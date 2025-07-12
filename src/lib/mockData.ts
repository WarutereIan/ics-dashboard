import { User, Project, Outcome, Activity, KPI } from '@/types/dashboard';

export const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@ics.org',
  role: 'project-admin',
  accessibleProjects: ['mameb', 'vacis'],
  accessibleBranches: ['mameb-nairobi', 'mameb-mombasa'],
  accessibleCountries: ['kenya'],
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
};

export const mockProjects: Project[] = [
  {
    id: 'mameb',
    name: 'MaMeb',
    description: 'Maternal and Neonatal Health Project',
    country: 'Kenya',
    status: 'active',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2027-12-31'),
    progress: 45,
    budget: 2500000,
    spent: 1125000
  },
  {
    id: 'vacis',
    name: 'VACIS',
    description: 'Vaccination Information System',
    country: 'Tanzania',
    status: 'active',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2026-05-31'),
    progress: 42,
    budget: 1800000,
    spent: 756000
  }
];

export const mockOutcomes: Outcome[] = [
  {
    id: 'outcome-1',
    projectId: 'mameb',
    title: 'Children\'s Rights and Empowerment',
    description: '3000 children have knowledge on their rights, and skills to make informed decisions and meaningfully engage with other actors for their own education success, safety and wellbeing by 2027',
    target: 3000,
    current: 1350,
    unit: 'children',
    progress: 45,
    status: 'on-track'
  },
  {
    id: 'outcome-2',
    projectId: 'mameb',
    title: 'Enhanced Parent-Teacher-Learner Collaboration',
    description: 'Enhanced collaboration between parents, teachers and learners resulting in improved learning and protection outcomes',
    target: 100,
    current: 68,
    unit: '% improvement',
    progress: 68,
    status: 'on-track'
  },
  {
    id: 'outcome-3',
    projectId: 'mameb',
    title: 'Community and Religious Leaders Engagement',
    description: '100 community and religious leaders model and promote the right to learning and protection and take action to coordinate efforts towards the realization of child rights at all levels',
    target: 100,
    current: 72,
    unit: 'leaders',
    progress: 72,
    status: 'on-track'
  },
  {
    id: 'outcome-4',
    projectId: 'mameb',
    title: 'School Capacity and Resources',
    description: 'Schools have the right capacity, resources, and policies and are implementing actions in collaboration with education stakeholders towards better safety and learning outcomes for children',
    target: 5,
    current: 3,
    unit: 'schools',
    progress: 60,
    status: 'on-track'
  },
  {
    id: 'outcome-5',
    projectId: 'mameb',
    title: 'Government and CSO Collaboration',
    description: 'Collaborate with Government and CSOs in conducting stakeholders\' engagement meetings to raise awareness on children rights and the importance for their protection and well-being',
    target: 12,
    current: 7,
    unit: 'meetings',
    progress: 58,
    status: 'on-track'
  }
];

export const mockActivities: Activity[] = [
  // Outcome 1 Activities
  {
    id: 'activity-1.1',
    outcomeId: 'outcome-1',
    title: 'Recruitment and training of mentors',
    description: 'Recruit and train 5 mentors (1 per school) with refreshments and transport reimbursement',
    progress: 80,
    status: 'in-progress',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2024-01-31'),
    responsible: 'Mary Wanjiku'
  },
  {
    id: 'activity-1.2',
    outcomeId: 'outcome-1',
    title: 'Formation of child rights clubs',
    description: 'Form child rights clubs where children meet to express opinions, discuss rights and plan advocacy (two clubs per school in 5 schools)',
    progress: 70,
    status: 'in-progress',
    startDate: new Date('2023-03-01'),
    endDate: new Date('2024-02-28'),
    responsible: 'John Kimani'
  },
  {
    id: 'activity-1.3',
    outcomeId: 'outcome-1',
    title: 'Establish child friendly reporting mechanisms',
    description: 'Establish child friendly reporting mechanisms within schools and communities that encourage children to report violence and seek support',
    progress: 85,
    status: 'in-progress',
    startDate: new Date('2023-01-15'),
    endDate: new Date('2023-12-31'),
    responsible: 'Grace Muthoni'
  },
  {
    id: 'activity-1.4',
    outcomeId: 'outcome-1',
    title: 'Child-friendly key messages creation',
    description: 'Engage children in creating child friendly key messages through artwork, illustrations, storytelling, writings, and songs',
    progress: 60,
    status: 'in-progress',
    startDate: new Date('2023-04-01'),
    endDate: new Date('2024-03-31'),
    responsible: 'Peter Ochieng'
  },
  {
    id: 'activity-1.5',
    outcomeId: 'outcome-1',
    title: 'Children\'s participation in assemblies and events',
    description: 'Facilitate learners to participate in children\'s assemblies, summits, inter-school debates, and cultural days',
    progress: 45,
    status: 'in-progress',
    startDate: new Date('2023-05-01'),
    endDate: new Date('2024-04-30'),
    responsible: 'Anne Njeri'
  },
  {
    id: 'activity-1.6',
    outcomeId: 'outcome-1',
    title: 'Media campaigns for children',
    description: 'Conduct media campaigns for children to express their views and raise awareness',
    progress: 30,
    status: 'in-progress',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2024-05-31'),
    responsible: 'David Mutua'
  },
  // Outcome 2 Activities
  {
    id: 'activity-2.1',
    outcomeId: 'outcome-2',
    title: 'Skillful parenting training',
    description: 'Train parents and caregivers on positive parenting skills and child development',
    progress: 75,
    status: 'in-progress',
    startDate: new Date('2023-03-01'),
    endDate: new Date('2024-02-29'),
    responsible: 'Susan Wanjiru'
  },
  {
    id: 'activity-2.2',
    outcomeId: 'outcome-2',
    title: 'Parent-teacher collaboration initiatives',
    description: 'Launch collaborative initiatives between parents, caregivers, and teachers for safe learning environments',
    progress: 55,
    status: 'in-progress',
    startDate: new Date('2023-04-01'),
    endDate: new Date('2024-03-31'),
    responsible: 'James Kariuki'
  },
  // Outcome 3 Activities
  {
    id: 'activity-3.1',
    outcomeId: 'outcome-3',
    title: 'Community leaders mapping and training',
    description: 'Identify, map and train community and religious leaders on child rights and their roles as duty bearers',
    progress: 80,
    status: 'in-progress',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2024-01-31'),
    responsible: 'Pastor Michael Omondi'
  },
  {
    id: 'activity-3.2',
    outcomeId: 'outcome-3',
    title: 'Community awareness sessions',
    description: 'Conduct community awareness sessions led by trained religious and community leaders',
    progress: 65,
    status: 'in-progress',
    startDate: new Date('2023-05-01'),
    endDate: new Date('2024-04-30'),
    responsible: 'Elder Sarah Akinyi'
  }
];

