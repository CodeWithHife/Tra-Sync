const fs = require('fs');

const files = [
  'src/app/admin/page.tsx',
  'src/app/pos/page.tsx',
  'src/app/onboard/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<<<<<<< HEAD[\s\S]*?=======\r?\n/g, '');
  content = content.replace(/>>>>>>> [^\n]*\r?\n?/g, '');
  fs.writeFileSync(file, content);
});
console.log('Done resolving conflicts.');
