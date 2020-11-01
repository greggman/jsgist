(function() {
  const originalConsole = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

  // adapted from http://stackoverflow.com/a/2401861/128511
  function getBrowser() {
    const userAgent = navigator.userAgent;
    let m = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(m[1])) {
      m = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return {
        name: 'IE',
        version: m[1],
      };
    }
    if (m[1] === 'Chrome') {
      const temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (temp) {
        return {
          name: temp[1].replace('OPR', 'Opera'),
          version: temp[2],
        };
      }
    }
    m = m[2] ? [m[1], m[2]] : [navigator.appName, navigator.appVersion, '-?'];
    const version = userAgent.match(/version\/(\d+)/i);
    if (version) {
      m.splice(1, 1, version[1]);
    }
    return {
      name: m[0],
      version: m[1],
    };
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function unifyStack(error) {
    if (!error.stack) {
      return '';
    }
    const re = new RegExp(`(^\\w+: ${escapeRegExp(error.message || error.reason)})\n`)
    const m = re.exec(error?.stack);
    return m ? error.stack.substr(m[1].length).trim() : error.stack;
  }

  /*
  Examples of stacks. Ideally I'd like to automatic this.
  Could maybe just scan from the top line down for the second
  match (need to remove ourselves). The problem is chrome shows
  the error message as the first line, safari and firefox don't show
  the message at all. If the message ended in `:num:num` then we'd
  have no idea if it was Safari/Firefox or a user's message.

  We can test for that though. Just put our message in an Error
  and then check if it exists in the stack. Otherwise we need
  a RegEx that parses lines in both browser. Not sure why
  the Chrome regex checks for not containing ')'

  chrome:
    Error: msg
        at https://jsgistrunner.devcomments.org/user-jsgist.html:24:13
  firefox:
    @https://jsgistrunner.devcomments.org/user-jsgist.html:24:13
  safari:
    module code@https://jsgistrunner.devcomments.org/user-jsgist.html:24:22
    evaluate@[native code]
    moduleEvaluation@[native code]
    [native code]
    promiseReactionJob@[native code]

  */

  /**
   * @typedef {Object} StackInfo
   * @property {string} url Url of line
   * @property {number} lineNo line number of error
   * @property {number} colNo column number of error
   * @property {string} [funcName] name of function
   */

  /**
   * @parameter {string} stack A stack string as in `(new Error()).stack`
   * @returns {StackInfo}
   */
  const parseStack = function() {
    const browser = getBrowser();
    let matcher;
    if ((/chrome|opera/i).test(browser.name)) {
      matcher = function(line, stack) {
        const m = /at ([^(]+)*\(*(.*?):(\d+):(\d+)/.exec(line);
        if (m) {
          let userFnName = m[1];
          let url = m[2];
          const lineNo = parseInt(m[3]);
          const colNo = parseInt(m[4]);
          if (url === '') {
            url = userFnName;
            userFnName = '';
          }
          return {
            url: url,
            lineNo: lineNo,
            colNo: colNo,
            funcName: userFnName,
            stack,
          };
        }
        return undefined;
      };
    } else if ((/firefox|safari/i).test(browser.name)) {
      matcher = function(line, stack) {
        const m = /@(.*?):(\d+):(\d+)/.exec(line);
        if (m) {
          const url = m[1];
          const lineNo = parseInt(m[2]);
          const colNo = parseInt(m[3]);
          return {
            url: url,
            lineNo: lineNo,
            colNo: colNo,
            stack,
          };
        }
        return undefined;
      };
    }

    return function stackParser(error, lineNdx = 2) {
      const stack = unifyStack(error);
      if (matcher) {
        try {
          const lines = stack.split('\n');
          return matcher(lines[lineNdx], stack);
        } catch (e) {
          // do nothing
        }
      }
      return undefined;
    };
  }();

  function sendMsgInfo(type, e, msgType) {
    const {
      message: msg,
      url,
      lineNo,
      colNo,
      stack,
    } = e;
    window.parent.postMessage({
      type,
      data: {msg, url, lineNo, colNo, stack, type: msgType},
    }, '*');
  }

  window.addEventListener('error', function(e) {
    originalConsole.error(e.error);
    const {url, lineNo, colNo, stack} = parseStack(e.error, 0) || {};
    sendMsgInfo('jsError', {
      url: e.filename || url,
      message: e.message || e.error?.message,
      stack,
      lineNo: e.lineno || lineNo,
      colNo: e.colno || colNo,
    });
  });

  window.addEventListener('unhandledrejection', function(e) {
    originalConsole.error(e.reason);
    const {url, lineNo, colNo, stack} = parseStack(e.reason, 0) || {};
    sendMsgInfo('jsUnhandledRejection', {
      url: e.filename || url,
      message: e.message || e.reason?.message,
      stack,
      lineNo: e.lineno || lineNo,
      colNo: e.colno || colNo,
    });
  });

  // TODO: implement the console.log rules where the first string
  // is a format string and various codes use the following arguments
  function formatArgs(args) {
    return args.join(' ');
  }

  function sendLog(type, args) {
    const error = new Error('--');
    const {url, lineNo, colNo, stack} = parseStack(error) || {};
    sendMsgInfo('jsLog', {
      url,
      lineNo,
      colNo,
      message: formatArgs(args),
      stack,
    }, type);
  }

  function makeLogFn(type) {
    const origFn = console[type].bind(console);
    console[type] = function(...args) {
      origFn(...args);
      sendLog(type, args);
    };
  }

  makeLogFn('log');
  makeLogFn('warn');
  makeLogFn('error');
  makeLogFn('info');
})();
