# Rural GenAI Wellbeing Project Documentation

## 1. Introduction
### 1.1 About the Organization
[To be filled with organization details]

### 1.2 Problem Definition
[To be filled with problem definition]

## 2. Problem Description
[To be filled with detailed problem description]

## 3. System Study
### 3.1 Existing System
[To be filled with existing system analysis]

### 3.2 Proposed System
[To be filled with proposed system details]

### 3.3 DFD, ER Diagram
[To be filled with diagrams]

### 3.4 UML Diagrams
- Use Case Diagram
- Activity Diagram
- Class Diagram
- Object Diagram
- Module Diagram
- Interaction Diagram

### 3.5 Feasibility Study
[To be filled with feasibility analysis]

## 4. System Configuration
### 4.1 Hardware Requirements
[To be filled with hardware specifications]

### 4.2 Software Requirements
[To be filled with software requirements]

## 5. Details of Software
### 5.1 Overview of Frontend
[To be filled with frontend details]

### 5.2 Overview of Backend
The backend of Wellnet is designed as a mock backend system using TypeScript and local storage to simulate data interactions and backend processes. This approach enables rapid prototyping and testing without the complexity of setting up a full database or server, while providing realistic functionality and data flow for the application.

#### Database Layer
**Description:**
The mock database simulates persistent data storage by using TypeScript interfaces for strong typing and local storage for data persistence. Dummy data generation functions create sample datasets to represent various entities in the system, enabling realistic data handling during development.

**Usage in Wellnet:**
This database layer acts as the core data repository, supporting CRUD operations on different types of users, appointments, medical records, and messages, thereby allowing the frontend to interact seamlessly with backend-like data.

**Data Models:**

| Model Name | Key Attributes | Description |
|------------|----------------|-------------|
| User | id, username, password, role, linkedId, name, profilePic, languages, createdAt | Represents all types of system users |
| Coordinator | id, name, latitude, longitude, district, linkedHealthSakhis, contactNumber, email | Oversees health workers in a geographic area |
| Health Sakhi | id, name, village, latitude, longitude, specializations, linkedLab | Frontline rural health worker |
| Customer | id, name, age, gender, village, latitude, longitude, linkedHealthSakhi, linkedLab, services, contactNumber, medicalHistory, appointments | Patients registered with the system |
| Lab | id, name, latitude, longitude, address, contactNumber, services, workingHours, workingDays, linkedHealthSakhi | Diagnostic centers providing lab tests |
| Medical Record | id, date, symptoms, diagnosis, prescriptions, labTests | Patient medical history and treatment details |
| Appointment | id, customerId, customerName, healthSakhiId, healthSakhiName, testName, date, status, results | Scheduled diagnostic or medical appointments |
| Message | id, fromId, fromName, fromType, toId, toName, toType, subject, content, type, appointmentId, date, status | Communication between users |

#### Authentication System
**Description:**
The authentication module manages login, logout, and user session management. It supports role-based access control to ensure users interact only with data and features relevant to their roles.

**Usage in Wellnet:**
Roles include Coordinator, Health Sakhi, Customer, and Lab, each having specific permissions. The authentication state is persisted in local storage to provide smooth user experience across sessions.

#### API Services
**Description:**
The backend exposes mock API services that simulate real server endpoints. These services interact with the mock database to perform data retrieval and management, enabling the frontend to work with realistic backend responses.

**Usage in Wellnet:**
APIs cover user management, relationships, appointments, messaging, and location queries, handling all key interactions in the system.

**Key API Services:**

| Service Category | Sample API Functions | Purpose |
|------------------|---------------------|----------|
| User Services | getUserByCredentials, getCoordinatorById, getHealthSakhiById, getCustomerById, getLabById | Retrieve user data based on role or ID |
| Relationship Services | getHealthSakhisByCoordinatorId, getCustomersByHealthSakhiId, getNearbyLabs, getNearbyCustomers | Fetch linked or nearby users for coordination or care |
| Appointment Services | getLabAppointments, manageAppointments | Manage scheduling and status updates for appointments |
| Message Services | sendMessage, getMessages, markMessageAsRead | Handle sending, retrieval, and reading status of messages |

#### Location Services
**Description:**
This module provides geographic data handling such as distance calculations, coordinate generation, and spatial queries.

**Usage in Wellnet:**
It supports location-based features including mapping health workers and labs, finding nearby resources, and enhancing logistics for appointments and visits.

#### AI Integration Services
**Description:**
AI-powered features enhance user experience and accessibility by providing automated translation, summarization, text-to-speech, and content recommendation.

**Usage in Wellnet:**
- **Translation:** Tamil-English bilingual support and language detection.
- **Text Processing:** Summarization of medical notes and conversion of text to speech.
- **Content Recommendation:** Personalized health education videos and advice tailored to users.

#### Data Management
**Description:**
Handles initialization, data generation, synchronization, and persistence of mock data using local storage.

**Usage in Wellnet:**
Ensures the mock database is correctly set up at runtime, keeps data consistent, and manages state changes during app use.

#### Utility Functions
**Description:**
Includes helper methods for data generation, formatting, and spatial computations.

**Usage in Wellnet:**
Supports creating dummy users, coordinators, labs, customers, medical records, and calculations like distance measurement.

### 5.3 About the Platform
[To be filled with platform details]

## 6. System Design
### 6.1 Architectural Design

The Rural GenAI Wellbeing Project follows a modern, component-based architecture with a clear separation of concerns. The system is built using React with TypeScript, implementing a mock backend for rapid prototyping and testing.

