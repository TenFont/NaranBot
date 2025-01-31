const mineflayer = require('mineflayer');

require('dotenv').config();

console.log(`${process.env.host}:${process.env.port}`);

const bot = mineflayer.createBot({
    version: '1.18.2',
    host: process.env.host,
    port: process.env.port,
    username: process.env.name,
});

// const mineflayerViewer = require('prismarine-viewer').mineflayer

bot.once("spawn", () => {
    // mineflayerViewer(bot, { port: 8080, firstPerson: true })
    console.log("We're alive!")
});

bot.on("messagestr", (message) => {
    log(message);

    if (message == ("LOGIN » Please login with /login <password>")) {
        console.log(`/login ${process.env.password}`);
        bot.chat(`/login ${process.env.password}`);
    } else if (message.startsWith("JartexNetwork » You are connected to Lobby")) {
        bot.chat(`/server`);
        bot.on("windowOpen", (window) => {
            setTimeout(() => {
                bot.simpleClick.leftMouse(19);
            }, 1000);
        });
    }
});

bot.on("kicked", (reason) => {
    console.log(`The bot was kicked with reason: ${reason}`);
    process.exit(1);
});



let chatlog = [];
function log(msg) {
    chatlog.push(msg);
    console.log(msg);
}

// SITE

const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/assets'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {
        status: 'online',
        account: {
            username: process.env.name
        }
    });
});

app.get('/chatlogs', (req, res) => {
    res.json(chatlog);
});

app.post('/chat', (req, res) => {
    bot.chat(req.body.message);
    res.sendStatus(200);
});

app.post('/restart', (req, res) => {
    bot.end('Restarting...');
    res.sendStatus(200);
});

app.listen(8080);