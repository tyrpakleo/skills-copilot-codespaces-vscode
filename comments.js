// Create web server
// 1. Create a web server
// 2. Handle request and response
// 3. Return response
// 4. Listen to port

const http = require('http');
const url = require('url');
const fs = require('fs');

const comments = [];

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const path = reqUrl.pathname;

    if (path === '/add-comment' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const comment = body.split('=')[1];
            comments.push(comment);
            fs.writeFileSync('comments.txt', comments.join('\n'));
            res.statusCode = 302;
            res.setHeader('Location', '/comments');
            res.end();
        });
    } else if (path === '/comments' && req.method === 'GET') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Comments</title></head>');
        res.write('<body>');
        res.write('<h1>Comments</h1>');
        res.write('<ul>');
        for (const comment of comments) {
            res.write(`<li>${comment}</li>`);
        }
        res.write('</ul>');
        res.write('<form action="/add-comment" method="POST"><input type="text" name="comment"><button type="submit">Add comment</button></form>');
        res.write('</body>');
        res.write('</html>');
        res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
});

server.listen(3000);

// To run the server run the command: node comments.js
// To stop the server press: Ctrl + C
// To access the server go to: http://localhost:3000/comments
// To add a comment go to: http://localhost:3000/add-comment