const fs = require('fs');
const path = require('path');

console.log('í´„ Converting @/ imports to relative imports...\n');

// Ensure axiosInstance exists
const axiosPath = path.join(__dirname, 'src', 'utils', 'axiosInstance.js');
if (!fs.existsSync(axiosPath)) {
  console.log('âŒ Error: src/utils/axiosInstance.js not found!');
  process.exit(1);
}

function getAllFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (/\.(js|jsx)$/.test(item)) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getAllFiles(path.join(__dirname, 'src'));
console.log(`í³ Found ${files.length} files to check\n`);

let fixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  if (content.includes('@/utils/axiosInstance')) {
    const relativePath = path
      .relative(path.dirname(file), axiosPath)
      .replace(/\\/g, '/')
      .replace(/\.js$/, '');

    content = content.replace(
      /from\s+['"]@\/utils\/axiosInstance['"]/g,
      `from '${relativePath}'`
    );

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`âœ… Fixed: ${path.relative(process.cwd(), file)}`);
      fixed++;
    }
  }
});

console.log(`\ní¾‰ Fixed ${fixed} files`);
console.log('\nNext:');
console.log('rm -rf node_modules/.cache build');
console.log('npm run build');
