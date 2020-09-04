// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel

const next = require('next');
const { createProxyMiddleware, Filter, Options, RequestHandler } = require('http-proxy-middleware');
const express = require('express');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// console.log(app, 'dev?')

app.prepare().then(() => {
    const server = express();
    console.log(process.env.NODE_ENV)
    if(process.env.NODE_ENV !== "production"){        
        server.use('/api/v1', createProxyMiddleware({ target: 'http://localhost:3030', changeOrigin: true }));        
    } else {
        //production api
        server.use('/api/v1', createProxyMiddleware({ target: 'http://localhost:3030', changeOrigin: true }));
    }
    server.get('*', (req, res) => {
        return handle(req, res)
    });
    server.listen(3000, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    });
})
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
});