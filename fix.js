// fix.js - Simple import fixer
const fs = require("fs");
const path = require("path");

console.log("Fixing axiosInstance imports...\n");

// 1. Create jsconfig.json
const jsconfig = {
  compilerOptions: {
    baseUrl: "src",
    paths: {
      "@/*": ["*"],
    },
  },
  include: ["src"],
  exclude: ["node_modules", "build"],
};

fs.writeFileSync("jsconfig.json", JSON.stringify(jsconfig, null, 2));
console.log("✅ Created jsconfig.json");

// 2. Find and fix files
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Fix all patterns
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/utils\/axiosInstance['"]/g,
    "from '@/utils/axiosInstance'"
  );

  content = content.replace(
    /from\s+['"]\.\.\/utils\/axiosInstance['"]/g,
    "from '@/utils/axiosInstance'"
  );

  content = content.replace(
    /from\s+['"]utils\/axiosInstance['"]/g,
    "from '@/utils/axiosInstance'"
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

// 3. Find all JS/JSX files
function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      results.push(fullPath);
    }
  });

  return results;
}

const allFiles = getAllFiles("src");
let fixedCount = 0;

allFiles.forEach((file) => {
  if (fixFile(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log("\nNow run:");
console.log("1. rm -rf node_modules/.cache build");
console.log("2. npm run build");
