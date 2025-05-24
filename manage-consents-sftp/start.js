/**
 * Script that determines whether to run with node or nodemon based on NODE_ENV
 */
const { spawn } = require('child_process');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const script = path.join(__dirname, './src/index.js');

// Choose command based on environment
const command = isProduction ? 'node' : 'npx';
const args = isProduction ? [script] : ['nodemon', script];

console.log(`Starting in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);

// Spawn the appropriate process
const proc = spawn(command, args, { stdio: 'inherit' });

proc.on('exit', (code) => {
    process.exit(code);
});