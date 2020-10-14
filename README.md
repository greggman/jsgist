# JSGist

See [jsgist.org](https://jsgist.org) (alpha)

A client side HTML/CSS/JavaScript playground

## Why? 

Just to see if it could be done. Also something we can add
features to instead of having to beg other services.

## To Do

There's a long list of desired features. Feel free to help add them

- [ ] add bunch of settings

  - [ ] layout options
  - [ ] tabs/space
  - [ ] editor? (use monaco?)
  - [ ] support mobile
  - [ ] log
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

- [ ] add a visible log

  this is relatively easy.

- [ ] allow more files. 

  The UI already kind of does this but we have to re-write references to blobs
  or figure out if maybe a service worker could handle it.

- [ ] consider github login?

  I would be more familiar but it requires a server for oauth. The current impl
  is 100% client side.

- [ ] check for infinite loops?

  codepen apparently parses the JavaScript and inserts checks into loops
  so you don't crash the browser with an infinite loop. As it is the code
  saves your work to local storage before running so if you come back to
  the same 

- [ ] Mobile

- [ ] Allow embedding

  - [X] Simple: just a page that shows your code
  - [ ] Complex: a page that shows your code with UX, links, avatar, etc...

## License: [MIT](LICENSE.md)
