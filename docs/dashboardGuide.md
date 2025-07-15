We are building a MEAL dashboard with a focus on visualization and organization. The dashboard layout must be responsive and role-based. We'll use shadcn/ui components and Tailwind CSS for styling. We'll structure the dashboard into several main views: Global Dashboard, Project Dashboard, Reports, and Settings.
 Key Layout Components:
 1. **Dashboard Shell**: Includes a header with navigation controls, a sidebar for main navigation, and a main content area.
 2. **Sidebar**: Dynamically generated based on user role and accessible projects/branches.
 3. **Header**: Contains user info, notifications, project switcher, and quick actions.
 4. **Main Content Area**: Contains the dashboard views (overview, outcomes, activities, reports, etc.)
 We'll create the following views:
   - Global Overview (for global and country admins)
   - Project Overview (for project and branch admins)
   - Outcome Detail
   - Activity Detail
   - Reports
 Let's design the layout with the following structure:
```
<DashboardLayout>
  <Sidebar />
  <div className="flex flex-col flex-1">
    <Header />
    <main className="flex-1 p-4 md:p-8">
      <Outlet /> <!-- React Router Outlet for nested routes -->
    </main>
  </div>
</DashboardLayout>
```
 We'll now detail each component.
## 1. Dashboard Shell (DashboardLayout)
### Functionality:
- Provides the basic structure of the dashboard.
- Manages the sidebar state (collapsed/expanded) on mobile and desktop.
- Wraps the entire application to provide consistent layout.
### Implementation Details:
- Use a flex container to hold the sidebar and main content area.
- The sidebar is fixed on desktop and collapsible on mobile.
- The main content area takes up the remaining space and has a header at the top.
### Code Structure (Pseudocode):
```tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (conditionally rendered for mobile) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
```
## 2. Sidebar
### Functionality:
- Displays navigation items based on user role.
- Collapsible on mobile.
- Shows the organization structure (Global, Countries, Projects, Branches) as a tree for admins, and limited items for branch admins.
### Implementation Details:
- Use the shadcn/ui `Sheet` component for mobile sidebar.
- For desktop, use a fixed sidebar.
- Navigation items are generated from the user's accessible scope (passed via context or props).
### Example for Global Admin:
```tsx
<nav>
  <NavGroup title="Dashboard">
    <NavItem href="/dashboard" icon={<HomeIcon />}>Global Overview</NavItem>
  </NavGroup>
  <NavGroup title="Countries">
    <NavItem href="/country/kenya" icon={<FlagIcon />}>Kenya</NavItem>
    <NavItem href="/country/tanzania" icon={<FlagIcon />}>Tanzania</NavItem>
    ...
  </NavGroup>
  <NavGroup title="Projects">
    <NavItem href="/project/mameb" icon={<FolderIcon />}>MaMeb</NavItem>
    ...
  </NavGroup>
</nav>
```
### Example for Project Admin (MaMeb):
```tsx
<nav>
  <NavGroup title="Dashboard">
    <NavItem href="/project/mameb" icon={<HomeIcon />}>Project Overview</NavItem>
  </NavGroup>
  <NavGroup title="Outcomes">
    <NavItem href="/project/mameb/outcome/1" icon={<TargetIcon />}>Outcome 1</NavItem>
    ...
  </NavGroup>
  <NavGroup title="Activities">
    <NavItem href="/project/mameb/activity/1.1" icon={<ActivityIcon />}>Activity 1.1</NavItem>
    ...
  </NavGroup>
  <NavGroup title="Reports">
    <NavItem href="/project/mameb/reports" icon={<ReportIcon />}>Project Reports</NavItem>
  </NavGroup>
</nav>
```
### Component: NavGroup
- Displays a group of navigation items with a title.
- Can be expanded/collapsed.
### Component: NavItem
- A single navigation item with an icon and label.
## 3. Header
### Functionality:
- Contains a menu button (for mobile sidebar toggle).
- Breadcrumbs for current location.
- Project switcher (if user has access to multiple projects).
- User menu (profile, settings, logout).
### Implementation Details:
- Use a fixed header at the top.
- On mobile, the menu button toggles the sidebar.
- Breadcrumbs show the current route hierarchy (e.g., Dashboard / MaMeb / Outcome 1).
- Project switcher is a dropdown that allows switching between accessible projects.
### Code Structure (Pseudocode):
```tsx
const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="md:hidden">Menu</button>
          <Breadcrumbs />
        </div>
        <div className="flex items-center space-x-4">
          <ProjectSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
```
## 4. Main Content Views
### 4.1 Global Overview View
- **Target Users**: Global Admin, Country Admin
- **Content**:
   - Summary cards for global KPIs (total projects, countries, etc.)
   - Map showing project locations and status
   - Performance charts by country
   - Recent activity feed