#### 6.1.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Frontend Application Layer                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐  │
│  │   UI Layer  │    │  Business   │    │   State     │    │  Data   │  │
│  │             │    │   Logic     │    │ Management  │    │  Layer  │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘  │
│         │                  │                   │                │       │
│         ▼                  ▼                   ▼                ▼       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Component Hierarchy                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 6.1.2 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Component Hierarchy                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         App Component                           │   │
│  └───────────────────────────────┬─────────────────────────────────┘   │
│                                  │                                     │
│  ┌───────────────────────────────┼─────────────────────────────────┐   │
│  │                               │                                 │   │
│  ▼                               ▼                                 ▼   │
│  ┌─────────────┐    ┌─────────────────────┐    ┌─────────────────┐ │   │
│  │ AuthProvider│    │ LanguageProvider    │    │ ErrorBoundary   │ │   │
│  └─────────────┘    └─────────────────────┘    └─────────────────┘ │   │
│                                  │                                 │   │
│                                  ▼                                 │   │
│                        ┌─────────────────────┐                     │   │
│                        │  DashboardLayout    │                     │   │
│                        └──────────┬──────────┘                     │   │
│                                  │                                 │   │
│              ┌───────────────────┼───────────────────┐             │   │
│              │                   │                   │             │   │
│              ▼                   ▼                   ▼             │   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │   │
│  │   AppHeader     │  │  Main Content   │  │   AppFooter     │    │   │
│  └─────────────────┘  └────────┬────────┘  └─────────────────┘    │   │
│                                │                                  │   │
│                                ▼                                  │   │
│  ┌─────────────────────────────────────────────────────────┐      │   │
│  │                 Role-specific Dashboards                 │      │   │
│  └─────────────────────────────────────────────────────────┘      │   │
│                                                                     │   │
└─────────────────────────────────────────────────────────────────────┘   │
```

#### 6.1.3 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Data Flow Architecture                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐  │
│  │   User      │    │  Context    │    │  Services   │    │  Mock   │  │
│  │ Interface   │◄───┤  Providers  │◄───┤  Layer      │◄───┤  Data   │  │
│  │             │    │             │    │             │    │  Store  │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘  │
│         │                  │                   │                │       │
│         │                  │                   │                │       │
│         ▼                  ▼                   ▼                ▼       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      External Services                           │   │
│  │                                                                  │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │   │
│  │  │   Maps      │    │    AI       │    │  Storage    │         │   │
│  │  │  Services   │    │  Services   │    │  Services   │         │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 6.1.4 Architecture Components

1. **Frontend Application Layer**
   - **UI Layer**
     - React components for user interface
     - Responsive layouts using Tailwind CSS
     - Role-based dashboard views
     - Interactive maps and visualizations
   
   - **Business Logic Layer**
     - Context providers for state management
     - Service modules for business operations
     - Authentication and authorization
     - AI integration services
   
   - **State Management Layer**
     - React Context API for global state
     - Local state for component-specific data
     - Persistent storage for user sessions
     - Real-time updates for critical data
   
   - **Data Layer**
     - Mock database implementation
     - TypeScript interfaces for data modeling
     - Local storage for persistence
     - Data generation utilities

2. **Component Hierarchy**
   - **Root Components**
     - App: Main application component
     - AuthProvider: Authentication context
     - LanguageProvider: Language context
     - ErrorBoundary: Error handling
   
   - **Layout Components**
     - DashboardLayout: Main layout structure
     - AppHeader: Navigation and user info
     - AppFooter: Footer information
   
   - **Role-specific Components**
     - CoordinatorDashboard
     - SakhiDashboard
     - CustomerDashboard
     - LabDashboard

3. **Data Flow Architecture**
   - **User Interface Layer**
     - Handles user interactions
     - Manages form inputs
     - Displays feedback
   
   - **Frontend Services**
     - API service integration
     - Business logic implementation
     - Data transformation
   
   - **Mock Backend**
     - Data storage and retrieval
     - Business rules enforcement
     - Data validation
   
   - **State Management**
     - Global state handling
     - Local state management
     - Data persistence

#### 6.1.5 System Interactions

1. **User Authentication Flow**
   ```
   ┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │  User   │     │ AuthProvider│     │ Mock Backend│     │    State    │
   │  Input  │────►│             │────►│             │────►│   Update    │
   └─────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                                                                   ▼
                                                             ┌─────────────┐
                                                             │    UI       │
                                                             │   Update    │
                                                             └─────────────┘
   ```

2. **Data Retrieval Flow**
   ```
   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │ Component   │     │  Service    │     │ Mock Backend│     │    State    │
   │  Request    │────►│   Layer     │────►│             │────►│   Update    │
   └─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                       │
                                                                       ▼
                                                                 ┌─────────────┐
                                                                 │    UI       │
                                                                 │   Render    │
                                                                 └─────────────┘
   ```

3. **Map Interaction Flow**
   ```
   ┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │  User   │     │   Map       │     │ Location    │     │    Data     │
   │ Action  │────►│ Component   │────►│  Service    │────►│   Update    │
   └─────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                                                                   ▼
                                                             ┌─────────────┐
                                                             │    UI       │
                                                             │   Update    │
                                                             └─────────────┘
   ```

4. **AI Feature Flow**
   ```
   ┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │  User   │     │    AI       │     │ Processing  │     │   Result    │
   │ Input   │────►│  Service    │────►│             │────►│             │
   └─────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                                                                   ▼
                                                             ┌─────────────┐
                                                             │    UI       │
                                                             │   Update    │
                                                             └─────────────┘
   ```

#### 6.1.6 Error Handling

1. **Component Level**
   - Error boundaries for component failures
   - Fallback UI components
   - User-friendly error messages

2. **Service Level**
   - API error handling
   - Data validation
   - Retry mechanisms

3. **State Level**
   - Error state management
   - Recovery procedures
   - State persistence

#### 6.1.7 Performance Considerations

1. **Code Splitting**
   - Route-based code splitting
   - Lazy loading of components
   - Dynamic imports

2. **Memoization**
   - React.memo for components
   - useMemo for computations
   - useCallback for functions

3. **Data Caching**
   - React Query for data caching
   - Local storage for persistence
   - Optimistic updates

#### 6.1.8 Security Implementation

1. **Authentication**
   - Role-based access control
   - Session management
   - Secure routing

2. **Data Protection**
   - Input validation
   - XSS prevention
   - CSRF protection

#### 6.1.9 Future Architecture Considerations

1. **Backend Integration**
   - Replace mock database with real backend
   - Implement real-time updates
   - Add offline capabilities

2. **AI Integration**
   - Implement real AI services
   - Add more AI features
   - Improve accuracy

3. **Mobile App**
   - Progressive Web App
   - Native mobile app
   - Offline-first approach

### 6.2 System Architecture and Data Flow

#### 6.2.1 System Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Rural GenAI Wellbeing System                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Client Layer                               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │   Web       │  │  Mobile     │  │  Tablet     │  │  Other  │ │   │
│  │  │  Browser    │  │   App       │  │   App       │  │ Clients │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Application Layer                            │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  React      │  │  Context    │  │  Services   │  │  Utils  │ │   │
│  │  │ Components  │  │ Providers   │  │   Layer     │  │         │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Service Layer                                │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Auth       │  │  Map        │  │    AI       │  │ Storage │ │   │
│  │  │ Services    │  │ Services    │  │  Services   │  │ Services│ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Data Layer                                   │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Mock       │  │  Local      │  │  External   │  │  Cache  │ │   │
│  │  │ Database    │  │ Storage     │  │  Services   │  │         │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 6.2.2 Data Flow Diagram (DFD)
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Flow Diagram (Level 0)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐                                                       │
│  │   User      │                                                       │
│  │  (External) │                                                       │
│  └──────┬──────┘                                                       │
│         │                                                              │
│         │  User Input                                                  │
│         ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Wellnet System                               │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  User       │  │  Data       │  │  Process    │  │  Output │ │   │
│  │  │  Interface  │──►│  Processing│──►│  Logic      │──►│ Display │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │   │
│  │         ▲                ▲                ▲               │      │   │
│  │         │                │                │               │      │   │
│  │         └────────────────┼────────────────┘               │      │   │
│  └─────────────────────────┼─────────────────────────────────┘      │   │
│                            │                                        │   │
│                            ▼                                        │   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │   │
│  │  External   │    │  External   │    │  External   │             │   │
│  │   Maps      │    │    AI       │    │  Storage    │             │   │
│  │  Services   │    │  Services   │    │  Services   │             │   │
│  └─────────────┘    └─────────────┘    └─────────────┘             │   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 6.2.3 Input/Output Design
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Input/Output Design                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Input Processes                              │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  User       │  │  Location   │  │  Medical    │  │  Lab    │ │   │
│  │  │  Auth       │  │  Data       │  │  Records    │  │  Tests  │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Processing                                   │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Data       │  │  Business   │  │  AI         │  │  Map    │ │   │
│  │  │  Validation │  │  Logic      │  │  Processing │  │  Logic  │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Output Processes                             │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Dashboard  │  │  Reports    │  │  Maps       │  │  Alerts │ │   │
│  │  │  Display    │  │  Generation │  │  Display    │  │         │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 6.2.4 Sequence Diagrams

##### 6.2.4.1 Appointment Scheduling
```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐
│ Customer│    │  Health     │    │    Lab      │    │  System     │    │   AI    │
│         │    │   Sakhi     │    │             │    │             │    │ Service │
└────┬────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘
     │                │                   │                   │                │
     │──Request Appt──►                   │                   │                │
     │                │                   │                   │                │
     │                │──Check Schedule──►│                   │                │
     │                │                   │                   │                │
     │                │◄──Available Slots─│                   │                │
     │                │                   │                   │                │
     │                │──Suggest Time────►│                   │                │
     │                │                   │                   │                │
     │◄──Time Options──                   │                   │                │
     │                │                   │                   │                │
     │──Select Time──►│                   │                   │                │
     │                │                   │                   │                │
     │                │──Confirm Appt────►│                   │                │
     │                │                   │                   │                │
     │                │                   │──Update DB───────►│                │
     │                │                   │                   │                │
     │                │                   │──Translate───────►│                │
     │                │                   │                   │                │
     │                │                   │◄──Translation────│                │
     │                │                   │                   │                │
     │                │◄──Confirmation────│                   │                │
     │                │                   │                   │                │
     │◄──Appt Confirmed                   │                   │                │
     │                │                   │                   │                │
