const fs = require('fs');
const path = require('path');

// Fix import statements to use proper Heroicons imports
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix the import statement to use proper Heroicons
    if (content.includes("from '@heroicons/react/24/outline'")) {
      // Extract all the icon names from the import
      const importMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]@heroicons\/react\/24\/outline['"]/);
      if (importMatch) {
        const iconList = importMatch[1].split(',').map(icon => icon.trim());
        
        // Filter out non-icon names (like Target, Circle, etc. that are not Heroicons)
        const heroicons = iconList.filter(icon => 
          icon.startsWith('Hi') || 
          ['Target', 'Circle', 'CheckCircle2', 'Flag', 'DollarSign', 'MessageSquare', 'BookOpen', 'Edit3', 'ClipboardList'].includes(icon)
        );
        
        const nonHeroicons = iconList.filter(icon => 
          !icon.startsWith('Hi') && 
          !['Target', 'Circle', 'CheckCircle2', 'Flag', 'DollarSign', 'MessageSquare', 'BookOpen', 'Edit3', 'ClipboardList'].includes(icon)
        );
        
        let newImport = '';
        if (heroicons.length > 0) {
          newImport += `import { ${heroicons.join(', ')} } from '@heroicons/react/24/outline';\n`;
        }
        if (nonHeroicons.length > 0) {
          newImport += `import { ${nonHeroicons.join(', ')} } from 'lucide-react';\n`;
        }
        
        content = content.replace(
          /import\s*{\s*[^}]+\s*}\s*from\s*['"]@heroicons\/react\/24\/outline['"];?\n?/,
          newImport
        );
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed imports: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let totalUpdated = 0;
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      totalUpdated += processDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
      if (fixImportsInFile(fullPath)) {
        totalUpdated++;
      }
    }
  });
  
  return totalUpdated;
}

// Run the fix
console.log('🚀 Fixing import statements...');
const srcPath = path.join(__dirname, 'src');
const totalUpdated = processDirectory(srcPath);
console.log(`\n✨ Import fix complete! Updated ${totalUpdated} files.`);
