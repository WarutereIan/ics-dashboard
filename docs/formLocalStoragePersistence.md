# Form Local Storage Persistence

## Overview

The form creation wizard, form preview, and form management components now include comprehensive local storage persistence to prevent data loss and improve user experience.

## Features

### Form Creation Wizard
- **Auto-save**: Automatically saves form data every 2 seconds when creating new forms
- **Draft restoration**: Loads saved drafts when returning to the wizard
- **Draft management**: Manual save/clear draft functionality
- **Draft notifications**: Shows draft age and restoration options

### Form Preview
- **Response persistence**: Saves user responses as they fill out forms
- **Section progress**: Remembers which section the user was on
- **Auto-resume**: Automatically restores form progress when returning
- **Draft indicators**: Shows when a draft response exists

### Form Management
- **Filter persistence**: Remembers search terms, status filters, and category filters
- **Sort preferences**: Saves sorting preferences
- **Filter restoration**: Automatically restores filters when returning to the page

## Implementation Details

### Storage Keys
- `ics_form_wizard_draft`: Form wizard state
- `ics_form_wizard_draft_timestamp`: Form wizard draft timestamp
- `ics_form_preview_data_<formId>`: Form preview data for specific forms
- `ics_form_management_filters`: Form management filters

### Data Serialization
- Date objects are converted to ISO strings for localStorage storage
- Complex nested objects are properly serialized/deserialized
- Form-specific data (questions, sections, responses) is preserved

### Auto-save Throttling
- Uses 2-second debounce to prevent excessive localStorage writes
- Clears timeouts on component unmount to prevent memory leaks

## Usage

### For Form Creation
1. Start creating a new form
2. Fill in basic info, sections, questions, and settings
3. Data is automatically saved as you type
4. If you navigate away and return, you'll see a draft notification
5. Click "Restore Draft" to continue where you left off
6. Use "Save Draft" to manually save your progress
7. Use "Clear Draft" to start fresh

### For Form Preview
1. Start filling out a form
2. Responses are automatically saved as you type
3. If you navigate away and return, your progress is restored
4. Continue from where you left off
5. Data is cleared after successful form submission

### For Form Management
1. Set search terms, filters, and sorting preferences
2. Preferences are automatically saved
3. When you return to the page, your filters are restored
4. Use "Clear Filters" to reset to defaults

## Technical Implementation

### Form Wizard Hook (`useFormWizard`)
```typescript
// Auto-save draft when wizard state changes
useEffect(() => {
  if (!wizardState.isEditing && wizardState.form.title) {
    autoSaveFormWizardDraft(wizardState);
  }
}, [wizardState, wizardState.isEditing]);

// Load draft for new form creation
useEffect(() => {
  if (!wizardState.isEditing) {
    const draft = loadFormWizardDraft();
    if (draft) {
      setWizardState(draft);
    }
  }
}, [wizardState.isEditing]);
```

### Form Preview Component
```typescript
// Load saved preview data when form changes
useEffect(() => {
  if (form?.id && !isPreviewMode) {
    const savedData = loadFormPreviewData(form.id);
    if (savedData) {
      setResponses(savedData.responses);
      setCurrentSectionIndex(savedData.currentSection);
    }
  }
}, [form?.id, isPreviewMode]);

// Auto-save preview data when responses change
useEffect(() => {
  if (form?.id && !isPreviewMode && Object.keys(responses).length > 0) {
    saveFormPreviewData(form.id, previewData);
  }
}, [form?.id, responses, currentSectionIndex, isPreviewMode]);
```

### Form Management Component
```typescript
// Load saved filters from localStorage
const [filters, setFilters] = useState<FormManagementFilters>(() => {
  const savedFilters = loadFormManagementFilters();
  return savedFilters || getDefaultFormManagementFilters();
});

// Save filters to localStorage when they change
useEffect(() => {
  saveFormManagementFilters(filters);
}, [filters]);
```

## Future Migration to API

When migrating to API-based operations:

### Form Wizard
```typescript
// Save draft
POST /api/forms/drafts
{
  formData: FormWizardState,
  userId: string
}

// Load draft
GET /api/forms/drafts/:userId

// Clear draft
DELETE /api/forms/drafts/:userId
```

### Form Preview
```typescript
// Save response draft
POST /api/forms/:formId/responses/drafts
{
  responses: Record<string, any>,
  currentSection: number,
  userId?: string
}

// Load response draft
GET /api/forms/:formId/responses/drafts/:userId

// Clear response draft
DELETE /api/forms/:formId/responses/drafts/:userId
```

### Form Management
```typescript
// Save user preferences
POST /api/users/:userId/preferences
{
  formManagementFilters: FormManagementFilters
}

// Load user preferences
GET /api/users/:userId/preferences
```

## Benefits

1. **Data Loss Prevention**: Users never lose their work due to navigation or page refresh
2. **Improved UX**: Seamless experience with automatic progress restoration
3. **Offline Support**: Works even when network connectivity is poor
4. **Performance**: Reduces server load with client-side caching
5. **User Preferences**: Remembers user's preferred filters and settings

## Considerations

1. **Storage Limits**: localStorage has size limits (~5-10MB)
2. **Browser Compatibility**: Works in all modern browsers
3. **Privacy**: Data is stored locally, not shared across devices
4. **Cleanup**: Old drafts should be cleaned up periodically
5. **Security**: Sensitive data should not be stored in localStorage

## Error Handling

The implementation includes comprehensive error handling:
- Graceful fallbacks when localStorage is unavailable
- Console logging for debugging
- User-friendly error messages
- Automatic cleanup on errors