```

##### 6.2.4.2 Authentication/Login Process
```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐
│  User   │    │  Auth       │    │  Mock       │    │  Context    │    │ Storage │
│(Any Role)│    │ Provider    │    │ Database    │    │ Provider    │    │ Service │
└────┬────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘
     │                │                   │                   │                │
     │──Enter Credentials─►               │                   │                │
     │                │                   │                   │                │
     │                │──Validate Input──►│                   │                │
     │                │                   │                   │                │
     │                │◄──Input Valid─────│                   │                │
     │                │                   │                   │                │
     │                │──Check User──────►│                   │                │
     │                │                   │                   │                │
     │                │◄──User Found──────│                   │                │
     │                │                   │                   │                │
     │                │──Verify Password──►│                   │                │
     │                │                   │                   │                │
     │                │◄──Password Valid──│                   │                │
     │                │                   │                   │                │
     │                │──Get User Role────►│                   │                │
     │                │                   │                   │                │
     │                │◄──Role Info───────│                   │                │
     │                │                   │                   │                │
     │                │──Update Context──►│                   │                │
     │                │                   │                   │                │
     │                │                   │──Store Session───►│                │
     │                │                   │                   │                │
     │                │                   │◄──Session Stored──│                │
     │                │                   │                   │                │
     │                │◄──Context Updated─│                   │                │
     │                │                   │                   │                │
     │◄──Login Success                    │                   │                │
     │                │                   │                   │                │
     │──Role-specific Redirect            │                   │                │
     │                │                   │                   │                │
     │                │                   │                   │                │
     │  ┌─────────────────────────────────────────────────────────┐          │
     │  │                    Role-specific Flows                   │          │
     │  │                                                         │          │
     │  │  Coordinator ──► Coordinator Dashboard                   │          │
     │  │  Health Sakhi ──► Health Sakhi Dashboard                │          │
     │  │  Customer ──────► Customer Dashboard                    │          │
     │  │  Lab ──────────► Lab Dashboard                          │          │
     │  └─────────────────────────────────────────────────────────┘          │
     │                │                   │                   │                │
```

#### 6.2.5 Use Case Diagram
[Rest of the content remains unchanged]

#### 6.2.6 Activity Diagram

##### 6.2.6.1 Appointment Flow
[Previous appointment flow diagram remains unchanged]

##### 6.2.6.2 AI Service Integration Flow
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AI Service Integration Flow                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐                                                       │
│  │   Start     │                                                       │
│  └──────┬──────┘                                                       │
│         │                                                              │
│         ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    User Input                                   │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Text       │  │  Language   │  │  Audio      │  │  Video  │ │   │
│  │  │  Input      │  │  Selection  │  │  Input      │  │  Input  │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Service Selection                             │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │ Translation │  │ Summarization│  │ Text-to-    │  │ Content │ │   │
│  │  │ Service     │  │ Service      │  │ Speech      │  │ Recomm. │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Processing                                   │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │ Language    │  │ Content     │  │ Audio       │  │ Video   │ │   │
│  │  │ Detection   │  │ Analysis    │  │ Generation  │  │ Analysis│ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Result Delivery                              │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │ Translated  │  │ Summarized  │  │ Audio       │  │ Video   │ │   │
│  │  │ Text        │  │ Content     │  │ Output      │  │ List    │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    User Feedback                                │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │ Accuracy    │  │ Quality     │  │ Speed       │  │ Overall │ │   │
│  │  │ Rating      │  │ Assessment  │  │ Evaluation  │  │ Rating  │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    End                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

This activity diagram shows the complete flow of AI service integration in the system, including:
1. User input options (text, language, audio, video)
2. Service selection (translation, summarization, text-to-speech, content recommendation)
3. Processing steps for each service
4. Result delivery methods
5. User feedback collection

The diagram demonstrates how different AI services are integrated into the system and how they interact with user inputs and deliver results.

## 7. Testing

### 7.1 Testing Strategy
The Rural GenAI Wellbeing Project implements a comprehensive testing strategy to ensure reliability, functionality, and user experience. The testing approach includes multiple levels of testing to validate different aspects of the application.

#### 7.1.1 Types of Testing

1. **Unit Testing**
   - Component-level testing
   - Service function testing
   - Utility function testing
   - Mock database operations testing

2. **Integration Testing**
   - API service integration
   - Component interaction testing
   - State management testing
   - Authentication flow testing

3. **End-to-End Testing**
   - User flow testing
   - Cross-browser testing
   - Responsive design testing
   - Performance testing

### 7.2 Test Cases

#### 7.2.1 Authentication Test Cases

| Test ID | Test Case | Precondition | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|--------------|------------|-----------------|---------------|--------|
| AUTH-001 | Valid Login | User exists in system | 1. Enter valid username<br>2. Enter valid password<br>3. Click login | User successfully logs in and redirected to dashboard | | |
| AUTH-002 | Invalid Login | User exists in system | 1. Enter invalid username<br>2. Enter invalid password<br>3. Click login | Error message displayed | | |
| AUTH-003 | Role-based Access | User logged in | 1. Access different role pages<br>2. Check permissions | User can only access authorized pages | | |
| AUTH-004 | Session Management | User logged in | 1. Close browser<br>2. Reopen browser<br>3. Access application | Session maintained or redirected to login | | |

#### 7.2.2 Dashboard Test Cases

| Test ID | Test Case | Precondition | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|--------------|------------|-----------------|---------------|--------|
| DASH-001 | Dashboard Load | User logged in | 1. Access dashboard<br>2. Check all components | All dashboard components load correctly | | |
| DASH-002 | Data Visualization | Data available | 1. Check charts<br>2. Verify data accuracy | Charts display correct data | | |
| DASH-003 | Real-time Updates | Dashboard open | 1. Make changes in another session<br>2. Check updates | Changes reflect immediately | | |
| DASH-004 | Responsive Layout | Dashboard open | 1. Test different screen sizes<br>2. Check component alignment | Layout adapts correctly | | |

#### 7.2.3 Map Integration Test Cases

| Test ID | Test Case | Precondition | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|--------------|------------|-----------------|---------------|--------|
| MAP-001 | Location Services | Location permission granted | 1. Enable location<br>2. Check user position | User location displayed correctly | | |
| MAP-002 | Marker Placement | Map loaded | 1. Add new marker<br>2. Verify position | Marker placed at correct location | | |
| MAP-003 | Distance Calculation | Two points selected | 1. Select start point<br>2. Select end point | Distance calculated correctly | | |
| MAP-004 | User Tracking | Location enabled | 1. Move device<br>2. Check position update | Position updates in real-time | | |

#### 7.2.4 AI Services Test Cases

| Test ID | Test Case | Precondition | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|--------------|------------|-----------------|---------------|--------|
| AI-001 | Translation | Text input available | 1. Enter text<br>2. Select target language<br>3. Translate | Text translated accurately | | |
| AI-002 | Text Summarization | Long text available | 1. Input text<br>2. Request summary | Concise summary generated | | |
| AI-003 | Text-to-Speech | Text available | 1. Input text<br>2. Convert to speech | Clear audio output generated | | |
| AI-004 | Video Recommendations | User profile available | 1. Check recommendations<br>2. Verify relevance | Relevant videos suggested | | |

#### 7.2.5 Communication Test Cases

| Test ID | Test Case | Precondition | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|--------------|------------|-----------------|---------------|--------|
| COMM-001 | Message Sending | Users logged in | 1. Compose message<br>2. Send to recipient | Message delivered successfully | | |
| COMM-002 | Appointment Scheduling | Calendar available | 1. Select date/time<br>2. Confirm appointment | Appointment scheduled correctly | | |
| COMM-003 | Notification System | System active | 1. Trigger notification<br>2. Check delivery | Notification received by user | | |
| COMM-004 | Real-time Updates | Chat active | 1. Send message<br>2. Check recipient view | Message appears immediately | | |

#### 7.2.6 Performance Test Cases

| Test ID | Test Case | Precondition | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|--------------|------------|-----------------|---------------|--------|
| PERF-001 | Load Testing | System ready | 1. Simulate 100 users<br>2. Monitor response time | Response time < 2 seconds | | |
| PERF-002 | Stress Testing | System ready | 1. Simulate 1000 users<br>2. Monitor system behavior | System handles load gracefully | | |
| PERF-003 | Database Performance | Database active | 1. Execute complex queries<br>2. Monitor execution time | Query execution < 1 second | | |
| PERF-004 | Memory Usage | Application running | 1. Monitor memory consumption<br>2. Check for leaks | Memory usage within limits | | |

#### 7.2.7 Security Test Cases

| Test ID | Test Case | Precondition | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|--------------|------------|-----------------|---------------|--------|
| SEC-001 | Password Encryption | User registration | 1. Create new user<br>2. Check password storage | Password stored encrypted | | |
| SEC-002 | Session Management | User logged in | 1. Check session token<br>2. Verify expiration | Token expires correctly | | |
| SEC-003 | API Security | API endpoints available | 1. Test unauthorized access<br>2. Verify protection | Access denied for unauthorized requests | | |
| SEC-004 | Data Validation | Input forms available | 1. Enter invalid data<br>2. Submit form | Input validation errors shown | | |

### 7.3 Test Environment
- **Development Environment**
  - Local development setup
  - Mock database integration
  - Development API endpoints
  - Debug tools and logging

- **Testing Environment**
  - Staging server setup
  - Test database
  - Test API endpoints
  - Performance monitoring

### 7.4 Test Automation
1. **Automated Testing Tools**
   - Jest for unit testing
   - React Testing Library for component testing
   - Cypress for E2E testing
   - GitHub Actions for CI/CD

2. **Test Coverage**
   - Component coverage
   - Function coverage
   - Branch coverage
   - Statement coverage

### 7.5 Performance Testing
1. **Load Testing**
   - Concurrent user simulation
   - API response time testing
   - Database performance testing
   - Memory usage monitoring

2. **Stress Testing**
   - Maximum user capacity testing
   - Resource utilization testing
   - Error handling under load
   - Recovery testing

### 7.6 Security Testing
1. **Authentication Security**
   - Password encryption
   - Session management
   - Token validation
   - Role-based access control

2. **Data Security**
   - Data encryption
   - Secure storage
   - API security
   - Input validation

### 7.7 Test Documentation
1. **Test Plans**
   - Test objectives
   - Test scope
   - Test schedule
   - Resource allocation

2. **Test Reports**
   - Test results
   - Bug reports
   - Performance metrics
   - Coverage reports

### 7.8 Continuous Testing
1. **CI/CD Integration**
   - Automated test execution
   - Build verification
   - Deployment testing
   - Regression testing

2. **Quality Gates**
   - Code coverage requirements
   - Performance benchmarks
   - Security compliance
   - Accessibility standards

## 8. Implementation

### 8.1 Technology Stack
The Rural GenAI Wellbeing Project is implemented using modern web technologies:

1. **Frontend Framework**
   - React with TypeScript
   - Vite as build tool
   - Tailwind CSS for styling
   - React Router for navigation
   - React Query for data fetching

2. **State Management**
   - React Context API
   - Local Storage for persistence
   - React Hooks for component state

3. **UI Components**
   - Custom UI components
   - Responsive design
   - Bilingual support (Tamil/English)
   - Interactive maps
   - Data visualizations

### 8.2 Core Components Implementation

#### 8.2.1 Authentication System
```typescript
// Role-based authentication
interface User {
  id: string;
  username: string;
  role: 'coordinator' | 'health_sakhi' | 'customer' | 'lab';
  linkedId: string;
}

