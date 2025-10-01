const fs = require('fs');
const path = require('path');

// Icon mapping from Lucide React to React Icons (Heroicons)
const iconMappings = {
  // Navigation & UI
  'Menu': 'HiMenu',
  'X': 'HiX',
  'ChevronDown': 'HiChevronDown',
  'ChevronRight': 'HiChevronRight',
  'ChevronLeft': 'HiChevronLeft',
  'ChevronUp': 'HiChevronUp',
  'Home': 'HiHome',
  'Settings': 'HiCog',
  'User': 'HiUser',
  'Users': 'HiUsers',
  'LogOut': 'HiLogout',
  
  // Actions
  'Plus': 'HiPlus',
  'Edit': 'HiPencil',
  'Trash2': 'HiTrash',
  'Save': 'HiSave',
  'Download': 'HiDownload',
  'Upload': 'HiUpload',
  'Search': 'HiSearch',
  'Filter': 'HiFilter',
  'RefreshCw': 'HiRefresh',
  'Eye': 'HiEye',
  'EyeOff': 'HiEyeOff',
  
  // Data & Charts
  'BarChart3': 'HiChartBar',
  'PieChart': 'HiChartPie',
  'TrendingUp': 'HiTrendingUp',
  'TrendingDown': 'HiTrendingDown',
  'Activity': 'HiActivity',
  'Database': 'HiDatabase',
  
  // Files & Documents
  'FileText': 'HiDocumentText',
  'File': 'HiDocument',
  'Folder': 'HiFolder',
  'FolderOpen': 'HiFolderOpen',
  'FileSpreadsheet': 'HiTable',
  
  // Communication
  'Mail': 'HiMail',
  'MessageCircle': 'HiChat',
  'Bell': 'HiBell',
  'AlertCircle': 'HiExclamationCircle',
  'CheckCircle': 'HiCheckCircle',
  'XCircle': 'HiXCircle',
  'Info': 'HiInformationCircle',
  
  // Navigation & Location
  'Globe': 'HiGlobe',
  'MapPin': 'HiLocationMarker',
  'Navigation': 'HiNavigation',
  
  // Time & Calendar
  'Calendar': 'HiCalendar',
  'Clock': 'HiClock',
  'Timer': 'HiClock',
  
  // Status & Progress
  'Check': 'HiCheck',
  'X': 'HiX',
  'AlertTriangle': 'HiExclamationTriangle',
  'Loader': 'HiRefresh',
  'Spinner': 'HiRefresh'
};

// Import mapping
const importMappings = {
  'lucide-react': '@heroicons/react/24/outline'
};

function replaceIconsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace imports
    if (content.includes("from 'lucide-react'")) {
      content = content.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/g,
        (match, icons) => {
          const iconList = icons.split(',').map(icon => icon.trim());
          const newIcons = iconList.map(icon => {
            const mappedIcon = iconMappings[icon] || icon;
            return mappedIcon;
          });
          return `import { ${newIcons.join(', ')} } from '@heroicons/react/24/outline'`;
        }
      );
      modified = true;
    }
    
    // Replace icon usage in JSX
    Object.entries(iconMappings).forEach(([lucideIcon, heroIcon]) => {
      const regex = new RegExp(`<${lucideIcon}(\\s|>)`, 'g');
      if (content.match(regex)) {
        content = content.replace(regex, `<${heroIcon}$1`);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
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
      if (replaceIconsInFile(fullPath)) {
        totalUpdated++;
      }
    }
  });
  
  return totalUpdated;
}

// Run the migration
console.log('🚀 Starting icon migration from Lucide React to React Icons...');
const srcPath = path.join(__dirname, 'src');
const totalUpdated = processDirectory(srcPath);
console.log(`\n✨ Migration complete! Updated ${totalUpdated} files.`);
