import React from 'react';
const darkMatcher = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : {};
// darkMatcher.addListener(render);

const noop = _ => _;

export default class MonacoEditor extends React.Component {
  constructor(props) {
    super(props);
    const {value, hackKey} = props;
    this.state = {value, hackKey}
    this.containerRef = React.createRef();
  }
  static getDerivedStateFromProps(props, state) {
    const needNewData = state.hackKey !== props.hackKey;
    return (needNewData)
       ? {hackKey: props.hackKey, value: props.value}
       : null;
  }
  componentDidMount() {
    const {options = {}, onValueChange = noop} = this.props;
    const language = (options.editor?.mode || 'text/javascript').replace(/^.*\//, '');
    const {value} = this.state;
    const isDarkMode = darkMatcher.matches;
    this.editor = window.monaco.editor.create(this.containerRef.current, {
      value,
      language,
      theme: isDarkMode ? 'vs-dark' : 'vs',
      disableTranslate3d: true,
      //   model: null,
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
    });
    this.editor.onDidChangeModelContent(() => {
      onValueChange(this.editor.getValue());
    })
    
    const {registerAPI} = this.props;
    if (registerAPI) {
      registerAPI({
        goToLine: (lineNumber, column) => {
          this.editor.focus();
          this.editor.setPosition({column, lineNumber});
        },
        refresh: _ => {
//          this.editor.refresh();
        },
        focus: _ => {
          this.editor.focus();
        },
      });
    }
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.containerRef.current);
  }
  componentWillUnmount() {
    this.editor.dispose();
    const model = this.editor.getModel();
    if (model) {
      model.dispose();
    }
  }
  handleResize = () => {
    this.editor.layout();
  }
  render() {
//    const {options = {}, onValueChange = noop} = this.props;
//    const {value} =  this.state;
//    const isDarkMode = darkMatcher.matches;
//    const codeMirrorOptions = {
//      mode: 'javascript',
//      scrollbarStyle: 'overlay',
//      theme: isDarkMode ? 'material' : 'eclipse',
//      matchBrackets: true,
//      lineNumbers: true,
//      ...(options.editor && options.editor),
//    };
//    if (codeMirrorOptions.mode.indexOf('html') >= 0) {
//      codeMirrorOptions.matchTags = true;
//    }
    return (
      <div ref={this.containerRef} />
      /*
      <CodeMirror
        value={value}
        options={codeMirrorOptions}
        onBeforeChange={(editor, data, value) => {
          this.setState({value});
        }}
      />
      */
    );
  }
};
