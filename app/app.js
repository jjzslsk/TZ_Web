const path = require('path');
const fs = require('fs');

const extname = path.extname;

const Koa = require('koa');
const app = new Koa();

const middewareFun = require('h-mock-middleware').middleware;

app.use(middewareFun());
app.use(require('koa-static')(path.join(__dirname, '../dist/')));

const tryPort = port => {
    app.listen(port, res => {
        console.log(`Serve dist on port :${port}
try http://localhost:${port}`);
    }).on('error', err => {
        if (err.code === 'EADDRINUSE') {
            // 端口已经被使用
            if (port < 10000) {
                tryPort(port + 1)
            }
        }
    })
}
tryPort(3000)
