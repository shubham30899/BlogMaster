const { spawn } = require('child_process');
const path = require('path');

// Start Express backend
const backend = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});

// Start Next.js frontend  
const frontend = spawn('npx', ['next', 'dev', '--port', '3000'], {
  stdio: 'inherit',
  shell: true
});

// Handle process cleanup
process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

console.log('🚀 Starting BlogCraft with Next.js App Router...');
console.log('📦 Express API: http://localhost:5000');
console.log('🌐 Next.js Frontend: http://localhost:3000');