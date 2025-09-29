# 🔍 Data Refresh Issue Debugging Guide

## 🐛 **Current Problem**
After adding new outcomes, activities, and KPIs to a project via the edit wizard, the data is not reflecting in other components (ProjectOverview, KPIAnalytics, etc.) even though the refresh mechanism appears to be working.

## 🔧 **Debugging Steps Implemented**

### **1. Enhanced Logging in ProjectsContext**
Added comprehensive logging to track:
- ✅ **Access Control**: `canAccessProject` and `hasProjectAccess` function calls
- ✅ **Data Fetching**: Each API call with refresh trigger context
- ✅ **Refresh Triggers**: When and how `triggerDataRefresh` is called
- ✅ **Function Memoization**: Using `useCallback` to prevent unnecessary re-renders

### **2. Function Memoization with useCallback**
```typescript
const getProjectOutcomes = useCallback(async (projectId: string): Promise<Outcome[]> => {
  // ... implementation
}, [dataRefreshTrigger]); // ✅ Now properly responds to refresh triggers
```

### **3. Enhanced Access Control Logging**
```typescript
const canAccessProject = (projectId: string): boolean => {
  const hasAccess = hasProjectAccess(projectId, 'read');
  console.log(`🔐 Access check for project ${projectId}: ${hasAccess ? 'GRANTED' : 'DENIED'}`);
  return hasAccess;
};
```

## 🧪 **Testing Instructions**

### **Step 1: Open Browser Console**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Clear console and keep it open

### **Step 2: Test Project Edit**
1. Navigate to an existing project
2. Click "Edit Project"
3. Add a new outcome, activity, or KPI
4. Save the project
5. **Watch console carefully** for the following sequence:

### **Step 3: Expected Console Output**
```bash
# 1. Save operations
💾 Saving project data: 3 outcomes, 5 activities, 8 KPIs
✅ All database operations completed successfully

# 2. Fresh data fetch
🔄 Fetching fresh data post-save...
✨ Fresh data loaded: 3 outcomes, 5 activities

# 3. Refresh trigger
🔄 Triggering data refresh from project wizard
🔄 Triggering data refresh for all project components: 0 -> 1

# 4. Navigation
🧭 Navigating to project overview: /dashboard/projects/abc123

# 5. Component data loading
🔄 ProjectOverview: Loading data for project abc123 (refresh trigger: 1)
🔐 Access check for project abc123: GRANTED
🔄 Fetching outcomes for project abc123 (refresh trigger: 1)
✅ Fetched 3 outcomes for project abc123
🔄 Fetching activities for project abc123 (refresh trigger: 1)
✅ Fetched 5 activities for project abc123
✅ ProjectOverview: Loaded 3 outcomes, 5 activities, 0 subactivities
```

## 🚨 **Common Issues to Check**

### **Issue 1: Access Control Blocking Data**
**Symptoms**: Console shows "Access check: DENIED"
**Check**: 
- User roles and permissions
- Project access configuration
- `user.projectAccess` array structure

### **Issue 2: API Endpoints Not Responding**
**Symptoms**: Console shows "Error fetching project outcomes/activities"
**Check**:
- Backend API endpoints are working
- Network requests in browser Network tab
- API authentication/authorization

### **Issue 3: Refresh Trigger Not Working**
**Symptoms**: Console shows refresh trigger but no data loading
**Check**:
- `dataRefreshTrigger` value changes
- Components properly depend on `dataRefreshTrigger`
- `useEffect` dependencies are correct

### **Issue 4: Function Recreation Issues**
**Symptoms**: Multiple API calls or stale data
**Check**:
- `useCallback` dependencies are correct
- Functions are properly memoized
- No unnecessary re-renders

## 🔍 **Debugging Commands**

### **Check Current State**
```javascript
// In browser console, check:
console.log('Current user:', window.user);
console.log('Current projects context:', window.projectsContext);
console.log('Current refresh trigger:', window.dataRefreshTrigger);
```

### **Force Refresh**
```javascript
// Manually trigger refresh
window.projectsContext.triggerDataRefresh();
```

### **Check API Endpoints**
```javascript
// Test API endpoints directly
fetch('/api/projects/your-project-id/outcomes')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## 📊 **Component Dependencies Check**

### **ProjectOverview.tsx**
```typescript
useEffect(() => {
  // Should depend on: projectId, user, dataRefreshTrigger
  // Should NOT depend on: getProjectOutcomes, getProjectActivities (these are memoized)
}, [projectId, user, dataRefreshTrigger]);
```

### **KPIAnalytics.tsx**
```typescript
useEffect(() => {
  // Should depend on: projectId, user, dataRefreshTrigger
}, [projectId, user, dataRefreshTrigger]);
```

### **OutcomesDetails.tsx**
```typescript
useEffect(() => {
  // Should depend on: projectId, user, dataRefreshTrigger
}, [projectId, user, dataRefreshTrigger]);
```

## 🎯 **Next Steps**

1. **Run the test** and capture console output
2. **Identify the specific failure point** from the logs
3. **Check browser Network tab** for failed API calls
4. **Verify backend endpoints** are working correctly
5. **Check user permissions** and project access

## 📝 **Debugging Checklist**

- [ ] Console shows save operations completing
- [ ] Console shows refresh trigger incrementing
- [ ] Console shows navigation happening
- [ ] Console shows access control checks
- [ ] Console shows API calls being made
- [ ] Console shows data being loaded
- [ ] UI displays updated data
- [ ] No errors in console or network tab

---

**Status**: 🔍 **DEBUGGING IN PROGRESS - Enhanced logging implemented**
