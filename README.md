# PROJETO M3 - Task & User Management System

A comprehensive TypeScript-based task and user management application with role-based access control, built with modern web technologies.


**Live Demo**: https://abelpinto229.github.io/M3/

**Repository**: https://github.com/abelpinto229/M3

**Branch**: Main

**Nome**: Abel Pinto

## 📋 Overview

M3 (PROJETO M3) - Task & User Management System is a full-featured management system designed to help teams organize users, manage tasks, track progress, and collaborate efficiently. It features a sophisticated permission system with four distinct roles, comprehensive task tracking, and user administration capabilities.

---

## ✨ Key Features

### 1. **Role-Based Access Control (RBAC)**
Four distinct user roles with specific permissions:

| Feature | ADMIN | MANAGER | MEMBER | VIEWER |
|---------|-------|---------|--------|--------|
| Create Users | ✅ | ✅ | ❌ | ❌ |
| Edit Users | ✅ | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ |
| Toggle User Status | ✅ | ❌ | ❌ | ❌ |
| Create Tasks | ✅ | ✅ | ❌ | ❌ |
| Edit Tasks | ✅ | ✅ | ✅ | ❌ |
| Delete Tasks | ✅ | ✅ | ❌ | ❌ |
| Change Task Status | ✅ | ✅ | ✅ | ❌ |
| Assign Tasks | ✅ | ✅ | ❌ | ❌ |
| Add Comments | ✅ | ✅ | ✅ | ❌ |
| Edit Task Title | ✅ | ✅ | ❌ | ❌ |
| View All Data | ✅ | ✅ | ✅ | ✅ |
| Add Tags | ✅ | ✅ | ✅ | ❌ |
| Upload Attachments | ✅ | ✅ | ✅ | ❌ |

---

## 👥 User Management Features

### Create Users
- Add new users with full name, email, role, and optional profile photo
- Email validation to prevent duplicates
- Select user role during creation
- Photo upload with automatic Base64 encoding

### User Profiles
- **Profile Photo**: Circular avatar display with fallback gradient initial
- **User Information**: Name, email, role, and active status
- **Status**: Mark users as active or inactive
- **Default Avatar**: Gradient colored circle with user's first initial if no photo

### Edit Users
- Update user name, email, role, and profile photo
- Change user status (active/inactive)
- Email duplication prevention
- Modal-based editing interface

### Filter Users
- **Show All**: Display all users
- **Active Users Only**: Filter users with active status
- **Inactive Users Only**: Filter disabled users
- Real-time filter updates

### User Details Modal
Click any user card to view:
- User ID
- Profile Photo (larger circular display)
- Full Name
- Email Address
- User Role
- Current Status (Active/Inactive)

---

## 📝 Task Management Features

### Create Tasks
- Title, type, and initial details
- Priority level assignment (LOW, MEDIUM, HIGH, CRITICAL)
- Automatic status initialization

### Task Details Modal
View comprehensive task information:
- Task title and type
- Priority level
- Current status
- Deadline information
- Assigned users
- Comments and discussions
- Attachments
- Tags

### Task Status Management
- **Six Status Types**: Criado → Atribuído → Em Progresso → Bloqueado → Concluído → Arquivado
- Status button shows color-coded indicators
- Click status button to cycle through states
- Status changes logged automatically
- Full Portuguese localization of all status values

### Task Sorting
- **Three-Way Toggle Sort**:
  1. **First Click**: Sort A-Z (button shows "↑ A-Z")
  2. **Second Click**: Sort Z-A (button shows "↓ Z-A")
  3. **Third Click**: Reset to original order (button shows "Sort A-Z")

### Task Filtering
- Search by task title or keywords
- Filter by status (All, Open, In Progress, Completed)
- Filter by priority level
- Filter by tags
- Real-time filter updates

### Task Assignment
- Assign tasks to active users
- Multiple user assignment support
- Dropdown selector with available users
- Shows assigned user emails

### Task Operations
- **Edit Title**: Update task name (ADMIN, MANAGER only)
- **Delete Task**: Remove tasks (ADMIN, MANAGER)
- **Priority Management**: Change task priority level
- **Clear Completed Tasks**: Remove all completed tasks in one click
- **Add Deadlines**: Set task completion deadlines

### Comments & Collaboration
- Add task comments for discussion
- Comments displayed in task modal
- Delete own comments
- Comment history maintained

### Tags & Labels
- Add multiple tags per task
- Remove tags easily
- Filter tasks by tags
- Tag organization

### Attachments
- Upload files to tasks
- Download attached documents
- Support for all file types
- Attachment management

---

## 📊 Dashboard & Statistics

