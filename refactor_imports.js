const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.ts') || file.endsWith('.tsx')) {
             results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk(__dirname, (err, results) => {
  if (err) throw err;
  let replacedFiles = 0;
  results.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('@/shared/')) {
      const newContent = content.replace(/@\/shared\//g, '@/');
      fs.writeFileSync(file, newContent, 'utf8');
      replacedFiles++;
    }
  });
  console.log(`Replaced import paths in ${replacedFiles} files.`);
});