### 4.2 Project Overview View
- **Target Users**: Project Admin, Branch Admin
- **Content**:
   - Project summary (timeline, budget, progress)
   - Outcome cards with progress indicators
   - Key risks and issues
   - Upcoming activities
### 4.3 Outcome Detail View
- **Content**:
   - Outcome title and description
   - Progress towards target (radial gauge)
   - List of outputs with their current status
   - Charts for each KPI in the outcome
   - Activity timeline
### 4.4 Activity Detail View
- **Content**:
   - Activity title and description
   - Progress bar and status
   - Sub-activities checklist
   - Related KPIs and their visualizations
   - Comments and updates log
### 4.5 Reports View
- **Content**:
   - Predefined report templates (e.g., Quarterly Progress Report)
   - Custom report builder (drag and drop KPIs)
   - Export options (PDF, Excel)
## 5. Visualization Components
We'll create a set of reusable visualization components:
### 5.1 RadialGauge
- Displays a percentage value as a radial progress.
- Used for outcome progress and percentage KPIs.
### 5.2 StackedBarChart
- Shows comparisons across branches or time.
### 5.3 TimelineChart
- Displays progress over time with milestones.
### 5.4 ProgressBar
- Horizontal bar for activity progress.
### 5.5 PieChart
- For showing distributions (e.g., status of activities).
### 5.6 DataTable
- For tabular data with sorting and filtering.
## 6. Responsive Design
- Use Tailwind CSS responsive classes (e.g., `md:`, `lg:`) to adjust layout for different screen sizes.
- On mobile, the sidebar is hidden and can be toggled via the menu button in the header.
- Cards stack vertically on mobile, and grid layouts on desktop.
## 7. Implementation Steps
1. **Set up the project structure** with Vite, React, TypeScript, and Tailwind CSS.
2. **Install shadcn/ui** and set up the theme.
3. **Create the DashboardLayout** component that includes the sidebar and header.
4. **Build the Sidebar** component that dynamically generates navigation based on user role (use mock user for now).
5. **Build the Header** with breadcrumbs, project switcher, and user menu.
6. **Set up routing** for the main views (Global, Project, Outcome, Activity, Reports).
7. **Create placeholder components** for each view.
8. **Build the visualization components** (RadialGauge, StackedBarChart, etc.) using Recharts.
9. **Populate views** with mock data and the visualization components.
10. **Implement responsive behavior** for mobile and desktop.
## 8. Mock Data Structure for Frontend
We'll create a `mockData.ts` file that includes:
- User roles (multiple users for testing)
- MEAL frameworks for several projects (including MaMeb)
- Data points for KPIs
Example:
```typescript
export const mockUser: User = {
  id: '1',
  name: 'Global Admin',
  role: 'global-admin',
  accessibleProjects: ['mameb', 'vacis'],
  accessibleBranches: [],
  accessibleCountries: ['kenya', 'tanzania'],
};
export const mockMealFramework: MEALFramework = { ... };
```
## 9. Best Practices for Styling
- **Consistent Spacing**: Use Tailwind's spacing scale (e.g., `p-4`, `m-2`).
- **Color Palette**: Use the ICS color scheme defined in the Tailwind config.
- **Typography**: Use consistent font sizes and weights.
- **Card Design**: Use a consistent card style for all dashboard widgets.
Example Card:
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <h3 className="font-semibold text-lg">Card Title</h3>
  <div className="mt-4">
    {/* Content */}
  </div>
</div>
```
## 10. Accessibility
- Use semantic HTML elements.
- Ensure proper contrast ratios.
- Add ARIA attributes for interactive elements.
- Keyboard navigable.
## 11. Folder Structure
```
src/
  ├── components/
  │   ├── layout/
  │   │   ├── DashboardLayout.tsx
  │   │   ├── Header.tsx
  │   │   ├── Sidebar.tsx
  │   │   ├── NavGroup.tsx
  │   │   └── NavItem.tsx
  │   ├── dashboard/
  │   │   ├── GlobalOverview.tsx
  │   │   ├── ProjectOverview.tsx
  │   │   ├── OutcomeDetail.tsx
  │   │   └── ...
  │   └── visualizations/
  │       ├── RadialGauge.tsx
  │       ├── StackedBarChart.tsx
  │       └── ...
  ├── contexts/
  ├── hooks/
  ├── routes/
  ├── mockData.ts
  ├── App.tsx
  └── main.tsx
```
This detailed guide provides a blueprint for building the dashboard layout. The AI coding agent can now implement the frontend step by step, starting with the layout components and then moving to the specific views.