// Role-based routing
const getDashboardRoute = (role: string) => {
  switch (role) {
    case 'coordinator': return '/dashboard/coordinator';
    case 'health_sakhi': return '/dashboard/sakhi';
    case 'customer': return '/dashboard/customer';
    case 'lab': return '/dashboard/lab';
    default: return '/dashboard';
  }
};
```

#### 8.2.2 Dashboard Implementation
Each role has a specialized dashboard with role-specific features:

1. **Coordinator Dashboard**
   - Health Sakhi monitoring
   - Coverage analysis
   - Underserved zone tracking
   - Monthly growth visualization

2. **Health Sakhi Dashboard**
   - Customer management
   - Appointment tracking
   - Lab coordination
   - AI-powered features

3. **Customer Dashboard**
   - Health Sakhi connection
   - Lab access
   - Appointment management
   - Message system

4. **Lab Dashboard**
   - Customer tracking
   - Service management
   - Health Sakhi coordination
   - Test result management

### 8.3 Key Features Implementation

#### 8.3.1 Map Integration
```typescript
// Map marker types
interface MapMarker {
  id: string;
  type: 'coordinator' | 'health_sakhi' | 'customer' | 'lab';
  latitude: number;
  longitude: number;
  title: string;
  info: string;
}

// Distance calculation
const calculateDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Implementation of Haversine formula
};
```

#### 8.3.2 AI Services
```typescript
// Mock AI service implementations
const translateText = async (text: string, targetLanguage: 'tamil' | 'english') => {
  // Translation implementation
};

const summarizeText = async (text: string) => {
  // Text summarization implementation
};

const textToSpeech = async (text: string, language: 'tamil' | 'english') => {
  // Text-to-speech implementation
};
```

#### 8.3.3 Data Management
```typescript
// Mock database structure
interface Database {
  users: User[];
  coordinators: Coordinator[];
  healthSakhis: HealthSakhi[];
  customers: Customer[];
  labs: Lab[];
  appointments: Appointment[];
  messages: Message[];
}

// Data generation
const generateUsers = (): User[] => {
  // Implementation of user data generation
};
```

### 8.4 User Interface Implementation

#### 8.4.1 Component Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── dashboard/    # Role-specific dashboards
│   ├── map/         # Map-related components
│   └── ai/          # AI feature components
├── contexts/        # React contexts
├── lib/            # Utility functions
└── pages/          # Page components
```

#### 8.4.2 Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Flexible grid system
- Adaptive components

### 8.5 Error Handling
```typescript
// Error boundary implementation
const ErrorBoundary: React.FC = ({ children }) => {
  // Error boundary implementation
};

// Toast notifications
const useToast = () => {
  // Toast implementation
};
```

### 8.6 Performance Optimizations

1. **Code Splitting**
   - Route-based code splitting
   - Lazy loading of components
   - Dynamic imports

2. **Memoization**
   - React.memo for components
   - useMemo for computations
   - useCallback for functions

3. **Data Caching**
   - React Query for data caching
   - Local storage for persistence
   - Optimistic updates

### 8.7 Security Implementation

1. **Authentication**
   - Role-based access control
   - Session management
   - Secure routing

2. **Data Protection**
   - Input validation
   - XSS prevention
   - CSRF protection

### 8.8 Testing Implementation

1. **Unit Tests**
   - Component testing
   - Utility function testing
   - Service testing

2. **Integration Tests**
   - User flow testing
   - API integration testing
   - State management testing

### 8.9 Deployment

1. **Build Process**
   - Vite build configuration
   - Environment variables
   - Asset optimization

