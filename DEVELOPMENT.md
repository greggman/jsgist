# jsGist Development

## Running

```
git clone https://github.com/greggman/jsgist.git
cd jsgist
npm install
npm start
```

In another terminal

```
git clone https://github.com/greggman/jsgistrunner.git
cd jsgistrunner
npm install
npm start
```

This starts 3 servers

1. `localhost:3000` - the react server
2. `localhost:8080` - a server that allows CORS access to the public folder
3. `localhost:8081` - a server for the runner

Note that there is really no good reason for 2 except googling I didn't
see an easy way to tell the react server to support CORS so when the
runner and the comment system try to reference scripts from the react
server they fail.

## Logging in with github on localhost

You can not directly login to github with localhost as the oauth
flow requires publicly accessible redirect url.

Two workarounds.

1. Create a [personal access token](https://github.com/settings/tokens) with
   `gist` only permissions.

   Run the site, open the devtools, in the console type

   ```
   localStorage.setItem('jsgist-pat', '<personal-access-token>');
   ```

   reload the page. You should be logged in

2. Login via [jsgist.org](https://jsgist.org)

   open the devtools and type

   ```
   localStorage.getItem('jsgist-pat');
   ```

   copy the result.

   Now run the dev site (the one that runs from localhost)

   Run the site, open the devtools, in the console type

   ```
   localStorage.setItem('jsgist-pat', '<access-token>');
   ```