export const mockKPIs: KPI[] = [
  {
    id: 'kpi-1',
    name: 'Children with Rights Knowledge',
    value: 1350,
    target: 3000,
    unit: 'children',
    trend: 'up',
    change: 15
  },
  {
    id: 'kpi-2',
    name: 'Mentors Trained',
    value: 4,
    target: 5,
    unit: 'mentors',
    trend: 'up',
    change: 1
  },
  {
    id: 'kpi-3',
    name: 'Child Rights Clubs Formed',
    value: 7,
    target: 10,
    unit: 'clubs',
    trend: 'up',
    change: 2
  },
  {
    id: 'kpi-4',
    name: 'Parents Trained in Skillful Parenting',
    value: 245,
    target: 400,
    unit: 'parents',
    trend: 'up',
    change: 35
  },
  {
    id: 'kpi-5',
    name: 'Community Leaders Trained',
    value: 72,
    target: 100,
    unit: 'leaders',
    trend: 'up',
    change: 8
  },
  {
    id: 'kpi-6',
    name: 'Schools with Enhanced Capacity',
    value: 3,
    target: 5,
    unit: 'schools',
    trend: 'up',
    change: 1
  }
];

// Detailed outputs for Outcome 1
export const outcome1Outputs = [
  {
    id: 'output-1.1',
    title: '% of children who report improved knowledge on their rights and responsibilities',
    target: 80,
    current: 65,
    unit: '%'
  },
  {
    id: 'output-1.2',
    title: '% of children actively using safe platforms to engage on their rights',
    target: 70,
    current: 45,
    unit: '%'
  },
  {
    id: 'output-1.3',
    title: '# of mentors trained on life skills value-based education',
    target: 5,
    current: 4,
    unit: 'mentors'
  },
  {
    id: 'output-1.4',
    title: '# of children participating in life skills value-based education',
    target: 3000,
    current: 1350,
    unit: 'children'
  },
  {
    id: 'output-1.5',
    title: '# of clubs created or strengthened to empower children',
    target: 10,
    current: 7,
    unit: 'clubs'
  },
  {
    id: 'output-1.6',
    title: '# of children actively participating in club activities',
    target: 2500,
    current: 980,
    unit: 'children'
  },
  {
    id: 'output-1.7',
    title: '# of learners sensitized on speak out boxes',
    target: 3000,
    current: 2100,
    unit: 'learners'
  },
  {
    id: 'output-1.8',
    title: '% of learners utilizing child-friendly reporting mechanisms',
    target: 60,
    current: 42,
    unit: '%'
  },
  {
    id: 'output-1.9',
    title: '# of incidences reported through speak out boxes',
    target: 50,
    current: 23,
    unit: 'incidents'
  }
];

