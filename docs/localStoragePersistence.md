# Local Storage Persistence for Project Creation Wizard

## Overview

The Project Creation Wizard now includes automatic local storage persistence to prevent data loss when users navigate away or refresh the page during project creation.

## Features

### Auto-Save
- Automatically saves project data every 2 seconds when the user makes changes
- Only saves when creating a new project (not when editing existing projects)
- Saves all form data including project details, outcomes, activities, and KPIs

### Draft Management
- Users can manually save drafts using the "Save Draft" button
- Drafts can be cleared using the "Clear Draft" button
- Draft age is displayed to show when the draft was last saved

### Draft Restoration
- When returning to the wizard, users are notified if a draft exists
- Drafts are automatically loaded when the component mounts
- Users can choose to restore the draft or dismiss the notification

## Implementation Details

### Storage Keys
- `ics_project_wizard_draft`: Contains the serialized wizard state
- `ics_project_wizard_draft_timestamp`: Contains the timestamp when the draft was saved

### Data Serialization
- Date objects are converted to ISO strings for localStorage storage
- Date objects are restored when loading from localStorage
- All form data is preserved including current step, project data, outcomes, activities, and KPIs

### Auto-Save Throttling
- Uses a 2-second debounce to prevent excessive localStorage writes
- Clears timeout on component unmount to prevent memory leaks

## Usage

### For Users
1. Start creating a new project
2. Fill in project details, outcomes, activities, and KPIs
3. Data is automatically saved as you type
4. If you navigate away and return, you'll see a draft notification
5. Click "Restore Draft" to continue where you left off
6. Use "Save Draft" to manually save your progress
7. Use "Clear Draft" to start fresh

### For Developers
The localStorage functionality is implemented in:
- `src/lib/localStorageUtils.ts`: Core localStorage utilities
- `src/components/dashboard/project-creation-wizard/hooks/useProjectWizard.ts`: Integration with the wizard hook
- `src/components/dashboard/ProjectCreationWizard.tsx`: UI for draft notifications
- `src/components/dashboard/project-creation-wizard/WizardNavigation.tsx`: Draft management buttons

## Future Migration to API

When migrating to API-based operations:
1. Replace localStorage calls with API calls
2. Update the auto-save functionality to use API endpoints
3. Implement proper error handling for network failures
4. Consider implementing offline support with localStorage as fallback

## API Endpoints (Future)

```typescript
// Save draft
POST /api/projects/drafts
{
  projectData: ProjectFormData,
  outcomes: OutcomeFormData[],
  activities: ActivityFormData[],
  kpis: KPIFormData[],
  currentStep: number
}

// Load draft
GET /api/projects/drafts/:userId

// Clear draft
DELETE /api/projects/drafts/:userId
```
