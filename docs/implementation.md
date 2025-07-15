Thank you for the detailed organizational context! This is very helpful for designing a scalable, multi-tenant dashboard system with role-based access. Here’s how I recommend structuring the dashboard and access control, along with some architectural notes for implementation.

---

## 1. **Organizational Structure Recap**

- **ICS (Global)**
  - **Countries:** Kenya, Tanzania, Cote d’Ivoire
    - **Projects:** (e.g., MaMeb, VACIS, NPPP, etc.)
      - **Project Branches:** (e.g., MaMeb Kenya, MaMeb Tanzania, etc.)
        - **Operations:** (e.g., counties/regions within a country)

---

## 2. **Dashboard Access Levels**

| User Role         | Access Level                                                                 |
|-------------------|------------------------------------------------------------------------------|
| **Global Admin**  | All projects, all countries, all branches. Can see global and per-project dashboards. |
| **Country Admin** | All projects within their country, all branches in that country.             |
| **Project Admin** | Only their assigned project (and its branches, if multi-country).            |
| **Branch Admin**  | Only their assigned project branch (e.g., MaMeb Kenya).                      |
| **Viewer/User**   | Only data/reports for their assigned branch/project, possibly read-only.      |

---

## 3. **Dashboard Navigation Structure**

- **If Global Admin:**
  - See all countries, all projects, all branches.
  - Can filter/aggregate at any level (global, country, project, branch).

- **If Country Admin:**
  - See only their country, all projects/branches within.

- **If Project Admin:**
  - See only their project (across all countries/branches if multi-country).

- **If Branch Admin:**
  - See only their project branch (e.g., MaMeb Kenya).

---

### **Sidebar Example (Role-based):**

**Global Admin:**
```
[ICS Logo]
-------------------------
Dashboard (Global)

Projects
  ├─ MaMeb (All branches)
  ├─ VACIS (All branches)
  └─ ...
Reports
Settings
```

**Project Admin (MaMeb only):**
```
[ICS Logo]
-------------------------
Dashboard (MaMeb)
Branches
  ├─ Kenya
  ├─ Tanzania
  └─ ...
Reports
Settings
```

**Branch Admin (MaMeb Kenya only):**
```
[ICS Logo]
-------------------------
Dashboard (MaMeb Kenya)
Reports
Settings
```

---

## 4. **Implementation Recommendations**

### **A. Multi-Tenancy**
- Each project/branch can have its own schema or table prefix in the database (as you’re already doing).
- User accounts should be linked to their allowed scope (global, country, project, branch).

### **B. Role-Based Access Control (RBAC)**
- Store user roles and permissions in the database.
- On login, determine the user’s scope and filter the dashboard accordingly.

### **C. Navigation & Filtering**
- Sidebar/menu should be dynamically generated based on user’s role and allowed scope.
- Filtering options (country, project, branch) should be available for higher-level admins.

### **D. Data Aggregation**
- For global/country/project admins, provide aggregate views (e.g., totals, comparisons across branches).
- For branch/project admins, show only their own data.

---

## 5. **Next Steps for Implementation**

1. **User Model & Auth:**  
   - Define user roles and their allowed scope in your backend.
   - Implement authentication and role-based authorization.

2. **Dynamic Sidebar:**  
   - Build the sidebar/menu to render based on the user’s role and allowed projects/branches.

3. **Dashboard Routing:**  
   - Set up routes/pages for each dashboard level (global, country, project, branch).

4. **Data Filtering:**  
   - Ensure all data queries are filtered by the user’s allowed scope.

5. **Admin Controls:**  
   - Only show admin features (e.g., user management, settings) to users with the right role.

---

## 6. **Example Data Model for Users**

```json
{
  "user_id": "123",
  "name": "Jane Doe",
  "role": "project_admin",
  "country": "Kenya",
  "project": "MaMeb",
  "branch": null
}
```
- For a branch admin, `"branch": "Kenya"` (or a specific county/region).

---

## 7. **What I Can Scaffold for You**

- A React dashboard with:
  - Role-based sidebar and routing
  - Example login/auth (mocked or real)
  - Project/branch selection based on user
  - Placeholder pages for dashboard, reports, etc.
  - Example data for MaMeb (as above)
- Backend API stubs for user info and data (if needed)

---

**Please confirm:**
- Should I proceed with a React frontend and mock backend for user roles?
- Do you want a simple login page for role selection (for demo)?
- Any specific UI library (Material-UI, Ant Design, etc.) preferred?

Once you confirm, I’ll start scaffolding the code and structure!