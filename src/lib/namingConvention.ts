// Hierarchical Geographic Naming Protocol
// CountryCode_Region_ProjectCode_ReportType_YYYYMMDD

export interface Country {
  code: string;
  name: string;
  regions: Region[];
}

export interface Region {
  code: string;
  name: string;
  areas: string[];
}

export interface Project {
  code: string;
  name: string;
  description: string;
  country: string;
}

export interface ReportType {
  code: string;
  name: string;
  description: string;
}

export interface VersionControl {
  code: string;
  name: string;
  description: string;
}

// Country and Region Data
export const COUNTRIES: Country[] = [
  {
    code: 'KE',
    name: 'Kenya',
    regions: [
      {
        code: 'KE-C',
        name: 'Central',
        areas: ['Nairobi', 'Kiambu', 'Murang\'a', 'Nyeri', 'Kirinyaga']
      },
      {
        code: 'KE-CO',
        name: 'Coast',
        areas: ['Mombasa', 'Kilifi', 'Kwale', 'Taita-Taveta', 'Lamu']
      },
      {
        code: 'KE-W',
        name: 'Western',
        areas: ['Kakamega', 'Bungoma', 'Busia', 'Vihiga']
      },
      {
        code: 'KE-E',
        name: 'Eastern',
        areas: ['Machakos', 'Kitui', 'Makueni', 'Embu', 'Tharaka-Nithi']
      },
      {
        code: 'KE-N',
        name: 'Northern',
        areas: ['Turkana', 'Marsabit', 'Samburu', 'Isiolo', 'Mandera']
      },
      {
        code: 'KE-RV',
        name: 'Rift Valley',
        areas: ['Nakuru', 'Uasin Gishu', 'Kericho', 'Bomet', 'Kajiado']
      },
      {
        code: 'KE-NY',
        name: 'Nyanza',
        areas: ['Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira']
      }
    ]
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    regions: [
      {
        code: 'TZ-N',
        name: 'Northern',
        areas: ['Arusha', 'Kilimanjaro', 'Manyara']
      },
      {
        code: 'TZ-C',
        name: 'Central',
        areas: ['Dodoma', 'Singida']
      },
      {
        code: 'TZ-E',
        name: 'Eastern',
        areas: ['Dar es Salaam', 'Pwani', 'Morogoro']
      },
      {
        code: 'TZ-S',
        name: 'Southern',
        areas: ['Mtwara', 'Lindi', 'Ruvuma']
      },
      {
        code: 'TZ-W',
        name: 'Western',
        areas: ['Tabora', 'Kigoma']
      },
      {
        code: 'TZ-L',
        name: 'Lake Zone',
        areas: ['Mwanza', 'Shinyanga', 'Simiyu', 'Geita']
      },
      {
        code: 'TZ-SH',
        name: 'Southern Highlands',
        areas: ['Iringa', 'Njombe', 'Songwe', 'Mbeya']
      }
    ]
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    regions: [
      {
        code: 'CI-AB',
        name: 'Abidjan',
        areas: ['Abidjan (Economic capital)']
      },
      {
        code: 'CI-YA',
        name: 'Yamoussoukro',
        areas: ['Yamoussoukro (Political capital)']
      },
      {
        code: 'CI-N',
        name: 'Northern',
        areas: ['Savanes', 'Vallée du Bandama (North)']
      },
      {
        code: 'CI-C',
        name: 'Central',
        areas: ['Lacs', 'N\'Zi', 'Bélier']
      },
      {
        code: 'CI-W',
        name: 'Western',
        areas: ['Montagnes', 'Dix-Huit Montagnes']
      },
      {
        code: 'CI-E',
        name: 'Eastern',
        areas: ['Comoé', 'Indénié-Djuablin']
      },
      {
        code: 'CI-S',
        name: 'Southern',
        areas: ['Sud-Bandama', 'Agnéby-Tiassa']
      }
    ]
  }
];

// Project Data
export const PROJECTS: Project[] = [
  // Kenya Projects
  { code: 'MAMEB', name: 'MaMEB', description: 'Malezi Mema Elimu Bora Project', country: 'KE' },
  { code: 'VACIS', name: 'VACIS', description: 'Violence Against Children In and Around schools', country: 'KE' },
  { code: 'CDW', name: 'CDW', description: 'Child Domestic work Project', country: 'KE' },
  { code: 'NPPP', name: 'NPPP', description: 'National Positive Parenting Program', country: 'KE' },
  { code: 'AACL', name: 'AACL', description: 'Action Against Child Labour', country: 'KE' },
  { code: 'KUIM', name: 'Kuimarisha', description: 'Kuimarisha ECD project', country: 'KE' },
  
  // Tanzania Projects
  { code: 'VACIS', name: 'VACIS', description: 'Violence Against Children In and Around schools', country: 'TZ' },
  { code: 'MTOTO', name: 'Mtoto Kwanza', description: 'Mtoto Kwanza', country: 'TZ' },
  { code: 'POLINF', name: 'Policy Influence', description: 'Policy Influence Program', country: 'TZ' },
  
  // Côte d'Ivoire Projects
  { code: 'CLP', name: 'Child Labor Project', description: 'Child Labor Prevention Project', country: 'CI' }
];

