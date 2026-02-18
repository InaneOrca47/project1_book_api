const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, content, type) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => {
    return respond(request, response, 200, index, 'text/html')
}

const getCss = (request, response) => {
    return respond(request, response, 200, css, 'text/css')
}

module.exports = {
    getIndex,
    getCss,
}