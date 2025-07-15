import { Outcome, Activity } from '@/types/dashboard';

// NPPP Outcomes and Activities

export const npppOutcomes: Outcome[] = [
  { id: 'nppp-outcome-1', projectId: 'nppp', title: 'Improved knowledge and skills on multi level parenting strategy and national parenting manual among parenting facilitators and supervisors in Garissa, Wajir, & Turkana Counties', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'on-track' },
  { id: 'nppp-outcome-2', projectId: 'nppp', title: 'Improved capacity among Community Health Promoters and their supervisors in Garissa, and Wajir on incorporating positive parenting sensitization into their day-to-day activities', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'on-track' },
  { id: 'nppp-outcome-3', projectId: 'nppp', title: 'Improved capacity of Care Reform Actors to incorporate Positive Parenting into their Day-to-day activities', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'on-track' },
  { id: 'nppp-outcome-4', projectId: 'nppp', title: '3120 and 152,000 parents and caregivers (in Garissa, Wajir & Turkana counties) are reached through Group Parenting training and home & sensitization programmes respectively', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'on-track' },
  { id: 'nppp-outcome-5', projectId: 'nppp', title: 'Improved learning and documentation of Positive Parenting interventions in Garissa, Wajir, Turkana, and Kilifi', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'on-track' },
  { id: 'nppp-outcome-6', projectId: 'nppp', title: 'Improved competency of state and non-state partners in implementing Positive Parenting Programme in the counties', description: '', target: undefined as any, current: undefined as any, unit: '', progress: 0, status: 'on-track' },
];