2. **Deployment Pipeline**
   - GitHub Actions
   - Automated testing
   - Continuous deployment

### 8.10 Future Implementation Plans

1. **Backend Integration**
   - Replace mock database with real backend
   - Implement real-time updates
   - Add offline capabilities

2. **AI Integration**
   - Implement real AI services
   - Add more AI features
   - Improve accuracy

3. **Mobile App**
   - Progressive Web App
   - Native mobile app
   - Offline-first approach

## 9. Conclusion and Future Enhancement
[To be filled with conclusion and future scope]

## 10. Bibliography
[To be filled with references]

## 11. APPENDICES A-Table Structure

### Introduction
This appendix details the logical structure of the data models used in the Rural GenAI Wellbeing Project. The system uses TypeScript interfaces to simulate a backend database, providing type safety and clear data structure definitions. These interfaces define the relationships between different entities in the system and serve as the foundation for the mock database implementation.

### Table/Interface Definitions

#### 1. User Interface
```typescript
interface User {
  id: string;              // Primary Key
  username: string;        // Unique identifier for login
  password: string;        // Hashed password (mock implementation)
  role: 'coordinator' | 'health_sakhi' | 'customer' | 'lab';  // User role
  linkedId: string;        // Foreign Key to role-specific table
  name: string;           // Display name
  profilePic?: string;    // Optional profile picture URL
  languages: ('tamil' | 'english')[];  // Supported languages
  createdAt: string;      // Account creation timestamp
}
```

#### 2. Coordinator Interface
```typescript
interface Coordinator {
  id: string;             // Primary Key
  name: string;           // Coordinator's name
  latitude: number;       // Location coordinates
  longitude: number;      // Location coordinates
  district: string;       // Assigned district
  linkedHealthSakhis: string[];  // Foreign Keys to HealthSakhi
  contactNumber: string;  // Contact information
  email: string;         // Email address
}
```

#### 3. HealthSakhi Interface
```typescript
interface HealthSakhi {
  id: string;             // Primary Key
  name: string;           // Health Sakhi's name
  village: string;        // Assigned village
  latitude: number;       // Location coordinates
  longitude: number;      // Location coordinates
  specializations: string[];  // Areas of expertise
  linkedLab: string;      // Foreign Key to Lab
  linkedCoordinator: string;  // Foreign Key to Coordinator
}
```

#### 4. Customer Interface
```typescript
interface Customer {
  id: string;             // Primary Key
  name: string;           // Customer's name
  age: number;            // Age
  gender: string;         // Gender
  village: string;        // Village of residence
  latitude: number;       // Location coordinates
  longitude: number;      // Location coordinates
  linkedHealthSakhi: string;  // Foreign Key to HealthSakhi
  linkedLab: string;      // Foreign Key to Lab
  services: string[];     // Required services
  contactNumber: string;  // Contact information
  medicalHistory: MedicalRecord[];  // Medical records
  appointments: Appointment[];  // Appointments
}
```

#### 5. Lab Interface
```typescript
interface Lab {
  id: string;             // Primary Key
  name: string;           // Lab name
  latitude: number;       // Location coordinates
  longitude: number;      // Location coordinates
  address: string;        // Physical address
  contactNumber: string;  // Contact information
  services: string[];     // Available services
  workingHours: string;   // Operating hours
  workingDays: string[];  // Operating days
  linkedHealthSakhi: string;  // Foreign Key to HealthSakhi
}
```

#### 6. MedicalRecord Interface
```typescript
interface MedicalRecord {
  id: string;             // Primary Key
  date: string;           // Record date
  symptoms: string[];     // Reported symptoms
  diagnosis: string;      // Medical diagnosis
  prescriptions: string[];  // Prescribed medications
  labTests: LabTest[];    // Related lab tests
  customerId: string;     // Foreign Key to Customer
}
```

#### 7. LabTest Interface
```typescript
interface LabTest {
  id: string;             // Primary Key
  labId: string;          // Foreign Key to Lab
  testName: string;       // Name of the test
  date: string;           // Test date
  results?: string;       // Test results
  status: 'scheduled' | 'completed' | 'cancelled';  // Test status
}
```

#### 8. Appointment Interface
```typescript
interface Appointment {
  id: string;             // Primary Key
  customerId: string;     // Foreign Key to Customer
  customerName: string;   // Customer's name
  healthSakhiId: string;  // Foreign Key to HealthSakhi
  healthSakhiName: string;  // Health Sakhi's name
  testName: string;       // Name of the test
  date: string;           // Appointment date
  status: 'pending' | 'completed' | 'cancelled';  // Appointment status
  results?: string;       // Test results if completed
}
```

#### 9. Message Interface
```typescript
interface Message {
  id: string;             // Primary Key
  fromId: string;         // Sender ID
  fromName: string;       // Sender name
  fromType: string;       // Sender type (role)
  toId: string;           // Recipient ID
  toName: string;         // Recipient name
  toType: string;         // Recipient type (role)
  subject: string;        // Message subject
  content: string;        // Message content
  type: string;           // Message type
  appointmentId?: string; // Related appointment (optional)
  date: string;           // Message date
  status: 'read' | 'unread';  // Message status
}
```

### Entity-Relationship Diagram
```
[User] 1:1 [Coordinator]
   |         |
   |         | 1:N
   |         v
   |    [HealthSakhi]
   |         |
   |         | 1:N
   |         v
   |      [Customer]
   |         |
   |         | 1:N
   |         v
   |    [Appointment]
   |         |
   |         | 1:1
   |         v
   |     [LabTest]
   |
   | 1:1 [Lab]
   |     |
   |     | 1:N
   |     v
   |  [Message]
   |
   | 1:N [MedicalRecord]
```

### Mock Data Statistics
- 8 Coordinators
- 20 Health Sakhis
- 50 Customers
- 15 Labs
- Multiple appointments and messages per user
- Medical records linked to customers
- Lab tests linked to appointments

### Data Relationships
1. **One-to-One Relationships**
   - User to Coordinator
   - User to HealthSakhi
   - User to Customer
   - User to Lab
   - Appointment to LabTest

2. **One-to-Many Relationships**
   - Coordinator to HealthSakhis
   - HealthSakhi to Customers
   - Customer to Appointments
   - Customer to MedicalRecords
   - Lab to Messages

3. **Many-to-Many Relationships**
   - HealthSakhis to Labs (through linkedLab)
   - Customers to Labs (through appointments)

### Mock Data Generation Process

The mock data generation follows a hierarchical approach, where entities are created in a specific order to maintain proper relationships:

1. **Base Data Generation**
   ```typescript
   // Base coordinates for Dharmapuri district
   const baseLatitude = 12.1277;
   const baseLongitude = 78.1579;
   ```

2. **Generation Order**
   ```
   Coordinators → Health Sakhis → Labs → Customers → Medical Records → Appointments → Messages
   ```

