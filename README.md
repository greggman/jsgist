# JSGist

See [jsgist.org](https://jsgist.org) (beta)

A client side HTML/CSS/JavaScript playground based on gists.

## Why? 

Just to see if it could be done. Also something you can add
features to instead of having to beg other services. Just make a PR
though maybe ask first. 

Further, it's your data. Nothing is stored by this site. It's effectively
a static webpage except for the tiny login function which itself does
not store anything on any servers. The only storage is your gists and
local storage. The site does not ask for any personal info. Even logging in
it only asks for permission to save gists. It does not ask for your name,
username, email, nothing. Further, that permission token is stored locally
on your machine. The site doesn't keep it.

On top of that, it's your data. Even if was to take this site down it would
be trivial to still use your gists. See [`embed.js`](https://github.com/greggman/jsgist/blob/main/src/embed/embed.js)
as one example of how to use your own gists.

## To Do

There's a long list of desired features. Feel free to help add them

- [ ] add bunch of settings

  - [X] layout options
  - [X] tabs/space
  - [X] editor? (use monaco?)
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
  tags (codepen, jsfiddle). The problem is, a new to programming user
  comes, see the visible code, copies, and it doesn't work because
  there are a bunch of invisible things happening. I think Stack 
  Overflow snippets get this right. They have the UI but the UI just
  inserts the correct script tags into the HTML area so they are
  visible. This makes it clear what's actually happening.

  It might be nice for the UX to present like codepen (a list of include stuff)
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

- [ ] optimize Log

  As it is the log prints all the messages. This is too slow. It should
  use a virtual list and just show the visible messages.

- [ ] show confirmation when loading backup

  In general consider what the flow should be. As it is it saves the current
  data to local storage just before running. The idea is if it crashes
  for some reason like an infinite loop, that reloading the you should be
  able to recover your work. But, sometimes you want to discard your work
  by just reloading the page and is it is that doesn't happen.

  A few things

  1. It should not save to local storage if the current data is the same
     as was loaded.
  
  2. It should not offer to recover if the data in local storage matches
     the data loaded.

  3. If they are different it should ask?

     Should asking be modal?

- [ ] allow browsing gists with pagination

  - [ ] search (if there is a search API)

  - [ ] by username (maybe use keywords?)

- [X] allow deleting gists

  as it is you go to github to delete gists.

- [ ] Try to reload only up to last gist unread?

  Each machine needs to track the highest gist it has read
  separate from the db of gists it knows.

  A is its `id` and its `node_id` and its `updated_at`
  so when reading we stop when we hit that id.

  (unless control is pressed or something to reset)
  
- [ ] Store list in gist?

  As it is to get the list of gists it has to get all your gists' meta data
  and then filter by those that have `jsgist.json`.
  
  The problem with storing the list as a gist
  
  1. You need to know which gist (which you can search and then remember client side)
  2. You need to fetch the directory gist, update, and write it back on every save.
  3. You need to handle the directory getting too large and so needing multiple gists
  4. It will almost always be your newest gist

- [x] only download up to the newest gist

  I'm not sure this works. The idea is, when you get the list of gists, as soon as you 
  see one that's already in your local list then you should have seen everything older
  and so it's already in your list. This assumes you track the newest gist you've seen
  when getting the list of gists which is separate from the newest gist (since the newest
  gist might be one you just saved).
  
  In other words. 
  
  1. Your local list has [ABC]. 
  2. Elsewhere you create [DE]. 
  3. You save locally and get [F].
  
  When you "reload gists" you need to load until you see 'C' because that's
  the newest gist you saw when you last did a "reload gists". That would help update
  quicker.
  
  Currently, given the example above, C is not tracked, so after step 3 your
  list is [ABCF] so just need to add flags or data that C is the newest when
  "reload gists" was last used.
  
  Also "Shift" to force reload?

- [ ] Consider paging "reload gists" so it just does one request at a time

  My hope is, if I implement the previous item, there's less need for this.
  As it is I think I have ~1400 gists which at 100 per means 14 requests
  for gists. At the same time, I do have 1400 gists which means each time
  I start on a new browser/profile/computer, 14 requests need to be made.
  It's possible I'll have to add this 😢 

- [ ] show revisions and forks

- [ ] allow more files.

  I'm not sure how handy this would be. If you want to test a worker it's nice
  to have a separate file but how often do people want to do that? My point
  being this might be lots of effort for little payoff. It would also require
  changing the UI, probably to be more like VSCode with an Explorer panel so
  lots of work.

- [X] consider github login?

  I would be more familiar but it requires a server for oauth. The current impl
  is 100% client side.

- [X] use gist comments

  Currently disqus is used for comments. Using gist comments would arguably be
  more appropriate but unfortunately github does not provide a UI to do so which
  means implementing one from scratch. That sucks because the built in one in
  github supports features like drag and drop files and other things. It would
  be so nice to just be able to link to an iframe of their UI but ATM that's not
  an option.

  Adding basic UX for markdown is semi-trivial though. Maybe
  that's enough?

- [ ] check for infinite loops?

  codepen apparently parses the JavaScript and inserts checks into loops so you
  don't crash the browser with an infinite loop. As it is the code saves your
  work to local storage before running so if crash you should come back to the
  same result. Note: I haven't thought much about how this flow should work.
  Also, at least in Chrome, your code is run in a separate process so you can
  kill the iframe by clicking "stop".

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