### Real-Time Statistics
- **Total Tasks**: Count of all tasks in the system with live updates
- **Completed Tasks**: Count of tasks with "Concluído" status
- **Active Tasks**: Count of tasks in progress or active states
- **Total Users**: Count of all registered users
- **Active Users**: Count of users with active status
- **Assigned Task Counter**: Shows "Tarefas atribuídas: X" on each user card
- Progress indicators showing completion rates
- Statistics automatically update in Portuguese

### System Logs
- **Real-Time Activity Log**: Timeline of all system events and actions
- **Automatic Logging**: User creation, task creation, status changes, assignments, and more
- **Timestamped Entries**: Each log entry includes Portuguese-formatted timestamp
- **User Creation Logs**: Records new user details (name, email, role)
- **Task Logs**: Logs all task creations with type information
- **Action Logs**: Status changes, priority updates, assignments, user status changes
- **Scrollable History**: Maintains full history with scrollable display
- **Latest First**: Most recent actions displayed at the top

---

## 🛡️ Security & Permissions

### Permission System
- Granular permission checks for every action
- Role-based feature visibility
- Disabled buttons for unauthorized actions
- Warning notifications for permission denials

### VIEWER Role Restrictions
- Can view all tasks and users (read-only)
- Cannot modify any data
- Cannot add comments, tags, or attachments
- Task modal shows without editing capabilities
- Status button is disabled

### Data Integrity
- Email uniqueness validation
- Prevents duplicate user emails on updates
- Type-safe data structures
- Automatic data persistence

---

## 🌍 Internationalization

### Portuguese Localization
- **Full UI Translation**: Complete Portuguese interface for all buttons, labels, modals
- **Task Statuses**: Criado, Atribuído, Em Progresso, Bloqueado, Concluído, Arquivado
- **Task Types**: Tarefa, Erro, Funcionalidade
- **Priorities**: Baixa, Média, Alta, Crítica
- **Dashboard**: Statistics display in Portuguese
- **Notifications**: All notifications in Portuguese
- **User Interface**: All modals, menus, and controls fully localized

### English Components
- **Role Names**: Kept in English (ADMIN, MANAGER, MEMBER, VIEWER) for consistency
- **System IDs**: Email addresses and user IDs remain unchanged

---

## 💾 Data Management

### Export Functionality
- **Export Button**: Located in navbar ("Exportar")
- **JSON Export**: Downloads complete system data as JSON backup
- **Timestamp Filenames**: Automatically named `backup-YYYY-MM-DD.json`
- **Complete Data**: Exports users, tasks, and assignments
- **Success Notification**: Confirmation after export

### Automatic Logging
- HistoryLog tracks all system events
- Detailed action logging
- Timestamp tracking
- Activity history maintenance

---

## 🎨 User Interface

### Modern Design
- Tailwind CSS styling
- Responsive layout
- Color-coded status indicators
- Smooth transitions and hover effects
- Icon-based actions

### Navigation
- Role selector dropdown in navbar
- Quick access to all sections
- Real-time permission-based UI updates
- Intuitive menu structure

### Modals & Dialogs
- **Edit User Modal**: Update user information with photo upload
- **Task Details Modal**: Full task information and editing
- **Edit Task Title Modal**: Inline task name editing
- **Confirmation Modal**: Safety confirmations for destructive actions
- **User Details Modal**: View complete user profile

### Notifications
- Success notifications for completed actions
- Warning notifications for errors
- Info notifications for status changes
- Auto-dismissing notifications

---

## 🏗️ Architecture

### Service-Based Architecture
14 core services manage all functionality:

1. **UserService** - User CRUD operations with email validation
2. **TaskService** - Task management with 6 status types
3. **CommentService** - Task comments and collaboration
4. **AttachmentService** - File attachment management
5. **TagService** - Tag management and filtering
6. **SearchService** - Advanced search with narrowSearch() method
7. **StatisticsService** - Real-time dashboard statistics
8. **DeadlineService** - Deadline tracking and expiration
9. **PriorityService** - Priority level management
10. **AssignmentService** - Task assignment handling
11. **BackupService** - JSON data export functionality
12. **AutomationRulesService** - Automated business rules and automation
13. **NotificationService** - User notifications and alerts
14. **HistoryLog** - Activity logging and audit trail

### Modular UI Renderers
- **RenderUser** - User list with task counter, user details modal
- **RenderTask** - Task list, modals, and task operations
- **RenderModals** - Modal dialogs for editing and viewing

### Technology Stack
- **Language**: TypeScript (ES2022 target)
- **Compilation**: tsc (TypeScript Compiler) - Exit Code 0
- **Styling**: Tailwind CSS
- **Layout**: Responsive 3-column design (32% Users, 45% Tasks, 23% Stats)
- **Data Format**: Base64 for image storage
- **Type Safety**: Full TypeScript with proper type checking

### Localization
- **UI Language**: Portuguese
- **Date Format**: YYYY-MM-DD
- **Status Values**: Portuguese enums
- **Type/Priority Display**: Portuguese with internal English values

---

