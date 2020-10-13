console.log('comments.js');
const observer = new ResizeObserver(entries => {
  console.log('--sending resize from comment.js--', document.body.scrollHeight);
  window.parent.postMessage({
    type: 'resize',
    data: {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight,
    },
  }, "*");
});
observer.observe(document.body);