import { Outcome, Activity } from '@/types/dashboard';

// CDW Outcomes and Activities

export const cdwOutcomes: Outcome[] = [
  {
    id: 'cdw-outcome-1',
    projectId: 'cdw',
    title: 'Strengthen child-centered advocacy on child domestic work',
    description: '',
    target: undefined as any,
    current: undefined as any,
    unit: '',
    progress: 0,
    status: 'on-track',
  },
  {
    id: 'cdw-outcome-2',
    projectId: 'cdw',
    title: 'Increase the reach of child and survivor-centered service provision for CDWs and former CDWs',
    description: '',
    target: undefined as any,
    current: undefined as any,
    unit: '',
    progress: 0,
    status: 'on-track',
  },
  {
    id: 'cdw-outcome-3',
    projectId: 'cdw',
    title: 'Increasing economic resilience amongst at-risk households and communities.',
    description: '',
    target: undefined as any,
    current: undefined as any,
    unit: '',
    progress: 0,
    status: 'on-track',
  },
  {
    id: 'cdw-outcome-4',
    projectId: 'cdw',
    title: 'Strengthening the policy framework and implementation.',
    description: '',
    target: undefined as any,
    current: undefined as any,
    unit: '',
    progress: 0,
    status: 'on-track',
  },
];

export const cdwActivities: Activity[] = [
  // Outcome 1 Activities
  { id: 'cdw-activity-1.1', outcomeId: 'cdw-outcome-1', title: 'Continuous enrollment of CDWs, at risk and Survivors', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-1.2', outcomeId: 'cdw-outcome-1', title: 'Feedback sessions with CDW, survivors and at risk', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-1.3', outcomeId: 'cdw-outcome-1', title: 'Life skills Sessions with CWDs (mentors stipend)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-1.4', outcomeId: 'cdw-outcome-1', title: 'Review meetings-monthly (with mentors)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-1.5', outcomeId: 'cdw-outcome-1', title: 'Representatives of CDW are empowered to be champions and invited to participate and voice their concerns in various advocacy platforms.', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-1.6', outcomeId: 'cdw-outcome-1', title: 'Support representatives of CDW to participate in children assemblies and other related child participation platforms in and out of school and support county children assembly activities', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-1.7', outcomeId: 'cdw-outcome-1', title: 'Children representatives supported to attend coordination meetings at county and sub-county level', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-1.8', outcomeId: 'cdw-outcome-1', title: 'Training of Peer Leaders/champions on leadership and advocacy', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-1.9', outcomeId: 'cdw-outcome-1', title: 'Development of advocacy and child friendly materials', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-1.10', outcomeId: 'cdw-outcome-1', title: 'Support commemoration of international days', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  // Outcome 2 Activities
  { id: 'cdw-activity-2.1', outcomeId: 'cdw-outcome-2', title: 'Mapping and referral of CDWs to services', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  // Outcome 3 Activities
  { id: 'cdw-activity-3.1', outcomeId: 'cdw-outcome-3', title: 'Mobilize and train 500 parents & adult caregivers on positive parenting (CFs Stipend)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-3.2', outcomeId: 'cdw-outcome-3', title: 'Review meetings-monthly (transport reimbursement and refreshments)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-3.3', outcomeId: 'cdw-outcome-3', title: 'Community awareness sessions (venues, refreshments, reimbursements)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-3.4', outcomeId: 'cdw-outcome-3', title: 'Families linked to social protection programmes', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  // Outcome 4 Activities
  { id: 'cdw-activity-4.1', outcomeId: 'cdw-outcome-4', title: 'Support Coordination meetings at national level (CAC meetings and Child Labor TWG meetings)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'cdw-activity-4.2', outcomeId: 'cdw-outcome-4', title: 'Support County level meetings (CAC meetings and TWGs)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
];

export const cdwKPIs = [
  // Outcome 1
  { outcomeId: 'cdw-outcome-1', name: 'Number of CDWs, at risk and Survivors enrolled', value: 100, target: 150, unit: 'children', type: 'bar' },
  { outcomeId: 'cdw-outcome-1', name: 'Number of feedback sessions with CDW, survivors and at risk', value: 20, target: 30, unit: 'sessions', type: 'progress' },
  { outcomeId: 'cdw-outcome-1', name: 'Number of life skills sessions with CDWs', value: 40, target: 60, unit: 'sessions', type: 'bar' },
  { outcomeId: 'cdw-outcome-1', name: 'Number of review meetings with mentors', value: 12, target: 18, unit: 'meetings', type: 'progress' },
  { outcomeId: 'cdw-outcome-1', name: 'Number of CDW representatives empowered to be champions', value: 10, target: 15, unit: 'champions', type: 'bar' },
  { outcomeId: 'cdw-outcome-1', name: 'Number of advocacy and child friendly materials developed', value: 8, target: 12, unit: 'materials', type: 'progress' },
  { outcomeId: 'cdw-outcome-1', name: 'Number of international days commemorated', value: 3, target: 5, unit: 'days', type: 'progress' },
  // Outcome 2
  { outcomeId: 'cdw-outcome-2', name: 'Number of CDWs mapped and referred to services', value: 50, target: 80, unit: 'children', type: 'bar' },
  // Outcome 3
  { outcomeId: 'cdw-outcome-3', name: 'Number of parents & adult caregivers trained on positive parenting', value: 500, target: 600, unit: 'caregivers', type: 'bar' },
  { outcomeId: 'cdw-outcome-3', name: 'Number of community awareness sessions held', value: 20, target: 30, unit: 'sessions', type: 'progress' },
  { outcomeId: 'cdw-outcome-3', name: 'Number of families linked to social protection programmes', value: 30, target: 50, unit: 'families', type: 'progress' },
  // Outcome 4
  { outcomeId: 'cdw-outcome-4', name: 'Number of national level coordination meetings supported', value: 4, target: 6, unit: 'meetings', type: 'progress' },
  { outcomeId: 'cdw-outcome-4', name: 'Number of county level meetings supported', value: 6, target: 10, unit: 'meetings', type: 'progress' },
]; 