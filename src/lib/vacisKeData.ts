import { Outcome, Activity, SubActivity, Output } from '@/types/dashboard';

// VACIS KE Outcomes and Activities

const vacisKeSubActivities: Record<string, SubActivity[]> = {
  'vaciske-activity-1.1': [
    { id: 'vaciske-activity-1.1.1', title: 'Engage government partners', progress: 100, status: 'completed', description: 'Initial meetings with government partners', dueDate: '2024-03-01' },
    { id: 'vaciske-activity-1.1.2', title: 'Adapt program materials', progress: 60, status: 'IN_PROGRESS', description: 'Customize materials for local context', dueDate: '2024-06-01' },
  ],
  'vaciske-activity-1.2': [
    { id: 'vaciske-activity-1.2.1', title: 'Identify new locations', progress: 80, status: 'IN_PROGRESS', description: 'Survey and select new program sites', dueDate: '2024-05-01' },
    { id: 'vaciske-activity-1.2.2', title: 'Train facilitators', progress: 30, status: 'NOT_STARTED', description: 'Facilitator training for new locations', dueDate: '2024-07-01' },
  ],
  'vaciske-activity-2.1': [
    { id: 'vaciske-activity-2.1.1', title: 'Document best practices', progress: 50, status: 'IN_PROGRESS', description: 'Compile and document effective practices', dueDate: '2024-08-01' },
  ],
};

export const vacisKeOutcomes: Outcome[] = [
  { id: 'vaciske-outcome-1', projectId: 'vacis-ke', title: 'Families in Kenya have increased access to evidence-based gender transformative parenting programmes that promote positive child development and prevent violence against children and young women.', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'ON_TRACK' },
  { id: 'vaciske-outcome-2', projectId: 'vacis-ke', title: 'Policies and evidence-based models and practices to address violence in and around schools adapted by education stakeholders in government and CSOs', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'ON_TRACK' },
  { id: 'vaciske-outcome-3', projectId: 'vacis-ke', title: 'Social and gender norms that perpetuate violence against children and young women identified and shifted in Kenya (I ward Kisumu)', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'ON_TRACK' },
  { id: 'vaciske-outcome-4', projectId: 'vacis-ke', title: 'ICS SP organizational capacity is strengthened to facilitate mission driven actions.', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'ON_TRACK' },
];