// Sub-activities for detailed tracking
export const subActivities = [
  {
    id: 'sub-activity-1.3.1',
    parentId: 'activity-1.3',
    title: 'Sensitize schools on the use of speakout box',
    progress: 100,
    status: 'completed'
  },
  {
    id: 'sub-activity-1.3.2',
    parentId: 'activity-1.3',
    title: 'Provide talking walls and speak out boxes in schools (1 per school)',
    progress: 80,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.3.3',
    parentId: 'activity-1.3',
    title: 'Facilitate referral and response to children - Case management',
    progress: 70,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.4.1',
    parentId: 'activity-1.4',
    title: 'Hold consultative meeting with children',
    progress: 90,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.4.2',
    parentId: 'activity-1.4',
    title: 'Develop key messages',
    progress: 60,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.5.1',
    parentId: 'activity-1.5',
    title: 'Support children in clubs to meaningfully participate in debates and assemblies',
    progress: 50,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.5.2',
    parentId: 'activity-1.5',
    title: 'Support children to participate in international days',
    progress: 40,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.5.3',
    parentId: 'activity-1.5',
    title: 'Support children to participate in advocacy platforms and summits',
    progress: 30,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.5.4',
    parentId: 'activity-1.5',
    title: 'Procure project banners, fliers, summaries, t-shirts, reflector jackets',
    progress: 85,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.6.1',
    parentId: 'activity-1.6',
    title: 'Training children on reporting and journalism',
    progress: 25,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.6.2',
    parentId: 'activity-1.6',
    title: 'Subscription/facilitation for media campaigns',
    progress: 35,
    status: 'in-progress'
  },
  {
    id: 'sub-activity-1.6.3',
    parentId: 'activity-1.6',
    title: 'Creating awareness on environment and climate change through clubs',
    progress: 20,
    status: 'not-started'
  }
];

// Comprehensive mock data for all outcomes, outputs, and activities
export const comprehensiveOutcomesData = {
  '1': {
    id: '1',
    title: 'Children\'s Rights & Empowerment',
    description: 'Children feel empowered and are playing a meaningful role in decisions that affect their lives, including demanding protection from violence and claiming their rights.',
    target: 3000,
    current: 1350,
    unit: 'children',
    status: 'on-track',
    progress: 45,
    outputs: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9'],
    activities: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6']
  },
  '2': {
    id: '2',
    title: 'Parent-Teacher Collaboration',
    description: 'Parents and teachers are working together to ensure children\'s well-being and educational success.',
    target: 200,
    current: 145,
    unit: 'parents',
    status: 'on-track',
    progress: 72,
    outputs: ['2.1', '2.2', '2.3', '2.4', '2.5'],
    activities: ['2.1']
  },
  '3': {
    id: '3',
    title: 'Community Leaders Engagement',
    description: 'Community and religious leaders are actively promoting positive parenting practices and child protection.',
    target: 85,
    current: 67,
    unit: '%',
    status: 'on-track',
    progress: 79,
    outputs: ['3.1', '3.2', '3.3', '3.4'],
    activities: ['3.1']
  },
  '4': {
    id: '4',
    title: 'School Capacity & Resources',
    description: 'Schools have improved capacity and resources to support children\'s holistic development and protection.',
    target: 5,
    current: 3,
    unit: 'schools',
    status: 'at-risk',
    progress: 60,
    outputs: ['4.1', '4.2'],
    activities: ['4.1']
  },
  '5': {
    id: '5',
    title: 'Government & CSO Collaboration',
    description: 'Government agencies and CSOs are working together effectively to protect children\'s rights.',
    target: 10,
    current: 6,
    unit: 'partnerships',
    status: 'on-track',
    progress: 60,
    outputs: ['5.1'],
    activities: ['5.1']
  }
};