3. **Detailed Generation Process**

   a. **Coordinators (8 total)**
   - Generated with random coordinates within 20km of Dharmapuri
   - Each assigned to Dharmapuri district
   - Given unique contact numbers and email addresses
   ```typescript
   function generateCoordinators(): Coordinator[] {
     const coordinators: Coordinator[] = [];
     for (let i = 0; i < 8; i++) {
       const { latitude, longitude } = generateRandomCoordinates(baseLatitude, baseLongitude, 20);
       coordinators.push({
         id: `coor-${i + 1}`,
         name: `Coordinator ${i + 1}`,
         latitude,
         longitude,
         district: 'Dharmapuri',
         linkedHealthSakhis: [],
         contactNumber: `+91 9${Math.floor(Math.random() * 1000000000)}`,
         email: `coordinator${i+1}@wellnet.org`
       });
     }
     return coordinators;
   }
   ```

   b. **Health Sakhis (20 total)**
   - 3-6 Health Sakhis assigned to each Coordinator
   - Located within 20km of their Coordinator
   - Assigned random specializations from predefined list
   ```typescript
   function generateHealthSakhis(coordinators: Coordinator[]): HealthSakhi[] {
     const healthSakhis: HealthSakhi[] = [];
     coordinators.forEach((coordinator) => {
       const numHealthSakhis = 3 + Math.floor(Math.random() * 4);
       for (let i = 0; i < numHealthSakhis; i++) {
         const { latitude, longitude } = generateRandomCoordinates(
           coordinator.latitude,
           coordinator.longitude,
           20
         );
         // ... create health sakhi with random specializations
       }
     });
     return healthSakhis;
   }
   ```

   c. **Labs (15 total)**
   - Located within 30km of Dharmapuri
   - Assigned random services from predefined list
   - Given working hours and days
   ```typescript
   function generateLabs(): Lab[] {
     const labs: Lab[] = [];
     for (let i = 0; i < 15; i++) {
       const { latitude, longitude } = generateRandomCoordinates(baseLatitude, baseLongitude, 30);
       // ... create lab with random services and working hours
     }
     return labs;
   }
   ```

   d. **Customers (50 total)**
   - Located within 30km of Dharmapuri
   - Assigned to nearest Health Sakhi within 10km
   - Given random age, gender, and contact information
   ```typescript
   function generateCustomers(healthSakhis: HealthSakhi[], labs: Lab[]): Customer[] {
     const customers: Customer[] = [];
     for (let i = 0; i < 50; i++) {
       const { latitude, longitude } = generateRandomCoordinates(baseLatitude, baseLongitude, 30);
       // Find nearest health sakhi and assign
       // ... create customer with random attributes
     }
     return customers;
   }
   ```

   e. **Medical Records**
   - 0-2 records per customer
   - Random symptoms, diagnosis, and prescriptions
   ```typescript
   function generateMedicalRecords(customerId: string, labs: Lab[]): MedicalRecord[] {
     const records: MedicalRecord[] = [];
     const numRecords = Math.floor(Math.random() * 3);
     // ... create records with random medical data
     return records;
   }
   ```

### Entity-Relationship Diagram (ERD)

```
┌─────────────┐       ┌───────────────┐       ┌─────────────┐
│    User     │       │  Coordinator  │       │ HealthSakhi │
├─────────────┤       ├───────────────┤       ├─────────────┤
│ PK: id      │       │ PK: id        │       │ PK: id      │
│ username    │       │ name          │       │ name        │
│ password    │       │ latitude      │       │ village     │
│ role        │       │ longitude     │       │ latitude    │
│ linkedId    │       │ district      │       │ longitude   │
│ name        │       │ contactNumber │       │ specializ.  │
│ profilePic  │       │ email         │       │ linkedLab   │
│ languages   │       │ linkedHS[]    │       │ linkedCoord │
│ createdAt   │       └───────┬───────┘       └──────┬──────┘
└──────┬──────┘               │                      │
       │                      │                      │
       │                      │                      │
       │                      ▼                      ▼
       │              ┌───────────────┐      ┌─────────────┐
       │              │   Customer    │      │     Lab     │
       │              ├───────────────┤      ├─────────────┤
       │              │ PK: id        │      │ PK: id      │
       │              │ name          │      │ name        │
       │              │ age           │      │ latitude    │
       │              │ gender        │      │ longitude   │
       │              │ village       │      │ address     │
       │              │ latitude      │      │ contactNum  │
       │              │ longitude     │      │ services[]  │
       │              │ linkedHS      │      │ workHours   │
       │              │ linkedLab     │      │ workDays[]  │
       │              │ services[]    │      │ linkedHS    │
       │              │ contactNumber │      └──────┬──────┘
       │              │ medicalHist[] │             │
       │              │ appointments[]│             │
       │              └───────┬───────┘             │
       │                      │                     │
       │                      ▼                     ▼
       │              ┌───────────────┐     ┌─────────────┐
       │              │  Appointment  │     │  Message    │
       │              ├───────────────┤     ├─────────────┤
       │              │ PK: id        │     │ PK: id      │
       │              │ customerId    │     │ fromId      │
       │              │ customerName  │     │ fromName    │
       │              │ healthSakhiId │     │ fromType    │
       │              │ healthSakhiName│    │ toId        │
       │              │ testName      │     │ toName      │
       │              │ date          │     │ toType      │
       │              │ status        │     │ subject     │
       │              │ results       │     │ content     │
       │              └───────────────┘     │ type        │
       │                                    │ appointmentId│
       │                                    │ date        │
       │                                    │ status      │
       │                                    └─────────────┘
       │
       ▼
┌───────────────┐
│ MedicalRecord │
├───────────────┤
│ PK: id        │
│ date          │
│ symptoms[]    │
│ diagnosis     │
│ prescriptions[]│
│ labTests[]    │
│ customerId    │
└───────────────┘

Legend:
PK: Primary Key
FK: Foreign Key
[]: Array/List
```

### Relationship Cardinality

1. **One-to-One Relationships**
   - User ↔ Coordinator
   - User ↔ HealthSakhi
   - User ↔ Customer
   - User ↔ Lab
   - Appointment ↔ LabTest

2. **One-to-Many Relationships**
   - Coordinator → HealthSakhis (1:3-6)
   - HealthSakhi → Customers (1:many)
   - Customer → MedicalRecords (1:0-2)
   - Customer → Appointments (1:many)
   - Lab → Messages (1:many)

3. **Many-to-Many Relationships**
   - HealthSakhis ↔ Labs (through linkedLab)
   - Customers ↔ Labs (through appointments)

### Data Distribution

1. **Geographic Distribution**
   - Coordinators: Within 20km of Dharmapuri
   - Health Sakhis: Within 20km of their Coordinator
   - Labs: Within 30km of Dharmapuri
   - Customers: Within 30km of Dharmapuri

2. **Role Distribution**
   - 8 Coordinators
   - 20 Health Sakhis
   - 50 Customers
   - 15 Labs

3. **Language Distribution**
   - Coordinators: Bilingual (Tamil/English)
   - Health Sakhis: 33% Tamil only, 67% Bilingual
   - Customers: 75% Tamil only, 25% English only
   - Labs: Bilingual (Tamil/English)

## 12. APPENDICES B-Screenshots
[To be filled with application screenshots]

## 13. APPENDICES C-Sample Report of test cases
[To be filled with test cases]

## 14. Supporting Information
[To be filled with additional information]

## 15. Diagrams

### 15.1 System Architecture Diagrams

#### 15.1.1 High-Level System Architecture
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Rural GenAI Wellbeing System                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Client Layer                               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │   Web       │  │  Mobile     │  │  Tablet     │  │  Other  │ │   │
│  │  │  Browser    │  │   App       │  │   App       │  │ Clients │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Application Layer                            │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  React      │  │  Context    │  │  Services   │  │  Utils  │ │   │
│  │  │ Components  │  │ Providers   │  │   Layer     │  │         │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Service Layer                                │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Auth       │  │  Map        │  │    AI       │  │ Storage │ │   │
│  │  │ Services    │  │ Services    │  │  Services   │  │ Services│ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Data Layer                                   │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Mock       │  │  Local      │  │  External   │  │  Cache  │ │   │
│  │  │ Database    │  │ Storage     │  │  Services   │  │         │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Explanation:**
This diagram shows the four main layers of the system:
1. Client Layer: Different types of client applications
2. Application Layer: Core application components
3. Service Layer: Various service providers
4. Data Layer: Data storage and management

#### 15.1.2 Component Hierarchy
[Previous component hierarchy diagram with explanation]

### 15.2 Data Flow Diagrams (DFD)

