# JSGist

See [jsgist.org](https://jsgist.org) (beta)

A client side HTML/CSS/JavaScript playground based on gists.

## Why? 

Just to see if it could be done. Also something you can add
features to instead of having to beg other services. Just make a PR
though maybe ask first.

## To Do

There's a long list of desired features. Feel free to help add them

- [ ] add bunch of settings

  - [X] layout options
  - [ ] tabs/space
  - [ ] editor? (use monaco?)
  - [ ] eslint?
  - [ ] eslint settings?
  - [X] support mobile
  - [X] log toggle
  - [ ] auto-run
  - [ ] css pre-processors? (lazy load)
  - [ ] js processors? (lazy load)
  - [ ] meta tags (stuff that goes in `<head>`)

- [ ] Support client side babel.

  You can already do this manually by including client side babel
  and putting your code in the HTML section as `<script type="text/babel">`
  but maybe we should add a setting that marks the inserted javascript
  as `type="text/babel"`

- [ ] Support a bunch of frameworks

  I'm not really a fan of the various sites that add hidden `<script>`
  tags (codepen, jsfiddle). The problem is a new to programming user
  comes, see the visible code, copies, and it doesn't work because
  there are a bunch of invisible things happening. I think Stack 
  Overflow snippets get this right. They have the UI but the UI just
  inserts the correct script tags into the HTML area so they are
  visible. This makes it clear what's actually happening.

  It might be nice for the UX present like codepen (a list of include stuff)
  but that list is derived from scanning the code, not internally stored.

  Speaking of which, if anyone knows a good layout / form lib speak up.
  One of the reasons I bailed on making a setting UI for the mvp is because
  designing the forms and then fighting all the HTML/CSS I knew would be
  several days. Basically just the settings alone will probably take 2x
  as long as the main app because there are so many UI details.

- [X] add a visible log

  this is relatively easy.
  
- [ ] highlight errors in source

  the data is already there for js errors. Could also do it for all
  log messages. As it is it should show the errors in the log
  and if you click them they'll move your cursor to the correct box.

- [X] add export to jsfiddle/codepen/codesandbox/snippet etc..

- [ ] make log wrapper support console.log formatting options

- [ ] show stack in log for warn/error messages

- [X] allow deleting gists

  as it is you go to github to delete gists.

- [ ] show revisions and forks

- [ ] allow more files.

  I'm not sure
  how handy this would be. If you want to test a worker it's nice to have a
  separate file but how often do people want to do that? My point being this
  might be lots of effort for little payoff. It would also require changing the
  UI, probably to be more like VSCode with an Explorer panel so lots of work.

- [X] consider github login?

  I would be more familiar but it requires a server for oauth. The current impl
  is 100% client side.

- [X] use gist comments

  Currently disqus is used for comments. Using gist comments
  would arguably be more appropriate but unfortunately github
  does not provide a UI to do so which means implementing one
  from scratch. That sucks because the built in one in github
  supports features like drag and drop files and other things.
  It would be so nice to just be able to link to an iframe
  of their UI but ATM that's not an option.

  Adding basic UX for markdown is semi-trivial though. Maybe
  that's enough?

- [ ] check for infinite loops?

  codepen apparently parses the JavaScript and inserts checks into loops
  so you don't crash the browser with an infinite loop. As it is the code
  saves your work to local storage before running so if crash you should 
  come back to the same result. Note: I haven't thought much about how
  this flow should work.

- [X] Mobile

  Mobile works but could use better styling/layout

- [X] Allow embedding

  - [X] Simple: just a page that shows your result
  - [X] Basic: shows your result with a banner, a link to your jsgist, and your github.
  - [ ] Complex: a page that shows your code with edit/run UI etc...

- [X] Use service worker to help debugging

- [ ] Add tests!!!

  There are currently no tests.

## Development

See [here](DEVELOPMENT.md)

## License: [MIT](LICENSE.md)