export const comprehensiveOutputsData = {
  // Outcome 1 Outputs
  '1.1': {
    id: '1.1',
    title: 'Children who report improved knowledge on their rights',
    description: 'Percentage of children demonstrating improved understanding of their rights and responsibilities through assessments and surveys.',
    target: 80,
    current: 65,
    unit: '%',
    status: 'on-track',
    outcomeId: '1',
    activities: ['1.1', '1.2']
  },
  '1.2': {
    id: '1.2',
    title: 'Children actively using safe platforms to engage on their rights',
    description: 'Percentage of children utilizing designated safe platforms and mechanisms for expressing their views and concerns.',
    target: 70,
    current: 45,
    unit: '%',
    status: 'at-risk',
    outcomeId: '1',
    activities: ['1.2', '1.5']
  },
  '1.3': {
    id: '1.3',
    title: 'Mentors trained on life skills value-based education',
    description: 'Number of mentors successfully trained and certified in life skills value-based education methodologies.',
    target: 5,
    current: 4,
    unit: 'mentors',
    status: 'on-track',
    outcomeId: '1',
    activities: ['1.1']
  },
  '1.4': {
    id: '1.4',
    title: 'Children participating in life skills education',
    description: 'Number of children actively participating in life skills education programs.',
    target: 3000,
    current: 1350,
    unit: 'children',
    status: 'on-track',
    outcomeId: '1',
    activities: ['1.1', '1.4']
  },
  '1.5': {
    id: '1.5',
    title: 'Clubs created or strengthened',
    description: 'Number of child rights clubs that have been established or strengthened.',
    target: 10,
    current: 7,
    unit: 'clubs',
    status: 'on-track',
    outcomeId: '1',
    activities: ['1.2']
  },
  '1.6': {
    id: '1.6',
    title: 'Children in club activities',
    description: 'Number of children actively participating in club activities.',
    target: 2500,
    current: 980,
    unit: 'children',
    status: 'behind',
    outcomeId: '1',
    activities: ['1.2', '1.5']
  },
  '1.7': {
    id: '1.7',
    title: 'Learners sensitized on speak out boxes',
    description: 'Number of learners who have been sensitized on the use of speak out boxes.',
    target: 3000,
    current: 2100,
    unit: 'learners',
    status: 'on-track',
    outcomeId: '1',
    activities: ['1.3']
  },
  '1.8': {
    id: '1.8',
    title: 'Using child-friendly reporting mechanisms',
    description: 'Percentage of children using child-friendly reporting mechanisms.',
    target: 60,
    current: 42,
    unit: '%',
    status: 'on-track',
    outcomeId: '1',
    activities: ['1.3']
  },
  '1.9': {
    id: '1.9',
    title: 'Incidents reported through speak out boxes',
    description: 'Number of incidents reported through speak out boxes.',
    target: 50,
    current: 23,
    unit: 'incidents',
    status: 'at-risk',
    outcomeId: '1',
    activities: ['1.3']
  },
  // Outcome 2 Outputs
  '2.1': {
    id: '2.1',
    title: 'Parents trained and graduated from Skilful parenting training',
    description: 'Number of parents who have successfully completed the comprehensive skilful parenting training program.',
    target: 200,
    current: 145,
    unit: 'parents',
    status: 'on-track',
    outcomeId: '2',
    activities: ['2.1']
  },
  '2.2': {
    id: '2.2',
    title: 'Parents demonstrating improved parenting skills',
    description: 'Percentage of parents demonstrating improved parenting skills through assessments.',
    target: 85,
    current: 72,
    unit: '%',
    status: 'on-track',
    outcomeId: '2',
    activities: ['2.1']
  },
  '2.3': {
    id: '2.3',
    title: 'Parent-teacher meetings held regularly',
    description: 'Number of schools where parent-teacher meetings are held regularly.',
    target: 5,
    current: 4,
    unit: 'schools',
    status: 'on-track',
    outcomeId: '2',
    activities: ['2.1']
  },
  '2.4': {
    id: '2.4',
    title: 'Parents actively involved in school activities',
    description: 'Percentage of parents actively involved in school activities.',
    target: 70,
    current: 58,
    unit: '%',
    status: 'at-risk',
    outcomeId: '2',
    activities: ['2.1']
  },
  '2.5': {
    id: '2.5',
    title: 'Positive parenting practices reported',
    description: 'Percentage of parents reporting use of positive parenting practices.',
    target: 80,
    current: 67,
    unit: '%',
    status: 'on-track',
    outcomeId: '2',
    activities: ['2.1']
  },
  // Outcome 3 Outputs
  '3.1': {
    id: '3.1',
    title: 'Parents reporting positive influence from community and religious leaders',
    description: 'Proportion of parents who report positive influence and support from trained community and religious leaders.',
    target: 85,
    current: 67,
    unit: '%',
    status: 'on-track',
    outcomeId: '3',
    activities: ['3.1']
  },
  '3.2': {
    id: '3.2',
    title: 'Community leaders actively promoting child protection',
    description: 'Number of community leaders actively promoting child protection practices.',
    target: 20,
    current: 15,
    unit: 'leaders',
    status: 'on-track',
    outcomeId: '3',
    activities: ['3.1']
  },
  '3.3': {
    id: '3.3',
    title: 'Community awareness sessions conducted',
    description: 'Number of community awareness sessions conducted by trained leaders.',
    target: 50,
    current: 32,
    unit: 'sessions',
    status: 'on-track',
    outcomeId: '3',
    activities: ['3.1']
  },
  '3.4': {
    id: '3.4',
    title: 'Community members reached through awareness campaigns',
    description: 'Number of community members reached through awareness campaigns.',
    target: 2000,
    current: 1280,
    unit: 'people',
    status: 'on-track',
    outcomeId: '3',
    activities: ['3.1']
  },
  // Outcome 4 Outputs
  '4.1': {
    id: '4.1',
    title: 'Schools with improved child protection policies',
    description: 'Number of schools with improved and implemented child protection policies.',
    target: 5,
    current: 3,
    unit: 'schools',
    status: 'at-risk',
    outcomeId: '4',
    activities: ['4.1']
  },
  '4.2': {
    id: '4.2',
    title: 'Teachers trained on child protection',
    description: 'Number of teachers trained on child protection and positive discipline.',
    target: 50,
    current: 28,
    unit: 'teachers',
    status: 'behind',
    outcomeId: '4',
    activities: ['4.1']
  },
  // Outcome 5 Outputs
  '5.1': {
    id: '5.1',
    title: 'Government-CSO partnerships established',
    description: 'Number of formal partnerships established between government agencies and CSOs.',
    target: 10,
    current: 6,
    unit: 'partnerships',
    status: 'on-track',
    outcomeId: '5',
    activities: ['5.1']
  }
};

