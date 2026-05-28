const mineflayer = require('mineflayer');

const config = {
  host: "eeesa.aternos.me",     // Your Aternos domain
  port: 45339,                  // ← Use your current dynamic port
  username: "afk-bot",
  version: "1.21.11",              // Change to your server version
  auth: "offline"
};

let bot = null;
let reconnectAttempts = 0;
const MAX_ATTEMPTS = 20;

function createBot() {
  if (bot) bot.quit();

  console.log(`🔄 Connecting to ${config.host}:${config.port}`);
  
  bot = mineflayer.createBot(config);

  bot.on('spawn', () => {
    console.log(`✅ ${bot.username} joined the server!`);
    reconnectAttempts = 0;
    startHittingAir();
  });

  bot.on('end', (reason) => {
    console.log(`⚠️ Disconnected: ${reason}`);
    if (reconnectAttempts < MAX_ATTEMPTS) {
      reconnectAttempts++;
      const delay = 15000 + (reconnectAttempts * 10000);
      console.log(`🔄 Reconnecting in ${delay/1000}s...`);
      setTimeout(createBot, delay);
    }
  });

  bot.on('error', (err) => console.log(`❌ Error:`, err.message));
  bot.on('kicked', (reason) => console.log(`🚪 Kicked:`, reason));
}

function startHittingAir() {
  setInterval(() => {
    if (bot && bot.entity) {
      bot.attack(bot.entity);
    }
  }, 950 + Math.random() * 650);
}

// Keep Render alive
require('http').createServer((req, res) => {
  res.writeHead(200);
  res.end('AFK Bot is running!');
}).listen(3000);

createBot();
