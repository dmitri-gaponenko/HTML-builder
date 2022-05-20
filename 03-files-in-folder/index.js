const fs = require('fs/promises');
const path = require('path');

const targetPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await fs.readdir(targetPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const fileExt = path.extname(file.name);
        const fileName = path.basename(file.name, fileExt);
        const filePath = path.join(targetPath, file.name);
        const fileStat = await fs.stat(filePath);
        console.log(`${fileName} - ${fileExt.slice(1)} - ${fileStat.size}b`);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
