'use strict';

const fs = require('fs');
const http = require('http');
const Utils = require('./modules/utils');
const English = require('./lang/en/en');

class Server {
    constructor() {
        this.port = process.env.PORT || 8080;
        this.utils = new Utils();
        this.english = new English();
    }

    start() {
        http.createServer((request, response) => {
            this.handleRequest(request, response);
        }).listen(this.port);

        console.log(`Server listening on port ${this.port}...`);
    }

    handleRequest(request, response) {
        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );

        if (url.pathname === '/getDate/' || url.pathname === '/getDate') {
            const name = url.searchParams.get('name');

            if (!name) {
                response.writeHead(400, {
                    'Content-Type': 'text/plain'
                });

                response.end('Please provide a name.');
                return;
            }

            const message =
                this.english.greeting.replace('%1', name);

            response.writeHead(200, {
                'Content-Type': 'text/html'
            });

            response.end(
                `<p style="color: blue;">${message} ${this.utils.getDate()}</p>`
            );

        } else if (
            url.pathname === '/writeFile/' ||
            url.pathname === '/writeFile'
        ) {
            const text = url.searchParams.get('text');

            if (!text) {
                response.writeHead(400, {
                    'Content-Type': 'text/plain'
                });

                response.end('Please provide text.');
                return;
            }

            this.writeFile(text, response);

        } else if (url.pathname.startsWith('/readFile/')) {
            const fileName = url.pathname.replace('/readFile/', '');

            this.readFile(fileName, response);

        } else {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.end('404 - Page not found.');
        }
    }

    writeFile(text, response) {
        fs.appendFile('file.txt', `${text}\n`, (err) => {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                response.end('Error writing to file.');
                return;
            }

            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            response.end(`${text} was appended to file.txt`);
        });
    }

    readFile(fileName, response) {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                response.end(`404 - File ${fileName} not found.`);
                return;
            }

            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            response.end(data);
        });
    }
}

const server = new Server();
server.start();