// Report Types
export const REPORT_TYPES: ReportType[] = [
  { code: 'FIN', name: 'Financial Reports', description: 'Financial and budgetary reports' },
  { code: 'OPS', name: 'Operations Reports', description: 'Operational activities and processes' },
  { code: 'MON', name: 'Monitoring Reports', description: 'Monitoring and tracking reports' },
  { code: 'EVAL', name: 'Evaluation Reports', description: 'Evaluation and assessment reports' },
  { code: 'PROG', name: 'Progress Reports', description: 'Progress and milestone reports' },
  { code: 'DASH', name: 'Dashboard Reports', description: 'Dashboard and analytics reports' },
  { code: 'ADM', name: 'Administrative Reports', description: 'Administrative and management reports' },
  { code: 'HR', name: 'Human Resources Reports', description: 'HR and personnel reports' },
  { code: 'LOG', name: 'Logistics Reports', description: 'Logistics and supply chain reports' },
  { code: 'TECH', name: 'Technical Reports', description: 'Technical and specialized reports' }
];

// Version Control
export const VERSION_CONTROLS: VersionControl[] = [
  { code: 'DRAFT', name: 'Draft', description: 'Draft version' },
  { code: 'FINAL', name: 'Final', description: 'Final version' },
  { code: 'v1.0', name: 'Version 1.0', description: 'Version number' },
  { code: 'REV01', name: 'Revision 01', description: 'Revision number' }
];

// Utility Functions
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(country => country.code === code);
}

export function getRegionByCode(code: string): Region | undefined {
  for (const country of COUNTRIES) {
    const region = country.regions.find(r => r.code === code);
    if (region) return region;
  }
  return undefined;
}

export function getProjectByCode(code: string): Project | undefined {
  return PROJECTS.find(project => project.code === code);
}

export function getReportTypeByCode(code: string): ReportType | undefined {
  return REPORT_TYPES.find(type => type.code === code);
}

export function getProjectsByCountry(countryCode: string): Project[] {
  return PROJECTS.filter(project => project.country === countryCode);
}

export function getRegionsByCountry(countryCode: string): Region[] {
  const country = getCountryByCode(countryCode);
  return country ? country.regions : [];
}

// Naming Convention Generator
export interface NamingConventionData {
  countryCode: string;
  regionCode: string;
  projectCode: string;
  reportTypeCode: string;
  date: Date;
  versionControl?: string;
}

export function generateFileName(data: NamingConventionData): string {
  const dateStr = data.date.toISOString().slice(0, 10).replace(/-/g, '');
  let fileName = `${data.countryCode}_${data.regionCode}_${data.projectCode}_${data.reportTypeCode}_${dateStr}`;
  
  if (data.versionControl) {
    fileName += `_${data.versionControl}`;
  }
  
  return fileName;
}

export function parseFileName(fileName: string): NamingConventionData | null {
  // Remove file extension if present
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  
  // Split by underscore
  const parts = nameWithoutExt.split('_');
  
  if (parts.length < 5) return null;
  
  const [countryCode, regionCode, projectCode, reportTypeCode, dateStr, ...versionParts] = parts;
  
  // Parse date (YYYYMMDD format)
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6)) - 1; // Month is 0-indexed
  const day = parseInt(dateStr.slice(6, 8));
  const date = new Date(year, month, day);
  
  return {
    countryCode,
    regionCode,
    projectCode,
    reportTypeCode,
    date,
    versionControl: versionParts.length > 0 ? versionParts.join('_') : undefined
  };
}

// Validation Functions
export function validateNamingConvention(data: NamingConventionData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!getCountryByCode(data.countryCode)) {
    errors.push(`Invalid country code: ${data.countryCode}`);
  }
  
  if (!getRegionByCode(data.regionCode)) {
    errors.push(`Invalid region code: ${data.regionCode}`);
  }
  
  if (!getProjectByCode(data.projectCode)) {
    errors.push(`Invalid project code: ${data.projectCode}`);
  }
  
  if (!getReportTypeByCode(data.reportTypeCode)) {
    errors.push(`Invalid report type code: ${data.reportTypeCode}`);
  }
  
  // Validate that region belongs to country
  const country = getCountryByCode(data.countryCode);
  if (country && !country.regions.find(r => r.code === data.regionCode)) {
    errors.push(`Region ${data.regionCode} does not belong to country ${data.countryCode}`);
  }
  
  // Validate that project belongs to country
  const project = getProjectByCode(data.projectCode);
  if (project && project.country !== data.countryCode) {
    errors.push(`Project ${data.projectCode} does not belong to country ${data.countryCode}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