#### 15.2.1 Level 0 DFD (Context Diagram)
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Flow Diagram (Level 0)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐                                                       │
│  │   User      │                                                       │
│  │  (External) │                                                       │
│  └──────┬──────┘                                                       │
│         │                                                              │
│         │  User Input                                                  │
│         ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Wellnet System                               │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  User       │  │  Data       │  │  Process    │  │  Output │ │   │
│  │  │  Interface  │──►│  Processing│──►│  Logic      │──►│ Display │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │   │
│  │         ▲                ▲                ▲               │      │   │
│  │         │                │                │               │      │   │
│  │         └────────────────┼────────────────┘               │      │   │
│  └─────────────────────────┼─────────────────────────────────┘      │   │
│                            │                                        │   │
│                            ▼                                        │   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │   │
│  │  External   │    │  External   │    │  External   │             │   │
│  │   Maps      │    │    AI       │    │  Storage    │             │   │
│  │  Services   │    │  Services   │    │  Services   │             │   │
│  └─────────────┘    └─────────────┘    └─────────────┘             │   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 15.2.2 Level 1 DFD
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Flow Diagram (Level 1)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐  │
│  │   User      │    │  Health     │    │    Lab      │    │   AI    │  │
│  │  (External) │    │   Sakhi     │    │  (External) │    │ Service │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘  │
│         │                  │                   │                │       │
│         ▼                  ▼                   ▼                ▼       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Wellnet System                               │   │
│  │                                                                  │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │   │
│  │  │  User       │    │  Data       │    │  Process    │         │   │
│  │  │ Management  │───►│  Processing │───►│  Logic      │         │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘         │   │
│  │         ▲                  ▲                  ▲                 │   │
│  │         │                  │                  │                 │   │
│  │         └──────────────────┼──────────────────┘                 │   │
│  │                            │                                    │   │
│  │                            ▼                                    │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │   │
│  │  │  Output     │    │  External   │    │  Data       │         │   │
│  │  │ Generation  │◄───┤  Services   │◄───┤  Storage    │         │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Explanation:**
The Level 1 DFD shows:
1. External entities interacting with the system
2. Main processes within the system
3. Data flows between processes
4. Data storage and external service interactions

### 15.3 Sequence Diagrams

#### 15.3.1 Authentication/Login Process
```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐
│  User   │    │  Auth       │    │  Mock       │    │  Context    │    │ Storage │
│(Any Role)│    │ Provider    │    │ Database    │    │ Provider    │    │ Service │
└────┬────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘
     │                │                   │                   │                │
     │──Enter Credentials─►               │                   │                │
     │                │                   │                   │                │
     │                │──Validate Input──►│                   │                │
     │                │                   │                   │                │
     │                │◄──Input Valid─────│                   │                │
     │                │                   │                   │                │
     │                │──Check User──────►│                   │                │
     │                │                   │                   │                │
     │                │◄──User Found──────│                   │                │
     │                │                   │                   │                │
     │                │──Verify Password──►│                   │                │
     │                │                   │                   │                │
     │                │◄──Password Valid──│                   │                │
     │                │                   │                   │                │
     │                │──Get User Role────►│                   │                │
     │                │                   │                   │                │
     │                │◄──Role Info───────│                   │                │
     │                │                   │                   │                │
     │                │──Update Context──►│                   │                │
     │                │                   │                   │                │
     │                │                   │──Store Session───►│                │
     │                │                   │                   │                │
     │                │                   │◄──Session Stored──│                │
     │                │                   │                   │                │
     │                │◄──Context Updated─│                   │                │
     │                │                   │                   │                │
     │◄──Login Success                    │                   │                │
     │                │                   │                   │                │
     │──Role-specific Redirect            │                   │                │
     │                │                   │                   │                │
     │                │                   │                   │                │
     │  ┌─────────────────────────────────────────────────────────┐          │
     │  │                    Role-specific Flows                   │          │
     │  │                                                         │          │
     │  │  Coordinator ──► Coordinator Dashboard                   │          │
     │  │  Health Sakhi ──► Health Sakhi Dashboard                │          │
     │  │  Customer ──────► Customer Dashboard                    │          │
     │  │  Lab ──────────► Lab Dashboard                          │          │
     │  └─────────────────────────────────────────────────────────┘          │
     │                │                   │                   │                │
```

**Explanation:**
This sequence diagram shows the complete authentication process:
1. User enters credentials
2. Input validation
3. User verification
4. Password verification
5. Role determination
6. Context update
7. Session storage
8. Role-specific redirection

#### 15.3.2 Appointment Scheduling
```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐
│ Customer│    │  Health     │    │    Lab      │    │  System     │    │   AI    │
│         │    │   Sakhi     │    │             │    │             │    │ Service │
└────┬────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘
     │                │                   │                   │                │
     │──Request Appt──►                   │                   │                │
     │                │                   │                   │                │
     │                │──Check Schedule──►│                   │                │
     │                │                   │                   │                │
     │                │◄──Available Slots─│                   │                │
     │                │                   │                   │                │
     │                │──Suggest Time────►│                   │                │
     │                │                   │                   │                │
     │◄──Time Options──                   │                   │                │
     │                │                   │                   │                │
     │──Select Time──►│                   │                   │                │
     │                │                   │                   │                │
     │                │──Confirm Appt────►│                   │                │
     │                │                   │                   │                │
     │                │                   │──Update DB───────►│                │
     │                │                   │                   │                │
     │                │                   │──Translate───────►│                │
     │                │                   │                   │                │
     │                │                   │◄──Translation────│                │
     │                │                   │                   │                │
     │                │◄──Confirmation────│                   │                │
     │                │                   │                   │                │
     │◄──Appt Confirmed                   │                   │                │
     │                │                   │                   │                │
```

**Explanation:**
This sequence diagram shows the appointment scheduling process:
1. Customer requests appointment
2. Health Sakhi checks lab schedule
3. Available slots are returned
4. Time options are suggested
5. Customer selects time
6. Appointment is confirmed
7. Database is updated
8. Translation service is used
9. Confirmation is sent

#### 15.3.3 Lab Test Process
```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐
│ Customer│    │  Health     │    │    Lab      │    │  System     │    │   AI    │
│         │    │   Sakhi     │    │             │    │             │    │ Service │
└────┬────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘
     │                │                   │                   │                │
     │──Request Test──►                   │                   │                │
     │                │                   │                   │                │
     │                │──Check Lab───────►│                   │                │
     │                │                   │                   │                │
     │                │◄──Lab Available───│                   │                │
     │                │                   │                   │                │
     │                │──Schedule Test────►│                   │                │
     │                │                   │                   │                │
     │                │                   │──Update DB───────►│                │
     │                │                   │                   │                │
     │                │                   │──Translate───────►│                │
     │                │                   │                   │                │
     │                │                   │◄──Translation────│                │
     │                │                   │                   │                │
     │                │◄──Test Scheduled──│                   │                │
     │                │                   │                   │                │
     │◄──Confirmation                     │                   │                │
     │                │                   │                   │                │
     │                │                   │──Send Reminder────►│                │
     │                │                   │                   │                │
     │◄──Reminder                         │                   │                │
     │                │                   │                   │                │
```

**Explanation:**
This sequence diagram shows the lab test process:
1. Customer requests test
2. Health Sakhi checks lab availability
3. Test is scheduled
4. Database is updated
5. Translation service is used
6. Confirmation is sent
7. Reminder is scheduled

