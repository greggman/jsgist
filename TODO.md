# To Do

- [ ] add notes
- [ ] fix re-load flow
- [ ] store gists in jsgist-index.json
  + much faster
  - more complex?
  - need to handle when too large
- [ ] fix console.log crashing
- [ ] try not making a new iframe each run (they show up in the debugger)
- [ ] add stack trace to all the logs?
- [ ] errors automatically go to line?
- [ ] handle back (need to notice back and re-load)
- [ ] allow pop-out result to separate window.
- [ ] save README with link. If user made a readme use that instead though sub {{link}} for link
  
  (we can't do this unless we double save on create as we need to know the gist id to make the link)

# Done

- [X] make save (new) create a README.md
- [X] document running test (ngrok?)
- [X] check flow when token is bad (ok?)
      Seems like it's ok. Get's error. You can pick "login"
- [x] fix file keys
- [x] fix model so that each area only updates when its file changes
- [x] click log line to take you to line
- [x] fix embed
- [x] make embed show more types cb64, etc.
- [x] add export UI
- [x] make embed build
- [x] add embed UI
- [x] Save gists in local storage
- [x] freeze names for now
- [x] save as multiple files but JSON includes files
- [x] logo
  - [x] app logos
  - [x] icons
  - [x] og
- [x] add avatar to embed
- [x] show avatar