export const comprehensiveActivitiesData = {
  // Outcome 1 Activities
  '1.1': {
    id: '1.1',
    title: 'Recruitment and training of mentors',
    description: 'Training of 5 mentors (1 per school) with refreshments and transport reimbursement',
    outcomeId: '1',
    target: 5,
    current: 4,
    unit: 'mentors',
    status: 'on-track',
    budget: 15000,
    spent: 12000,
    startDate: '2023-01-15',
    endDate: '2023-12-31',
    responsible: 'Training Team',
    location: 'All 5 schools',
    subActivities: [
      {
        id: '1.1.1',
        title: 'Mentor recruitment and selection',
        description: 'Identify and recruit suitable mentors from each school',
        status: 'completed',
        progress: 100,
        dueDate: '2023-02-28'
      },
      {
        id: '1.1.2',
        title: 'Mentor training workshops',
        description: 'Conduct comprehensive training workshops for selected mentors',
        status: 'in-progress',
        progress: 80,
        dueDate: '2023-08-31'
      },
      {
        id: '1.1.3',
        title: 'Mentor certification and ongoing support',
        description: 'Certify trained mentors and provide ongoing support',
        status: 'pending',
        progress: 20,
        dueDate: '2023-12-31'
      }
    ]
  },
  '1.2': {
    id: '1.2',
    title: 'Establish and strengthen child clubs',
    description: 'Establish new child clubs and strengthen existing ones to promote children\'s rights',
    outcomeId: '1',
    target: 10,
    current: 7,
    unit: 'clubs',
    status: 'on-track',
    budget: 12000,
    spent: 8500,
    startDate: '2023-02-01',
    endDate: '2023-11-30',
    responsible: 'Community Mobilization Team',
    location: 'Community centers and schools',
    subActivities: [
      {
        id: '1.2.1',
        title: 'Club formation and registration',
        description: 'Form and register new child clubs in target areas',
        status: 'completed',
        progress: 100,
        dueDate: '2023-04-30'
      },
      {
        id: '1.2.2',
        title: 'Club leadership training',
        description: 'Train club leaders and provide governance support',
        status: 'in-progress',
        progress: 70,
        dueDate: '2023-09-30'
      },
      {
        id: '1.2.3',
        title: 'Club activity implementation',
        description: 'Support clubs in implementing their activity plans',
        status: 'in-progress',
        progress: 60,
        dueDate: '2023-11-30'
      }
    ]
  },
  '1.3': {
    id: '1.3',
    title: 'Establish child friendly reporting mechanisms',
    description: 'Establish child friendly reporting mechanisms within schools and communities that encourages children to report incidence of violence and seek support',
    outcomeId: '1',
    target: 5,
    current: 3,
    unit: 'schools',
    status: 'on-track',
    budget: 8000,
    spent: 5200,
    startDate: '2023-03-01',
    endDate: '2023-11-30',
    responsible: 'Child Protection Team',
    location: 'All target schools',
    subActivities: [
      {
        id: '1.3.1',
        title: 'Sensitize schools on the use of speak out boxes',
        description: 'Conduct sensitization sessions with school administrators and teachers',
        status: 'completed',
        progress: 100,
        dueDate: '2023-04-30'
      },
      {
        id: '1.3.2',
        title: 'Provide talking walls and speak out boxes in schools',
        description: 'Install talking walls and speak out boxes in all 5 target schools',
        status: 'in-progress',
        progress: 60,
        dueDate: '2023-09-30'
      },
      {
        id: '1.3.3',
        title: 'Facilitate referral and response to children - Case management',
        description: 'Establish case management system for reports received through mechanisms',
        status: 'in-progress',
        progress: 40,
        dueDate: '2023-11-30'
      }
    ]
  },
  '1.4': {
    id: '1.4',
    title: 'Life skills education implementation',
    description: 'Implement comprehensive life skills education programs for children',
    outcomeId: '1',
    target: 3000,
    current: 1350,
    unit: 'children',
    status: 'on-track',
    budget: 25000,
    spent: 15000,
    startDate: '2023-02-01',
    endDate: '2023-12-31',
    responsible: 'Education Team',
    location: 'Schools and community centers',
    subActivities: [
      {
        id: '1.4.1',
        title: 'Curriculum development',
        description: 'Develop age-appropriate life skills curriculum',
        status: 'completed',
        progress: 100,
        dueDate: '2023-03-31'
      },
      {
        id: '1.4.2',
        title: 'Teacher training',
        description: 'Train teachers on life skills education delivery',
        status: 'completed',
        progress: 100,
        dueDate: '2023-05-31'
      },
      {
        id: '1.4.3',
        title: 'Program implementation',
        description: 'Roll out life skills education programs',
        status: 'in-progress',
        progress: 45,
        dueDate: '2023-12-31'
      }
    ]
  },
  '1.5': {
    id: '1.5',
    title: 'Children\'s participation in decision-making',
    description: 'Facilitate meaningful participation of children in decisions that affect them',
    outcomeId: '1',
    target: 2500,
    current: 980,
    unit: 'children',
    status: 'behind',
    budget: 18000,
    spent: 9000,
    startDate: '2023-04-01',
    endDate: '2023-12-31',
    responsible: 'Participation Team',
    location: 'Schools and communities',
    subActivities: [
      {
        id: '1.5.1',
        title: 'Child participation training',
        description: 'Train children on meaningful participation principles',
        status: 'in-progress',
        progress: 60,
        dueDate: '2023-08-31'
      },
      {
        id: '1.5.2',
        title: 'Establish child parliaments',
        description: 'Establish child parliaments in schools and communities',
        status: 'in-progress',
        progress: 40,
        dueDate: '2023-10-31'
      },
      {
        id: '1.5.3',
        title: 'Youth advocacy campaigns',
        description: 'Support youth-led advocacy campaigns',
        status: 'pending',
        progress: 20,
        dueDate: '2023-12-31'
      }
    ]
  },
  '1.6': {
    id: '1.6',
    title: 'Children\'s rights awareness campaigns',
    description: 'Conduct awareness campaigns to promote children\'s rights knowledge',
    outcomeId: '1',
    target: 3000,
    current: 2100,
    unit: 'children',
    status: 'on-track',
    budget: 14000,
    spent: 9800,
    startDate: '2023-03-01',
    endDate: '2023-11-30',
    responsible: 'Advocacy Team',
    location: 'Schools and communities',
    subActivities: [
      {
        id: '1.6.1',
        title: 'Campaign material development',
        description: 'Develop age-appropriate campaign materials',
        status: 'completed',
        progress: 100,
        dueDate: '2023-04-30'
      },
      {
        id: '1.6.2',
        title: 'School-based campaigns',
        description: 'Conduct rights awareness campaigns in schools',
        status: 'in-progress',
        progress: 70,
        dueDate: '2023-09-30'
      },
      {
        id: '1.6.3',
        title: 'Community outreach',
        description: 'Conduct community-based awareness activities',
        status: 'in-progress',
        progress: 65,
        dueDate: '2023-11-30'
      }
    ]
  },
  // Outcome 2 Activities
  '2.1': {
    id: '2.1',
    title: 'Skilful parenting training',
    description: 'Training parents on positive parenting techniques and child development',
    outcomeId: '2',
    target: 200,
    current: 145,
    unit: 'parents',
    status: 'on-track',
    budget: 25000,
    spent: 18000,
    startDate: '2023-02-01',
    endDate: '2023-12-31',
    responsible: 'Parenting Team',
    location: 'Community centers',
    subActivities: [
      {
        id: '2.1.1',
        title: 'Develop parenting training curriculum',
        description: 'Create comprehensive curriculum for skilful parenting training',
        status: 'completed',
        progress: 100,
        dueDate: '2023-03-31'
      },
      {
        id: '2.1.2',
        title: 'Conduct parenting training sessions',
        description: 'Deliver training sessions to groups of parents',
        status: 'in-progress',
        progress: 72,
        dueDate: '2023-12-31'
      },
      {
        id: '2.1.3',
        title: 'Follow-up and support sessions',
        description: 'Provide ongoing support and follow-up to trained parents',
        status: 'in-progress',
        progress: 30,
        dueDate: '2023-12-31'
      }
    ]
  },
  // Outcome 3 Activities
  '3.1': {
    id: '3.1',
    title: 'Training and mobilization of community and religious leaders',
    description: 'Train and mobilize community and religious leaders to promote positive parenting',
    outcomeId: '3',
    target: 20,
    current: 15,
    unit: 'leaders',
    status: 'on-track',
    budget: 20000,
    spent: 15000,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    responsible: 'Community Engagement Team',
    location: 'Community centers and religious facilities',
    subActivities: [
      {
        id: '3.1.1',
        title: 'Leader identification and recruitment',
        description: 'Identify and recruit influential community and religious leaders',
        status: 'completed',
        progress: 100,
        dueDate: '2023-03-31'
      },
      {
        id: '3.1.2',
        title: 'Leadership training workshops',
        description: 'Conduct comprehensive training workshops for leaders',
        status: 'in-progress',
        progress: 75,
        dueDate: '2023-09-30'
      },
      {
        id: '3.1.3',
        title: 'Community mobilization activities',
        description: 'Support leaders in conducting community mobilization',
        status: 'in-progress',
        progress: 65,
        dueDate: '2023-12-31'
      }
    ]
  },
  // Outcome 4 Activities
  '4.1': {
    id: '4.1',
    title: 'School capacity building and resource development',
    description: 'Build school capacity and develop resources for child protection and holistic development',
    outcomeId: '4',
    target: 5,
    current: 3,
    unit: 'schools',
    status: 'at-risk',
    budget: 30000,
    spent: 18000,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    responsible: 'School Development Team',
    location: 'Target schools',
    subActivities: [
      {
        id: '4.1.1',
        title: 'School assessment and planning',
        description: 'Conduct comprehensive assessments and develop improvement plans',
        status: 'completed',
        progress: 100,
        dueDate: '2023-04-30'
      },
      {
        id: '4.1.2',
        title: 'Teacher training and capacity building',
        description: 'Train teachers on child protection and positive discipline',
        status: 'in-progress',
        progress: 60,
        dueDate: '2023-10-31'
      },
      {
        id: '4.1.3',
        title: 'Resource development and provision',
        description: 'Develop and provide necessary resources for schools',
        status: 'in-progress',
        progress: 45,
        dueDate: '2023-12-31'
      }
    ]
  },
  // Outcome 5 Activities
  '5.1': {
    id: '5.1',
    title: 'Government-CSO partnership development',
    description: 'Develop formal partnerships between government agencies and CSOs',
    outcomeId: '5',
    target: 10,
    current: 6,
    unit: 'partnerships',
    status: 'on-track',
    budget: 15000,
    spent: 9000,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    responsible: 'Partnership Team',
    location: 'Government offices and CSO headquarters',
    subActivities: [
      {
        id: '5.1.1',
        title: 'Stakeholder mapping and engagement',
        description: 'Map key stakeholders and initiate engagement processes',
        status: 'completed',
        progress: 100,
        dueDate: '2023-03-31'
      },
      {
        id: '5.1.2',
        title: 'Partnership agreement development',
        description: 'Develop formal partnership agreements',
        status: 'in-progress',
        progress: 60,
        dueDate: '2023-09-30'
      },
      {
        id: '5.1.3',
        title: 'Joint program implementation',
        description: 'Implement joint programs and activities',
        status: 'in-progress',
        progress: 40,
        dueDate: '2023-12-31'
      }
    ]
  }
};