#### 15.3.4 Message Communication
```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐
│ Sender  │    │  System     │    │  Database   │    │  Context    │    │ Storage │
│         │    │             │    │             │    │ Provider    │    │ Service │
└────┬────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └────┬────┘
     │                │                   │                   │                │
     │──Compose Msg──►│                   │                   │                │
     │                │                   │                   │                │
     │                │──Validate Msg────►│                   │                │
     │                │                   │                   │                │
     │                │◄──Msg Valid───────│                   │                │
     │                │                   │                   │                │
     │                │──Store Msg───────►│                   │                │
     │                │                   │                   │                │
     │                │                   │──Update Context──►│                │
     │                │                   │                   │                │
     │                │                   │◄──Context Updated─│                │
     │                │                   │                   │                │
     │                │──Send Notification►│                   │                │
     │                │                   │                   │                │
     │                │◄──Notification Sent│                   │                │
     │                │                   │                   │                │
     │◄──Msg Sent                         │                   │                │
     │                │                   │                   │                │
     │                │                   │──Update Status────►│                │
     │                │                   │                   │                │
     │                │                   │◄──Status Updated──│                │
     │                │                   │                   │                │
```

**Explanation:**
This sequence diagram shows the message communication process:
1. Sender composes message
2. System validates message
3. Message is stored in database
4. Context is updated
5. Notification is sent
6. Message status is updated
7. Confirmation is sent to sender

Each sequence diagram shows the interaction between different components of the system and the flow of data between them. The diagrams help in understanding the timing and sequence of operations in various processes.

### 15.4 Activity Diagrams

#### 15.4.1 Appointment Flow
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Appointment Flow                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐                                                       │
│  │   Start     │                                                       │
│  └──────┬──────┘                                                       │
│         │                                                              │
│         ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Customer Request                             │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Select     │  │  Choose     │  │  Specify    │  │  Submit │ │   │
│  │  │  Service    │  │  Date       │  │  Time       │  │ Request │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Health Sakhi Processing                      │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Review     │  │  Check      │  │  Verify     │  │  Update │ │   │
│  │  │  Request    │  │  Schedule   │  │  Availability│  │ Schedule│ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Lab Confirmation                             │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Receive    │  │  Confirm    │  │  Update     │  │  Send   │ │   │
│  │  │  Request    │  │  Schedule   │  │  Database   │  │  Response│ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Customer Notification                         │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Generate   │  │  Translate  │  │  Send       │  │  Update │ │   │
│  │  │  Message    │  │  Message    │  │  Notification│  │  Status  │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    End                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 15.4.2 AI Service Integration Flow
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AI Service Integration Flow                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐                                                       │
│  │   Start     │                                                       │
│  └──────┬──────┘                                                       │
│         │                                                              │
│         ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    User Input                                   │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Text       │  │  Language   │  │  Audio      │  │  Video  │ │   │
│  │  │  Input      │  │  Selection  │  │  Input      │  │  Input  │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Service Selection                             │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │ Translation │  │ Summarization│  │ Text-to-    │  │ Content │ │   │
│  │  │ Service     │  │ Service      │  │ Speech      │  │ Recomm. │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Processing                                   │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │ Language    │  │ Content     │  │ Audio       │  │ Video   │ │   │
│  │  │ Detection   │  │ Analysis    │  │ Generation  │  │ Analysis│ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Result Delivery                              │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │ Translated  │  │ Summarized  │  │ Audio       │  │ Video   │ │   │
│  │  │ Text        │  │ Content     │  │ Output      │  │ List    │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    User Feedback                                │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │ Accuracy    │  │ Quality     │  │ Speed       │  │ Overall │ │   │
│  │  │ Rating      │  │ Assessment  │  │ Evaluation  │  │ Rating  │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    End                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 15.4.3 Health Sakhi Assignment Flow
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Health Sakhi Assignment Flow                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐                                                       │
│  │   Start     │                                                       │
│  └──────┬──────┘                                                       │
│         │                                                              │
│         ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Customer Registration                         │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Enter      │  │  Verify     │  │  Validate   │  │  Store  │ │   │
│  │  │  Details    │  │  Location   │  │  Data       │  │  Data   │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Health Sakhi Search                          │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Find       │  │  Check      │  │  Calculate  │  │  Rank   │ │   │
│  │  │  Nearby     │  │  Availability│  │  Distance   │  │  Sakhis │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Assignment Process                           │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Select     │  │  Update     │  │  Generate   │  │  Send   │ │   │
│  │  │  Sakhi      │  │  Database   │  │  Notification│  │  Alert  │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Confirmation                                 │   │
│  │                                                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │  Verify     │  │  Update     │  │  Send       │  │  Record │ │   │
│  │  │  Assignment │  │  Status     │  │  Confirmation│  │  Update │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │   │
│  └─────────┼────────────────┼────────────────┼───────────────┼─────┘   │
│            │                │                │               │         │
│            ▼                ▼                ▼               ▼         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    End                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Explanation:**
These activity diagrams show the detailed flow of three major processes:

1. **Appointment Flow**
   - Customer request initiation
   - Health Sakhi processing
   - Lab confirmation
   - Customer notification
   - Status updates

2. **AI Service Integration Flow**
   - User input handling
   - Service selection
   - Processing steps
   - Result delivery
   - User feedback collection

3. **Health Sakhi Assignment Flow**
   - Customer registration
   - Health Sakhi search
   - Assignment process
   - Confirmation handling
   - Status updates

Each diagram shows:
- Start and end points
- Process steps
- Decision points
- Data flow
- System interactions
- User interactions

### 15.5 Use Case Diagrams

```
                    Rural GenAI Wellbeing System

    (Coordinator)    (Health Sakhi)    (Customer)     (Lab)
         |                |                |            |
         |                |                |            |
    +----------------------------------------------------------+
    |                                                          |
    |  (Login) <------------------+                            |
    |                            |                            |
    |  (Manage Health Sakhis)    |                            |
    |                            |                            |
    |  (Generate Reports)        |                            |
    |                            |                            |
    |  (Track Metrics)           |                            |
    |                            |                            |
    |  (View Analytics)          |                            |
    |                            |                            |
    |  (Manage Appointments)     |                            |
    |                            |                            |
    |  (Update Medical Records)  |                            |
    |                            |                            |
    |  (Send Messages)           |                            |
    |                            |                            |
    |  (Use AI Features)         |                            |
    |                            |                            |
    |  (Manage Lab Tests)        |                            |
    |                            |                            |
    |  (View History)            |                            |
    |                            |                            |
    |  (Update Status)           |                            |
    |                            |                            |
    +----------------------------------------------------------+

    Legend:
    | : Association
    <-- : Include relationship
    --> : Extend relationship
    ( ) : Actor/Use Case
    [ ] : System Boundary
```

**Use Case Diagram Explanation:**

1. **Actors:**
   - (Coordinator): Oversees health workers and manages resources
   - (Health Sakhi): Frontline rural health worker
   - (Customer): Patient receiving healthcare services
   - (Lab): Diagnostic center providing medical tests

2. **Primary Use Cases:**
   - (Login): Authentication for all actors
   - (Manage Health Sakhis): Coordinator's role
   - (Generate Reports): System reporting
   - (Track Metrics): Performance monitoring
   - (View Analytics): Data analysis
   - (Manage Appointments): Schedule management
   - (Update Medical Records): Patient data management
   - (Send Messages): Communication system
   - (Use AI Features): AI-powered tools
   - (Manage Lab Tests): Laboratory services
   - (View History): Record access
   - (Update Status): Status management

3. **Relationships:**
   - Association: Direct connection between actor and use case
   - Include: Mandatory relationship between use cases
   - Extend: Optional relationship between use cases

4. **System Boundary:**
   - Encloses all use cases
   - Shows system scope
   - Separates actors from system functionality

### 15.6 Entity-Relationship Diagrams (ERD)
[Previous ERD with explanations]

### 15.7 Component Diagrams
[Previous component diagrams with explanations]

### 15.8 State Diagrams
[Previous state diagrams with explanations]

Each diagram section includes:
- Visual representation
- Detailed explanation
- Key components and relationships
- Process flows where applicable
- Integration points with other system components

Each diagram section includes:
- Visual representation
- Detailed explanation
- Key components and relationships
- Process flows where applicable
- Integration points with other system components 