export const vacisKeActivities: Activity[] = [
  // Outcome 1 Activities
  { id: 'vaciske-activity-1.1', outcomeId: 'vaciske-outcome-1', title: 'Adapting and scaling evidence-based parenting programmes through government systems.', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: vacisKeSubActivities['vaciske-activity-1.1'] },
  { id: 'vaciske-activity-1.2', outcomeId: 'vaciske-outcome-1', title: 'Geographical expansion of gender transformative parenting programmes in new locations in Kenya.', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: vacisKeSubActivities['vaciske-activity-1.2'] },
  { id: 'vaciske-activity-1.3', outcomeId: 'vaciske-outcome-1', title: 'Generate, use and share evidence and practice-based knowledge to influence and strengthen policies, supporting environments and programmes on VAC/W', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  // Outcome 2 Activities
  { id: 'vaciske-activity-2.1', outcomeId: 'vaciske-outcome-2', title: 'Evidence generated and practice knowledge documented and utilised to strengthen whole school approach and to influence education sector plans and programmes', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: vacisKeSubActivities['vaciske-activity-2.1'] },
  { id: 'vaciske-activity-2.2', outcomeId: 'vaciske-outcome-2', title: 'Geographical expansion of the adapted WSA to new schools in Kenya', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-2.3', outcomeId: 'vaciske-outcome-2', title: 'Safe, healthy and equitable families', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-2.4', outcomeId: 'vaciske-outcome-2', title: 'Safe and inclusive learning environments', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  // Outcome 3 Activities
  { id: 'vaciske-activity-3.1', outcomeId: 'vaciske-outcome-3', title: 'Pilot test Fanikisha Uajibikaji Nyanjani (FUN) intervention in the period 2024-2026', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-3.2', outcomeId: 'vaciske-outcome-3', title: 'Facilitate the social and economic inclusion of girls aged 14-24 years who are at high risk of VAC/W.', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-3.3', outcomeId: 'vaciske-outcome-3', title: 'Create spaces for dialogue and utilize positive messages to facilitate public awareness and education through community debates, dialogues and discussions with various reference groups to break the silence.', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-3.4', outcomeId: 'vaciske-outcome-3', title: 'Find and support early adopters/champions from communities and share their stories of change and impact through various community and mass media channels to inspire community wide change', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-3.5', outcomeId: 'vaciske-outcome-3', title: 'Mobilize and organize public involvement and participation of stakeholders in improving public service systems', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-3.6', outcomeId: 'vaciske-outcome-3', title: 'Forming and or participating in existing policy networks and social movements on ending violence against children and women.', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  // Outcome 4 Activities
  { id: 'vaciske-activity-4.1', outcomeId: 'vaciske-outcome-4', title: 'Talent management and retention', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-4.2', outcomeId: 'vaciske-outcome-4', title: 'Systems procurement and upgrade (M&E)', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-4.3', outcomeId: 'vaciske-outcome-4', title: 'Business development and fundraising', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
  { id: 'vaciske-activity-4.4', outcomeId: 'vaciske-outcome-4', title: 'Equipment and logistical assets (transportation)', description: '', progress: 0, status: 'NOT_STARTED', startDate: undefined as any, endDate: undefined as any, responsible: '', subActivities: [] },
];

export const vacisKeOutputs: Output[] = [
  // Outcome 1 Outputs
  { id: 'vaciske-output-1.1', outcomeId: 'vaciske-outcome-1', title: 'Increased capacity of the government to develop and implement VAC/W prevention', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  { id: 'vaciske-output-1.2', outcomeId: 'vaciske-outcome-1', title: 'Increased budgetary allocation to VAC/W prevention programs', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  { id: 'vaciske-output-1.3', outcomeId: 'vaciske-outcome-1', title: 'Increased capacity of partners (government & CSOs paraprofessionals) to deliver gender transformative parenting', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  { id: 'vaciske-output-1.4', outcomeId: 'vaciske-outcome-1', title: 'Baseline and endline research conducted to demonstrate the effectiveness of gender transformative parenting programmes in addressing VAC/W', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  // Outcome 2 Outputs
  { id: 'vaciske-output-2.1', outcomeId: 'vaciske-outcome-2', title: 'Teachers equipped with knowledge and skills to address contemporary education challenges to meet unique needs of school', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  { id: 'vaciske-output-2.2', outcomeId: 'vaciske-outcome-2', title: 'Increased commitment to parental engagement in education to promote learning outcomes in schools', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  { id: 'vaciske-output-2.3', outcomeId: 'vaciske-outcome-2', title: 'Increased capacity by the government and education sector CSOs to incorporate VAC prevention and response strategies in their programs', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  // Outcome 3 Outputs
  { id: 'vaciske-output-3.1', outcomeId: 'vaciske-outcome-3', title: 'Community beliefs, norms and value systems that prevent VAC are strengthened', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  { id: 'vaciske-output-3.2', outcomeId: 'vaciske-outcome-3', title: 'Integration of the social norms change model into government and CSOs programs', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  { id: 'vaciske-output-3.3', outcomeId: 'vaciske-outcome-3', title: 'Increased empowerment and agency among AGYWs in making informed choices on their health and wellbeing', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  { id: 'vaciske-output-3.4', outcomeId: 'vaciske-outcome-3', title: 'Increased survivor-led advocacy initiatives to influence policies addressing VAC/W', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  // Outcome 4 Outputs
  { id: 'vaciske-output-4.1', outcomeId: 'vaciske-outcome-4', title: 'Increased capacity to develop and scale innovative VAC/W prevention solutions', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
  { id: 'vaciske-output-4.2', outcomeId: 'vaciske-outcome-4', title: 'Enhanced operational efficiency and organizational sustainability', description: '', current: 0, target: 0, unit: '', status: 'ON_TRACK', activities: [] },
];

export const vacisKeKPIs = [
  // Outcome 1
  { outcomeId: 'vaciske-outcome-1', name: 'Number of parents and caregivers organized into parent peer support groups, trained and certified', value: 120, target: 200, unit: 'caregivers', type: 'bar' },
  { outcomeId: 'vaciske-outcome-1', name: 'Proportion of caregivers who demonstrate a change in knowledge on Positive Parenting and responsive care practices', value: 65, target: 80, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-1', name: 'Number of government staff and CSOs paraprofessionals trained as facilitators to deliver parenting interventions', value: 40, target: 60, unit: 'staff', type: 'bar' },
  { outcomeId: 'vaciske-outcome-1', name: 'Count of National frameworks developed that aim to end VAC/W', value: 2, target: 3, unit: 'frameworks', type: 'progress' },
  { outcomeId: 'vaciske-outcome-1', name: 'Count of regional roadmaps developed to translate national plans into actionable strategies at the local level', value: 3, target: 5, unit: 'roadmaps', type: 'progress' },
  { outcomeId: 'vaciske-outcome-1', name: 'Proportion increase in financial commitment of governments to addressing VAC/W issues', value: 10, target: 20, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-1', name: 'Number of caregivers groups trained in HES interventions and linked to economic strengthening opportunities', value: 15, target: 30, unit: 'groups', type: 'bar' },
  { outcomeId: 'vaciske-outcome-1', name: 'Proportion of caregivers reporting HES interventions have helped them to meet their household needs', value: 55, target: 80, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-1', name: 'Number of program participants and government officials facilitated by the project to participate in commemoration of events', value: 50, target: 100, unit: 'participants', type: 'bar' },
  { outcomeId: 'vaciske-outcome-1', name: 'Number of key messages developed and shared by the program participants during the events', value: 8, target: 12, unit: 'messages', type: 'progress' },
  // Outcome 2
  { outcomeId: 'vaciske-outcome-2', name: 'Total number of learners organized into Child rights clubs and trained on life skills', value: 300, target: 500, unit: 'learners', type: 'bar' },
  { outcomeId: 'vaciske-outcome-2', name: 'Proportion of learners with knowledge in life skills and applying knowledge to protect themselves from violence', value: 60, target: 85, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-2', name: 'Total number of G&C centers established in schools/communities', value: 10, target: 20, unit: 'centers', type: 'progress' },
  { outcomeId: 'vaciske-outcome-2', name: 'Total number of learners in schools and out of girls supported to make transitions to the working world and to re-engage with further learning', value: 80, target: 150, unit: 'learners', type: 'bar' },
  { outcomeId: 'vaciske-outcome-2', name: 'Total number of teachers trained on prevention, identification and response to VAC', value: 40, target: 60, unit: 'teachers', type: 'bar' },
  { outcomeId: 'vaciske-outcome-2', name: 'Total number of schools with reporting and referral mechanisms for VAC', value: 7, target: 10, unit: 'schools', type: 'progress' },
  // Outcome 3
  { outcomeId: 'vaciske-outcome-3', name: 'Total number of influential people, allies and networks identified, mobilized and capacity built as change agents', value: 25, target: 40, unit: 'people', type: 'bar' },
  { outcomeId: 'vaciske-outcome-3', name: 'Proportion of people reporting knowledge and attitude change on IPV at individuals, family and community levels', value: 55, target: 80, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-3', name: 'Total number of key messages and alternative practices identified', value: 6, target: 10, unit: 'messages', type: 'progress' },
  { outcomeId: 'vaciske-outcome-3', name: 'Proportion of people who promote use of healthy norms and no longer accept IPV', value: 40, target: 70, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-3', name: 'Total number of safe spaces created for public awareness and education', value: 5, target: 10, unit: 'spaces', type: 'progress' },
  { outcomeId: 'vaciske-outcome-3', name: 'Proportion of reference groups openly speaking out to challenge practices that perpetuate IPV', value: 30, target: 60, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-3', name: 'Total number of champions/early adopters identifed to share stories of change', value: 8, target: 15, unit: 'champions', type: 'bar' },
  { outcomeId: 'vaciske-outcome-3', name: 'Proportion of community members reporting positive change inspired by the champions to adopt healthy norms against IPV', value: 45, target: 75, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-3', name: 'Total number of stakeholders and beneficiaries organized to attend PP forums', value: 20, target: 40, unit: 'stakeholders', type: 'bar' },
  { outcomeId: 'vaciske-outcome-3', name: 'Proportion of department heads championing for budget allocations on programs promoting gender equality and prevention of VAC/W', value: 3, target: 6, unit: 'departments', type: 'progress' },
  { outcomeId: 'vaciske-outcome-3', name: 'Total number of networks and movements on EVAC/W that the project is actively participating', value: 4, target: 8, unit: 'networks', type: 'progress' },
  // Outcome 4
  { outcomeId: 'vaciske-outcome-4', name: 'Total number of girls facilitated to access NHIF and BR', value: 30, target: 60, unit: 'girls', type: 'bar' },
  { outcomeId: 'vaciske-outcome-4', name: 'Proportion of girls reporting change in their families due to access to NHIF and BR', value: 50, target: 80, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-4', name: 'Total number of girls supported to access education bursaries/education subsidies', value: 25, target: 50, unit: 'girls', type: 'bar' },
  { outcomeId: 'vaciske-outcome-4', name: 'Proportion of girls reporting change in their lives due to access to education bursaries/subsidies', value: 45, target: 75, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-4', name: 'Total number of young women trained on parenting, life skills and violence prevention', value: 18, target: 30, unit: 'women', type: 'bar' },
  { outcomeId: 'vaciske-outcome-4', name: 'Proportion of young women reporting change from the knowledge acquired', value: 40, target: 70, unit: '%', type: 'radialGauge' },
  { outcomeId: 'vaciske-outcome-4', name: 'Total number of action case learning studies conducted (Case studies documented on thematic areas - Parenting, life skills, social norms, AGYWs empowement)', value: 3, target: 6, unit: 'studies', type: 'progress' },
  { outcomeId: 'vaciske-outcome-4', name: 'Proportion of actions identified and implemented to enhance VAC/W prevention during peak seasons', value: 2, target: 4, unit: 'actions', type: 'progress' },
]; 