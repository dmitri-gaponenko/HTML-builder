const fs = require('fs/promises');
const path = require('path');

const sourceFolderPath = path.join(__dirname, 'files');
const targetFolderPath = path.join(__dirname, 'files-copy');

(async () => {
  try {
    await fs.mkdir(targetFolderPath, { recursive: true });
    const targetFiles = await fs.readdir(targetFolderPath);
    for (const file of targetFiles) {
      fs.unlink(path.join(targetFolderPath, file));
    }
    const sourceFiles = await fs.readdir(sourceFolderPath);
    for (const file of sourceFiles) {
      fs.copyFile(path.join(sourceFolderPath, file), path.join(targetFolderPath, file));
    }
    console.log('Directory copy completed');
  } catch (err) {
    console.error(err);
  }
})();