// Enhanced mock data with visualization-specific data
export const visualizationData = {
  // Output 1.1: % children with improved knowledge - Radial Gauge with color coding
  '1.1': {
    type: 'radialGauge',
    value: 65,
    target: 80,
    unit: '%',
    useColorCoding: true,
    data: [
      { month: 'Jan', value: 45 },
      { month: 'Feb', value: 48 },
      { month: 'Mar', value: 52 },
      { month: 'Apr', value: 58 },
      { month: 'May', value: 62 },
      { month: 'Jun', value: 65 }
    ]
  },
  // Output 1.2: % children using safe platforms - Donut Chart with interactive segments
  '1.2': {
    type: 'pieChart',
    data: [
      { name: 'Using Safe Platforms', value: 45, color: '#10B981' },
      { name: 'Not Using Safe Platforms', value: 55, color: '#EF4444' }
    ],
    innerRadius: 40,
    interactive: true
  },
  // Output 1.3: # mentors trained - Stacked Bar Chart with branch comparison
  '1.3': {
    type: 'stackedBarChart',
    data: [
      { school: 'School A', trained: 1, pending: 0 },
      { school: 'School B', trained: 1, pending: 0 },
      { school: 'School C', trained: 1, pending: 0 },
      { school: 'School D', trained: 1, pending: 0 },
      { school: 'School E', trained: 0, pending: 1 }
    ],
    stacks: [
      { dataKey: 'trained', fill: '#10B981', name: 'Trained' },
      { dataKey: 'pending', fill: '#F59E0B', name: 'Pending' }
    ]
  },
  // Output 1.4: # children in life skills education - Timeline Area Chart
  '1.4': {
    type: 'areaChart',
    data: [
      { date: '2023-01', value: 150, cumulative: 150 },
      { date: '2023-02', value: 180, cumulative: 330 },
      { date: '2023-03', value: 220, cumulative: 550 },
      { date: '2023-04', value: 195, cumulative: 745 },
      { date: '2023-05', value: 240, cumulative: 985 },
      { date: '2023-06', value: 210, cumulative: 1195 },
      { date: '2023-07', value: 155, cumulative: 1350 }
    ],
    showCumulative: true,
    milestones: [
      { x: '2023-03', label: 'Q1 Target' },
      { x: '2023-06', label: 'Mid-year Review' }
    ]
  },
  // Output 1.5: # clubs created/strengthened - Progress Bar with target comparison
  '1.5': {
    type: 'progressBar',
    current: 7,
    target: 10,
    unit: 'clubs',
    breakdown: [
      { name: 'New Clubs', value: 4 },
      { name: 'Strengthened', value: 3 }
    ]
  },
  // Output 1.6: # children in club activities - Multi-line Chart with branch comparison
  '1.6': {
    type: 'lineChart',
    data: [
      { date: '2023-01', schoolA: 45, schoolB: 38, schoolC: 42, schoolD: 35, schoolE: 28 },
      { date: '2023-02', schoolA: 52, schoolB: 45, schoolC: 48, schoolD: 42, schoolE: 33 },
      { date: '2023-03', schoolA: 58, schoolB: 52, schoolC: 55, schoolD: 48, schoolE: 39 },
      { date: '2023-04', schoolA: 65, schoolB: 58, schoolC: 62, schoolD: 55, schoolE: 45 },
      { date: '2023-05', schoolA: 72, schoolB: 65, schoolC: 68, schoolD: 62, schoolE: 52 },
      { date: '2023-06', schoolA: 78, schoolB: 72, schoolC: 75, schoolD: 68, schoolE: 58 }
    ],
    lines: [
      { dataKey: 'schoolA', color: '#3B82F6', name: 'School A' },
      { dataKey: 'schoolB', color: '#10B981', name: 'School B' },
      { dataKey: 'schoolC', color: '#F59E0B', name: 'School C' },
      { dataKey: 'schoolD', color: '#EF4444', name: 'School D' },
      { dataKey: 'schoolE', color: '#8B5CF6', name: 'School E' }
    ]
  },
  // Output 1.7: # learners sensitized - Column Chart with monthly breakdown
  '1.7': {
    type: 'barChart',
    data: [
      { month: 'Jan', value: 280 },
      { month: 'Feb', value: 320 },
      { month: 'Mar', value: 350 },
      { month: 'Apr', value: 380 },
      { month: 'May', value: 420 },
      { month: 'Jun', value: 350 }
    ],
    bars: [{ dataKey: 'value', fill: '#3B82F6', name: 'Learners Sensitized' }]
  },
  // Output 1.8: % utilizing reporting mechanisms - Pie + Trend Combo
  '1.8': {
    type: 'pieAndTrend',
    pieData: [
      { name: 'Using Reporting Mechanisms', value: 42, color: '#10B981' },
      { name: 'Not Using', value: 58, color: '#EF4444' }
    ],
    trendData: [
      { date: '2023-01', value: 25 },
      { date: '2023-02', value: 28 },
      { date: '2023-03', value: 32 },
      { date: '2023-04', value: 36 },
      { date: '2023-05', value: 39 },
      { date: '2023-06', value: 42 }
    ]
  },
  // Output 1.9: # incidents reported - Heatmap Calendar
  '1.9': {
    type: 'heatmapCalendar',
    data: [
      { date: '2023-01-05', value: 2 },
      { date: '2023-01-12', value: 1 },
      { date: '2023-01-18', value: 3 },
      { date: '2023-02-03', value: 1 },
      { date: '2023-02-15', value: 2 },
      { date: '2023-02-28', value: 1 },
      { date: '2023-03-08', value: 2 },
      { date: '2023-03-22', value: 4 },
      { date: '2023-04-05', value: 1 },
      { date: '2023-04-19', value: 2 },
      { date: '2023-05-12', value: 3 },
      { date: '2023-06-02', value: 1 }
    ]
  },
  // Output 2.1: # parents trained - Bullet Chart with target bands
  '2.1': {
    type: 'bulletChart',
    current: 145,
    target: 200,
    unit: 'parents',
    qualitativeRanges: { poor: 100, satisfactory: 150, good: 200 },
    comparative: 120
  },
  // Output 2.2: % with improved knowledge - Radial Gauge comparative to baseline
  '2.2': {
    type: 'radialGauge',
    value: 72,
    target: 85,
    unit: '%',
    useColorCoding: true,
    baseline: 45,
    improvement: 27
  },
  // Output 3.1: % reporting positive influence - Likert Scale Chart
  '3.1': {
    type: 'likertScale',
    data: [
      {
        question: 'Community leaders provide positive guidance',
        responses: {
          stronglyDisagree: 5,
          disagree: 8,
          neutral: 15,
          agree: 35,
          stronglyAgree: 25
        }
      },
      {
        question: 'Religious leaders support positive parenting',
        responses: {
          stronglyDisagree: 3,
          disagree: 6,
          neutral: 12,
          agree: 38,
          stronglyAgree: 28
        }
      },
      {
        question: 'Leaders help resolve family conflicts',
        responses: {
          stronglyDisagree: 8,
          disagree: 12,
          neutral: 18,
          agree: 30,
          stronglyAgree: 20
        }
      }
    ]
  },
  // Output 4.1: # patrons trained - Progress Bar with certification status
  '4.1': {
    type: 'progressBar',
    current: 28,
    target: 50,
    unit: 'teachers',
    breakdown: [
      { name: 'Certified', value: 20 },
      { name: 'In Training', value: 8 },
      { name: 'Pending', value: 22 }
    ]
  },
  // Output 5.1: # stakeholder meetings - Timeline Chart with milestone markers
  '5.1': {
    type: 'lineChart',
    data: [
      { date: '2023-01', value: 1, cumulative: 1 },
      { date: '2023-02', value: 1, cumulative: 2 },
      { date: '2023-03', value: 2, cumulative: 4 },
      { date: '2023-04', value: 1, cumulative: 5 },
      { date: '2023-05', value: 1, cumulative: 6 },
      { date: '2023-06', value: 0, cumulative: 6 }
    ],
    lines: [
      { dataKey: 'value', color: '#3B82F6', name: 'Monthly Meetings' },
      { dataKey: 'cumulative', color: '#10B981', name: 'Cumulative' }
    ],
    milestones: [
      { x: '2023-03', label: 'Quarterly Review' },
      { x: '2023-06', label: 'Mid-year Assessment' }
    ]
  }
};

