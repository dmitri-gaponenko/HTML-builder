const fs = require('fs/promises');
const path = require('path');
const { createReadStream, createWriteStream } = require('fs');

const componentsFolderPath = path.join(__dirname, 'components');
const projectDistFolderPath = path.join(__dirname, 'project-dist');
const stylesFolderPath = path.join(__dirname, 'styles');

(async () => {
  try {
    const componentsFiles = await fs.readdir(componentsFolderPath, { withFileTypes: true });
    const htmlComponentsFiles = componentsFiles.filter(file => path.extname(file.name) === '.html');
    const components = htmlComponentsFiles.map( file => path.basename(file.name, '.html'));

    let templateSting = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    for (const component of components) {
      let componentSting = await fs.readFile(path.join(componentsFolderPath, `${component}.html`), 'utf-8');
      templateSting = templateSting.replace(`{{${component}}}`, componentSting);
    }

    await fs.mkdir(projectDistFolderPath, { recursive: true });
    await fs.writeFile(path.join(projectDistFolderPath, 'index.html'), templateSting);
    console.log('index.html created');
    
    await fs.writeFile(path.join(projectDistFolderPath, 'style.css'), '');
    const bundle = createWriteStream(path.join(projectDistFolderPath, 'style.css'));
    const files = await fs.readdir(stylesFolderPath, { withFileTypes: true });
    const cssFiles = files.filter(file => path.extname(file.name) === '.css');

    for (const cssFile of cssFiles) {
      const stream = createReadStream(path.join(stylesFolderPath, cssFile.name), 'utf-8');
      let data = '';
      stream.on('data', chunk => data += chunk);
      stream.on('end', () => bundle.write(data + '\n'));
      stream.on('error', error => console.log('Error', error.message));
    }
    console.log('style.css created');

    await fs.rm(path.join(projectDistFolderPath, 'assets'), { recursive: true, force: true });
    await copyDir(path.join(__dirname, 'assets'), path.join(projectDistFolderPath, 'assets'));
    console.log('assets copied');
  } catch (err) {
    console.error(err);
  }
})();

async function copyDir(sourceDir, targetDir) {
  const sourceFiles = await fs.readdir(sourceDir, { withFileTypes: true });
  for (const file of sourceFiles) {
    if (file.isDirectory()) {
      await fs.mkdir(path.join(targetDir, file.name), { recursive: true });
      await copyDir(path.join(sourceDir, file.name), path.join(targetDir, file.name));
    } else {
      fs.copyFile(path.join(sourceDir, file.name), path.join(targetDir, file.name));
    }
  }
}