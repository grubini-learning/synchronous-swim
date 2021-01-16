const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const keypressHandler = require('./keypressHandler');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};
let base64_encode = (file) => {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

module.exports.router = (req, res, next = () => { }) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);


  const url = req.url;
  console.log(url)
  if (url === '/getmove') {
    res.writeHead(200, headers);
    const response = keypressHandler.randomMove();
    res.write(JSON.stringify(response));
    res.end();
    next();
  } else if (url === '/getbackground') {
    try {
      const bitmap = base64_encode(__dirname + '/background.jpg');
      res.writeHead(200, headers);
      res.write(JSON.stringify({ image: bitmap }));
      res.end();
      next();
    } catch (error) {
      console.log('error ', error)
      res.writeHead(404, headers);
      res.end();
      next();
    }
  } else if (req.method === 'POST' && url === '/sendbackground') {
    let body = Buffer.alloc(0);
    req.on('data', chunk => {
      body = Buffer.concat([body, chunk]) // convert Buffer to string
    });
    req.on('end', () => {
      var file = multipart.getFile(body);
      fs.writeFile('image.jpg', file.data, (err) => {
        res.writeHead(err ? 400 : 201, headers);
        res.end('ok');
        next();
      })

    });
  } // invoke next() at the end of a request to help with testing!
};
