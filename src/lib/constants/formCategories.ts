// Standard form categories for the ICS Dashboard
export const FORM_CATEGORIES = [
  {
    value: 'baseline',
    label: 'Baseline Survey',
    description: 'Initial data collection at project start'
  },
  {
    value: 'monitoring',
    label: 'Monitoring',
    description: 'Regular progress tracking and data collection'
  },
  {
    value: 'evaluation',
    label: 'Evaluation',
    description: 'Assessment of project outcomes and impact'
  },
  {
    value: 'endline',
    label: 'Endline Survey',
    description: 'Final data collection at project completion'
  },
  {
    value: 'midline',
    label: 'Midline Survey',
    description: 'Mid-project assessment and data collection'
  },
  {
    value: 'feedback',
    label: 'Feedback Collection',
    description: 'Gathering stakeholder feedback and opinions'
  },
  {
    value: 'registration',
    label: 'Registration',
    description: 'Participant or beneficiary registration forms'
  },
  {
    value: 'attendance',
    label: 'Attendance Tracking',
    description: 'Event or activity attendance recording'
  },
  {
    value: 'training',
    label: 'Training Assessment',
    description: 'Pre/post training assessments and evaluations'
  },
  {
    value: 'needs_assessment',
    label: 'Needs Assessment',
    description: 'Identifying community or beneficiary needs'
  },
  {
    value: 'financial',
    label: 'Financial Reporting',
    description: 'Budget tracking and financial data collection'
  },
  {
    value: 'incident',
    label: 'Incident Reporting',
    description: 'Recording incidents, issues, or problems'
  },
  {
    value: 'monthly_report',
    label: 'Monthly Report',
    description: 'Regular monthly progress and status reports'
  },
  {
    value: 'quarterly_report',
    label: 'Quarterly Report',
    description: 'Quarterly progress and financial reports'
  },
  {
    value: 'annual_report',
    label: 'Annual Report',
    description: 'Comprehensive yearly project reports'
  },
  {
    value: 'stakeholder',
    label: 'Stakeholder Engagement',
    description: 'Stakeholder mapping and engagement tracking'
  },
  {
    value: 'beneficiary',
    label: 'Beneficiary Data',
    description: 'Beneficiary information and demographics'
  },
  {
    value: 'activity_report',
    label: 'Activity Report',
    description: 'Specific activity implementation reports'
  },
  {
    value: 'compliance',
    label: 'Compliance Check',
    description: 'Regulatory and policy compliance verification'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Custom or miscellaneous form categories'
  }
] as const;

// Type for form category values
export type FormCategoryValue = typeof FORM_CATEGORIES[number]['value'];

// Helper function to get category label by value
export const getCategoryLabel = (value: string): string => {
  const category = FORM_CATEGORIES.find(cat => cat.value === value);
  return category?.label || value;
};

// Helper function to get category description by value
export const getCategoryDescription = (value: string): string => {
  const category = FORM_CATEGORIES.find(cat => cat.value === value);
  return category?.description || '';
};

// Grouped categories for better organization in UI
export const GROUPED_FORM_CATEGORIES = {
  'Data Collection': [
    'baseline',
    'monitoring',
    'evaluation',
    'endline',
    'midline',
    'needs_assessment'
  ],
  'Project Management': [
    'registration',
    'attendance',
    'training',
    'stakeholder',
    'beneficiary',
    'activity_report'
  ],
  'Reporting': [
    'monthly_report',
    'quarterly_report',
    'annual_report',
    'financial',
    'incident'
  ],
  'Other': [
    'feedback',
    'compliance',
    'other'
  ]
};