## 📦 Demo Data

The application comes with pre-populated demo data:

### Users (5 + 1 Admin)
- Administrator (ADMIN) - Default
- Abel Pinto (MEMBER) - Active
- Joel Pinto (MANAGER) - Inactive
- Lionel Pinto (MEMBER) - Active
- Isabel Pinto (VIEWER) - Inactive
- Ezequiel Pinto (MEMBER) - Active

### Tasks (3)
1. **Revisar diapositivos da aula 2** (Review class 2 slides)
   - Type: Tarefa
   - Priority: Média
   - Status: Criado
   - Deadline: 2026-02-05
   - Assigned: Administrator

2. **Fazer exercícios orientados** (Do guided exercises)
   - Type: Tarefa
   - Priority: Alta
   - Status: Em Progresso
   - Deadline: 2026-02-03
   - Assigned: Abel

3. **Fazer exercícios autónomos** (Do autonomous exercises)
   - Type: Tarefa
   - Priority: Baixa
   - Status: Criado
   - Deadline: 2026-02-10
   - Unassigned

---

## 🚀 Getting Started

### Prerequisites
- Node.js (with npm)
- TypeScript

### Installation
```bash
# Navigate to project directory
cd M3

# Install dependencies (if not already installed)
npm install

# Compile TypeScript
npx tsc

# Open in browser
# Open main.html in your web browser
```

### Development
```bash
# Watch mode (recompile on file changes)
npx tsc --watch
```

---

## 📝 Usage Guide

### Switching Roles
1. Click the "Select Role" dropdown in the navbar
2. Choose from: ADMIN, MANAGER, MEMBER, VIEWER
3. UI automatically updates based on permissions
4. All buttons and features adjust visibility

### Creating a User
1. Go to Users section
2. Fill in: Photo (optional), Name, Email, Role
3. Click "+" button
4. New user appears in list immediately

### Editing a User
1. Click the pencil icon on any user card
2. Update fields in the modal
3. Click "Salvar" to save changes
4. Changes reflected immediately

### Creating a Task
1. Go to Tasks section
2. Fill in task details
3. Click "+" button
4. Task appears in list

### Managing Tasks
1. Click task title to open details modal
2. Add comments by typing and pressing Enter
3. Upload attachments using file input
4. Add tags for organization
5. Click status button to cycle through states

### Filtering
- Use search box for keyword search
- Use filter dropdowns for specific criteria
- Filters apply in real-time
- Multiple filters can be combined

---

## 🔐 Security Notes

- The VIEWER role is read-only and cannot modify any data
- Permissions are enforced both in UI and backend
- Email validation prevents duplicate user creation
- All user actions are logged
- Sensitive operations require confirmation

---

## 📄 License

This project is part of the M3 educational system.

---

## 👨‍💻 Development

### Project Structure
```
M3/
├── src/
│   ├── models/           # Data structures
│   ├── services/         # Business logic (14 services)
│   ├── ui/              # UI renderers
│   ├── logs/            # Logging
│   ├── security/        # Auth & roles
│   ├── tasks/           # Task types
│   ├── notifications/   # Notifications
│   └── utils/           # Utilities
├── dist/                # Compiled JavaScript
├── main.ts              # Main application file
├── main.html            # HTML template
└── tsconfig.json        # TypeScript config
```

### Adding New Features
1. Create service in `src/services/`
2. Create UI renderer in `src/ui/` if needed
3. Add to main.ts initialization
4. Update permissions in checkPermission matrix
5. Compile with `npx tsc`

---

## 🐛 Known Limitations

- Data is stored in memory (resets on page refresh)
- Single-instance application (one user per browser)
- File attachments stored as references only

---

## ✅ Recent Updates (February 2026)

- **Test Suite Restoration**: Restored comprehensive test cases for EntityList, SimpleCache, TagManager, RatingSystem, DependencyGraph, and WatcherSystem classes
- **Import Path Fixes**: Fixed all import paths to correctly reference the module structure
- **TypeScript Type Safety**: Added proper type annotations and assertions for improved type checking

## ✅ Previous Updates (January 2026)

- **Complete Portuguese Localization**: Entire UI translated to Portuguese
- **User Card Task Counter**: Shows "Tarefas atribuídas: X" for each user
- **Export Functionality**: Added JSON export button with timestamp filenames
- **Service Refactoring**: Simplified services with cleaner APIs
- **Automation Rules**: Enhanced AutomationRulesService with business logic
- **Statistics**: Real-time dashboard with Portuguese status values
- **Comprehensive Logging**: All user creations and task creations logged automatically
- **Log Timestamp Formatting**: Portuguese-formatted timestamps in system logs

---

## 📞 Support

For issues or feature requests, refer to the project documentation or contact the development team.

---

**Version**: 2.2.0  
**Last Updated**: February 2, 2026  
**Status**: Production Ready ✅
