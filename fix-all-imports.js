const fs = require('fs');
const path = require('path');

console.log('í´§ Fixing ALL axiosInstance imports...\n');

function getAllFiles(dir) {
  const results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push(...getAllFiles(fullPath));
    } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

const allFiles = getAllFiles('src');
console.log(`í³ Processing ${allFiles.length} files...\n`);

let fixedCount = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Fix pattern 1: "utils/axiosInstance" (no dots)
  content = content.replace(
    /from\s+['"]utils\/axiosInstance['"]/g,
    "from '@/utils/axiosInstance'"
  );
  
  // Fix pattern 2: "../../utils/axiosInstance"
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/utils\/axiosInstance['"]/g,
    "from '@/utils/axiosInstance'"
  );
  
  // Fix pattern 3: "../utils/axiosInstance"
  content = content.replace(
    /from\s+['"]\.\.\/utils\/axiosInstance['"]/g,
    "from '@/utils/axiosInstance'"
  );
  
  // Fix pattern 4: "../../api/axiosInstance"
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/api\/axiosInstance['"]/g,
    "from '@/utils/axiosInstance'"
  );
  
  // Fix pattern 5: "../api/axiosInstance"
  content = content.replace(
    /from\s+['"]\.\.\/api\/axiosInstance['"]/g,
    "from '@/utils/axiosInstance'"
  );
  
  // Fix pattern 6: "../../api/axiosInstance" (different quotes)
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/api\/axiosInstance["']/g,
    "from '@/utils/axiosInstance'"
  );
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    const relativePath = path.relative(process.cwd(), file);
    console.log(`âœ… Fixed: ${relativePath}`);
    fixedCount++;
  }
});

console.log(`\ní¾‰ Fixed ${fixedCount} files`);
console.log('\nNow run:');
console.log('1. rm -rf node_modules/.cache build');
console.log('2. npm run build');
