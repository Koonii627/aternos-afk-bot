const mineflayer = require('mineflayer');
const http = require('http');

const config = {
  host: "eeesa.aternos.me",
  port: 45339,                    // Update this when it changes
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
      const delay = 8000 + (reconnectAttempts * 7000);
      console.log(`🔄 Reconnecting in ${delay/1000}s...`);
      setTimeout(createBot, delay);
    }
  });

  bot.on('error', (err) => console.log(`❌ Error:`, err.message));
  bot.on('kicked', (reason) => console.log(`🚪 Kicked:`, reason));
}

function startAntiAFK() {
  // More human-like behavior
  setInterval(() => {
    if (!bot || !bot.entity) return;
    
    // Hit air
    bot.attack(bot.entity);
    
    // Random look around
    if (Math.random() < 0.3) {
      bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 1.5);
    }
    
    // Occasional jump
    if (Math.random() < 0.15) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
    }
    
    // Very occasional chat
    if (Math.random() < 0.08) {
      bot.chat("zZz...");
    }
  }, 650 + Math.random() * 850);   // More frequent activity
}

// Keep Render alive
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('AFK Bot Running');
}).listen(3000);

createBot();
