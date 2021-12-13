const fs = require('fs');
const path = require('path');

const domain = process.env.REACT_APP_DOMAIN;
if (!domain) {
  throw new Error(`environment variable REACT_APP_DOMAIN not set`);
}

fs.writeFileSync(path.join(__dirname, 'build', 'CNAME'), `${domain}\n`);