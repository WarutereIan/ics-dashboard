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