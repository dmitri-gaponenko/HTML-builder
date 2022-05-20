const fs = require('fs/promises');
const path = require('path');
const { createReadStream, createWriteStream }= require('fs');

const projectDistFolderPath = path.join(__dirname, 'project-dist');
const stylesFolderPath = path.join(__dirname, 'styles');

(async () => {
  try {
    await fs.writeFile(path.join(projectDistFolderPath, 'bundle.css'), '');
    const bundle = createWriteStream(path.join(projectDistFolderPath, 'bundle.css'));
    const files = await fs.readdir(stylesFolderPath, { withFileTypes: true });
    const cssFiles = files.filter(file => path.extname(file.name) === '.css');

    for (const cssFile of cssFiles) {
      const stream = createReadStream(path.join(stylesFolderPath, cssFile.name), 'utf-8');
      let data = '';
      stream.on('data', chunk => data += chunk);
      stream.on('end', () => bundle.write(data));
      stream.on('error', error => console.log('Error', error.message));
    }
    console.log('Bundle created');
  } catch (err) {
    console.error(err);
  }
})();