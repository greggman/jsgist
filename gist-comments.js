/* global hljs, showdown, DOMPurify */
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

const observer = new ResizeObserver(entries => {
  window.parent.postMessage({
    type: 'resize',
    data: {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight,
    },
  }, "*");
});
observer.observe(document.body);

/*
function createURL(base, params) {
  const url = new URL(base);
  const searchParams = new URLSearchParams(url.search);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  }
  url.search = searchParams.toString();
  return url.href;
}
*/

let converter;

async function main() {
  // id is github user id
  const {url, gist_id, gitUserId, preview} = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  const u = new URL(url);

  document.head.appendChild(e('link', {rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.3.2/styles/default.min.css" }));
  document.head.appendChild(e('link', {rel: "stylesheet", href: "https://unpkg.com/highlight.js@10.3.2/styles/github-gist.css", media: "(prefers-color-scheme: light)" }));
  document.head.appendChild(e('link', {rel: "stylesheet", href: "https://unpkg.com/highlight.js@10.3.2/styles/monokai-sublime.css", media: "(prefers-color-scheme: dark)" }));
  document.head.appendChild(e('link', {rel: "stylesheet", href: `${u.origin}/scrollbars.css` }));
  document.head.appendChild(e('link', {rel: "stylesheet", href: `${u.origin}/gist-comments.css` }));

  await Promise.all([
    loadScript(`${u.origin}/scrollbars.js`, 'module'),
    loadScript("https://unpkg.com/showdown@1.9.1/dist/showdown.min.js"),
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.3.2/highlight.min.js"),
    loadScript("https://unpkg.com/dompurify@2.2.2/dist/purify.min.js"),
  ]);

  converter = getMarkdownConverter();

  if (gist_id) {
    showComments(gist_id, gitUserId);
  } else if (preview) {
    showPreview();
  }
}

async function showComments(gist_id, gitUserId) {
  const elem = e('div', {className: 'comments'});
  document.body.appendChild(elem);

  const handlers = {
    addComment(data) {
      addComment(elem, data, gist_id, gitUserId);
    },
  };

  window.addEventListener('message', (e) => {
    const {type, data} = e.data;
    const fn = handlers[type];
    if (fn) {
      fn(data);
    }
  })

  const octokit = new Octokit();
  const response = await octokit.gists.listComments({
    gist_id,
  });
  
  if (response.status === 200) {
    const comments = response.data;
    for (const comment of comments) {
      addComment(elem, comment, gist_id, gitUserId);
    }
  }
}

function showPreview() {
  const converter = getMarkdownConverter();
  const body = e('div', {className: 'body'})
  document.body.appendChild(e('div', {className: 'comment'}, [body]));

  const handlers = {
    preview(data) {
      const html = converter.makeHtml(data.body);
      body.innerHTML = DOMPurify.sanitize(html);
      highlightAndFixup(body);
    },
  };

  window.addEventListener('message', (e) => {
    const {type, data} = e.data;
    const fn = handlers[type];
    if (fn) {
      fn(data);
    }
  })
  window.parent.postMessage({type: 'sendPreview'}, '*');
}

function highlightAndFixup(elem) {
  elem.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
  elem.querySelectorAll('pre>code.hljs').forEach(elem => {
    elem.parentElement.classList.add('hljs');
    elem.classList.add('hljs');
    elem.classList.add('layout-scrollbar');
  });
  elem.querySelectorAll('a').forEach(elem => {
    elem.target = '_blank';
    elem.setAttribute('rel', 'noopener noreferrer');
  });
}

function getMarkdownConverter() {
  return new showdown.Converter({
    ghCompatibleHeaderId: true,
    parseImgDimensions: true,
    strikethrough: true,
    tasklists: true,
    ghMentions: true,
    openLinksInNewWindow: true,
  });
}

function unCheckParentCheckbox(elem) {
  const parent = elem.parentElement
  const checkbox = parent.querySelector('input[type="checkbox"]');
  if (checkbox) {
    checkbox.checked = false;
  } else {
    unCheckParentCheckbox(parent);
  }
}

/*
these are all problematic: I'm sure I can sanitize the comments
but if I fail then these can be called.

function handleCopyLink(e, comment) {
  unCheckParentCheckbox(e.target);
  console.log('copy link:', comment);
}

function handleQuoteReply(e, comment) {
  unCheckParentCheckbox(e.target);
  console.log('quote reply:', comment);
}

function handleEdit(e, comment) {
  unCheckParentCheckbox(e.target);
  console.log('edit:', comment);
}

function handleDelete(e, comment) {
  unCheckParentCheckbox(e.target);
  console.log('delete:', comment);
}
*/

function editMenu(comment, gist_id) {
  return e('div', {className: 'edit'} ,[
    e('div', {}, [
      e('input', {type: 'checkbox', id: comment.id}),
      e('label', {textContent: '⋯', for: comment.id}),
      e('div', {className: 'pop-down'}, [
        e('a', {
          textContent: 'Edit on Github',
          target: '_blank',
          href: `https://gist.github.com/${gist_id}/#gistcomment-${comment.id}`,
          onclick: e => unCheckParentCheckbox(e.target),
        }),
//        e('button', {textContent: 'Copy Link', onclick: e => handleCopyLink(e, comment)}),
//        e('button', {textContent: 'Quote Reply', onclick: e => handleQuoteReply(e, comment)}),
//        e('hr'),
//        e('button', {textContent: 'Edit', onclick: e => handleEdit(e, comment)}),
//        e('button', {textContent: 'Delete', onclick: e => handleDelete(e, comment)}),
      ]),
    ]),
  ]);
}

function addComment(parent, comment, gist_id, gitUserId) {
  const {login, avatar_url, html_url, id = ''} = comment.user;
	const html = converter.makeHtml(comment.body);
  parent.appendChild(e('div', {className: 'comment'}, [
    e('div', {className: 'comment-inner'}, [
      e('div', {className: 'user'}, [
        e('div', {className: 'info'}, [
          e('a', {className: 'avatar', href: html_url, target: '_blank'}, [
            e('img', {src: avatar_url}),
          ]),
          e('a', {className: 'name', href: html_url, target: '_blank'}, [
            e('div', {textContent: login}),
          ]),
        ]),
        ...(id.toString() === gitUserId ? [editMenu(comment, gist_id)] : []),
      ]),
      e('div', {className: 'body', innerHTML: DOMPurify.sanitize(html)}),
    ]),
  ]));
  highlightAndFixup(parent);
}

function e(tag, attrs = {}, children = []) { 
  const elem = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        elem[key][k] = v;
      }
    } else if (elem[key] === undefined) {
      elem.setAttribute(key, value);
    } else {
      elem[key] = value;
    }
  }
  for (const child of children) {
    elem.appendChild(child);
  }
  return elem;
}

function loadScript(url, type = 'application/javascript') {
  return new Promise((resolve, reject) => {
    const script = e('script');
    script.addEventListener('load', resolve);
    script.addEventListener('error', reject);
    script.type = type;
    script.src = url;
    document.head.appendChild(script);
  });
}

main();