export const npppActivities: Activity[] = [
  // Outcome 1 Activities
  { id: 'nppp-activity-1.1', outcomeId: 'nppp-outcome-1', title: 'Train 10 parenting facilitators using the NPPP manual in Garissa (6 days residential training)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-1.2', outcomeId: 'nppp-outcome-1', title: 'Train 8 parenting facilitators using the NPPP manual in Turkana (6 days residential training)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-1.3', outcomeId: 'nppp-outcome-1', title: 'Train 12 parenting facilitators using the NPPP manual in Dadaab (8) and host community (4)  (6 days residential training)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-1.4', outcomeId: 'nppp-outcome-1', title: 'Train 10 parenting facilitators using the NPPP manual in Wajir (6 days residential training)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-1.5', outcomeId: 'nppp-outcome-1', title: 'Train 12 parenting facilitators using the NPPP manual in Kakuma (8)  and host Community (4)  (6 days residential training)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  // Outcome 2 Activities
  { id: 'nppp-activity-2.1', outcomeId: 'nppp-outcome-2', title: 'Train 30 HCWs on how to incorporate positive parenting into their day-to-day activities) Garissa County', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-2.2', outcomeId: 'nppp-outcome-2', title: 'Train 30 HCWs on how to incorporate positive parenting into their day-to-day activities) Wajir County', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-2.3', outcomeId: 'nppp-outcome-2', title: 'Cascade training of 250 CHPs on how to incorporate positive parenting into their day-to-day activities) Garissa County', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-2.4', outcomeId: 'nppp-outcome-2', title: 'Cascade training of 250 CHPs on how to incorporate positive parenting into their day-to-day activities) Wajir County', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  // Outcome 3 Activities
  { id: 'nppp-activity-3.1', outcomeId: 'nppp-outcome-3', title: 'Train 18 CCI staff (Social Workers) on Case Management Turkana', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-3.2', outcomeId: 'nppp-outcome-3', title: 'Train 18 CCI staff (Social Workers) on Parenting using the 5-day curriculum - Turkana', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  // Outcome 4 Activities
  { id: 'nppp-activity-4.1', outcomeId: 'nppp-outcome-4', title: 'Equip 76 Parenting facilitators & TOTs with manuals and trainings materials to deliver training to parents - @ 4000 per material package per facilitator', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-4.2', outcomeId: 'nppp-outcome-4', title: 'Bi weekly community sensitization and  awareness through SBCC community dialogues sessions in Wajir', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-4.3', outcomeId: 'nppp-outcome-4', title: 'Bi weekly community sensitization and  awareness through SBCC community dialogues sessions in Garissa', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-4.4', outcomeId: 'nppp-outcome-4', title: 'Transport & Communication allowance for 10 parenting facilitators for 8 months in Garissa @ 5000 p/m per facilitator', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-4.5', outcomeId: 'nppp-outcome-4', title: 'Transport & Communication reimbursement for 8 parenting facilitators for 8 months in Turkana @ 5000 p/m per facilitator', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-4.6', outcomeId: 'nppp-outcome-4', title: 'Transport & Communication reimbursement for 10 parenting facilitators for 8 months in Wajir @ 5000 p/m per facilitator', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-4.7', outcomeId: 'nppp-outcome-4', title: 'Transport & Communication reimbursement for 12 parenting facilitators for 8 months in Dadaab @ 4000 p/m per facilitator', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-4.8', outcomeId: 'nppp-outcome-4', title: 'Transport & Communication reimbursement for 12 parenting facilitators for 8 months in Kakuma @ 4000 p/m per facilitator', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-4.9', outcomeId: 'nppp-outcome-4', title: 'Transport reimbursement for  15 supervisors in 3 counties @ 3500 p/m for 8 months', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-4.10', outcomeId: 'nppp-outcome-4', title: 'Materials for parent peer groups during group sessions  in Garissa, Turkana, & Wajir', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  // Outcome 5 Activities
  { id: 'nppp-activity-5.1', outcomeId: 'nppp-outcome-5', title: 'Stakeholders meeting to share progress and review implementation of Positive Parenting in Counties - Garissa', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-5.2', outcomeId: 'nppp-outcome-5', title: 'Stakeholders meeting to share progress and review implementation of Positive Parenting in Counties - Wajir', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-5.3', outcomeId: 'nppp-outcome-5', title: 'Stakeholders meeting to share progress and review implementation of Positive Parenting in Counties - Turkana', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-5.4', outcomeId: 'nppp-outcome-5', title: 'Stakeholders meeting to share progress and review implementation of Positive Parenting in Counties - Kilifi', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-5.5', outcomeId: 'nppp-outcome-5', title: 'Collect project data feedback through 4 FGD groups of 10 parents each in Garissa', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-5.6', outcomeId: 'nppp-outcome-5', title: 'Collect project data feedback through 2 FGD groups of 10 parents each in Wajir', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-5.7', outcomeId: 'nppp-outcome-5', title: 'Collect project data feedback through 2 FGD groups of 10 parents each in Turkana', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  // Outcome 6 Activities
  { id: 'nppp-activity-6.1', outcomeId: 'nppp-outcome-6', title: 'Train 24 TOTs in Garissa (Dadaab, Wajir, Garissa) ( 10 day residential training)', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
  { id: 'nppp-activity-6.2', outcomeId: 'nppp-outcome-6', title: 'Technically Support and Supervise of 6 CSO Partners to implement Positive Parenting in Kakuma and Dadaab', description: '', progress: 0, status: 'not-started', startDate: undefined as any, endDate: undefined as any, responsible: '' },
];

export const npppKPIs = [
  // Output 1
  { outputId: 'nppp-output-1', name: 'Number of supervisors trained - Garissa', value: 10, target: 15, unit: 'supervisors', type: 'bar' },
  { outputId: 'nppp-output-1', name: 'Number of supervisors trained - Wajir', value: 8, target: 12, unit: 'supervisors', type: 'bar' },
  { outputId: 'nppp-output-1', name: 'Number of supervisors trained - Turkana', value: 9, target: 14, unit: 'supervisors', type: 'bar' },
  { outputId: 'nppp-output-1', name: 'Number of parenting facilitators trained to deliver parenting sessions - Garissa', value: 20, target: 30, unit: 'facilitators', type: 'bar' },
  { outputId: 'nppp-output-1', name: 'Number of parenting facilitators trained to deliver parenting sessions - Dadaab', value: 18, target: 25, unit: 'facilitators', type: 'bar' },
  { outputId: 'nppp-output-1', name: 'Number of parenting facilitators trained to deliver parenting sessions - Wajir', value: 15, target: 22, unit: 'facilitators', type: 'bar' },
  { outputId: 'nppp-output-1', name: 'Number of parenting facilitators trained to deliver parenting sessions - Kakuma', value: 17, target: 24, unit: 'facilitators', type: 'bar' },
  { outputId: 'nppp-output-1', name: 'Number of parenting facilitators trained to deliver parenting sessions - Turkana South', value: 12, target: 18, unit: 'facilitators', type: 'bar' },
  { outputId: 'nppp-output-1', name: 'Number of parenting facilitators actively delivering parenting sessions - Garissa, Turkana, & Wajir', value: 30, target: 40, unit: 'facilitators', type: 'bar' },
  // Output 2
  { outputId: 'nppp-output-2', name: 'Number of Health Care Workers trained on Parenting - Garissa', value: 25, target: 35, unit: 'HCWs', type: 'bar' },
  { outputId: 'nppp-output-2', name: 'Number of Health Care Workers trained on Parenting - Wajir', value: 20, target: 30, unit: 'HCWs', type: 'bar' },
  { outputId: 'nppp-output-2', name: 'Number of CHPs trained on how to cascade Positive Parenting into their Day to Day activities - Garissa', value: 40, target: 60, unit: 'CHPs', type: 'bar' },
  { outputId: 'nppp-output-2', name: 'Number of CHPs trained on how to cascade Positive Parenting into their Day to Day activities - Wajir', value: 35, target: 55, unit: 'CHPs', type: 'bar' },
  // Output 3
  { outputId: 'nppp-output-3', name: 'Number of CCI staff trained on case management for integration - Turkana', value: 12, target: 18, unit: 'staff', type: 'bar' },
  { outputId: 'nppp-output-3', name: 'Number of CCI staff trained on Positive Parenting - Turkana', value: 10, target: 16, unit: 'staff', type: 'bar' },
  // Output 4
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through group sessions - Garissa', value: 200, target: 300, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through group sessions - Dadaab', value: 180, target: 250, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through group sessions - Wajir', value: 150, target: 220, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through group sessions - Turkana South', value: 120, target: 180, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through group sessions - Kakuma', value: 110, target: 170, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through home sessions - Garissa', value: 90, target: 140, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through home sessions - Wajir', value: 80, target: 130, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through parenting sensitization - Garissa', value: 70, target: 120, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through parenting sensitization - Dadaab', value: 60, target: 110, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through parenting sensitization - Wajir', value: 50, target: 100, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through parenting sensitization - Kakuma', value: 40, target: 90, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of parents and caregivers reached through parenting sensitization - Turkana South', value: 30, target: 80, unit: 'parents', type: 'bar' },
  { outputId: 'nppp-output-4', name: 'Number of FGDs conducted with parents to gather feedback - Garissa', value: 4, target: 6, unit: 'FGDs', type: 'progress' },
  { outputId: 'nppp-output-4', name: 'Number of FGDs conducted with parents to gather feedback - Dadaab', value: 3, target: 5, unit: 'FGDs', type: 'progress' },
  { outputId: 'nppp-output-4', name: 'Number of FGDs conducted with parents to gather feedback - Wajir', value: 2, target: 4, unit: 'FGDs', type: 'progress' },
  { outputId: 'nppp-output-4', name: 'Number of FGDs conducted with parents to gather feedback - Kakuma', value: 2, target: 4, unit: 'FGDs', type: 'progress' },
  { outputId: 'nppp-output-4', name: 'Number of FGDs conducted with parents to gather feedback - Turkana South', value: 2, target: 4, unit: 'FGDs', type: 'progress' },
  // Output 5
  { outputId: 'nppp-output-5', name: 'Number of Stakeholders meetings held to share progress and review implementation of Positive Parenting in Counties - Garissa', value: 3, target: 5, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-5', name: 'Number of Stakeholders meetings held to share progress and review implementation of Positive Parenting in Counties - Turkana', value: 2, target: 4, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-5', name: 'Number of Stakeholders meetings held to share progress and review implementation of Positive Parenting in Counties - Wajir', value: 2, target: 4, unit: 'meetings', type: 'progress' },
  // Output 6
  { outputId: 'nppp-output-6', name: 'Number of Positive Parenting ToTs trained - HQ, Garissa, Turkana, Wajir, Kakuma, Dadaab', value: 24, target: 30, unit: 'ToTs', type: 'bar' },
  { outputId: 'nppp-output-6', name: 'Number of stakeholders sensitized on the SOPs for Positive Parenting Programme - Garissa', value: 15, target: 20, unit: 'stakeholders', type: 'bar' },
  { outputId: 'nppp-output-6', name: 'Number of stakeholders sensitized on the SOPs for Positive Parenting Programme - Wajir', value: 12, target: 18, unit: 'stakeholders', type: 'bar' },
  { outputId: 'nppp-output-6', name: 'Number of CSO partner staff trained on the NPPTM - Garissa', value: 10, target: 15, unit: 'staff', type: 'bar' },
  { outputId: 'nppp-output-6', name: 'Number of CSO partner staff trained on the NPPTM - Turkana', value: 8, target: 12, unit: 'staff', type: 'bar' },
  { outputId: 'nppp-output-6', name: 'Number of CSO partner staff trained on the NPPTM - Kilifi', value: 6, target: 10, unit: 'staff', type: 'bar' },
  { outputId: 'nppp-output-6', name: 'Number of CSO partners supported to incorporate Positive Parenting into their regular programming - Garissa', value: 5, target: 8, unit: 'partners', type: 'progress' },
  { outputId: 'nppp-output-6', name: 'Number of CSOs actively implementing Positive Parenting training and sensitization - Turkana', value: 4, target: 7, unit: 'CSOs', type: 'progress' },
  { outputId: 'nppp-output-6', name: 'Number of CSOs actively implementing Positive Parenting training and sensitization - Kilifi', value: 3, target: 6, unit: 'CSOs', type: 'progress' },
  // Output 7
  { outputId: 'nppp-output-7', name: 'Planning Meetings with GoK & UNICEF stakeholders in Garissa to plan for implementation', value: 2, target: 3, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Planning Meetings with GoK & UNICEF stakeholders in Turkana to plan for implementation', value: 2, target: 3, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Planning Meetings with GoK & UNICEF stakeholders in Turkana to plan for implementation - Wajir', value: 1, target: 2, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Inception meeting held with stakeholders to introduce the project - Garissa', value: 1, target: 1, unit: 'meeting', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Inception meeting held with stakeholders to introduce the project - Turkana', value: 1, target: 1, unit: 'meeting', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Bi-monthly Project meeting held with Facilitators and Supervisors - Garissa', value: 4, target: 6, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Bi-monthly Project meeting held with Facilitators and Supervisors - Turkana', value: 3, target: 5, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Bi-monthly Project meeting held with Facilitators and Supervisors - Wajir', value: 2, target: 4, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Quarterly advisory meetings – 1 day - Garissa', value: 2, target: 3, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Quarterly advisory meetings – 1 day - Turkana', value: 2, target: 3, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Quarterly advisory meetings – 1 day - Wajir', value: 1, target: 2, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Quarterly advisory meetings – 1 day - Kilifi', value: 1, target: 2, unit: 'meetings', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Dissemination of project results and lessons learnt - Garissa', value: 1, target: 2, unit: 'disseminations', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Dissemination of project results and lessons learnt - Turkana', value: 1, target: 2, unit: 'disseminations', type: 'progress' },
  { outputId: 'nppp-output-7', name: 'Number of staff with 100% LOE in the project - Garissa & Turkana', value: 5, target: 8, unit: 'staff', type: 'progress' },
]; 