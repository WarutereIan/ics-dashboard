# Form Context Implementation

## Overview

The Form Context provides global state management for forms being created or edited in the application. It solves the issue where the form preview component couldn't access the form data being edited in the form creation wizard.

## Key Features

### 1. Global Form State
- `currentForm`: The currently active form being edited/created
- `setCurrentForm()`: Set the current form (accepts both complete and partial Form objects)
- `updateCurrentForm()`: Update specific fields of the current form

### 2. Form Preview State
- `isPreviewMode`: Boolean indicating if the form is in preview mode
- `setIsPreviewMode()`: Toggle preview mode on/off

### 3. Form Responses
- `formResponses`: Array of form responses (useful for testing/preview)
- `addFormResponse()`: Add a new response to the collection
- `clearFormResponses()`: Clear all responses

### 4. Form Validation
- `formErrors`: Object containing validation errors
- `setFormErrors()`: Set validation errors
- `clearFormErrors()`: Clear all validation errors

### 5. Unsaved Changes Tracking
- `hasUnsavedChanges`: Boolean indicating if there are unsaved changes
- `setHasUnsavedChanges()`: Update the unsaved changes state

## Usage

### Setting up the Provider

The FormProvider is already set up in `App.tsx`:

```tsx
import { FormProvider } from '@/contexts/FormContext';

function App() {
  return (
    <Router>
      <DashboardProvider>
        <FormProvider>
          <Routes>
            {/* Your routes */}
          </Routes>
        </FormProvider>
      </DashboardProvider>
    </Router>
  );
}
```

### Using the Context in Components

```tsx
import { useForm } from '@/contexts/FormContext';

function MyComponent() {
  const { 
    currentForm, 
    setCurrentForm, 
    isPreviewMode, 
    setIsPreviewMode 
  } = useForm();

  // Use the context values and functions
  return (
    <div>
      {currentForm && <h1>{currentForm.title}</h1>}
      <button onClick={() => setIsPreviewMode(true)}>
        Preview Form
      </button>
    </div>
  );
}
```

## Integration with Form Creation Wizard

The FormCreationWizard automatically syncs its state with the FormContext:

```tsx
// In FormCreationWizard.tsx
const { setCurrentForm, setHasUnsavedChanges } = useForm();

// Sync form data with context
useEffect(() => {
  setCurrentForm(form);
}, [form, setCurrentForm]);

// Sync unsaved changes with context
useEffect(() => {
  setContextHasUnsavedChanges(hasUnsavedChanges);
}, [hasUnsavedChanges, setContextHasUnsavedChanges]);
```

## Integration with Form Preview

The FormPreview component now uses the context to access the current form:

```tsx
// In FormPreview.tsx
const { currentForm, addFormResponse } = useForm();

// Use form from context if available, otherwise fall back to provided form or URL params
useEffect(() => {
  if (currentForm) {
    setForm(currentForm);
  } else if (providedForm) {
    setForm(providedForm);
  } else if (formId) {
    // Fallback to sample form
  }
}, [currentForm, providedForm, formId, projectId]);
```

## Preview Dialog Implementation

The form preview is now available as a dialog in the form creation wizard:

```tsx
// Preview button in FormCreationWizard
<Button 
  variant="outline"
  onClick={() => {
    setIsPreviewMode(true);
    setShowPreview(true);
  }}
  disabled={!form.id || !form.projectId || !form.sections?.some(s => s.questions.length > 0)}
>
  <Eye className="w-4 h-4" />
  Preview
</Button>

// Preview dialog
<Dialog open={showPreview} onOpenChange={setShowPreview}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
    <FormPreview 
      isPreviewMode={true}
      onBack={() => setShowPreview(false)}
      isDialog={true}
    />
  </DialogContent>
</Dialog>
```

## Benefits

1. **Global Accessibility**: Form data is accessible from any component
2. **Real-time Preview**: Form preview updates as you edit the form
3. **State Persistence**: Form state persists across component unmounts
4. **Response Testing**: Can test form responses in preview mode
5. **Better UX**: Users can preview their form without losing their work

## Future Enhancements

- Add form templates support
- Implement form versioning
- Add form sharing capabilities
- Support for form collaboration
- Add form analytics integration 