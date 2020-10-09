import React from 'react';
import showdown from 'showdown';
import Dialog from './Dialog.js';

const converter = new showdown.Converter();
const text = `
Run some code, own your data.

## Contribute, Fix, Enhance!

[https://github.com/greggman/jsgist](https://github.com/greggman/jsgist)

Also see [jsbenchit.org](https://jsbenchit.org)

## Saving

You can save your tests in multiple ways.

1. To a github gist using a [Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)

   Be sure to give the token **ONLY GIST** permissions. Paste it into the
   save as UI click --Save to new gist--. Be sure to keep a copy of it
   somewhere so you can use if you clear your browser's storage or switch
   machines or browser. This site is a static site. The token is saved
   in the browser only.

2. Save it manually into github

   Copy the JSON. Go to github. Create a new gist. Name the file
   --jsGist.json--. Paste the JSON in. Pick "Create public gist".

   Note the id in the URL after you create the gist.

   Create a url in the form --https://jsgist.org/?src=<gist_id>--.

   Example: https://jsgist.org/?src=025c51db6329e93a80140050857c2636

3. Save it manually somewhere else.

   If there's some other service that will provide a string via
   http get then copy and save the JSON there then create a URL
   in the form of --https://jsgist.org/?src=<url>--. Note: you
   will have to escape the URL although if just paste it into your
   browser it will likely do the conversion for you.

4. Save it as a bookmark or link

   In the SaveAs dialog there's a link that contains all the data
   for your benchmark.

## Saving Notes

* --Save-- saves on top of an existing gist

  --Save-- will not be enabled until you've added a Personal Access Token
  and saved a gist.

* --Save As-- creates a new gist/link/json

## Comparing across browsers

Saving saves the results of the benchmark so if you want to compare
across browsers:

### With Personal Access Token

1. Create your benchmark
2. Run it
3. Save a new gist using Personal Access Token
4. Copy URL to another browser
5. Run it
6. Save over old gist using Personal Access Token

Repeat steps 4, 5, 6 on other browsers. 

### With URL

1. Create your benchmark
2. Run it
3. Pick Save and copy the URL
4. Copy URL to another browser
5. Run it
6. Pick Save and copy the URL

Repeat steps 4, 5, 6 on other browsers. 

Note: In general it only makes sense to compare results of browsers
on the same machine.







`.replace(/---/g, '```')
 .replace(/--/g, '`');
const html = converter.makeHtml(text);

export default function Help(props) {
  const {onClose} = props;
  return (
    <Dialog title="jsGist" onClose={onClose}>
      <div className="markdown" dangerouslySetInnerHTML={{__html: html}}/>
    </Dialog>
  );
}