// Helper function to get visualization data for a specific output
export const getVisualizationData = (outputId: string) => {
  return visualizationData[outputId as keyof typeof visualizationData];
};

// Enhanced data generation with visualization support
export const generateVisualizationData = (outputId: string, current: number, target: number) => {
  const vizData = getVisualizationData(outputId);
  
  if (!vizData) {
    return generateProgressData(current, target);
  }
  
  // Handle different data structures based on type
  if ('data' in vizData && vizData.data) {
    return vizData.data;
  }
  
  if ('trendData' in vizData && vizData.trendData) {
    return vizData.trendData;
  }
  
  // Fallback to generated progress data
  return generateProgressData(current, target);
};

// Helper function to generate mock progress data
export const generateProgressData = (current: number, target: number) => {
  const months = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07'];
  const data = [];
  let cumulative = 0;
  
  for (let i = 0; i < months.length; i++) {
    const monthlyValue = i < 6 ? Math.round(current / 6) : 0;
    cumulative += monthlyValue;
    data.push({
      date: months[i],
      value: monthlyValue,
      cumulative: Math.min(cumulative, current)
    });
  }
  
  return data;
};

// Helper function to get status color
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'on-track':
      return 'bg-green-100 text-green-800';
    case 'at-risk':
      return 'bg-yellow-100 text-yellow-800';
    case 'behind':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};