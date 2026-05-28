const mineflayer = require('mineflayer');
const http = require('http');

const config = {
  host: "eeesa.aternos.me",
  port: 45339,                    // Update when it changes
  username: "afk-bot",
  version: "1.21.11",                // Change to your version
  auth: "offline"
};

let bot = null;
let reconnectAttempts = 0;
const MAX_ATTEMPTS = 25;

function createBot() {
  if (bot) bot.quit();

  console.log(`🔄 Connecting to ${config.host}:${config.port}`);

  bot = mineflayer.createBot(config);

  bot.on('spawn', () => {
    console.log(`✅ ${bot.username} joined the server!`);
    reconnectAttempts = 0;
    startAntiAFK();
  });

  bot.on('end', (reason) => {
    console.log(`⚠️ Disconnected: ${reason}`);
    if (reconnectAttempts < MAX_ATTEMPTS) {
      reconnectAttempts++;
      const delay = 12000 + (reconnectAttempts * 8000);
      console.log(`🔄 Reconnecting in ${delay/1000}s...`);
      setTimeout(createBot, delay);
    }
  });

  bot.on('error', (err) => console.log(`❌ Error:`, err.message));
  bot.on('kicked', (reason) => console.log(`🚪 Kicked:`, reason));
}

function startAntiAFK() {
  console.log("🛡️ Starting human-like anti-AFK behavior...");

  setInterval(() => {
    if (!bot || !bot.entity) return;

    const rand = Math.random();

    // 1. Look around randomly (safest & most effective)
    if (rand < 0.6) {
      bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 1.8);
    }

    // 2. Occasional small movement
    if (rand < 0.25) {
      bot.setControlState('forward', true);
      setTimeout(() => bot.setControlState('forward', false), 400);
    }

    // 3. Occasional jump
    if (rand < 0.18) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 250);
    }

    // 4. Very rare chat
    if (rand < 0.06) {
      const messages = ["zZz...", "afk", "hmm", "brb"];
      bot.chat(messages[Math.floor(Math.random() * messages.length)]);
    }

  }, 650 + Math.random() * 950); // Every 0.65 ~ 1.6 seconds
}

// Keep Render alive
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('AFK Bot Running');
}).listen(3000);

createBot();
