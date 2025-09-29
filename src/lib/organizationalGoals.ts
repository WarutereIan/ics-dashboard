// Organizational Goals and their connections to project activities

export interface OrganizationalGoal {
  id: string;
  title: string;
  description: string;
  subgoals: SubGoal[];
  targetOutcome: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SubGoal {
  id: string;
  title: string;
  description: string;
  kpi: {
    value: number;
    target: number;
    unit: string;
    type: 'radialGauge' | 'progressBar' | 'bulletChart';
  };
  linkedActivities: ActivityLink[];
}

export interface ActivityLink {
  projectId: string;
  projectName: string;
  activityId: string;
  activityTitle: string;
  contribution: number; // percentage contribution to the subgoal
  status: 'contributing' | 'at-risk' | 'not-contributing';
}

// Strategic Goals Data with Project Activity Links
export const organizationalGoals: OrganizationalGoal[] = [
  {
    id: 'goal-1',
    title: 'Strategic Goal 1: Safe, stable and nurturing family environments',
    description: 'Ensuring families have access to platforms, services, and economic opportunities that create safe and nurturing environments for children.',
    priority: 'high',
    targetOutcome: 'Improved family stability and child well-being',
    subgoals: [
      {
        id: 'goal-1-1',
        title: '1.1: 2,000,000 parents and caregivers have access to platforms and services',
        description: 'Providing comprehensive parenting support and educational platforms',
        kpi: { value: 1200000, target: 2000000, unit: 'parents', type: 'radialGauge' },
        linkedActivities: [
          {
            projectId: 'mameb',
            projectName: 'MaMeb',
            activityId: 'mameb-activity-1.1',
            activityTitle: 'Parent-Teacher-Learner collaboration',
            contribution: 35,
            status: 'contributing'
          },
          {
            projectId: 'vacis-ke',
            projectName: 'VACIS Kenya',
            activityId: 'vaciske-activity-1.1',
            activityTitle: 'Adapting and scaling evidence-based parenting programmes',
            contribution: 40,
            status: 'contributing'
          },
          {
            projectId: 'vacis-tz',
            projectName: 'VACIS Tanzania',
            activityId: 'vacistz-activity-1.1',
            activityTitle: 'Adapting and scaling evidence-based parenting programmes',
            contribution: 25,
            status: 'at-risk'
          }
        ]
      },
      {
        id: 'goal-1-2',
        title: '1.2: 500,000 families have access to household economic strengthening opportunities',
        description: 'Economic empowerment programs for families',
        kpi: { value: 320000, target: 500000, unit: 'families', type: 'progressBar' },
        linkedActivities: [
          {
            projectId: 'cdw',
            projectName: 'CDW',
            activityId: 'cdw-activity-3.3',
            activityTitle: 'Community awareness and family support',
            contribution: 60,
            status: 'contributing'
          },
          {
            projectId: 'kuimarisha',
            projectName: 'Kuimarisha',
            activityId: 'kuimarisha-activity-3.1',
            activityTitle: 'Community support systems',
            contribution: 40,
            status: 'contributing'
          }
        ]
      }
    ]
  },
  {
    id: 'goal-2',
    title: 'Strategic Goal 2: Safe, non-violent and inclusive communities and schools',
    description: 'Creating environments where children are protected from violence and have access to quality education.',
    priority: 'high',
    targetOutcome: 'Reduced violence against children and improved educational outcomes',
    subgoals: [
      {
        id: 'goal-2-1',
        title: '2.1: 50% community structures and child protection mechanisms supported',
        description: 'Strengthening community-based child protection systems',
        kpi: { value: 38, target: 50, unit: '%', type: 'radialGauge' },
        linkedActivities: [
          {
            projectId: 'vacis-ke',
            projectName: 'VACIS Kenya',
            activityId: 'vaciske-activity-3.1',
            activityTitle: 'Community norm change initiatives',
            contribution: 45,
            status: 'contributing'
          },
          {
            projectId: 'vacis-tz',
            projectName: 'VACIS Tanzania',
            activityId: 'vacistz-activity-3.1',
            activityTitle: 'Community norm change initiatives',
            contribution: 35,
            status: 'contributing'
          },
          {
            projectId: 'cdw',
            projectName: 'CDW',
            activityId: 'cdw-activity-2.1',
            activityTitle: 'Child protection services improvement',
            contribution: 20,
            status: 'at-risk'
          }
        ]
      },
      {
        id: 'goal-2-2',
        title: '2.2: 10 public schools per region per year supported to be safe',
        description: 'School safety and violence prevention programs',
        kpi: { value: 7, target: 10, unit: 'schools', type: 'bulletChart' },
        linkedActivities: [
          {
            projectId: 'vacis-ke',
            projectName: 'VACIS Kenya',
            activityId: 'vaciske-activity-2.1',
            activityTitle: 'School violence prevention models',
            contribution: 50,
            status: 'contributing'
          },
          {
            projectId: 'vacis-tz',
            projectName: 'VACIS Tanzania',
            activityId: 'vacistz-activity-2.1',
            activityTitle: 'School violence prevention models',
            contribution: 30,
            status: 'contributing'
          },
          {
            projectId: 'aacl',
            projectName: 'AACL',
            activityId: 'aacl-activity-2.1',
            activityTitle: 'Enhanced teacher capacity and classroom practices',
            contribution: 20,
            status: 'contributing'
          }
        ]
      }
    ]
  },
  {
    id: 'goal-3',
    title: 'Strategic Goal 3: Supportive and responsive laws, policies and services for children',
    description: 'Advocating for and supporting implementation of child-friendly policies and services.',
    priority: 'medium',
    targetOutcome: 'Improved policy environment and service delivery for children',
    subgoals: [
      {
        id: 'goal-3-1',
        title: '3.1: Influence government to align and implement existing policies',
        description: 'Policy advocacy and alignment initiatives',
        kpi: { value: 6, target: 10, unit: 'policies', type: 'bulletChart' },
        linkedActivities: [
          {
            projectId: 'vacis-ke',
            projectName: 'VACIS Kenya',
            activityId: 'vaciske-activity-4.1',
            activityTitle: 'Organizational capacity strengthening for advocacy',
            contribution: 40,
            status: 'contributing'
          },
          {
            projectId: 'vacis-tz',
            projectName: 'VACIS Tanzania',
            activityId: 'vacistz-activity-4.1',
            activityTitle: 'Organizational capacity strengthening for advocacy',
            contribution: 35,
            status: 'contributing'
          },
          {
            projectId: 'cdw',
            projectName: 'CDW',
            activityId: 'cdw-activity-4.1',
            activityTitle: 'Government coordination support',
            contribution: 25,
            status: 'at-risk'
          }
        ]
      },
      {
        id: 'goal-3-2',
        title: '3.2: Quality and responsive government services for children and families',
        description: 'Improving quality and accessibility of government services',
        kpi: { value: 70, target: 100, unit: '%', type: 'radialGauge' },
        linkedActivities: [
          {
            projectId: 'cdw',
            projectName: 'CDW',
            activityId: 'cdw-activity-4.2',
            activityTitle: 'County level coordination support',
            contribution: 50,
            status: 'contributing'
          },
          {
            projectId: 'kuimarisha',
            projectName: 'Kuimarisha',
            activityId: 'kuimarisha-activity-1.1',
            activityTitle: 'Early childhood development services',
            contribution: 30,
            status: 'contributing'
          },
          {
            projectId: 'nppp',
            projectName: 'NPPP',
            activityId: 'nppp-activity-2.1',
            activityTitle: 'Community support for positive parenting',
            contribution: 20,
            status: 'contributing'
          }
        ]
      }
    ]
  },
  {
    id: 'goal-4',
    title: 'Strategic Goal 4: Sustainable organizational development',
    description: 'Building organizational capacity, systems, and resources for sustainable impact.',
    priority: 'medium',
    targetOutcome: 'Enhanced organizational effectiveness and sustainability',
    subgoals: [
      {
        id: 'goal-4-1',
        title: '4.1: 100% of processes, systems and structures are standardized and strengthened',
        description: 'Organizational systems and process improvement',
        kpi: { value: 82, target: 100, unit: '%', type: 'radialGauge' },
        linkedActivities: [
          {
            projectId: 'vacis-ke',
            projectName: 'VACIS Kenya',
            activityId: 'vaciske-activity-4.1',
            activityTitle: 'Organizational capacity strengthening',
            contribution: 35,
            status: 'contributing'
          },
          {
            projectId: 'vacis-tz',
            projectName: 'VACIS Tanzania',
            activityId: 'vacistz-activity-4.1',
            activityTitle: 'Organizational capacity strengthening',
            contribution: 35,
            status: 'contributing'
          },
          {
            projectId: 'mameb',
            projectName: 'MaMeb',
            activityId: 'mameb-activity-5.1',
            activityTitle: 'Stakeholder engagement and coordination',
            contribution: 30,
            status: 'contributing'
          }
        ]
      },
      {
        id: 'goal-4-2',
        title: '4.2: USD 10 million resource mobilized per year per country',
        description: 'Resource mobilization and funding diversification',
        kpi: { value: 7.5, target: 10, unit: 'million USD', type: 'bulletChart' },
        linkedActivities: [
          {
            projectId: 'mameb',
            projectName: 'MaMeb',
            activityId: 'mameb-activity-5.2',
            activityTitle: 'Resource mobilization activities',
            contribution: 40,
            status: 'contributing'
          },
          {
            projectId: 'vacis-ke',
            projectName: 'VACIS Kenya',
            activityId: 'vaciske-activity-4.2',
            activityTitle: 'Partnership development and funding',
            contribution: 35,
            status: 'at-risk'
          },
          {
            projectId: 'aacl',
            projectName: 'AACL',
            activityId: 'aacl-activity-3.1',
            activityTitle: 'Community engagement for sustainability',
            contribution: 25,
            status: 'contributing'
          }
        ]
      }
    ]
  }
];

// Helper functions
export function getGoalById(goalId: string): OrganizationalGoal | undefined {
  return organizationalGoals.find(goal => goal.id === goalId);
}

export function getSubGoalById(subGoalId: string): { goal: OrganizationalGoal; subGoal: SubGoal } | undefined {
  for (const goal of organizationalGoals) {
    const subGoal = goal.subgoals.find(sg => sg.id === subGoalId);
    if (subGoal) {
      return { goal, subGoal };
    }
  }
  return undefined;
}

export function getActivityContributionToGoals(projectId: string, activityId: string): Array<{
  goalId: string;
  goalTitle: string;
  subGoalId: string;
  subGoalTitle: string;
  contribution: number;
  status: string;
}> {
  const contributions: Array<{
    goalId: string;
    goalTitle: string;
    subGoalId: string;
    subGoalTitle: string;
    contribution: number;
    status: string;
  }> = [];

  organizationalGoals.forEach(goal => {
    goal.subgoals.forEach(subGoal => {
      const activity = subGoal.linkedActivities.find(
        act => act.projectId === projectId && act.activityId === activityId
      );
      if (activity) {
        contributions.push({
          goalId: goal.id,
          goalTitle: goal.title,
          subGoalId: subGoal.id,
          subGoalTitle: subGoal.title,
          contribution: activity.contribution,
          status: activity.status
        });
      }
    });
  });

  return contributions;
}

export function getProjectContributionToGoal(goalId: string, projectId: string): number {
  const goal = getGoalById(goalId);
  if (!goal) return 0;

  let totalContribution = 0;
  let subGoalCount = 0;

  goal.subgoals.forEach(subGoal => {
    const projectActivities = subGoal.linkedActivities.filter(act => act.projectId === projectId);
    if (projectActivities.length > 0) {
      const subGoalContribution = projectActivities.reduce((sum, act) => sum + act.contribution, 0);
      totalContribution += subGoalContribution;
      subGoalCount++;
    }
  });

  return subGoalCount > 0 ? totalContribution / subGoalCount : 0;
}