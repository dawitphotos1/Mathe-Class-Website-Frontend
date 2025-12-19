const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Ì∫Ä FINAL FIX: Searching for ALL problematic imports...\n');

// Step 1: Find ALL JavaScript/JSX files
const allFiles = execSync('find src -type f \\( -name "*.js" -o -name "*.jsx" \\)', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(f => f);

console.log(`Ì≥Å Found ${allFiles.length} JS/JSX files\n`);
