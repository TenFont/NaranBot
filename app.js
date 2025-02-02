const mineflayer = require('mineflayer');

require('dotenv').config();

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/assets'));

let accounts = (process.env.name).split(',');
let timeout = 0;
accounts.forEach(username => {
    setTimeout(() => {
        initBot(username, process.env.host, process.env.port);
    }, timeout);
    timeout += 1000;
});
app.listen(8080);

function initBot(username, host, port) {    
    const chatlog = [];
    const log = (msg) => {
        chatlog.push(msg);
        console.log(`[${username}] ${msg}`);
    };

    log(`Creating new bot...`);
    const bot = mineflayer.createBot({
        version: '1.18.2',
        host: host,
        port: port,
        username: username,
    });

    bot.once("spawn", () => {
        console.log("We're alive!")
    });
    
    bot.on("messagestr", (message) => {
        log(message);
    
        if (message == ("LOGIN » Please login with /login <password>")) {
            log("[SYSTEM] Logging in...");
            bot.chat(`/login ${process.env.password}`);
        } else if (message.startsWith("JartexNetwork » You are connected to Lobby")) {
            log("[SYSTEM] Opening server selector...");
            bot.chat(`/server`);
            bot.on("windowOpen", (window) => {
                setTimeout(() => {
                    log("[SYSTEM] Clicking on survival icon...");
                    bot.simpleClick.leftMouse(19);
                }, 1000);
            });
        }
    });
    
    bot.on("kicked", (reason) => {
        log(`The bot has been kicked: ${reason}`);
    });
    
    bot.once('end', reason => {
        log('Connection lost: ' + reason);
        log('ATTEMPTING RECONNECT IN 5 SECONDS...')
        setTimeout(() => {
            initBot(username, host, port);
        }, 5000);
    });


    // http

    const router = express.Router();
    app.use(`/${username}/`, router);

    router.get(`/`, (req, res) => {
        res.render('index', {
            status: 'online',
            account: {
                username: username
            }
        });
    });
    
    router.get(`/chatlogs`, (req, res) => {
        res.json(chatlog);
    });
    
    router.post(`/chat`, (req, res) => {
        bot.chat(req.body.message);
        res.sendStatus(200);
    });
    
    router.post(`/restart`, (req, res) => {
        bot.end('Restarting...');
        res.sendStatus(200);
    });
}