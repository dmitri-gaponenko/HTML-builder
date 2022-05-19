const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const file = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface({ input: stdin, output: stdout });

const finish = () => {
  process.stdout.write('Goodbye!\n');
  rl.close();
  file.close();
  process.exit();
};

const write = (text) => {
  if (text === 'exit') {
    finish();
  }
  file.write(`${text}\n`);
};

rl.question('Hello! Please enter text:\n', (text) => {
  write(text);
});

rl.on('line', (text) => {
  write(text);
});

rl.on('SIGINT', () => {
  finish();
});
