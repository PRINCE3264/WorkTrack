// ===== GLOBAL RECORDS DATABASE & STATES =====
let dbRecords = [];
let masterQuery = { search: "", status: "all", sort: "date-desc", page: 1, limit: 5 };
let memberQuery = { search: "", status: "all", sort: "date-desc", page: 1, limit: 5 };
let activeDeleteId = null;

let members = {};

// Time Tracking & Work Management Global States
var ttState = null;
var ttClockInterval = null;
var ttElapsedInterval = null;
var ttBreakInterval = null;
var ttTimerInterval = null;
var webcamStream = null;
var wmTasks = [];
var currentCalendarMonth = new Date().getMonth();
var currentCalendarYear = new Date().getFullYear();
var currentActiveTask = null;

/* ==========================================================================
   SECURE JQUERY & AJAX API SERVICE LAYER
   ========================================================================== */

const WorkTrackAPI = (function ($) {
  'use strict';

  // Secure HTML Escaping to prevent XSS attacks
  function sanitize(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Generic Secure AJAX simulation & Live Promise/Deferred wrapper
  function sendRequest(endpoint, method, payload) {
    const dfd = $.Deferred();

    setTimeout(function () {
      try {
        dfd.resolve({
          status: 200,
          success: true,
          endpoint: endpoint,
          data: payload,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        dfd.reject({
          status: 500,
          success: false,
          error: err.message || 'Network request failed'
        });
      }
    }, 40);

    return dfd.promise();
  }

  return {
    sanitize: sanitize,
    request: sendRequest,

    // Secure Auth API
    Auth: {
      getCurrentUser: function () {
        return {
          username: sanitize(sessionStorage.getItem('wt_user') || 'admin'),
          name: sanitize(sessionStorage.getItem('wt_user_name') || 'Admin'),
          role: sanitize(sessionStorage.getItem('wt_user_role') || 'Super Admin')
        };
      },
      isAuthenticated: function () {
        return sessionStorage.getItem('wt_auth') === 'true';
      }
    },

    // Work Records API
    Records: {
      getAll: function () {
        return sendRequest('/api/records', 'GET', dbRecords);
      },
      saveAll: function (records) {
        dbRecords = records;
        localStorage.setItem('hie_work_records', JSON.stringify(dbRecords));
        return sendRequest('/api/records/sync', 'POST', dbRecords);
      },
      create: function (record) {
        dbRecords.unshift(record);
        localStorage.setItem('hie_work_records', JSON.stringify(dbRecords));
        return sendRequest('/api/records/create', 'POST', record);
      },
      delete: function (id) {
        dbRecords = dbRecords.filter(r => r.id !== id);
        localStorage.setItem('hie_work_records', JSON.stringify(dbRecords));
        return sendRequest('/api/records/delete', 'DELETE', { id: id });
      }
    },

    // Time Tracking API
    TimeTracking: {
      getState: function () {
        return sendRequest('/api/timetracking', 'GET', ttState);
      },
      saveState: function (state) {
        ttState = state;
        localStorage.setItem('wt_time_tracking', JSON.stringify(ttState));
        return sendRequest('/api/timetracking/save', 'POST', ttState);
      }
    }
  };
})(jQuery);

// ===== DEFAULT MEMBER DATA =====
const DEFAULT_MEMBERS = {
  praveen: {
    name: "Praveen Kumar",
    role: "Team Lead",
    isLead: true,
    avatar: "",
    color: "linear-gradient(135deg,#4f46e5,#7c3aed)",
    solidColor: "#4f46e5",
    tags: ["Team Lead", "Project Architecture", "Sprint Planning", "Code Review", "DevOps", "Full Stack", "Client Delivery"],
    tasks: 12,
    company: "Envision Beyond India Pvt Ltd",
    teamLead: "Self (Team Lead)",
    info: { Email: "praveen@envisionbeyond.com", Phone: "+91 98765 00000", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Self (Team Lead)", Joined: "15 January 2025", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name: "Project Architecture & System Design", pct: 95 },
      { name: "Sprint & Team Management", pct: 94 },
      { name: "Code Review & Quality Assurance", pct: 92 },
      { name: "Full Stack (.NET & React)", pct: 90 },
      { name: "DevOps, CI/CD & Cloud Infrastructure", pct: 88 },
      { name: "Database Architecture (PostgreSQL/SQL)", pct: 86 }
    ],
    responsibilities: [
      { icon: "👥", title: "Team Management", desc: "Team members ko tasks assign karna aur daily coordination maintain karna." },
      { icon: "📋", title: "Task Planning", desc: "Daily aur weekly work plan banana aur sprint milestones define karna." },
      { icon: "🔍", title: "Code/Work Review", desc: "Developers ka code aur work quality review karna and standards ensure karna." },
      { icon: "🐛", title: "Issue Resolution", desc: "Technical problems aur blockers ko identify aur solve karwana." },
      { icon: "📊", title: "Progress Tracking", desc: "Project ka live status monitor karna aur timeline tracking karna." },
      { icon: "⏰", title: "Deadline Management", desc: "Tasks ko deadline ke according deliver aur complete karwana." },
      { icon: "🤝", title: "Team Support", desc: "Team members ko continuous technical guidance aur mentorship dena." },
      { icon: "💬", title: "Communication", desc: "Manager/PM aur development team ke beech transparent coordination rakhna." },
      { icon: "🧪", title: "Quality Check", desc: "Ensure karna ki har module client requirements ke according test ho." },
      { icon: "🚀", title: "Deployment Support", desc: "Testing, release aur production deployment mein coordinate karna." },
      { icon: "📚", title: "Knowledge Sharing", desc: "Team ko new technology, tools aur best practices sikhana." },
      { icon: "📝", title: "Reporting", desc: "Management aur stakeholders ko project/team progress report dena." }
    ],
    taskList: [
      { title: "👥 Team Management: Assign sprint modules & features across frontend and backend developers.", date: "01 Aug 2026", status: "done" },
      { title: "📋 Task Planning: Created weekly development roadmap, sprint backlog, and task milestones.", date: "02 Aug 2026", status: "done" },
      { title: "🔍 Code/Work Review: Conducted PR reviews for React frontend, .NET APIs, and state management.", date: "04 Aug 2026", status: "done" },
      { title: "🐛 Issue Resolution: Resolved critical database deadlock and API integration blockers.", date: "06 Aug 2026", status: "done" },
      { title: "📊 Progress Tracking: Monitored daily burndown chart and sprint delivery health.", date: "08 Aug 2026", status: "done" },
      { title: "⏰ Deadline Management: Aligned module deliveries to ensure on-time client release.", date: "10 Aug 2026", status: "done" },
      { title: "🤝 Team Support: Provided architectural guidance on Google Maps GIS layers and Territory engine.", date: "12 Aug 2026", status: "done" },
      { title: "💬 Communication: Coordinated client change requests with product managers and dev team.", date: "14 Aug 2026", status: "done" },
      { title: "🧪 Quality Check: Verified SonarQube quality gate and automated test coverage across modules.", date: "16 Aug 2026", status: "done" },
      { title: "🚀 Deployment Support: Coordinated Docker containerization and Kubernetes cluster rollout.", date: "18 Aug 2026", status: "done" },
      { title: "📚 Knowledge Sharing: Held team workshop on React 18, performance optimization, and clean code.", date: "20 Aug 2026", status: "progress" },
      { title: "📝 Reporting: Compiled monthly project velocity and performance metrics for management.", date: "22 Aug 2026", status: "progress" }
    ],
    reports: { completed: 10, inProgress: 2, pending: 0 },
    workRecords: [
      { app: "EtaPrise", feature: "System Architecture", task: "Omni Inside System Architecture, Microservices & Database Schema Design" },
      { app: "EtaPrise", feature: "Sprint Management", task: "Sprint Planning, Developer Task Assignment, Velocity & Milestone Tracking" },
      { app: "EtaPrise", feature: "Code Review & QA", task: "Comprehensive Code Review & Pull Request Approval for Full-Stack Team" },
      { app: "Fleet Management", feature: "Rule Engine Review", task: "Architected Driver Assignment Rule Engine & Route Optimization Logic" },
      { app: "DevOps", feature: "Production Deployment", task: "Docker Containerization, K8s Cluster Management & Jenkins CI/CD Hardening" },
      { app: "AI-Studio", feature: "Chatbot Architecture", task: "Evaluated AI Studio LLM Chatbot APIs & Knowledge Base Ingestion Pipeline" },
      { app: "Security", feature: "SonarQube & OWASP", task: "Security Vulnerability Mitigation & Code Quality Assurance Audit" },
      { app: "Database", feature: "PostgreSQL Tuning", task: "Database Indexing, Query Optimization & Connection Pool Tuning" }
    ]
  },
  prince: {
    name: "Prince",
    role: "Full Stack Developer",
    avatar: "image/prince.png",
    color: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    solidColor: "#7c3aed",
    tags: ["JavaScript", "React", "UI/UX", "DevOps", ".Net", "Angular", "PgAdmin"],
    tasks: 20,
    company: "Envision Beyond India Pvt Ltd",
    teamLead: "Praveen Kumar",
    info: { Email: "prince@envisionbeyond.com", Phone: "+91 98765 00001", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Praveen Kumar", Joined: "26 March 2026", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name: "JavaScript", pct: 90 },
      { name: "React", pct: 82 },
      { name: "CSS", pct: 75 },
      { name: "Node.js", pct: 60 },
      { name: ".Net", pct: 70 },
      { name: "Angular", pct: 78 },
      { name: "Pgadmin", pct: 65 },
      { name: "Wordpress", pct: 60 },
      { name: "Devops", pct: 68 }
    ],
    taskList: [
      { title: "Controlpanel: Design Summary Card Appointment, Contract, Contact, Leave", date: "01 Aug 2026", status: "done" },
      { title: "Sales: Integrated Sales module APIs with the frontend pages and implemented API data binding and functionality.", date: "02 Aug 2026", status: "done" },
      { title: "Job Definition: Worked on Job Definition module UI, API integration, database design, and frontend functionality for OMNI Inside.", date: "03 Aug 2026", status: "done" },
      { title: "Account: Integrated Account module APIs with the frontend pages and implemented API data binding and functionality.", date: "04 Aug 2026", status: "done" },
      { title: "Appointment: Integrated Appointment module APIs with the frontend pages and implemented API data binding and functionality", date: "05 Aug 2026", status: "done" },
      { title: "Region & Territory: Create new component + Db Table + Backend integration", date: "06 Aug 2026", status: "done" },
      { title: "Contract: Integrated Appointment module APIs with the frontend pages and implemented API data binding and functionality", date: "08 Aug 2026", status: "done" },
      { title: "WhatsApp Integration: Create ui in existing component + API config", date: "09 Aug 2026", status: "done" },
      { title: "iOmni Integration: Ui Designing", date: "10 Aug 2026", status: "done" },
      { title: "Elevator PM: Summary card designing & Table Create", date: "11 Aug 2026", status: "done" },
      { title: "AI Studio: Worked on AI Chatbot, Knowledge Base, Appointment, Account, Contact, Notifications, API Integration, WhatsApp/SMS, chat UI, polls, events, and database", date: "12 Aug 2026", status: "done" },
      { title: "QA Testing (SonarQube): Testing api response + security enhancement", date: "14 Aug 2026", status: "done" },
      { title: "Docker: Create Dockerfiles + build pipeline config", date: "15 Aug 2026", status: "done" },
      { title: "Kubernetes: Cluster setup + deployment config", date: "16 Aug 2026", status: "done" },
      { title: "Nginx: Config backend + frontend routing", date: "17 Aug 2026", status: "done" },
      { title: "Automation: Create backend + frontend config + database table", date: "18 Aug 2026", status: "progress" },
      { title: "Jenkins CI/CD: Create pipeline + build/test/deploy stages", date: "19 Aug 2026", status: "progress" },
      { title: "Enterprise Application: Create whole website application", date: "20 Aug 2026", status: "progress" },
      { title: "Performance Optimization: Testing api response + security enhancement", date: "21 Aug 2026", status: "pending" },
      { title: "CI Change #1687: Ui Change Article, Footer, Header", date: "22 Aug 2026", status: "pending" }
    ],
    reports: { completed: 15, inProgress: 3, pending: 2 },
    workRecords: [
      { app: "EtaPrise", feature: "Controlpanel", task: "Design Summary Card Appointment, Contract, Contact, Leave" },
      { app: "EtaPrise", feature: "Sales", task: "Integrated Sales module APIs with the frontend pages and implemented API data binding and functionality." },
      { app: "EtaPrise", feature: "Job Definition", task: "Worked on Job Definition module UI, API integration, database design, and frontend functionality for OMNI Inside." },
      { app: "EtaPrise(WHM)", feature: "Account", task: "Integrated Account module APIs with the frontend pages and implemented API data binding and functionality." },
      { app: "EtaPrise", feature: "Appointment", task: "Integrated Appointment module APIs with the frontend pages and implemented API data binding and functionality" },
      { app: "EtaPrise", feature: "Region & Territory", task: "Create new component + Db Table + Backend integration" },
      { app: "EtaPrise", feature: "Contract", task: "Integrated Appointment module APIs with the frontend pages and implemented API data binding and functionality" },
      { app: "EtaPrise", feature: "WhatsApp Integration", task: "Create ui in existing component + API config" },
      { app: "EtaPrise", feature: "iOmni Integration", task: "Ui Designing" },
      { app: "EtaPrise", feature: "Elevator PM", task: "Summary card designing & Table Create" },
      { app: "EtaPrise", feature: "AI Studio", task: "AI Studio: Worked on AI Chatbot, Knowledge Base, Appointment, Account, Contact, Notifications, API Integration, WhatsApp/SMS, chat UI, polls, events, and database" },
      { app: "EtaPrise", feature: "QA Testing (SonarQube)", task: "Testing api response + security enhancement" },
      { app: "EtaPrise", feature: "Docker", task: "Create Dockerfiles + build pipeline config" },
      { app: "DevOps", feature: "Kubernetes", task: "Cluster setup + deployment config" },
      { app: "DevOps", feature: "Nginx", task: "Config backend + frontend routing" },
      { app: "DevOps", feature: "Automation", task: "Create backend + frontend config + database table" },
      { app: "DevOps", feature: "Jenkins CI/CD", task: "Create pipeline + build/test/deploy stages" },
      { app: "DevOps", feature: "Enterprise Application", task: "Create whole website application" },
      { app: "WordPress App (EtaPrise) live", feature: "Performance Optimization", task: "Testing api response + security enhancement" },
      { app: "WordPress App (EtaPrise) live", feature: "CI Change #1687", task: "Ui Change Article, Footer, Header" }
    ]
  },
  ajay: {
    name: "Ajay",
    role: "Full Stack Developer",
    color: "linear-gradient(135deg,#0891b2,#06b6d4)",
    solidColor: "#0891b2",
    tags: ["JavaScript", "React", "UI/UX", "DevOps", ".Net", "Angular", "PgAdmin"],
    tasks: 3,
    company: "Envision Beyond India Pvt Ltd",
    teamLead: "Praveen Kumar",
    info: { Email: "ajay@envisionbeyond.com", Phone: "+91 98765 00002", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Praveen Kumar", Joined: "26 March 2026", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name: "JavaScript", pct: 90 },
      { name: "React", pct: 82 },
      { name: "CSS", pct: 75 },
      { name: "Node.js", pct: 60 },
      { name: ".Net", pct: 70 },
      { name: "Angular", pct: 78 },
      { name: "Pgadmin", pct: 65 },
      { name: "Wordpress", pct: 60 },
      { name: "Devops", pct: 68 }
    ],
    taskList: [
      { title: "Build REST API for orders module", date: "22 Aug 2026", status: "progress" },
      { title: "Optimize database queries", date: "21 Aug 2026", status: "done" },
      { title: "Deploy microservices to staging", date: "24 Aug 2026", status: "pending" }
    ],
    reports: { completed: 8, inProgress: 2, pending: 1 }
  },
  jigar: {
    name: "Jigar",
    role: "Full Stack Developer",
    avatar: "image/jigar.jpg",
    color: "linear-gradient(135deg,#059669,#34d399)",
    solidColor: "#059669",
    tags: ["JavaScript", "React", "UI/UX", "DevOps", ".Net", "Angular", "PgAdmin"],
    tasks: 7,
    company: "Envision Beyond India Pvt Ltd",
    teamLead: "Praveen Kumar",
    info: { Email: "jigar@envisionbeyond.com", Phone: "+91 98765 00003", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Praveen Kumar", Joined: "26 March 2026", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name: "JavaScript", pct: 90 },
      { name: "React", pct: 82 },
      { name: "CSS", pct: 75 },
      { name: "Node.js", pct: 60 },
      { name: ".Net", pct: 70 },
      { name: "Angular", pct: 78 },
      { name: "Pgadmin", pct: 65 },
      { name: "Wordpress", pct: 60 },
      { name: "Devops", pct: 68 }
    ],
    taskList: [
      { title: "Accounts: New component create", date: "01 Aug 2026", status: "done" },
      { title: "Contacts: New component create", date: "02 Aug 2026", status: "done" },
      { title: "Appointment: New component + existing component", date: "03 Aug 2026", status: "done" },
      { title: "Work Order: Omni workorder integration", date: "04 Aug 2026", status: "done" },
      { title: "Part Request: Create new component + Approval button config", date: "05 Aug 2026", status: "done" },
      { title: "Design: Create 14 pdf template create + using Html2Pdf + 4 module", date: "06 Aug 2026", status: "pending" },
      { title: "Mobile Config: Create backend + frontend config + database table", date: "07 Aug 2026", status: "done" },
      { title: "Support Portal: Create whole website application", date: "08 Aug 2026", status: "done" },
      { title: "Live Panel: Create canvas of live panel + add signalr + config hub in backend", date: "09 Aug 2026", status: "done" },
      { title: "Flow: Create starting flow of whole application + ui", date: "10 Aug 2026", status: "progress" },
      { title: "Sonar Q: Testing api response + security enhancement", date: "11 Aug 2026", status: "done" },
      { title: "Aircall Integration: Create ui in existing component", date: "12 Aug 2026", status: "progress" },
      { title: "Clock In / Clock Out: Add camera feature + Checklist", date: "13 Aug 2026", status: "done" },
      { title: "IAMOmni: New component + Create sandbox environment + Integrate omni apis sync", date: "14 Aug 2026", status: "pending" },
      { title: "Controlpanel: Appointment + Contract + PartRequest + Leaves + Accreditation + Expence", date: "15 Aug 2026", status: "done" }
    ],
    reports: { completed: 15, inProgress: 4, pending: 3 }
  },
  devyani: {
    name: "Devyani",
    role: "Full Stack Developer",
    color: "linear-gradient(135deg,#db2777,#f472b6)",
    solidColor: "#db2777",
    tags: ["JavaScript", "React", "UI/UX", "DevOps", ".Net", "Angular", "PgAdmin"],
    tasks: 2,
    company: "Envision Beyond India Pvt Ltd",
    teamLead: "Praveen Kumar",
    info: { Email: "devyani@envisionbeyond.com", Phone: "+91 98765 00004", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Praveen Kumar", Joined: "26 March 2026", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name: "JavaScript", pct: 90 },
      { name: "React", pct: 82 },
      { name: "CSS", pct: 75 },
      { name: "Node.js", pct: 60 },
      { name: ".Net", pct: 70 },
      { name: "Angular", pct: 78 },
      { name: "Pgadmin", pct: 65 },
      { name: "Wordpress", pct: 60 },
      { name: "Devops", pct: 68 }
    ],
    taskList: [
      { title: "General / R&D: Conducted R&D on the Etaprise application to understand module functionality and system workflow.", date: "01 Aug 2026", status: "done" },
      { title: "General / R&D: Explored application features and analyzed navigation across different modules; documented key observations for future reference; enhanced", date: "02 Aug 2026", status: "done" },
      { title: "PDF Testing: Performed PDF functionality testing across application modules. Verified PDF generation, download, and content accuracy.", date: "03 Aug 2026", status: "done" },
      { title: "PDF Testing: Identified and documented issues in the Excel defect tracker. Updated defect details with relevant observations for further analysis.", date: "04 Aug 2026", status: "done" },
      { title: "Estimates and Quotes(PDF Testing): Performed PDF functionality testing for the Estimates and Quotes modules. Verified PDF generation, download, and data accuracy.", date: "05 Aug 2026", status: "done" },
      { title: "Estimates and Quotes(PDF Testing): Identified issues during testing and documented them in the Excel defect tracker. Updated defect details with relevant observations for further", date: "06 Aug 2026", status: "done" },
      { title: "Work Orders(PDF Testing): Performed testing for the Work Orders module. Verified the Edit functionality and validated that all existing data is displayed and updated co", date: "07 Aug 2026", status: "done" },
      { title: "Work Orders(PDF Testing): Tested PDF generation for Work Orders. Verified PDF content, formatting, and data accuracy against the Work Order details. Documented", date: "08 Aug 2026", status: "done" },
      { title: "Work Orders(PDF Testing): Re-tested the Work Orders module - verified Edit functionality and validated that all existing data is displayed and updated correctly; review", date: "09 Aug 2026", status: "done" },
      { title: "Work Orders(PDF Testing): Re-tested PDF generation for Work Orders - verified PDF content, formatting, and data accuracy against Work Order details; documented", date: "10 Aug 2026", status: "done" },
      { title: "WMS Application Modules: Executed test cases for the WMS application modules. Validated functionality across key workflows to ensure expected system behavior. V", date: "11 Aug 2026", status: "done" },
      { title: "WMS Application Modules: Identified defects and logged issues with proper test evidence. Re-tested resolved issues to confirm fixes and ensure stability. Documented", date: "12 Aug 2026", status: "done" },
      { title: "Inbound / Inventory / Outbound: Created and documented test cases for warehouse modules. Prepared End-to-End flow mapping from Inbound to Outbound process.", date: "13 Aug 2026", status: "done" },
      { title: "Inbound / Inventory / Outbound: Tested Inbound, Inventory, and Outbound flows for data accuracy and process validation. Verified system behavior, status flow, and module", date: "14 Aug 2026", status: "done" },
      { title: "UI / Navigation: Reviewed the website flow and verified the overall navigation. Worked on the UI and fixed layout, alignment, and consistency issues.", date: "15 Aug 2026", status: "done" },
      { title: "UI / Pagination: Added pagination functionality to tables and verified its behavior.", date: "16 Aug 2026", status: "done" },
      { title: "Supplier Management (Vendor): Worked on the Supplier Management (Vendor) module. Added address suggestion functionality with map-based location selection. Tested", date: "17 Aug 2026", status: "done" },
      { title: "Item Master: Worked on the Item Master module. Added search functionality to the required columns, updated and aligned the search fields with the exis", date: "18 Aug 2026", status: "done" },
      { title: "API Testing / Item Master: Tested APIs for different modules and verified response functionality; validated API data and checked expected results. Tested the Item Ma", date: "19 Aug 2026", status: "progress" },
      { title: "API Mapping (Cross-Module): Reviewed the APIs used across different WMS modules. Checked and analyzed API responses and data flow for each module. Verified wh", date: "20 Aug 2026", status: "progress" },
      { title: "Dashboard / Dark Theme UI: Fixed UI Issues related to the dark theme. Updated the application logo and made the required dashboard changes; removed unnecessary", date: "21 Aug 2026", status: "pending" }
    ],
    reports: { completed: 20, inProgress: 1, pending: 1 }
  },
  tanisha: {
    name: "Tanisha",
    role: "Full Stack Developer",
    color: "linear-gradient(135deg,#d97706,#fbbf24)",
    solidColor: "#d97706",
    tags: ["JavaScript", "React", "UI/UX", "DevOps", ".Net", "Angular", "PgAdmin"],
    tasks: 4,
    company: "Envision Beyond India Pvt Ltd",
    teamLead: "Praveen Kumar",
    info: { Email: "tanisha@hie.com", Phone: "+91 98765 00005", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Praveen Kumar", Joined: "26 March 2026", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name: "JavaScript", pct: 90 },
      { name: "React", pct: 82 },
      { name: "CSS", pct: 75 },
      { name: "Node.js", pct: 60 },
      { name: ".Net", pct: 70 },
      { name: "Angular", pct: 78 },
      { name: "Pgadmin", pct: 65 },
      { name: "Wordpress", pct: 60 },
      { name: "Devops", pct: 68 }
    ],
    taskList: [
      { title: "Google Maps Integration: Integrated Google Maps into the Region Territory module to provide an interactive map for managing and viewing geographical territories.", date: "01 Aug 2026", status: "done" },
      { title: "DDS & OSM Layers: Added DDS and OpenStreetMap (OSM) layers to fetch and display geographical/boundary information on the map.", date: "02 Aug 2026", status: "done" },
      { title: "Administrative Area Selection: Implemented selection based on Country, Administrative Area Level 1, Administrative Area Level 2, Locality, and other geographical levels.", date: "03 Aug 2026", status: "done" },
      { title: "Address & Postal Code Search: Added functionality to search using an address or postal code and automatically highlight the respective geographical area on the map.", date: "04 Aug 2026", status: "done" },
      { title: "Drawing Tools: Added Rectangle, Circle, and Freehand drawing tools to allow users to create custom geographical boundaries.", date: "05 Aug 2026", status: "done" },
      { title: "Territory Management: Implemented Save, Update, and Delete functionality for created territories/shapes.", date: "06 Aug 2026", status: "done" },
      { title: "Clear Functionality: Added a Clear button to remove currently drawn shapes and reset the map selection.", date: "07 Aug 2026", status: "done" },
      { title: "Technician Assignment: Added functionality to assign technicians to created geographical territories.", date: "08 Aug 2026", status: "done" },
      { title: "Map Integration: Worked on the Work Order and Dispatch Board module and integrated multiple map providers for displaying work orders and locations.", date: "09 Aug 2026", status: "done" },
      { title: "Google Maps: Integrated Google Maps for location tracking and displaying work order-related geographical information.", date: "10 Aug 2026", status: "done" },
      { title: "OSM: Integrated OpenStreetMap for displaying map and location information.", date: "11 Aug 2026", status: "done" },
      { title: "Leaflet: Integrated Leaflet maps and worked on map rendering, markers, and location-related functionality.", date: "12 Aug 2026", status: "done" },
      { title: "ESRI Maps: Integrated ESRI Maps as an additional map provider for the Work Order and Dispatch Board.", date: "13 Aug 2026", status: "done" },
      { title: "Road & Satellite Views: Added Road View and Satellite View functionality for the supported map providers.", date: "14 Aug 2026", status: "done" },
      { title: "Map Handling: Worked on map switching, location markers, work order locations, routing, and various map-related UI/functional issues.", date: "15 Aug 2026", status: "done" },
      { title: "Estimate & Quote: Implemented customizable PDF designs for Estimate and Quote documents.", date: "16 Aug 2026", status: "done" },
      { title: "Invoice: Added customizable PDF design support for Invoice documents.", date: "17 Aug 2026", status: "done" },
      { title: "Work Order: Added customizable PDF design support for Work Order documents.", date: "18 Aug 2026", status: "done" },
      { title: "Purchase Order: Added customizable PDF design support for Purchase Order documents.", date: "19 Aug 2026", status: "done" },
      { title: "Design Settings: Created/implemented a Design Settings page where users can select the required PDF design.", date: "20 Aug 2026", status: "done" },
      { title: "12 Designs: Implemented 12 different PDF design templates that users can select based on their requirements.", date: "21 Aug 2026", status: "done" },
      { title: "PDFMake Integration: Used PDFMake to generate actual structured PDFs instead of generating PDFs from screenshots or webpage images.", date: "22 Aug 2026", status: "done" },
      { title: "Dynamic Design Selection: Integrated the selected design from Settings into the corresponding Estimate, Quote, Invoice, Work Order, and Purchase Order PDFs.", date: "23 Aug 2026", status: "done" },
      { title: "Layout & Formatting Fixes: Fixed PDF issues such as table width, checkbox rendering, themes, spacing, alignment, and overall document formatting.", date: "24 Aug 2026", status: "done" },
      { title: "System Development: Developed the Fleet Management system for managing drivers, vehicles, demands, trips, scheduling, and assignment workflows.", date: "25 Aug 2026", status: "done" },
      { title: "Driver Assignment: Developed functionality to assign eligible drivers to trips based on configured business rules.", date: "26 Aug 2026", status: "done" },
      { title: "Rule Engine: Developed a Rule Engine page to configure and manage active rules used during trip and driver assignment.", date: "27 Aug 2026", status: "done" },
      { title: "Rule Validation: Implemented validation to ensure that active rules are properly checked before assigning drivers to trips.", date: "28 Aug 2026", status: "done" },
      { title: "Rule Application: Added a dedicated interface to show how rules are being applied during the scheduling and assignment process.", date: "29 Aug 2026", status: "done" },
      { title: "Excel Import: Added Excel import functionality to upload Fleet Management data such as demand, driver, and vehicle information.", date: "30 Aug 2026", status: "done" },
      { title: "Excel Validation: Implemented validation for imported Excel data and provided users with validation results/errors for incorrect records.", date: "31 Aug 2026", status: "done" },
      { title: "Demand Management: Worked on demand import and processing workflows to convert requirements into trips for scheduling.", date: "01 Sep 2026", status: "done" },
      { title: "Auto Scheduler: Developed the Auto Scheduler flow to automatically generate and assign trips based on driver, vehicle, and active business-rule eligibility.", date: "02 Sep 2026", status: "done" },
      { title: "Trip Management: Added functionality to review, modify, assign, and manage generated trips before proceeding to the next stage.", date: "03 Sep 2026", status: "done" },
      { title: "Integration with Etaprise: Worked on integrating and validating Fleet Management functionality with the existing Etaprise system and its data/workflows.", date: "04 Sep 2026", status: "done" },
      { title: "UI Development: Developed and improved multiple Fleet Management pages including Driver Master, Vehicle Master, Demand Import, Auto Scheduler, Schedule Board, Exceptions, and related sections.", date: "05 Sep 2026", status: "progress" },
      { title: "Testing & Verification: Tested the complete workflow and verified that rules, driver assignment, trip generation, Excel validation, and related functionality were working correctly.", date: "06 Sep 2026", status: "progress" },
      { title: "Bug Fixing & Improvements: Continuously identified and fixed UI, functional, API, database, routing, integration, and PDF-related issues across different modules.", date: "07 Sep 2026", status: "pending" },
      { title: "Legacy Code Integration: Integrated new features into existing project code while ensuring existing functionality and default behavior were preserved.", date: "08 Sep 2026", status: "pending" }
    ],
    reports: { completed: 18, inProgress: 2, pending: 2 }
  }
};

// ===== STATE =====
let currentMember = null;
let currentTab = "profile";
let sidebarCollapsed = false;

// ===== DOM REFS =====
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileToggle = document.getElementById("mobileToggle");
const overlay = document.getElementById("overlay");
const welcomeSection = document.getElementById("welcomeSection");
const memberDetail = document.getElementById("memberDetail");
const membersGrid = document.getElementById("membersGrid");
const bcMember = document.getElementById("bcMember");
const tabBar = document.getElementById("tabBar");
const tabContent = document.getElementById("tabContent");
const backBtn = document.getElementById("backBtn");

// ===== INIT =====
function init() {
  initMembersDb();
  initRecordsDb();
  renderSidebarNav();
  renderMembersGrid();
  setupSidebarNav();
  setupHamburger();
  setupMobileToggle();
  setupOverlay();
  setupBackBtn();
  setupTabs();
  setupModalEvents();
  initTimeTracking();
  initWorkManagement();
  updateDynamicCardDates();
}

// ===== MEMBERS GRID =====
function renderMembersGrid() {
  membersGrid.innerHTML = "";

  const memberCount = Object.keys(members).length;
  const totalMembersSpan = document.getElementById("overviewTotalMembers");
  if (totalMembersSpan) {
    totalMembersSpan.textContent = memberCount;
  }

  const countBadge = document.getElementById("membersCountBadge");
  if (countBadge) {
    countBadge.textContent = `${memberCount} Active`;
  }

  const totalTasksSpan = document.getElementById("overviewTotalTasks");
  if (totalTasksSpan) {
    totalTasksSpan.textContent = dbRecords.length;
  }

  const companyTag = document.getElementById("companyEmpTag");
  if (companyTag) {
    companyTag.textContent = `${memberCount} Team Members`;
  }

  const companyBadge = document.getElementById("badge-company-records");
  if (companyBadge) {
    companyBadge.textContent = dbRecords.length;
  }

  updateDynamicCardDates();

  Object.entries(members).forEach(([key, m]) => {
    const card = document.createElement("div");
    card.className = "member-card";
    card.style.setProperty("--color", m.solidColor + "33");
    const avatarHtml = m.avatar
      ? `<div class="mc-avatar mc-avatar-img"><img src="${m.avatar}" alt="${m.name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; display:block;" /></div>`
      : `<div class="mc-avatar" style="background:${m.color}">${m.name[0]}</div>`;
    const isLead = m.isLead || (m.role && m.role.toLowerCase().includes("lead"));
    const leadBadge = isLead ? `<span style="background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; font-size:0.68rem; font-weight:700; padding:2px 8px; border-radius:12px; margin-left:6px; vertical-align:middle;">TL</span>` : '';
    const liveTaskCount = dbRecords.filter(r => r.memberKey === key).length;
    card.innerHTML = `
      ${avatarHtml}
      <div class="mc-name">${m.name}${leadBadge}</div>
      <div class="mc-role">${m.role}</div>
      <div class="mc-tasks">Tasks: <span>${liveTaskCount}</span></div>
      <button class="mc-btn" style="--color:${m.solidColor}33">View Dashboard</button>
    `;
    card.querySelector(".mc-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      showMember(key, "profile");
    });
    card.addEventListener("click", () => showMember(key, "profile"));
    membersGrid.appendChild(card);
  });
}

// ===== SHOW MEMBER =====
function showMember(key, tab) {
  currentMember = key;
  currentTab = tab || "profile";
  const m = members[key];
  welcomeSection.style.display = "none";
  document.getElementById("companyRecordsSection").style.display = "none";
  const ttSec = document.getElementById("timeTrackingSection"); if (ttSec) ttSec.style.display = "none";
  const wmSec = document.getElementById("workManagementSection"); if (wmSec) wmSec.style.display = "none";

  const companyRecordsBtn = document.getElementById("companyRecordsBtn");
  if (companyRecordsBtn) companyRecordsBtn.classList.remove("active");
  const timeTrackingBtn = document.getElementById("timeTrackingBtn");
  if (timeTrackingBtn) timeTrackingBtn.classList.remove("active");
  const workManagementBtn = document.getElementById("workManagementBtn");
  if (workManagementBtn) workManagementBtn.classList.remove("active");

  memberDetail.style.display = "block";
  memberDetail.style.animation = "none";
  requestAnimationFrame(() => { memberDetail.style.animation = ""; });

  // Avatar & info
  const detailAvatar = document.getElementById("detailAvatar");
  if (m.avatar) {
    detailAvatar.className = "detail-avatar detail-avatar-img";
    detailAvatar.style.background = "none";
    detailAvatar.innerHTML = `<img src="${m.avatar}" alt="${m.name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; display:block;" />`;
  } else {
    detailAvatar.className = "detail-avatar";
    detailAvatar.style.background = m.color;
    detailAvatar.textContent = m.name[0];
  }
  document.getElementById("detailName").textContent = m.name;
  document.getElementById("detailRole").textContent = m.role;
  document.getElementById("detailTags").innerHTML = m.tags.map(t => `<span class="tag">${t}</span>`).join("");

  // Breadcrumb
  bcMember.textContent = m.name;

  // Activate sidebar item
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  const navBtn = document.querySelector(`.nav-btn[data-member="${key}"]`);
  if (navBtn) { navBtn.classList.add("active"); navBtn.setAttribute("aria-expanded", "true"); }

  // Open submenu
  document.querySelectorAll(".nav-submenu").forEach(s => s.classList.remove("open"));
  const sub = document.getElementById(`sub-${key}`);
  if (sub) sub.classList.add("open");

  // Active sub-link
  document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
  const activeLink = document.querySelector(`.sub-link[data-member="${key}"][data-section="${currentTab}"]`);
  if (activeLink) activeLink.classList.add("active");

  renderTab(currentTab);

  // Activate tab button
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === currentTab);
  });

  // Close mobile sidebar
  if (window.innerWidth <= 768) closeMobileSidebar();
}

// ===== RENDER TAB =====
function renderTab(tab) {
  const m = members[currentMember];
  tabContent.style.animation = "none";
  requestAnimationFrame(() => { tabContent.style.animation = ""; tabContent.className = "tab-content"; });

  if (tab === "profile") {
    const responsibilitiesHtml = m.responsibilities ? `
      <div class="info-card" style="grid-column: 1 / -1; margin-top: 6px;">
        <h3 style="display:flex; align-items:center; gap:8px;">
          <span class="material-icons" style="color:var(--primary); font-size:22px;">stars</span>
          Key Responsibilities & Role Focus
        </h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-top:14px;">
          ${m.responsibilities.map(r => `
            <div style="background:#faf9fd; border:1px solid #eeeaf6; border-radius:10px; padding:12px 14px; display:flex; gap:12px; align-items:flex-start; transition:transform 0.15s, box-shadow 0.15s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(109,40,217,0.06)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">
              <span style="font-size:1.4rem; line-height:1; flex-shrink:0; margin-top:2px;">${r.icon}</span>
              <div>
                <div style="font-weight:700; color:#1a1035; font-size:0.88rem; margin-bottom:3px;">${r.title}</div>
                <div style="font-size:0.78rem; color:#6b5fa0; line-height:1.4;">${r.desc}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : '';

    tabContent.innerHTML = `
      <div class="profile-grid">
        <div class="info-card">
          <h3>Personal Information</h3>
          ${Object.entries(m.info).map(([k, v]) => `
            <div class="info-row">
              <span class="info-key">${k}</span>
              <span class="info-val">${v}</span>
            </div>
          `).join("")}
        </div>
        <div class="info-card">
          <h3>Skills & Expertise</h3>
          ${m.skills.map(s => `
            <div class="skill-row">
              <div class="skill-meta"><span>${s.name}</span><span>${s.pct}%</span></div>
              <div class="progress-bar"><div class="progress-fill" style="width:0%" data-width="${s.pct}%"></div></div>
            </div>
          `).join("")}
        </div>
        ${responsibilitiesHtml}
      </div>
    `;
    // Animate progress bars
    setTimeout(() => {
      document.querySelectorAll(".progress-fill").forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 100);
  } else if (tab === "tasks") {
    tabContent.innerHTML = `
      <div class="task-list">
        ${m.taskList.map((t, i) => `
          <div class="task-item">
            <div class="task-check ${t.status === "done" ? "done" : ""}" data-task="${i}" id="tc-${currentMember}-${i}"></div>
            <div class="task-info">
              <div class="task-title ${t.status === "done" ? "done" : ""}">${t.title}</div>
              <div class="task-meta">
                <span class="task-date">${t.date}</span>
                <span class="task-status ${t.status === "done" ? "status-done" : t.status === "progress" ? "status-progress" : "status-pending"}">
                  ${t.status === "done" ? "Completed" : t.status === "progress" ? "In Progress" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    // Toggle task done
    document.querySelectorAll(".task-check").forEach(check => {
      check.addEventListener("click", () => {
        const idx = parseInt(check.dataset.task);
        const task = m.taskList[idx];
        task.status = task.status === "done" ? "pending" : "done";
        renderTab("tasks");
        document.querySelectorAll(".tab-btn").forEach(b => { b.classList.toggle("active", b.dataset.tab === "tasks"); });
      });
    });
  } else if (tab === "reports") {
    tabContent.innerHTML = `
      <div class="report-grid">
        <div class="report-card">
          <div class="report-num" style="color:#34d399">${m.reports.completed}</div>
          <div class="report-lbl">Completed Tasks</div>
        </div>
        <div class="report-card">
          <div class="report-num" style="color:#fbbf24">${m.reports.inProgress}</div>
          <div class="report-lbl">In Progress</div>
        </div>
        <div class="report-card">
          <div class="report-num" style="color:#f87171">${m.reports.pending}</div>
          <div class="report-lbl">Pending</div>
        </div>
      </div>
      <div class="info-card">
        <h3>Performance Summary</h3>
        <div class="info-row"><span class="info-key">Total Tasks Assigned</span><span class="info-val">${m.reports.completed + m.reports.inProgress + m.reports.pending}</span></div>
        <div class="info-row"><span class="info-key">Completion Rate</span><span class="info-val">${Math.round((m.reports.completed / (m.reports.completed + m.reports.inProgress + m.reports.pending)) * 100)}%</span></div>
        <div class="info-row"><span class="info-key">Member Since</span><span class="info-val">${m.info.Joined}</span></div>
      </div>
    `;
  } else if (tab === "work-record") {
    tabContent.innerHTML = `
      <div class="wr-header-bar">
        <div class="wr-meta">
          <div class="wr-meta-item">
            <span class="material-icons" style="font-size:24px; color:#7c3aed;">corporate_fare</span>
            <div><span class="wr-meta-label">Company</span><span class="wr-meta-val">${m.company || 'N/A'}</span></div>
          </div>
          <div class="wr-meta-item">
            <span class="material-icons" style="font-size:24px; color:#7c3aed;">people</span>
            <div><span class="wr-meta-label">Team Lead</span><span class="wr-meta-val">${m.teamLead || 'N/A'}</span></div>
          </div>
          <div class="wr-meta-item">
            <span class="material-icons" style="font-size:24px; color:#7c3aed;">assessment</span>
            <div><span class="wr-meta-label">Total Records</span><span class="wr-meta-val" id="entriesCount">0 Entries</span></div>
          </div>
        </div>
        
        <div class="wr-controls">
          <div class="wr-search-box">
            <span class="material-icons" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#a099af; font-size:18px;">search</span>
            <input type="text" id="memberSearchInput" class="wr-search-input" placeholder="Search tasks, features, or apps...">
          </div>
          <div class="wr-sort-box" style="margin-left: 10px;">
            <select id="memberSortSelect" class="wr-select">
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="app-asc">Application (A-Z)</option>
              <option value="status-asc">Status</option>
            </select>
          </div>
          <div class="wr-filter-tags" style="margin-left: 15px;">
            <button class="filter-tag active" data-filter="all">All Statuses</button>
            <button class="filter-tag" data-filter="completed">Completed</button>
            <button class="filter-tag" data-filter="progress">In Progress</button>
            <button class="filter-tag" data-filter="pending">Pending</button>
          </div>
          <div class="wr-export-btns">
            <button class="export-btn pdf-btn" id="exportPdfBtn"><span class="material-icons" style="font-size:16px;">picture_as_pdf</span> PDF</button>
            <button class="export-btn excel-btn" id="exportExcelBtn"><span class="material-icons" style="font-size:16px;">table_view</span> Excel</button>
            <button class="export-btn" id="memberAddBtn" style="background:#7c3aed; color:#fff; border-color:#7c3aed;"><span class="material-icons" style="font-size:16px;">add</span> Add</button>
          </div>
        </div>
      </div>
      
      <div class="wr-table-wrap">
        <table class="wr-table" id="wrTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Application / Module</th>
              <th>Feature / Task</th>
              <th>Work Done</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Injected dynamically -->
          </tbody>
        </table>
      </div>
      <div class="wr-pagination" id="memberPagination"></div>
    `;

    // Reset member query state
    memberQuery.page = 1;
    memberQuery.search = "";
    memberQuery.status = "all";
    memberQuery.sort = "date-desc";

    // Bind member query control event listeners using jQuery
    $("#memberSearchInput").on("keyup input", function () {
      memberQuery.search = $(this).val();
      memberQuery.page = 1;
      renderMemberRecords();
    });

    $("#memberSortSelect").on("change", function () {
      memberQuery.sort = $(this).val();
      memberQuery.page = 1;
      renderMemberRecords();
    });

    $(".wr-filter-tags .filter-tag").on("click", function () {
      $(".wr-filter-tags .filter-tag").removeClass("active");
      $(this).addClass("active");
      memberQuery.status = $(this).data("filter");
      memberQuery.page = 1;
      renderMemberRecords();
    });

    $("#exportPdfBtn").on("click", function () {
      const list = getFilteredMemberRecords();
      exportPDF(m, list);
    });

    $("#exportExcelBtn").on("click", function () {
      const list = getFilteredMemberRecords();
      exportExcel(m, list);
    });

    $("#memberAddBtn").on("click", function () {
      openAddModal(currentMember);
    });

    // Render table
    renderMemberRecords();
  } else if (tab === "settings") {
    tabContent.innerHTML = `
      <div class="settings-list">
        <div class="setting-item">
          <div class="setting-info"><h4>Email Notifications</h4><p>Receive task updates via email</p></div>
          <button class="toggle on" onclick="this.classList.toggle('on')"></button>
        </div>
        <div class="setting-item">
          <div class="setting-info"><h4>Push Notifications</h4><p>Browser push notifications</p></div>
          <button class="toggle on" onclick="this.classList.toggle('on')"></button>
        </div>
        <div class="setting-item">
          <div class="setting-info"><h4>Weekly Report</h4><p>Auto-generate weekly performance report</p></div>
          <button class="toggle" onclick="this.classList.toggle('on')"></button>
        </div>
        <div class="setting-item">
          <div class="setting-info"><h4>Two-Factor Auth</h4><p>Add extra security to account</p></div>
          <button class="toggle" onclick="this.classList.toggle('on')"></button>
        </div>
        <div class="setting-item">
          <div class="setting-info"><h4>Dark Mode</h4><p>Always use dark theme</p></div>
          <button class="toggle on" onclick="this.classList.toggle('on')"></button>
        </div>
      </div>
    `;
  }
}

// ===== SIDEBAR NAV =====
function setupSidebarNav() {
  // Nav buttons (expand/collapse)
  document.querySelectorAll(".nav-btn[data-member]").forEach(btn => {
    btn.addEventListener("click", () => {
      const member = btn.dataset.member;
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      // Collapse all
      document.querySelectorAll(".nav-btn").forEach(b => { b.setAttribute("aria-expanded", "false"); b.classList.remove("active"); });
      document.querySelectorAll(".nav-submenu").forEach(s => s.classList.remove("open"));
      if (!isExpanded) {
        btn.setAttribute("aria-expanded", "true");
        btn.classList.add("active");
        document.getElementById(`sub-${member}`).classList.add("open");
        showMember(member, "profile");
      } else {
        // Collapsed back - show welcome
        currentMember = null;
        welcomeSection.style.display = "block";
        memberDetail.style.display = "none";
        document.getElementById("companyRecordsSection").style.display = "none";
        bcMember.textContent = "Overview";
      }
    });
  });

  // Company Records master button
  const companyRecordsBtn = document.getElementById("companyRecordsBtn");
  if (companyRecordsBtn) {
    companyRecordsBtn.addEventListener("click", () => {
      const subMenu = document.getElementById("sub-company-records");
      const isExpanded = companyRecordsBtn.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".nav-btn:not(#companyRecordsBtn)").forEach(b => {
        b.setAttribute("aria-expanded", "false");
        b.classList.remove("active");
      });
      document.querySelectorAll(".nav-submenu:not(#sub-company-records)").forEach(s => s.classList.remove("open"));

      if (!isExpanded) {
        companyRecordsBtn.setAttribute("aria-expanded", "true");
        companyRecordsBtn.classList.add("active");
        if (subMenu) subMenu.classList.add("open");
        showCompanyRecords();
        document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
        const allLink = document.querySelector('.sub-link[data-section="company-records"][data-filter="all"]');
        if (allLink) allLink.classList.add("active");
      } else {
        if (subMenu) subMenu.classList.remove("open");
        companyRecordsBtn.classList.remove("active");
        companyRecordsBtn.setAttribute("aria-expanded", "false");
        document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
        currentMember = null;
        welcomeSection.style.display = "block";
        memberDetail.style.display = "none";
        document.getElementById("companyRecordsSection").style.display = "none";
        const ttSec = document.getElementById("timeTrackingSection"); if (ttSec) ttSec.style.display = "none";
        const wmSec = document.getElementById("workManagementSection"); if (wmSec) wmSec.style.display = "none";
        bcMember.textContent = "Overview";
      }
    });
  }

  // Time Tracking master button
  const timeTrackingBtn = document.getElementById("timeTrackingBtn");
  if (timeTrackingBtn) {
    timeTrackingBtn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn:not(#timeTrackingBtn)").forEach(b => {
        b.setAttribute("aria-expanded", "false");
        b.classList.remove("active");
      });
      document.querySelectorAll(".nav-submenu").forEach(s => s.classList.remove("open"));
      document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));

      timeTrackingBtn.classList.add("active");
      showTimeTracking("clock-in");
    });
  }

  // Work Management master button
  const workManagementBtn = document.getElementById("workManagementBtn");
  if (workManagementBtn) {
    workManagementBtn.addEventListener("click", () => {
      const subMenu = document.getElementById("sub-work-management");
      const isExpanded = workManagementBtn.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".nav-btn:not(#workManagementBtn)").forEach(b => {
        b.setAttribute("aria-expanded", "false");
        b.classList.remove("active");
      });
      document.querySelectorAll(".nav-submenu:not(#sub-work-management)").forEach(s => s.classList.remove("open"));

      if (!isExpanded) {
        workManagementBtn.setAttribute("aria-expanded", "true");
        workManagementBtn.classList.add("active");
        if (subMenu) subMenu.classList.add("open");
        showWorkManagement("kanban");
      } else {
        if (subMenu) subMenu.classList.remove("open");
        workManagementBtn.classList.remove("active");
        workManagementBtn.setAttribute("aria-expanded", "false");
        document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
        currentMember = null;
        welcomeSection.style.display = "block";
        memberDetail.style.display = "none";
        document.getElementById("companyRecordsSection").style.display = "none";
        const ttSec = document.getElementById("timeTrackingSection"); if (ttSec) ttSec.style.display = "none";
        const wmSec = document.getElementById("workManagementSection"); if (wmSec) wmSec.style.display = "none";
        bcMember.textContent = "Overview";
      }
    });
  }

  // Sub-links (employee tabs + company records filters + time tracking + work management)
  document.querySelectorAll(".sub-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const member = link.dataset.member;
      const section = link.dataset.section;
      const filter = link.dataset.filter; // company records
      const sub = link.dataset.sub; // time tracking / work management

      document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      if (section === "time-tracking") {
        showTimeTracking(sub || "clock-in");
        if (window.innerWidth <= 768) closeMobileSidebar();
        return;
      }

      if (section === "work-management") {
        showWorkManagement(sub || "kanban");
        if (window.innerWidth <= 768) closeMobileSidebar();
        return;
      }

      if (filter !== undefined) {
        showCompanyRecords();
        masterQuery.status = filter;
        masterQuery.page = 1;
        renderMasterRecords();
        document.querySelectorAll("#companyRecordsSection .filter-tag").forEach(t => {
          t.classList.toggle("active", t.dataset.filter === filter);
        });
        if (window.innerWidth <= 768) closeMobileSidebar();
        return;
      }

      // Employee section sub-link
      currentTab = section;
      if (currentMember !== member) {
        showMember(member, section);
      } else {
        renderTab(section);
        document.querySelectorAll(".tab-btn").forEach(b => { b.classList.toggle("active", b.dataset.tab === section); });
      }
      if (window.innerWidth <= 768) closeMobileSidebar();
    });
  });
}

// ===== TABS =====
function setupTabs() {
  tabBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn || !currentMember) return;
    currentTab = btn.dataset.tab;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".sub-link").forEach(l => {
      l.classList.toggle("active", l.dataset.member === currentMember && l.dataset.section === currentTab);
    });
    renderTab(currentTab);
  });
}

// ===== BACK BTN =====
function setupBackBtn() {
  backBtn.addEventListener("click", () => {
    currentMember = null;
    memberDetail.style.display = "none";
    welcomeSection.style.display = "block";
    bcMember.textContent = "Overview";
    document.querySelectorAll(".nav-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-expanded", "false"); });
    document.querySelectorAll(".nav-submenu").forEach(s => s.classList.remove("open"));
    document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
  });
}

// ===== HAMBURGER (Desktop collapse) =====
function setupHamburger() {
  hamburgerBtn.addEventListener("click", () => {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle("collapsed", sidebarCollapsed);
    mainContent.classList.toggle("expanded", sidebarCollapsed);
  });

  // Expand sidebar on logo icon click if collapsed
  const logoIcon = document.querySelector(".logo-icon");
  if (logoIcon) {
    logoIcon.addEventListener("click", () => {
      if (sidebarCollapsed) {
        sidebarCollapsed = false;
        sidebar.classList.remove("collapsed");
        mainContent.classList.remove("expanded");
      }
    });
  }
}

// ===== MOBILE TOGGLE =====
function setupMobileToggle() {
  mobileToggle.addEventListener("click", () => {
    sidebar.classList.add("mobile-open");
    overlay.classList.add("show");
  });
}

function closeMobileSidebar() {
  sidebar.classList.remove("mobile-open");
  overlay.classList.remove("show");
}

// ===== OVERLAY =====
function setupOverlay() {
  overlay.addEventListener("click", closeMobileSidebar);
}

// ===== RESIZE =====
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeMobileSidebar();
});

// ===== EXPORT PDF =====
function exportPDF(m, wr) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Header background
  doc.setFillColor(109, 40, 217);
  doc.rect(0, 0, 297, 28, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Work Record Report", 14, 12);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${m.name}   |   Company: ${m.company}   |   Team Lead: ${m.teamLead}`, 14, 20);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, 250, 20, { align: "right" });

  // Table
  doc.autoTable({
    startY: 32,
    head: [["#", "Application / Module", "Feature / Task", "Description"]],
    body: wr.map((r, i) => [i + 1, r.app, r.feature, r.task]),
    styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: "bold", halign: "center" },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 52 },
      2: { cellWidth: 45 },
      3: { cellWidth: 155 }
    },
    alternateRowStyles: { fillColor: [244, 243, 251] },
    rowStyles: { valign: "middle" },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${doc.internal.getNumberOfPages()}  |  ${m.company}`, 148, 205, { align: "center" });
    }
  });

  doc.save(`${m.name}_WorkRecord.pdf`);
}

// ===== EXPORT EXCEL =====
function exportExcel(m, wr) {
  const wb = XLSX.utils.book_new();

  // Header rows
  const headerRows = [
    ["Work Record Report — " + m.name],
    ["Company:", m.company],
    ["Team Lead:", m.teamLead],
    ["Generated:", new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
    [],
    ["#", "Application / Module", "Feature / Task", "Description"]
  ];
  const dataRows = wr.map((r, i) => [i + 1, r.app, r.feature, r.task]);
  const allRows = [...headerRows, ...dataRows];

  const ws = XLSX.utils.aoa_to_sheet(allRows);

  // Column widths
  ws["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 28 }, { wch: 80 }];

  // Merge title cell
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

  XLSX.utils.book_append_sheet(wb, ws, "Work Record");
  XLSX.writeFile(wb, `${m.name}_WorkRecord.xlsx`);
}

// ===== EXPORT MASTER PDF =====
function exportMasterPDF(wr) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Header background
  doc.setFillColor(109, 40, 217);
  doc.rect(0, 0, 297, 28, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Company Master Work Record Report", 14, 12);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Company: Envision Beyond India Pvt Ltd   |   Total Records: ${wr.length} Entries`, 14, 20);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, 250, 20, { align: "right" });

  // Table
  doc.autoTable({
    startY: 32,
    head: [["#", "Employee", "Application / Module", "Feature / Task", "Work Done", "Date", "Status"]],
    body: wr.map((r, i) => [
      i + 1,
      r.empName || (members[r.memberKey] ? members[r.memberKey].name : "Employee"),
      r.app,
      r.feature,
      r.task,
      r.date,
      (r.status || "").toUpperCase()
    ]),
    styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: "bold", halign: "center" },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 30 },
      2: { cellWidth: 42 },
      3: { cellWidth: 40 },
      4: { cellWidth: 95 },
      5: { cellWidth: 26, halign: "center" },
      6: { cellWidth: 26, halign: "center" }
    },
    alternateRowStyles: { fillColor: [244, 243, 251] },
    rowStyles: { valign: "middle" },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${doc.internal.getNumberOfPages()}  |  Envision Beyond India Pvt Ltd`, 148, 205, { align: "center" });
    }
  });

  doc.save(`Company_Master_WorkRecords.pdf`);
}

// ===== EXPORT MASTER EXCEL =====
function exportMasterExcel(wr) {
  const wb = XLSX.utils.book_new();

  // Header rows
  const headerRows = [
    ["Company Master Work Record Report — Envision Beyond India Pvt Ltd"],
    ["Company:", "Envision Beyond India Pvt Ltd"],
    ["Total Entries:", wr.length],
    ["Generated:", new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
    [],
    ["#", "Employee", "Application / Module", "Feature / Task", "Work Done", "Date", "Status"]
  ];
  const dataRows = wr.map((r, i) => [
    i + 1,
    r.empName || (members[r.memberKey] ? members[r.memberKey].name : "Employee"),
    r.app,
    r.feature,
    r.task,
    r.date,
    r.status
  ]);
  const allRows = [...headerRows, ...dataRows];

  const ws = XLSX.utils.aoa_to_sheet(allRows);

  ws["!cols"] = [{ wch: 5 }, { wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 80 }, { wch: 15 }, { wch: 15 }];
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];

  XLSX.utils.book_append_sheet(wb, ws, "Company Work Records");
  XLSX.writeFile(wb, `Company_Master_WorkRecords.xlsx`);
}

// ===== LOCAL STORAGE DATABASE =====
function initRecordsDb() {
  let localData = localStorage.getItem("hie_work_records");
  if (localData && (!localData.includes("Job Defination") || !localData.includes("MS Entra Authentication") || !localData.includes("Aircall Integration") || !localData.includes("PDF Testing") || !localData.includes("Region Territory"))) {
    localStorage.removeItem("hie_work_records");
    localData = null;
  }

  if (localData) {
    dbRecords = JSON.parse(localData);
  } else {
    const initialSeed = [];

    // Seed Team Lead Praveen Kumar's work records
    const praveenSeeds = [
      { app: "EtaPrise", feature: "System Architecture", task: "Omni Inside System Architecture, Microservices & Database Schema Design", status: "completed" },
      { app: "EtaPrise", feature: "Sprint Management", task: "Sprint Planning, Developer Task Assignment, Velocity & Milestone Tracking", status: "completed" },
      { app: "EtaPrise", feature: "Code Review & QA", task: "Comprehensive Code Review & Pull Request Approval for Full-Stack Team", status: "completed" },
      { app: "Fleet Management", feature: "Rule Engine Review", task: "Architected Driver Assignment Rule Engine & Route Optimization Logic", status: "completed" },
      { app: "DevOps", feature: "Production Deployment", task: "Docker Containerization, K8s Cluster Management & Jenkins CI/CD Hardening", status: "completed" },
      { app: "AI-Studio", feature: "Chatbot Architecture", task: "Evaluated AI Studio LLM Chatbot APIs & Knowledge Base Ingestion Pipeline", status: "completed" },
      { app: "Security", feature: "SonarQube & OWASP", task: "Security Vulnerability Mitigation & Code Quality Assurance Audit", status: "completed" },
      { app: "Database", feature: "PostgreSQL Tuning", task: "Database Indexing, Query Optimization & Connection Pool Tuning", status: "progress" }
    ];

    praveenSeeds.forEach((s, i) => {
      initialSeed.push({
        id: "rec-praveen-" + i,
        memberKey: "praveen",
        app: s.app,
        feature: s.feature,
        task: s.task,
        date: "2026-08-22",
        status: s.status
      });
    });

    // Seed Prince's exact 20 work records from spreadsheet
    const princeSeeds = [
      { app: "EtaPrise", feature: "Controlpanel", task: "Design Summry Card Appointment,Contract,Contact,Leave", status: "completed" },
      { app: "EtaPrise", feature: "Sales", task: "Integrated Sales module APIs with the frontend pages and implemented API data binding and functionality.", status: "completed" },
      { app: "EtaPrise", feature: "Job Defination", task: "Worked on Job Definition module UI, API integration, database design, and frontend functionality for OMNI Inside.", status: "completed" },
      { app: "EtaPrise(WHM)", feature: "Account", task: "Integrated Account module APIs with the frontend pages and implemented API data binding and functionality.", status: "completed" },
      { app: "EtaPrise", feature: "Appointment", task: "Integrated Appointment module APIs with the frontend pages and implemented API data binding and functionality.", status: "completed" },
      { app: "EtaPrise", feature: "Region & Territory", task: "Create new component + Db Table +Backendintegration", status: "completed" },
      { app: "EtaPrise", feature: "Contract", task: "Integrated Appointment module APIs with the frontend pages and implemented API data binding and functionality.", status: "completed" },
      { app: "EtaPrise", feature: "WhatsApp Integration", task: "Create ui in existing component + API config", status: "completed" },
      { app: "EtaPrise", feature: "IOmni Integration", task: "UI Desing", status: "completed" },
      { app: "EtaPrise", feature: "Elevator PM", task: "Summry card desing & Table Create", status: "completed" },
      { app: "EtaPrise", feature: "AI-Studio", task: "AI Studio: Worked on AI Chatbot, Knowledge Base, Appointment, Account, Contact, Notifications, API Integration, WhatsApp/SMS, chat UI, polls, events, and database", status: "completed" },
      { app: "EtaPrise", feature: "QA Testing (SonarQube)", task: "Testing api response + security enhancement", status: "completed" },
      { app: "EtaPrise", feature: "Docker", task: "Create Dockerfiles + build pipeline config", status: "completed" },
      { app: "DevOps", feature: "Kubernetes", task: "Cluster setup + deployment config", status: "completed" },
      { app: "DevOps", feature: "Nginx", task: "Config backend + frontend routing", status: "completed" },
      { app: "DevOps", feature: "Automation", task: "Create backend + frontend config + database table", status: "progress" },
      { app: "DevOps", feature: "Jenkins CI/CD", task: "Create pipeline + build/test/deploy stages", status: "progress" },
      { app: "DevOps", feature: "Enterprise Application", task: "Create whole website application", status: "progress" },
      { app: "WordPress App (EtaPrise) live", feature: "Performance Optimization", task: "Testing api response + security enhancement", status: "pending" },
      { app: "WordPress App (EtaPrise) live", feature: "CI Change #1687", task: "Ui Change Article ,Footer ,Header", status: "pending" }
    ];

    princeSeeds.forEach((s, i) => {
      initialSeed.push({
        id: "rec-prince-" + i,
        memberKey: "prince",
        app: s.app,
        feature: s.feature,
        task: s.task,
        date: "2026-08-22",
        status: s.status
      });
    });

    // Seed Ajay's exact 12 work records from spreadsheet
    const ajaySeeds = [
      { app: "MS Entra Authentication", feature: "OAuth2 Login & Token Generation", task: "Azure AD OAuth2 login with access & refresh token setup.", status: "completed" },
      { app: "Dynamics 365 Integration", feature: "Account Module Sync", task: "Account data fetched & synced via Dataverse API.", status: "completed" },
      { app: "Dynamics 365 Integration", feature: "Contact Module Sync", task: "Contact data fetched & linked to Account via Dataverse API.", status: "completed" },
      { app: "Dynamics 365 Integration", feature: "Appointment Module Sync", task: "Appointment/scheduling data fetched via Dataverse API.", status: "completed" },
      { app: "Omni Third-Party Integration", feature: "Department Master Sync", task: "Department master data synced from Omni.", status: "completed" },
      { app: "Omni Third-Party Integration", feature: "Service Master Sync", task: "Service Category & Sub-Category synced from Omni.", status: "completed" },
      { app: "Omni Third-Party Integration", feature: "Work Order Ingestion", task: "Omni Work Orders ingested with Department & Service mapping.", status: "completed" },
      { app: "ElevatorPM -> WMS Integration", feature: "Elevator to Warehouse Linking", task: "ElevatorPM linked with WMS for stock & dispatch sync.", status: "completed" },
      { app: "Warehouse Management System (WMS)", feature: "Complete WMS", task: "Full WMS designed, developed & deployed end-to-end.", status: "completed" },
      { app: "Code Quality & Testing", feature: "SonarQube Analysis", task: "Code quality checked via SonarQube Quality Gate.", status: "progress" },
      { app: "Containerization", feature: "Docker Containerization", task: "App containerized using Docker & docker-compose.", status: "progress" },
      { app: "Systemd Automation & Execution Testing", feature: "Systemd Service & Timer", task: "Scheduled service/timer configured & verified with logs.", status: "pending" }
    ];

    ajaySeeds.forEach((s, i) => {
      initialSeed.push({
        id: "rec-ajay-" + i,
        memberKey: "ajay",
        app: s.app,
        feature: s.feature,
        task: s.task,
        date: "2026-08-22",
        status: s.status
      });
    });

    // Seed Jigar's exact 15 work records from spreadsheet
    const jigarSeeds = [
      { app: "Etaprise", feature: "Accounts", task: "New component create", status: "completed" },
      { app: "Etaprise", feature: "Contacts", task: "New component create", status: "completed" },
      { app: "Etaprise", feature: "Appointment", task: "New component + existing component", status: "completed" },
      { app: "Etaprise", feature: "Work Order", task: "Omni workorder integration", status: "completed" },
      { app: "Etaprise", feature: "Part Request", task: "Create new component + Approval button config", status: "completed" },
      { app: "Etaprise", feature: "Design", task: "Create 14 pdf template create + using Html2Pdf + 4 module", status: "pending" },
      { app: "Etaprise", feature: "Mobile Config", task: "Create backend + frontend config + database table", status: "completed" },
      { app: "Etaprise", feature: "Support Portal", task: "Create whole website application", status: "completed" },
      { app: "Etaprise", feature: "Live Panel", task: "Create canvas of live panel + add signalr + config hub in backend", status: "completed" },
      { app: "Etaprise", feature: "Flow", task: "Create starting flow of whole application + ui", status: "progress" },
      { app: "Etaprise", feature: "Sonar Q", task: "Testing api response + security enhancement", status: "completed" },
      { app: "Etaprise", feature: "Aircall Integration", task: "Create ui in existing component", status: "progress" },
      { app: "Etaprise", feature: "Clock In / Clock Out", task: "Add camera feature + Checklist", status: "completed" },
      { app: "Etaprise", feature: "IAMOmni", task: "New component + Create sandbox environment + Integrate omni apis sync", status: "pending" },
      { app: "Etaprise", feature: "Controlpanel", task: "Appointment + Contract + PartRequest + Leaves + Accreditation + Expence", status: "completed" }
    ];

    jigarSeeds.forEach((s, i) => {
      initialSeed.push({
        id: "rec-jigar-" + i,
        memberKey: "jigar",
        app: s.app,
        feature: s.feature,
        task: s.task,
        date: "2026-08-22",
        status: s.status
      });
    });

    // Seed Devyani's exact 21 work records from spreadsheet
    const devyaniSeeds = [
      { app: "Etaprise", feature: "General / R&D", task: "Conducted R&D on the Etaprise application to understand module functionality and system workflow.", status: "completed" },
      { app: "Etaprise", feature: "General / R&D", task: "Explored application features and analyzed navigation across different modules; documented key observations for future reference; enhanced", status: "completed" },
      { app: "Etaprise", feature: "PDF Testing", task: "Performed PDF functionality testing across application modules. Verified PDF generation, download, and content accuracy.", status: "completed" },
      { app: "Etaprise", feature: "PDF Testing", task: "Identified and documented issues in the Excel defect tracker. Updated defect details with relevant observations for further analysis.", status: "completed" },
      { app: "Etaprise", feature: "Estimates and Quotes(PDF Testing)", task: "Performed PDF functionality testing for the Estimates and Quotes modules. Verified PDF generation, download, and data accuracy.", status: "completed" },
      { app: "Etaprise", feature: "Estimates and Quotes(PDF Testing)", task: "Identified issues during testing and documented them in the Excel defect tracker. Updated defect details with relevant observations for further", status: "completed" },
      { app: "Etaprise", feature: "Work Orders(PDF Testing)", task: "Performed testing for the Work Orders module. Verified the Edit functionality and validated that all existing data is displayed and updated co", status: "completed" },
      { app: "Etaprise", feature: "Work Orders(PDF Testing)", task: "Tested PDF generation for Work Orders. Verified PDF content, formatting, and data accuracy against the Work Order details. Documented", status: "completed" },
      { app: "Etaprise", feature: "Work Orders(PDF Testing)", task: "Re-tested the Work Orders module - verified Edit functionality and validated that all existing data is displayed and updated correctly; review", status: "completed" },
      { app: "Etaprise", feature: "Work Orders(PDF Testing)", task: "Re-tested PDF generation for Work Orders - verified PDF content, formatting, and data accuracy against Work Order details; documented", status: "completed" },
      { app: "Etaprise (WMS)", feature: "WMS Application Modules", task: "Executed test cases for the WMS application modules. Validated functionality across key workflows to ensure expected system behavior. V", status: "completed" },
      { app: "Etaprise (WMS)", feature: "WMS Application Modules", task: "Identified defects and logged issues with proper test evidence. Re-tested resolved issues to confirm fixes and ensure stability. Documented", status: "completed" },
      { app: "Warehouse Management System (WMS)", feature: "Inbound / Inventory / Outbound", task: "Created and documented test cases for warehouse modules. Prepared End-to-End flow mapping from Inbound to Outbound process.", status: "completed" },
      { app: "Warehouse Management System (WMS)", feature: "Inbound / Inventory / Outbound", task: "Tested Inbound, Inventory, and Outbound flows for data accuracy and process validation. Verified system behavior, status flow, and module", status: "completed" },
      { app: "Etaprise (Fleet Management)", feature: "UI / Navigation", task: "Reviewed the website flow and verified the overall navigation. Worked on the UI and fixed layout, alignment, and consistency issues.", status: "completed" },
      { app: "Etaprise (Fleet Management)", feature: "UI / Pagination", task: "Added pagination functionality to tables and verified its behavior.", status: "completed" },
      { app: "Etaprise (WMS)", feature: "Supplier Management (Vendor)", task: "Worked on the Supplier Management (Vendor) module. Added address suggestion functionality with map-based location selection. Tested", status: "completed" },
      { app: "Etaprise (WMS)", feature: "Item Master", task: "Worked on the Item Master module. Added search functionality to the required columns, updated and aligned the search fields with the exis", status: "completed" },
      { app: "Etaprise (WMS)", feature: "API Testing / Item Master", task: "Tested APIs for different modules and verified response functionality; validated API data and checked expected results. Tested the Item Ma", status: "progress" },
      { app: "Etaprise (WMS)", feature: "API Mapping (Cross-Module)", task: "Reviewed the APIs used across different WMS modules. Checked and analyzed API responses and data flow for each module. Verified wh", status: "progress" },
      { app: "Etaprise (WMS)", feature: "Dashboard / Dark Theme UI", task: "Fixed UI Issues related to the dark theme. Updated the application logo and made the required dashboard changes; removed unnecessary", status: "pending" }
    ];

    devyaniSeeds.forEach((s, i) => {
      initialSeed.push({
        id: "rec-devyani-" + i,
        memberKey: "devyani",
        app: s.app,
        feature: s.feature,
        task: s.task,
        date: "2026-08-22",
        status: s.status
      });
    });

    // Seed Tanisha's exact 39 work records from spreadsheet
    const tanishaSeeds = [
      { app: "Region Territory", feature: "Google Maps Integration", task: "Integrated Google Maps into the Region Territory module to provide an interactive map for managing and viewing geographical territories.", status: "completed" },
      { app: "Region Territory", feature: "DDS & OSM Layers", task: "Added DDS and OpenStreetMap (OSM) layers to fetch and display geographical/boundary information on the map.", status: "completed" },
      { app: "Region Territory", feature: "Administrative Area Selection", task: "Implemented selection based on Country, Administrative Area Level 1, Administrative Area Level 2, Locality, and other geographical levels.", status: "completed" },
      { app: "Region Territory", feature: "Address & Postal Code Search", task: "Added functionality to search using an address or postal code and automatically highlight the respective geographical area on the map.", status: "completed" },
      { app: "Region Territory", feature: "Drawing Tools", task: "Added Rectangle, Circle, and Freehand drawing tools to allow users to create custom geographical boundaries.", status: "completed" },
      { app: "Region Territory", feature: "Territory Management", task: "Implemented Save, Update, and Delete functionality for created territories/shapes.", status: "completed" },
      { app: "Region Territory", feature: "Clear Functionality", task: "Added a Clear button to remove currently drawn shapes and reset the map selection.", status: "completed" },
      { app: "Region Territory", feature: "Technician Assignment", task: "Added functionality to assign technicians to created geographical territories.", status: "completed" },
      { app: "Work Order", feature: "Map Integration", task: "Worked on the Work Order and Dispatch Board module and integrated multiple map providers for displaying work orders and locations.", status: "completed" },
      { app: "Work Order", feature: "Google Maps", task: "Integrated Google Maps for location tracking and displaying work order-related geographical information.", status: "completed" },
      { app: "Work Order", feature: "OSM", task: "Integrated OpenStreetMap for displaying map and location information.", status: "completed" },
      { app: "Work Order", feature: "Leaflet", task: "Integrated Leaflet maps and worked on map rendering, markers, and location-related functionality.", status: "completed" },
      { app: "Work Order", feature: "ESRI Maps", task: "Integrated ESRI Maps as an additional map provider for the Work Order and Dispatch Board.", status: "completed" },
      { app: "Work Order", feature: "Road & Satellite Views", task: "Added Road View and Satellite View functionality for the supported map providers.", status: "completed" },
      { app: "Dispatch Board", feature: "Map Handling", task: "Worked on map switching, location markers, work order locations, routing, and various map-related UI/functional issues.", status: "completed" },
      { app: "PDF", feature: "Estimate & Quote", task: "Implemented customizable PDF designs for Estimate and Quote documents.", status: "completed" },
      { app: "PDF", feature: "Invoice", task: "Added customizable PDF design support for Invoice documents.", status: "completed" },
      { app: "PDF", feature: "Work Order", task: "Added customizable PDF design support for Work Order documents.", status: "completed" },
      { app: "PDF", feature: "Purchase Order", task: "Added customizable PDF design support for Purchase Order documents.", status: "completed" },
      { app: "PDF", feature: "Design Settings", task: "Created/implemented a Design Settings page where users can select the required PDF design.", status: "completed" },
      { app: "PDF", feature: "12 Designs", task: "Implemented 12 different PDF design templates that users can select based on their requirements.", status: "completed" },
      { app: "PDF", feature: "PDFMake Integration", task: "Used PDFMake to generate actual structured PDFs instead of generating PDFs from screenshots or webpage images.", status: "completed" },
      { app: "PDF", feature: "Dynamic Design Selection", task: "Integrated the selected design from Settings into the corresponding Estimate, Quote, Invoice, Work Order, and Purchase Order PDFs.", status: "completed" },
      { app: "PDF", feature: "Layout & Formatting Fixes", task: "Fixed PDF issues such as table width, checkbox rendering, themes, spacing, alignment, and overall document formatting.", status: "completed" },
      { app: "Fleet Management", feature: "System Development", task: "Developed the Fleet Management system for managing drivers, vehicles, demands, trips, scheduling, and assignment workflows.", status: "completed" },
      { app: "Fleet Management", feature: "Driver Assignment", task: "Developed functionality to assign eligible drivers to trips based on configured business rules.", status: "completed" },
      { app: "Fleet Management", feature: "Rule Engine", task: "Developed a Rule Engine page to configure and manage active rules used during trip and driver assignment.", status: "completed" },
      { app: "Fleet Management", feature: "Rule Validation", task: "Implemented validation to ensure that active rules are properly checked before assigning drivers to trips.", status: "completed" },
      { app: "Fleet Management", feature: "Rule Application", task: "Added a dedicated interface to show how rules are being applied during the scheduling and assignment process.", status: "completed" },
      { app: "Fleet Management", feature: "Excel Import", task: "Added Excel import functionality to upload Fleet Management data such as demand, driver, and vehicle information.", status: "completed" },
      { app: "Fleet Management", feature: "Excel Validation", task: "Implemented validation for imported Excel data and provided users with validation results/errors for incorrect records.", status: "completed" },
      { app: "Fleet Management", feature: "Demand Management", task: "Worked on demand import and processing workflows to convert requirements into trips for scheduling.", status: "completed" },
      { app: "Fleet Management", feature: "Auto Scheduler", task: "Developed the Auto Scheduler flow to automatically generate and assign trips based on driver, vehicle, and active business-rule eligibility.", status: "completed" },
      { app: "Fleet Management", feature: "Trip Management", task: "Added functionality to review, modify, assign, and manage generated trips before proceeding to the next stage.", status: "completed" },
      { app: "Fleet Management", feature: "Integration with Etaprise", task: "Worked on integrating and validating Fleet Management functionality with the existing Etaprise system and its data/workflows.", status: "completed" },
      { app: "Fleet Management", feature: "UI Development", task: "Developed and improved multiple Fleet Management pages including Driver Master, Vehicle Master, Demand Import, Auto Scheduler, Schedule Board, Exceptions, and related sections.", status: "progress" },
      { app: "Fleet Management", feature: "Testing & Verification", task: "Tested the complete workflow and verified that rules, driver assignment, trip generation, Excel validation, and related functionality were working correctly.", status: "progress" },
      { app: "Overall", feature: "Bug Fixing & Improvements", task: "Continuously identified and fixed UI, functional, API, database, routing, integration, and PDF-related issues across different modules.", status: "pending" },
      { app: "Overall", feature: "Legacy Code Integration", task: "Integrated new features into existing project code while ensuring existing functionality and default behavior were preserved.", status: "pending" }
    ];

    tanishaSeeds.forEach((s, i) => {
      initialSeed.push({
        id: "rec-tanisha-" + i,
        memberKey: "tanisha",
        app: s.app,
        feature: s.feature,
        task: s.task,
        date: "2026-08-22",
        status: s.status
      });
    });

    dbRecords = initialSeed;
    saveRecordsToLocal();
  }

  if (dbRecords && !dbRecords.some(r => r.memberKey === "praveen")) {
    const praveenSeeds = [
      { app: "EtaPrise", feature: "System Architecture", task: "Omni Inside System Architecture, Microservices & Database Schema Design", status: "completed" },
      { app: "EtaPrise", feature: "Sprint Management", task: "Sprint Planning, Developer Task Assignment, Velocity & Milestone Tracking", status: "completed" },
      { app: "EtaPrise", feature: "Code Review & QA", task: "Comprehensive Code Review & Pull Request Approval for Full-Stack Team", status: "completed" },
      { app: "Fleet Management", feature: "Rule Engine Review", task: "Architected Driver Assignment Rule Engine & Route Optimization Logic", status: "completed" },
      { app: "DevOps", feature: "Production Deployment", task: "Docker Containerization, K8s Cluster Management & Jenkins CI/CD Hardening", status: "completed" },
      { app: "AI-Studio", feature: "Chatbot Architecture", task: "Evaluated AI Studio LLM Chatbot APIs & Knowledge Base Ingestion Pipeline", status: "completed" },
      { app: "Security", feature: "SonarQube & OWASP", task: "Security Vulnerability Mitigation & Code Quality Assurance Audit", status: "completed" },
      { app: "Database", feature: "PostgreSQL Tuning", task: "Database Indexing, Query Optimization & Connection Pool Tuning", status: "progress" }
    ];
    praveenSeeds.forEach((s, i) => {
      dbRecords.unshift({
        id: "rec-praveen-" + i,
        memberKey: "praveen",
        app: s.app,
        feature: s.feature,
        task: s.task,
        date: "2026-08-22",
        status: s.status
      });
    });
    saveRecordsToLocal();
  }
}

function saveRecordsToLocal() {
  localStorage.setItem("hie_work_records", JSON.stringify(dbRecords));
}

// ===== NAVIGATION: COMPANY RECORDS =====
function showCompanyRecords() {
  currentMember = null;
  currentTab = "company-records";

  // Hide sections
  welcomeSection.style.display = "none";
  memberDetail.style.display = "none";
  const ttSec = document.getElementById("timeTrackingSection"); if (ttSec) ttSec.style.display = "none";
  const wmSec = document.getElementById("workManagementSection"); if (wmSec) wmSec.style.display = "none";

  const timeTrackingBtn = document.getElementById("timeTrackingBtn");
  if (timeTrackingBtn) timeTrackingBtn.classList.remove("active");
  const workManagementBtn = document.getElementById("workManagementBtn");
  if (workManagementBtn) workManagementBtn.classList.remove("active");

  // Show Company Records Panel
  const companyRecordsSection = document.getElementById("companyRecordsSection");
  companyRecordsSection.style.display = "block";
  companyRecordsSection.style.animation = "none";
  requestAnimationFrame(() => { companyRecordsSection.style.animation = "fadeIn 0.4s ease"; });

  bcMember.textContent = "Company Records";

  // Reset query state
  masterQuery.page = 1;
  masterQuery.search = "";
  masterQuery.status = "all";
  masterQuery.sort = "date-desc";

  // Bind master input elements
  $("#masterSearchInput").val("");
  $("#masterSortSelect").val("date-desc");
  $(".company-records-section .filter-tag").removeClass("active").first().addClass("active");

  // Bind master event handlers once
  $("#masterSearchInput").off("keyup input").on("keyup input", function () {
    masterQuery.search = $(this).val();
    masterQuery.page = 1;
    renderMasterRecords();
  });

  $("#masterSortSelect").off("change").on("change", function () {
    masterQuery.sort = $(this).val();
    masterQuery.page = 1;
    renderMasterRecords();
  });

  $(".company-records-section .filter-tag").off("click").on("click", function () {
    $(".company-records-section .filter-tag").removeClass("active");
    $(this).addClass("active");
    masterQuery.status = $(this).data("filter");
    masterQuery.page = 1;
    renderMasterRecords();
  });

  $("#masterExportPdfBtn").off("click").on("click", function () {
    const list = getFilteredMasterRecords();
    exportMasterPDF(list);
  });

  $("#masterExportExcelBtn").off("click").on("click", function () {
    const list = getFilteredMasterRecords();
    exportMasterExcel(list);
  });

  $("#companyBackBtn").off("click").on("click", function () {
    $("#backBtn").trigger("click");
  });

  $("#masterAddBtn").off("click").on("click", function () {
    openAddModal();
  });

  // Initial render
  renderMasterRecords();

  if (window.innerWidth <= 768) closeMobileSidebar();
}

function getFilteredMasterRecords() {
  let filtered = dbRecords.map(r => {
    const m = members[r.memberKey] || { name: "Unknown", role: "Developer", color: "#6b5fa0", solidColor: "#6b5fa0" };
    return { ...r, empName: m.name, empRole: m.role, empColor: m.solidColor, empAvatar: m.avatar };
  });

  if (masterQuery.status !== "all") {
    filtered = filtered.filter(r => r.status === masterQuery.status);
  }

  if (masterQuery.search) {
    const q = masterQuery.search.toLowerCase().trim();
    filtered = filtered.filter(r =>
      r.empName.toLowerCase().includes(q) ||
      r.app.toLowerCase().includes(q) ||
      r.feature.toLowerCase().includes(q) ||
      r.task.toLowerCase().includes(q)
    );
  }
  return filtered;
}

// ===== MASTER RECORDS RENDER ENGINE =====
function renderMasterRecords() {
  // 1. Filter
  let filtered = getFilteredMasterRecords();

  // Update stats label
  $("#masterEntriesCount").text(filtered.length + (filtered.length === 1 ? " Entry" : " Entries"));

  // 2. Sort
  filtered.sort((a, b) => {
    if (masterQuery.sort === "date-desc") return new Date(b.date) - new Date(a.date);
    if (masterQuery.sort === "date-asc") return new Date(a.date) - new Date(b.date);
    if (masterQuery.sort === "name-asc") return a.empName.localeCompare(b.empName);
    if (masterQuery.sort === "status-asc") return a.status.localeCompare(b.status);
    return 0;
  });

  // 3. Paginate
  const total = filtered.length;
  const pages = Math.ceil(total / masterQuery.limit) || 1;
  if (masterQuery.page > pages) masterQuery.page = pages;

  const start = (masterQuery.page - 1) * masterQuery.limit;
  const end = Math.min(start + masterQuery.limit, total);
  const sliced = filtered.slice(start, end);

  // Render table rows
  const tbody = $("#masterTable tbody");
  tbody.empty();

  if (sliced.length === 0) {
    tbody.append(`<tr><td colspan="8" style="text-align:center; padding:30px; color:#8c8599;">No records found matching criteria.</td></tr>`);
  } else {
    sliced.forEach((r, idx) => {
      const globalIndex = start + idx + 1;
      const avatarHtml = r.empAvatar
        ? `<img src="${r.empAvatar}" alt="${r.empName}" class="emp-avatar" style="object-fit:cover;" />`
        : `<div class="emp-avatar" style="background:${r.empColor}">${r.empName[0]}</div>`;

      tbody.append(`
        <tr class="${idx % 2 === 0 ? 'wr-row-even' : 'wr-row-odd'}">
          <td class="wr-num">${globalIndex}</td>
          <td>
            <div class="emp-cell">
              ${avatarHtml}
              <div class="emp-meta">
                <span class="emp-name">${r.empName}</span>
                <span class="emp-role">${r.empRole}</span>
              </div>
            </div>
          </td>
          <td><span class="wr-app-badge badge-eta">${r.app}</span></td>
          <td class="wr-feature" style="font-weight:600; color:#1a1035;">${r.feature}</td>
          <td class="wr-task" style="color:#6e6580; font-size:0.85rem;">${r.task}</td>
          <td style="color:#6e6580; font-size:0.85rem; white-space:nowrap;">
            ${new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </td>
          <td>
            <span class="badge-status status-${r.status}" data-id="${r.id}">
              ${r.status === "completed" ? "Completed" : r.status === "progress" ? "In Progress" : "Pending"}
            </span>
          </td>
          <td>
            <div class="actions-cell">
              <button class="btn-icon btn-view" data-id="${r.id}" title="View Details"><span class="material-icons">visibility</span></button>
              <button class="btn-icon btn-edit" data-id="${r.id}" title="Edit"><span class="material-icons">edit</span></button>
              <button class="btn-icon btn-delete" data-id="${r.id}" title="Delete"><span class="material-icons">delete</span></button>
            </div>
          </td>
        </tr>
      `);
    });
  }

  // Render Pagination controls
  renderPagination("#masterPagination", masterQuery, total, pages, renderMasterRecords);

  // Bind actions
  bindTableActionEvents("#masterTable", renderMasterRecords);
}

// ===== MEMBER RECORDS RENDER ENGINE =====
function renderMemberRecords() {
  const m = members[currentMember];
  let filtered = dbRecords.filter(r => r.memberKey === currentMember);

  if (memberQuery.status !== "all") {
    filtered = filtered.filter(r => r.status === memberQuery.status);
  }

  if (memberQuery.search) {
    const q = memberQuery.search.toLowerCase().trim();
    filtered = filtered.filter(r =>
      r.app.toLowerCase().includes(q) ||
      r.feature.toLowerCase().includes(q) ||
      r.task.toLowerCase().includes(q)
    );
  }

  // Update stats label
  $("#entriesCount").text(filtered.length + (filtered.length === 1 ? " Entry" : " Entries"));

  // Sort
  filtered.sort((a, b) => {
    if (memberQuery.sort === "date-desc") return new Date(b.date) - new Date(a.date);
    if (memberQuery.sort === "date-asc") return new Date(a.date) - new Date(b.date);
    if (memberQuery.sort === "app-asc") return a.app.localeCompare(b.app);
    if (memberQuery.sort === "status-asc") return a.status.localeCompare(b.status);
    return 0;
  });

  // Paginate
  const total = filtered.length;
  const pages = Math.ceil(total / memberQuery.limit) || 1;
  if (memberQuery.page > pages) memberQuery.page = pages;

  const start = (memberQuery.page - 1) * memberQuery.limit;
  const end = Math.min(start + memberQuery.limit, total);
  const sliced = filtered.slice(start, end);

  const tbody = $("#wrTable tbody");
  tbody.empty();

  if (sliced.length === 0) {
    tbody.append(`<tr><td colspan="7" style="text-align:center; padding:30px; color:#8c8599;">No records found matching criteria.</td></tr>`);
  } else {
    sliced.forEach((r, idx) => {
      const globalIndex = start + idx + 1;
      tbody.append(`
        <tr class="${idx % 2 === 0 ? 'wr-row-even' : 'wr-row-odd'}">
          <td class="wr-num">${globalIndex}</td>
          <td><span class="wr-app-badge badge-eta">${r.app}</span></td>
          <td class="wr-feature" style="font-weight:600; color:#1a1035;">${r.feature}</td>
          <td class="wr-task" style="color:#6e6580; font-size:0.85rem;">${r.task}</td>
          <td style="color:#6e6580; font-size:0.85rem; white-space:nowrap;">
            ${new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </td>
          <td>
            <span class="badge-status status-${r.status}" data-id="${r.id}">
              ${r.status === "completed" ? "Completed" : r.status === "progress" ? "In Progress" : "Pending"}
            </span>
          </td>
          <td>
            <div class="actions-cell">
              <button class="btn-icon btn-view" data-id="${r.id}" title="View Details"><span class="material-icons">visibility</span></button>
              <button class="btn-icon btn-edit" data-id="${r.id}" title="Edit"><span class="material-icons">edit</span></button>
              <button class="btn-icon btn-delete" data-id="${r.id}" title="Delete"><span class="material-icons">delete</span></button>
            </div>
          </td>
        </tr>
      `);
    });
  }

  // Render Pagination controls
  renderPagination("#memberPagination", memberQuery, total, pages, renderMemberRecords);

  // Bind actions
  bindTableActionEvents("#wrTable", renderMemberRecords);
}

function getFilteredMemberRecords() {
  return dbRecords.filter(r => r.memberKey === currentMember);
}

// ===== PAGINATION RENDER HELPERS =====
function renderPagination(containerId, queryObj, total, pages, renderFn) {
  const container = $(containerId);
  container.empty();

  const startEntry = total === 0 ? 0 : (queryObj.page - 1) * queryObj.limit + 1;
  const endEntry = Math.min(startEntry + queryObj.limit - 1, total);

  const infoSpan = `<span class="pag-info">Showing ${startEntry} to ${endEntry} of ${total} entries</span>`;

  let buttonsHtml = '<div class="pag-buttons">';

  // Prev button
  const prevDisabled = queryObj.page === 1 ? 'disabled' : '';
  buttonsHtml += `<button class="pag-btn pag-btn-wide ${prevDisabled}" data-page="${queryObj.page - 1}">Previous</button>`;

  // Page buttons
  for (let p = 1; p <= pages; p++) {
    const activeClass = queryObj.page === p ? 'active' : '';
    buttonsHtml += `<button class="pag-btn ${activeClass}" data-page="${p}">${p}</button>`;
  }

  // Next button
  const nextDisabled = queryObj.page === pages ? 'disabled' : '';
  buttonsHtml += `<button class="pag-btn pag-btn-wide ${nextDisabled}" data-page="${queryObj.page + 1}">Next</button>`;

  buttonsHtml += '</div>';

  container.append(infoSpan);
  container.append(buttonsHtml);

  // Bind click actions
  container.find(".pag-btn").off("click").on("click", function () {
    if ($(this).hasClass("disabled") || $(this).hasClass("active")) return;
    queryObj.page = parseInt($(this).data("page"));
    renderFn();
  });
}

// ===== TABLE ACTIONS BINDINGS (CYCLE STATUS, EDIT, DELETE, DETAILS) =====
function bindTableActionEvents(tableId, renderFn) {
  // 1. Status cycle (Pending -> In Progress -> Completed)
  $(`${tableId} .badge-status`).off("click").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).data("id");
    const record = dbRecords.find(r => r.id === id);
    if (record) {
      if (record.status === "pending") record.status = "progress";
      else if (record.status === "progress") record.status = "completed";
      else record.status = "pending";

      saveRecordsToLocal();
      renderMembersGrid();
      renderSidebarNav();
      renderFn();
    }
  });

  // 2. View details modal
  $(`${tableId} .btn-view`).off("click").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).data("id");
    const r = dbRecords.find(x => x.id === id);
    if (r) {
      const emp = members[r.memberKey] || { name: "Unknown" };
      $("#detailRecordEmployee").text(emp.name);
      $("#detailRecordApp").text(r.app);
      $("#detailRecordFeature").text(r.feature);
      $("#detailRecordDate").text(new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));

      const badge = $("#detailRecordStatus");
      badge.removeClass().addClass(`badge-status status-${r.status}`);
      badge.text(r.status === "completed" ? "Completed" : r.status === "progress" ? "In Progress" : "Pending");

      $("#detailRecordTask").text(r.task);
      $("#detailsModal").show();
    }
  });

  // 3. Edit modal
  $(`${tableId} .btn-edit`).off("click").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).data("id");
    openEditModal(id, currentMember);
  });

  // 4. Delete modal confirmation
  $(`${tableId} .btn-delete`).off("click").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).data("id");
    activeDeleteId = id;
    $("#deleteConfirmModal").show();
  });
}

// ===== CRUD MODAL CONTROLS =====
function openAddModal(lockedMemberKey) {
  $("#modalTitle").text(lockedMemberKey ? `Add Work Record for ${members[lockedMemberKey].name}` : "Add Work Record");
  $("#recordId").val("");
  $("#recordApp").val("");
  $("#recordFeature").val("");
  $("#recordTask").val("");
  $("#recordDate").val(new Date().toISOString().substring(0, 10)); // Default current date
  $("#recordStatus").val("completed");

  if (lockedMemberKey) {
    $("#recordEmployee").val(lockedMemberKey).prop("disabled", true);
    $("#employeeSelectGroup").hide();
  } else {
    $("#recordEmployee").val("prince").prop("disabled", false);
    $("#employeeSelectGroup").show();
  }

  $("#recordModal").show();
}

function openEditModal(id, lockedMemberKey) {
  const r = dbRecords.find(x => x.id === id);
  if (!r) return;

  $("#modalTitle").text("Edit Work Record");
  $("#recordId").val(r.id);
  $("#recordApp").val(r.app);
  $("#recordFeature").val(r.feature);
  $("#recordTask").val(r.task);
  $("#recordDate").val(r.date);
  $("#recordStatus").val(r.status);

  if (lockedMemberKey) {
    $("#recordEmployee").val(r.memberKey).prop("disabled", true);
    $("#employeeSelectGroup").hide();
  } else {
    $("#recordEmployee").val(r.memberKey).prop("disabled", false);
    $("#employeeSelectGroup").show();
  }

  $("#recordModal").show();
}

// ===== REGISTER MODAL EVENT LISTENERS =====
function setupModalEvents() {
  // Modal Overlays and Cancel buttons close them
  $(".modal-overlay, #cancelRecordModal, #closeRecordModal").on("click", function () {
    $("#recordModal").hide();
  });

  $(".modal-overlay, #cancelDeleteModal, #closeDeleteModal").on("click", function () {
    $("#deleteConfirmModal").hide();
  });

  $(".modal-overlay, #closeDetailsModal, #closeDetailsBtn").on("click", function () {
    $("#detailsModal").hide();
  });

  // Submit record form (Add / Edit save)
  $("#recordForm").on("submit", function (e) {
    e.preventDefault();
    const id = $("#recordId").val();
    const memberKey = $("#recordEmployee").val();
    const app = $("#recordApp").val();
    const feature = $("#recordFeature").val();
    const task = $("#recordTask").val();
    const date = $("#recordDate").val();
    const status = $("#recordStatus").val();

    if (id) {
      // Edit mode
      const idx = dbRecords.findIndex(r => r.id === id);
      if (idx !== -1) {
        dbRecords[idx].memberKey = memberKey;
        dbRecords[idx].app = app;
        dbRecords[idx].feature = feature;
        dbRecords[idx].task = task;
        dbRecords[idx].date = date;
        dbRecords[idx].status = status;
      }
    } else {
      // Add mode
      const newId = "rec-" + Date.now();
      dbRecords.push({
        id: newId,
        memberKey: memberKey,
        app: app,
        feature: feature,
        task: task,
        date: date,
        status: status
      });
    }

    saveRecordsToLocal();
    renderMembersGrid();
    renderSidebarNav();
    $("#recordModal").hide();

    // Refresh the active view
    if (currentMember) {
      renderMemberRecords();
    } else {
      renderMasterRecords();
    }
  });

  // Confirm Delete Action
  $("#confirmDeleteBtn").on("click", function () {
    if (activeDeleteId) {
      dbRecords = dbRecords.filter(r => r.id !== activeDeleteId);
      saveRecordsToLocal();
      renderMembersGrid();
      renderSidebarNav();
      activeDeleteId = null;
      $("#deleteConfirmModal").hide();

      // Refresh active view
      if (currentMember) {
        renderMemberRecords();
      } else {
        renderMasterRecords();
      }
    }
  });

  // 1. Open Add Employee Modal
  $("#addEmployeeBtn").off("click").on("click", function () {
    $("#employeeModalTitle").text("Add New Employee");
    $("#employeeId").val("");
    $("#empFormName").val("");
    $("#empFormRole").val("");
    $("#empFormEmail").val("");
    $("#empFormPhone").val("");
    $("#empFormJoined").val(new Date().toISOString().substring(0, 10));
    $("#empFormLocation").val("Surat, Gujarat");
    $("#empFormLead").val("Praveen Kumar");
    $("#empFormColor").val("#7c3aed");
    $("#empFormTags").val("JavaScript, React, UI/UX, DevOps, .Net, Angular, PgAdmin");
    $("#deleteEmployeeBtn").hide();
    $("#employeeModal").show();
  });

  // 2. Open Edit Profile Modal (from header)
  $("#editProfileBtn").off("click").on("click", function () {
    if (!currentMember) return;
    const m = members[currentMember];
    $("#employeeModalTitle").text("Edit Employee Profile");
    $("#employeeId").val(currentMember);
    $("#empFormName").val(m.name);
    $("#empFormRole").val(m.role);
    $("#empFormEmail").val(m.info.Email || "");
    $("#empFormPhone").val(m.info.Phone || "");

    let dateVal = new Date("2026-03-26").toISOString().substring(0, 10);
    if (m.info.Joined) {
      try {
        dateVal = new Date(m.info.Joined).toISOString().substring(0, 10);
      } catch (err) { }
    }
    $("#empFormJoined").val(dateVal);

    $("#empFormLocation").val(m.info.Location || "");
    $("#empFormLead").val(m.info["Team Lead"] || "");
    $("#empFormColor").val(m.solidColor || "#7c3aed");
    $("#empFormTags").val(m.tags.join(", "));
    $("#deleteEmployeeBtn").show();
    $("#employeeModal").show();
  });

  // 3. Cancel/Close Employee Modal
  $("#closeEmployeeModal, #cancelEmployeeModal").on("click", function () {
    $("#employeeModal").hide();
  });

  // 4. Save Employee Form
  $("#employeeForm").off("submit").on("submit", function (e) {
    e.preventDefault();
    const id = $("#employeeId").val();
    const name = $("#empFormName").val();
    const role = $("#empFormRole").val();
    const email = $("#empFormEmail").val();
    const phone = $("#empFormPhone").val();
    const joinedVal = $("#empFormJoined").val();
    const location = $("#empFormLocation").val();
    const lead = $("#empFormLead").val();
    const color = $("#empFormColor").val();
    const tagsText = $("#empFormTags").val();

    const tags = tagsText.split(",").map(t => t.trim()).filter(t => t.length > 0);

    let formattedJoined = "26 March 2026";
    if (joinedVal) {
      const dt = new Date(joinedVal);
      formattedJoined = dt.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    }

    const colorsMap = {
      "#7c3aed": "linear-gradient(135deg,#7c3aed,#a78bfa)",
      "#0891b2": "linear-gradient(135deg,#0891b2,#06b6d4)",
      "#059669": "linear-gradient(135deg,#059669,#34d399)",
      "#db2777": "linear-gradient(135deg,#db2777,#f472b6)",
      "#d97706": "linear-gradient(135deg,#d97706,#fbbf24)"
    };
    const gradient = colorsMap[color] || colorsMap["#7c3aed"];

    if (id) {
      const m = members[id];
      m.name = name;
      m.role = role;
      m.solidColor = color;
      m.color = gradient;
      m.tags = tags;
      m.info.Email = email;
      m.info.Phone = phone;
      m.info.Joined = formattedJoined;
      m.info.Location = location;
      m.info["Team Lead"] = lead;
    } else {
      const newKey = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      members[newKey] = {
        name: name,
        role: role,
        color: gradient,
        solidColor: color,
        tags: tags,
        tasks: 0,
        company: "Envision Beyond India Pvt Ltd",
        teamLead: lead,
        info: {
          Email: email,
          Phone: phone,
          Company: "Envision Beyond India Pvt Ltd",
          "Team Lead": lead,
          Joined: formattedJoined,
          Location: location,
          Status: "Active"
        },
        skills: [
          { name: "JavaScript", pct: 90 },
          { name: "React", pct: 82 },
          { name: "CSS", pct: 75 },
          { name: "Node.js", pct: 60 },
          { name: ".Net", pct: 70 },
          { name: "Angular", pct: 78 },
          { name: "Pgadmin", pct: 65 },
          { name: "Wordpress", pct: 60 },
          { name: "Devops", pct: 68 }
        ],
        taskList: [],
        reports: { completed: 0, inProgress: 0, pending: 0 }
      };
    }

    saveMembersToLocal();
    populateEmployeeSelects();
    renderSidebarNav();
    setupSidebarNav();
    renderMembersGrid();

    $("#employeeModal").hide();

    if (id) {
      showMember(id, currentTab);
    }
  });

  // 5. Delete Employee Action
  $("#deleteEmployeeBtn").off("click").on("click", function () {
    const id = $("#employeeId").val();
    if (id && members[id]) {
      delete members[id];
      dbRecords = dbRecords.filter(r => r.memberKey !== id);
      saveMembersToLocal();
      saveRecordsToLocal();

      populateEmployeeSelects();
      renderSidebarNav();
      setupSidebarNav();
      renderMembersGrid();

      $("#employeeModal").hide();
      $("#backBtn").trigger("click");
    }
  });
}

// ===== MEMBER PROFILE MANAGEMENT =====
function initMembersDb() {
  let localMembers = localStorage.getItem("hie_members");
  if (localMembers) {
    try {
      const temp = JSON.parse(localMembers);
      if ((temp.ajay && temp.ajay.taskList && temp.ajay.taskList.some(t => t.title === "Implement payment gateway")) || (temp.tanisha && temp.tanisha.taskList && temp.tanisha.taskList.length < 39)) {
        localStorage.removeItem("hie_members");
        localMembers = null;
      }
    } catch (e) {
      localStorage.removeItem("hie_members");
      localMembers = null;
    }
  }

  if (localMembers) {
    members = JSON.parse(localMembers);
    members.praveen = DEFAULT_MEMBERS.praveen; // Update TL data with full responsibilities
    if (members.jigar) {
      members.jigar.avatar = "image/jigar.jpg";
    }

    // Ensure all member emails use @envisionbeyond.com
    Object.values(members).forEach(m => {
      if (m.info && m.info.Email) {
        m.info.Email = m.info.Email.replace("@hie.com", "@envisionbeyond.com");
      }
    });
    saveMembersToLocal();
  } else {
    members = DEFAULT_MEMBERS;
    saveMembersToLocal();
  }
  populateEmployeeSelects();
}

function saveMembersToLocal() {
  localStorage.setItem("hie_members", JSON.stringify(members));
}

function populateEmployeeSelects() {
  const select = $("#recordEmployee");
  select.empty();
  Object.entries(members).forEach(([key, m]) => {
    const isLead = m.isLead || (m.role && m.role.toLowerCase().includes("lead"));
    const label = isLead ? `${m.name} (Team Lead)` : m.name;
    select.append(`<option value="${key}">${label}</option>`);
  });
}

function renderSidebarNav() {
  const list = $("#sidebarNavList");
  list.find("li:not(#nav-company-records):not(#nav-time-tracking)").remove();
  $("#badge-company-records").text(dbRecords.length);

  Object.entries(members).forEach(([key, m]) => {
    const taskCount = dbRecords.filter(r => r.memberKey === key).length;
    const isLead = m.isLead || (m.role && m.role.toLowerCase().includes("lead"));
    const leadBadge = isLead ? `<span class="nav-tl-tag" style="background:#7c3aed; color:#fff; font-size:0.65rem; font-weight:700; padding:1px 6px; border-radius:4px; margin-left:6px; letter-spacing:0.5px; vertical-align:middle;">TL</span>` : '';

    list.append(`
      <li class="nav-item" id="nav-${key}">
        <button class="nav-btn" data-member="${key}" aria-expanded="false">
          <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" stroke-width="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></span>
          <span class="nav-label">${m.name}${leadBadge}</span>
          <span class="nav-badge" id="badge-${key}">${taskCount}</span>
          <svg class="nav-arrow" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <ul class="nav-submenu" id="sub-${key}">
          <li><a href="#" class="sub-link" data-section="profile" data-member="${key}"><span class="material-icons sub-icon">person</span>Profile</a></li>
          <li><a href="#" class="sub-link" data-section="tasks" data-member="${key}"><span class="material-icons sub-icon">assignment</span>Tasks</a></li>
          <li><a href="#" class="sub-link" data-section="work-record" data-member="${key}"><span class="material-icons sub-icon">history</span>Work Record</a></li>
        </ul>
      </li>
    `);
  });
}

// ===== APPLICATION STARTUP LOGIC =====

// ===== DYNAMIC TIME GREETING =====
(function setupGreeting() {
  function setGreeting() {
    var hour = new Date().getHours();
    var text;
    if (hour >= 5 && hour < 12) { text = 'Good Morning'; }
    else if (hour >= 12 && hour < 17) { text = 'Good Afternoon'; }
    else if (hour >= 17 && hour < 21) { text = 'Good Evening'; }
    else { text = 'Good Night'; }

    var $el = $('#welcomeGreeting');
    if ($el.length) $el.text(text);
  }
  setGreeting();
  setInterval(setGreeting, 60000);
})();


// ===== LOGOUT / AVATAR DROPDOWN & USER PROFILE =====
(function setupLogout() {
  // Populate user profile info from sessionStorage
  var username = sessionStorage.getItem('wt_user') || 'admin';
  var fullName = sessionStorage.getItem('wt_user_name') || (username.charAt(0).toUpperCase() + username.slice(1));
  var role = sessionStorage.getItem('wt_user_role') || 'Super Admin';
  var initial = (fullName || username).charAt(0).toUpperCase();

  var $avatar = $('#topbarAvatar');
  var $ddIcon = $('#avatarDdIcon');
  var $ddName = $('#avatarDdName');
  var $dropdown = $('#avatarDropdown');

  var $sbAvatar = $('#sidebarUserAvatar');
  var $sbName = $('#sidebarUserName');
  var $sbRole = $('#sidebarUserRole');

  if ($avatar.length) $avatar.text(initial);
  if ($ddIcon.length) $ddIcon.text(initial);
  if ($ddName.length) $ddName.text(fullName);

  if ($sbAvatar.length) $sbAvatar.text(initial);
  if ($sbName.length) $sbName.text(fullName);
  if ($sbRole.length) $sbRole.text(role);

  // Toggle dropdown on avatar click
  $avatar.on('click', function (e) {
    e.stopPropagation();
    $dropdown.toggleClass('open');
  });

  // Close dropdown on outside click
  $(document).on('click', function () {
    $dropdown.removeClass('open');
  });

  // Prevent closing when clicking inside dropdown
  $dropdown.on('click', function (e) {
    e.stopPropagation();
  });

  // Logout button
  $('#logoutBtn').on('click', function () {
    sessionStorage.removeItem('wt_auth');
    sessionStorage.removeItem('wt_user');
    sessionStorage.removeItem('wt_user_name');
    sessionStorage.removeItem('wt_user_role');
    sessionStorage.removeItem('wt_user_email');
    window.location.replace('login.html');
  });
})();


/* ==========================================================================
   TIME TRACKING MODULE ENGINE
   ========================================================================== */

function getTtState() {
  const saved = localStorage.getItem("wt_time_tracking");
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { }
  }
  const defaultState = {
    isClockedIn: false,
    clockInTime: null,
    workMode: "Office",
    snapshotImg: null,
    activeBreak: null,
    todayLogs: [
      { type: "info", time: "09:00 AM", desc: "System initialized for today" }
    ],
    todayHoursFormatted: "0h 00m",
    weekHoursFormatted: "38h 15m",
    monthHoursFormatted: "162h 40m",
    overtimeFormatted: "+3h 45m",
    activeTaskTimer: null,
    timerSessions: [
      { id: 1, project: "EtaPrise ERP", task: "API Gateway Authorization", category: "Development", duration: "01:45:20", startedAt: "09:45 AM", status: "Completed" },
      { id: 2, project: "WorkTrack", task: "Design Kanban Board & Subtasks", category: "Design", duration: "02:10:15", startedAt: "01:30 PM", status: "Completed" },
      { id: 3, project: "ControlPanel", task: "Database Indexing & Query Tuning", category: "Testing", duration: "00:55:00", startedAt: "04:15 PM", status: "Completed" }
    ],
    timesheets: [
      { day: "Mon", date: "Aug 17, 2026", clockIn: "09:28 AM", clockOut: "06:35 PM", breakDur: "45m", effective: "8h 22m", overtime: "+0h 22m", verified: true, status: "Approved" },
      { day: "Tue", date: "Aug 18, 2026", clockIn: "09:30 AM", clockOut: "06:30 PM", breakDur: "45m", effective: "8h 15m", overtime: "+0h 15m", verified: true, status: "Approved" },
      { day: "Wed", date: "Aug 19, 2026", clockIn: "09:15 AM", clockOut: "07:15 PM", breakDur: "50m", effective: "9h 10m", overtime: "+1h 10m", verified: true, status: "Approved" },
      { day: "Thu", date: "Aug 20, 2026", clockIn: "09:32 AM", clockOut: "06:30 PM", breakDur: "45m", effective: "8h 13m", overtime: "+0h 13m", verified: true, status: "Approved" },
      { day: "Fri", date: "Aug 21, 2026", clockIn: "09:20 AM", clockOut: "08:00 PM", breakDur: "55m", effective: "9h 45m", overtime: "+1h 45m", verified: true, status: "Approved" }
    ],
    adjustments: [
      { id: "#ADJ-102", date: "2026-08-14", orig: "09:45 AM - 06:00 PM", req: "09:00 AM - 06:30 PM", reason: "Client deployment sync on-site", status: "Approved", approver: "Praveen Kumar" }
    ]
  };
  localStorage.setItem("wt_time_tracking", JSON.stringify(defaultState));
  return defaultState;
}

function saveTtState() {
  localStorage.setItem("wt_time_tracking", JSON.stringify(ttState));
}

function initTimeTracking() {
  ttState = getTtState();

  // Digital Live Clock
  function updateLiveClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    $("#ttLiveTime").text(timeStr);
    $("#ttLiveDate").text(dateStr);
  }
  updateLiveClock();
  if (ttClockInterval) clearInterval(ttClockInterval);
  ttClockInterval = setInterval(updateLiveClock, 1000);

  // Tab Switcher inside Time Tracking
  $("#ttTabBar .tab-btn").on("click", function () {
    const targetTab = $(this).data("tt-tab");
    switchTimeTrackingTab(targetTab);
  });

  // Work Mode Pills
  $(".wm-btn").on("click", function () {
    $(".wm-btn").removeClass("active");
    $(this).addClass("active");
    ttState.workMode = $(this).data("mode");
    saveTtState();
  });

  // Clock In / Out Main Button
  $("#ttMainClockBtn").on("click", handleClockInOutClick);

  // Camera Modal controls
  $("#closeCameraModal, #cancelCameraBtn, #cameraModal .modal-overlay").on("click", closeCameraModal);
  $("#captureAndClockBtn").on("click", captureAndClockIn);

  // Break pill clicks
  $(".break-pill-btn").on("click", function () {
    const type = $(this).data("type");
    const dur = $(this).data("time");
    startBreak(type, dur);
  });

  // End break button
  $("#ttEndBreakBtn").on("click", endActiveBreak);

  // Task Timer Stopwatch
  $("#ttTimerStartBtn").on("click", startTaskTimer);
  $("#ttTimerPauseBtn").on("click", pauseTaskTimer);
  $("#ttTimerStopBtn").on("click", stopTaskTimer);

  // Timesheets submit & approval
  $("#ttSubmitTimesheetBtn").on("click", function () {
    alert("Weekly timesheet submitted successfully for manager approval!");
    const lastRow = ttState.timesheets[ttState.timesheets.length - 1];
    if (lastRow) {
      lastRow.status = "Pending Approval";
      saveTtState();
      renderTimesheets();
    }
  });

  $("#ttApproveAllBtn").on("click", function () {
    ttState.timesheets.forEach(t => { t.status = "Approved"; });
    saveTtState();
    renderTimesheets();
    alert("All timesheet records approved by Super Admin!");
  });

  // Time Adjustment Modal
  $("#ttOpenAdjustModalBtn").on("click", function () {
    $("#adjDate").val(new Date().toISOString().split('T')[0]);
    $("#adjustmentModal").show();
  });
  $("#closeAdjustmentModal, #cancelAdjustmentBtn, #adjustmentModal .modal-overlay").on("click", function () {
    $("#adjustmentModal").hide();
  });
  $("#adjustmentForm").on("submit", function (e) {
    e.preventDefault();
    const newAdj = {
      id: "#ADJ-" + (100 + ttState.adjustments.length + 1),
      date: $("#adjDate").val(),
      orig: "09:30 AM - 06:30 PM",
      req: $("#adjClockIn").val() + " - " + $("#adjClockOut").val(),
      reason: $("#adjReason").val(),
      status: "Pending",
      approver: "Manager Review"
    };
    ttState.adjustments.unshift(newAdj);
    saveTtState();
    renderAdjustments();
    $("#adjustmentModal").hide();
    $("#adjustmentForm")[0].reset();
    alert("Adjustment request submitted successfully!");
  });

  // Back button in Time Tracking
  $("#ttBackBtn").on("click", function () {
    $("#timeTrackingSection").hide();
    welcomeSection.style.display = "block";
    bcMember.textContent = "Overview";
    document.querySelectorAll(".nav-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-expanded", "false"); });
    document.querySelectorAll(".nav-submenu").forEach(s => s.classList.remove("open"));
    document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
  });

  // Update UI on load
  syncTtUi();
}

function switchTimeTrackingTab(tab) {
  $("#ttTabBar .tab-btn").removeClass("active");
  $(`#ttTabBar .tab-btn[data-tt-tab="${tab}"]`).addClass("active");

  $("#ttPanelClockIn, #ttPanelTimer, #ttPanelTimesheets, #ttPanelAdjustments").hide();

  if (tab === "clock-in") {
    $("#ttPanelClockIn").fadeIn(200);
    syncTtUi();
  } else if (tab === "timer") {
    $("#ttPanelTimer").fadeIn(200);
    renderTimerSessions();
  } else if (tab === "timesheets") {
    $("#ttPanelTimesheets").fadeIn(200);
    renderTimesheets();
  } else if (tab === "adjustments") {
    $("#ttPanelAdjustments").fadeIn(200);
    renderAdjustments();
  }
}

function syncTtUi() {
  if (!ttState) return;

  const loggedUser = sessionStorage.getItem("wt_user_name") || "Prince Patel";

  if (ttState.isClockedIn) {
    $("#ttHeaderStatusPill").removeClass("clocked-out on-break").addClass("clocked-in").text("Clocked In");
    $("#ttMainClockBtn").removeClass("clock-in-state").addClass("clock-out-state");
    $("#ttClockBtnIcon").text("logout");
    $("#ttClockBtnText").text("CLOCK OUT");
    $("#ttClockBtnSub").text("Click to finish work day");
    $("#ttElapsedBox").show();

    startElapsedWorkTicker();

    if (ttState.snapshotImg) {
      $("#ttSnapshotImg").attr("src", ttState.snapshotImg);
      $("#ttSnapshotUser").text(loggedUser);
      const inTime = new Date(ttState.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      $("#ttSnapshotTime").text("Clocked in at " + inTime);
      $("#ttSnapshotMode").text("Location: " + (ttState.workMode || "Office"));
      $("#ttSnapshotCard").show();
    }
  } else {
    $("#ttHeaderStatusPill").removeClass("clocked-in on-break").addClass("clocked-out").text("Clocked Out");
    $("#ttMainClockBtn").removeClass("clock-out-state").addClass("clock-in-state");
    $("#ttClockBtnIcon").text("camera_alt");
    $("#ttClockBtnText").text("CLOCK IN");
    $("#ttClockBtnSub").text("Camera snapshot required");
    $("#ttElapsedBox").hide();
    if (ttElapsedInterval) clearInterval(ttElapsedInterval);
  }

  // Active Break UI
  if (ttState.activeBreak) {
    $("#ttHeaderStatusPill").removeClass("clocked-in clocked-out").addClass("on-break").text("On Break");
    $("#ttBreakBannerText").text("You are currently taking a " + ttState.activeBreak.type);
    $("#ttCurrentBreakType").text(ttState.activeBreak.type);
    $("#ttActiveBreakPanel").show();
    startBreakTicker();
  } else {
    $("#ttBreakBannerText").text(ttState.isClockedIn ? "You are currently Working (No active break)" : "Please Clock In to start working & tracking breaks");
    $("#ttActiveBreakPanel").hide();
    if (ttBreakInterval) clearInterval(ttBreakInterval);
  }

  // Today's Attendance Timeline
  renderTodayTimeline();
  updateDynamicCardDates();
}

function updateDynamicCardDates() {
  const now = new Date();
  const monthShort = now.toLocaleDateString('en-US', { month: 'short' });
  const monthLong = now.toLocaleDateString('en-US', { month: 'long' });
  const day = now.getDate();
  const year = now.getFullYear();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  // Overview date card (displays current date & dynamic day e.g. 23 Aug / Sunday)
  const dateStr = `${day} ${monthShort}`;
  const dayLabel = dayName;

  const $om = $("#overviewCurrentMonth");
  if ($om.length) {
    $om.text(dateStr);
  } else {
    const omEl = document.getElementById("overviewCurrentMonth");
    if (omEl) omEl.textContent = dateStr;
  }

  const $oy = $("#overviewCurrentYear");
  if ($oy.length) {
    $oy.text(year);
  } else {
    const oyEl = document.getElementById("overviewCurrentYear");
    if (oyEl) oyEl.textContent = year;
  }

  const $od = $("#overviewCurrentDateLabel");
  if ($od.length) {
    $od.text(dayLabel);
  } else {
    const odEl = document.getElementById("overviewCurrentDateLabel");
    if (odEl) odEl.textContent = dayLabel;
  }

  // Time Tracking Cards
  // 1. Today Date
  $("#ttTodayDateLabel").text(`Today (${day} ${monthShort})`);

  // 2. Week Range
  const currentDay = now.getDay();
  const diffToMonday = (currentDay + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const monStr = monday.getDate() + (monday.getMonth() !== now.getMonth() ? ' ' + monday.toLocaleDateString('en-US', { month: 'short' }) : '');
  const sunStr = `${sunday.getDate()} ${sunday.toLocaleDateString('en-US', { month: 'short' })}`;
  $("#ttWeekRangeLabel").text(`This Week (${monStr} - ${sunStr})`);

  // 3. Month
  $("#ttMonthNameLabel").text(`${monthLong} ${year}`);

  // 4. Overtime
  $("#ttOvertimeDateLabel").text(`Overtime (${monthShort} ${year})`);
}

function handleClockInOutClick() {
  if (!ttState.isClockedIn) {
    openCameraModal();
  } else {
    if (ttState.activeBreak) {
      alert("Please end your active break before clocking out.");
      return;
    }
    if (confirm("Are you sure you want to Clock Out and finalize today's work session?")) {
      const now = new Date();
      const outTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ttState.isClockedIn = false;

      // Compute elapsed
      const inTime = new Date(ttState.clockInTime);
      const diffMs = now - inTime;
      const hours = Math.floor(diffMs / 3600000);
      const mins = Math.floor((diffMs % 3600000) / 60000);
      const totalWorkStr = `${hours}h ${mins}m`;

      ttState.todayLogs.push({
        type: "clock-out",
        time: outTimeStr,
        desc: `Clocked Out (${totalWorkStr} total session)`
      });

      // Update today's hours card
      ttState.todayHoursFormatted = totalWorkStr;
      $("#ttTodayHours").text(totalWorkStr);

      saveTtState();
      syncTtUi();
    }
  }
}

function openCameraModal() {
  $("#cameraErrorNote").hide();
  $("#cameraModal").show();

  const video = document.getElementById("webcamVideo");
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" } })
      .then(function (stream) {
        webcamStream = stream;
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.warn("Camera access warning:", err);
        $("#cameraErrorNote").text("Camera not accessible (" + (err.message || "Permission denied") + "). Fallback verification will be used.").show();
      });
  } else {
    $("#cameraErrorNote").text("Camera not supported on this browser. Avatar verification will be used.").show();
  }
}

function closeCameraModal() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  $("#cameraModal").hide();
}

function captureAndClockIn() {
  const video = document.getElementById("webcamVideo");
  const canvas = document.getElementById("snapshotCanvas");
  let photoDataUrl = "";

  if (webcamStream && video.videoWidth) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    // Draw mirrored
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Reset transform for watermark
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(10, canvas.height - 36, canvas.width - 20, 26);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.fillText("✓ WorkTrack Verified • " + new Date().toLocaleString(), 20, canvas.height - 18);

    photoDataUrl = canvas.toDataURL("image/jpeg", 0.85);
  } else {
    // Generate an SVG-based fallback avatar snapshot
    const userName = sessionStorage.getItem("wt_user_name") || "Prince Patel";
    const initial = userName.charAt(0).toUpperCase();
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 90px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial, 150, 130);
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.fillText(userName, 150, 220);
    ctx.font = "12px Inter, sans-serif";
    ctx.fillStyle = "#a7f3d0";
    ctx.fillText("✓ Verified Clock-In", 150, 245);
    photoDataUrl = canvas.toDataURL("image/jpeg", 0.85);
  }

  closeCameraModal();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  ttState.isClockedIn = true;
  ttState.clockInTime = now.toISOString();
  ttState.snapshotImg = photoDataUrl;
  ttState.todayLogs.push({
    type: "clock-in",
    time: timeStr,
    desc: `Clocked In with camera snapshot (${ttState.workMode})`
  });

  saveTtState();
  syncTtUi();
}

function startElapsedWorkTicker() {
  if (ttElapsedInterval) clearInterval(ttElapsedInterval);

  function tick() {
    if (!ttState.isClockedIn || !ttState.clockInTime) return;
    const diff = Math.floor((new Date() - new Date(ttState.clockInTime)) / 1000);
    const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const secs = String(diff % 60).padStart(2, '0');
    $("#ttElapsedTime").text(`${hrs}:${mins}:${secs}`);
    $("#ttTodayHours").text(`${parseInt(hrs, 10)}h ${parseInt(mins, 10)}m`);
  }
  tick();
  ttElapsedInterval = setInterval(tick, 1000);
}

function startBreak(type, plannedMins) {
  if (!ttState.isClockedIn) {
    alert("Please Clock In first before taking a break!");
    return;
  }
  if (ttState.activeBreak) {
    alert("You are already on a break. End current break first.");
    return;
  }

  const now = new Date();
  ttState.activeBreak = {
    type: type,
    startTime: now.toISOString(),
    plannedMinutes: plannedMins
  };

  ttState.todayLogs.push({
    type: "break-start",
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    desc: `Started ${type} (${plannedMins}m planned)`
  });

  saveTtState();
  syncTtUi();
}

function startBreakTicker() {
  if (ttBreakInterval) clearInterval(ttBreakInterval);

  function tick() {
    if (!ttState.activeBreak) return;
    const diff = Math.floor((new Date() - new Date(ttState.activeBreak.startTime)) / 1000);
    const mins = String(Math.floor(diff / 60)).padStart(2, '0');
    const secs = String(diff % 60).padStart(2, '0');
    $("#ttBreakTimer").text(`${mins}:${secs}`);
  }
  tick();
  ttBreakInterval = setInterval(tick, 1000);
}

function endActiveBreak() {
  if (!ttState.activeBreak) return;

  const now = new Date();
  const diffSecs = Math.floor((now - new Date(ttState.activeBreak.startTime)) / 1000);
  const mins = Math.max(1, Math.round(diffSecs / 60));
  const type = ttState.activeBreak.type;

  ttState.todayLogs.push({
    type: "break-end",
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    desc: `Ended ${type} (${mins} mins duration)`
  });

  ttState.activeBreak = null;
  saveTtState();
  syncTtUi();
}

function renderTodayTimeline() {
  const $list = $("#ttTodayLogsList");
  $list.empty();

  if (!ttState.todayLogs || !ttState.todayLogs.length) {
    $list.html('<div style="font-size:0.75rem; color:#a099af; padding:8px;">No activity logged yet today.</div>');
    return;
  }

  ttState.todayLogs.slice().reverse().forEach(log => {
    let dotColor = "#7c3aed";
    if (log.type === "clock-in") dotColor = "#10b981";
    if (log.type === "clock-out") dotColor = "#ef4444";
    if (log.type && log.type.includes("break")) dotColor = "#f59e0b";

    $list.append(`
      <div class="tt-log-item">
        <div class="tt-log-left">
          <span class="tt-log-dot" style="background:${dotColor}"></span>
          <span style="font-weight:600; color:#1a1035;">${log.desc}</span>
        </div>
        <span style="color:#6b5fa0; font-size:0.74rem;">${log.time}</span>
      </div>
    `);
  });
}

// Live Task Stopwatch Timer
let timerElapsedSeconds = 0;
let timerRunning = false;

function startTaskTimer() {
  const taskName = $.trim($("#ttTimerTaskName").val());
  if (!taskName) {
    alert("Please enter what task you are working on!");
    $("#ttTimerTaskName").focus();
    return;
  }
  timerRunning = true;
  $("#ttTimerStartBtn").hide();
  $("#ttTimerPauseBtn").show();
  $("#ttTimerStopBtn").show();

  if (ttTimerInterval) clearInterval(ttTimerInterval);
  ttTimerInterval = setInterval(function () {
    timerElapsedSeconds++;
    const hrs = String(Math.floor(timerElapsedSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((timerElapsedSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(timerElapsedSeconds % 60).padStart(2, '0');
    $("#ttStopwatch").text(`${hrs}:${mins}:${secs}`);
  }, 1000);
}

function pauseTaskTimer() {
  timerRunning = false;
  clearInterval(ttTimerInterval);
  $("#ttTimerPauseBtn").hide();
  $("#ttTimerStartBtn").show().html('<span class="material-icons">play_arrow</span> Resume');
}

function stopTaskTimer() {
  if (ttTimerInterval) clearInterval(ttTimerInterval);
  timerRunning = false;

  const project = $("#ttTimerProject").val();
  const task = $("#ttTimerTaskName").val() || "General Task";
  const category = $("#ttTimerCategory").val();

  const hrs = String(Math.floor(timerElapsedSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((timerElapsedSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(timerElapsedSeconds % 60).padStart(2, '0');
  const durStr = `${hrs}:${mins}:${secs}`;

  const newSession = {
    id: ttState.timerSessions.length + 1,
    project: project,
    task: task,
    category: category,
    duration: durStr,
    startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "Completed"
  };

  ttState.timerSessions.unshift(newSession);
  saveTtState();

  // Reset
  timerElapsedSeconds = 0;
  $("#ttStopwatch").text("00:00:00");
  $("#ttTimerTaskName").val("");
  $("#ttTimerStartBtn").show().html('<span class="material-icons">play_arrow</span> Start Timer');
  $("#ttTimerPauseBtn").hide();
  $("#ttTimerStopBtn").hide();

  renderTimerSessions();
}

function renderTimerSessions() {
  const $tb = $("#ttSessionsTableBody");
  $tb.empty();
  $("#ttSessionCount").text(ttState.timerSessions.length + " Recorded Sessions");

  ttState.timerSessions.forEach((s, idx) => {
    $tb.append(`
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${s.project}</strong></td>
        <td>${s.task}</td>
        <td><span class="tag">${s.category}</span></td>
        <td><strong style="color:#7c3aed;">${s.duration}</strong></td>
        <td>${s.startedAt}</td>
        <td><span class="status-badge status-completed">${s.status}</span></td>
        <td>
          <button type="button" class="btn-icon btn-delete" onclick="deleteTimerSession(${s.id})" title="Delete session">
            <span class="material-icons">delete</span>
          </button>
        </td>
      </tr>
    `);
  });
}

window.deleteTimerSession = function (id) {
  ttState.timerSessions = ttState.timerSessions.filter(s => s.id !== id);
  saveTtState();
  renderTimerSessions();
};

function renderTimesheets() {
  const $tb = $("#ttWeeklyTableBody");
  $tb.empty();

  ttState.timesheets.forEach(ts => {
    const isApproved = ts.status === "Approved";
    const statusBadge = isApproved
      ? '<span class="status-badge status-completed">✓ Approved</span>'
      : `<span class="status-badge status-progress">${ts.status}</span>`;

    $tb.append(`
      <tr>
        <td><strong>${ts.day}</strong></td>
        <td>${ts.date}</td>
        <td>${ts.clockIn}</td>
        <td>${ts.clockOut}</td>
        <td>${ts.breakDur}</td>
        <td><strong>${ts.effective}</strong></td>
        <td><span style="color:#10b981; font-weight:700;">${ts.overtime}</span></td>
        <td><span style="color:#10b981; font-size:0.8rem;">● Photo Verified</span></td>
        <td>${statusBadge}</td>
      </tr>
    `);
  });
}

function renderAdjustments() {
  const $tb = $("#ttAdjustTableBody");
  $tb.empty();

  if (!ttState.adjustments || !ttState.adjustments.length) {
    $tb.append('<tr><td colspan="8" style="text-align:center; color:#a099af; padding:16px;">No adjustment requests.</td></tr>');
    return;
  }

  ttState.adjustments.forEach(adj => {
    const isPending = adj.status === "Pending";
    const badge = isPending
      ? '<span class="status-badge status-progress">Pending Review</span>'
      : (adj.status === "Approved" ? '<span class="status-badge status-completed">Approved</span>' : '<span class="status-badge status-pending">Rejected</span>');

    const actions = isPending ? `
      <button class="export-btn" style="padding:4px 8px; font-size:0.74rem; background:#10b981; color:#fff;" onclick="approveAdjustment('${adj.id}')">Approve</button>
      <button class="export-btn" style="padding:4px 8px; font-size:0.74rem; background:#ef4444; color:#fff;" onclick="rejectAdjustment('${adj.id}')">Reject</button>
    ` : '<span style="font-size:0.75rem; color:#a099af;">Finalized</span>';

    $tb.append(`
      <tr>
        <td><strong>${adj.id}</strong></td>
        <td>${adj.date}</td>
        <td>${adj.orig}</td>
        <td><strong style="color:#7c3aed;">${adj.req}</strong></td>
        <td>${adj.reason}</td>
        <td>${badge}</td>
        <td>${adj.approver}</td>
        <td>${actions}</td>
      </tr>
    `);
  });
}

window.approveAdjustment = function (id) {
  const adj = ttState.adjustments.find(a => a.id === id);
  if (adj) {
    adj.status = "Approved";
    adj.approver = sessionStorage.getItem("wt_user_name") || "Admin";
    saveTtState();
    renderAdjustments();
  }
};
window.rejectAdjustment = function (id) {
  const adj = ttState.adjustments.find(a => a.id === id);
  if (adj) {
    adj.status = "Rejected";
    adj.approver = sessionStorage.getItem("wt_user_name") || "Admin";
    saveTtState();
    renderAdjustments();
  }
};


/* ==========================================================================
   WORK MANAGEMENT ENGINE (KANBAN / CALENDAR / TABLE)
   ========================================================================== */

function getWmTasks() {
  const saved = localStorage.getItem("wt_tasks");
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { }
  }
  const defaultTasks = [
    {
      id: "TASK-101",
      title: "Build Camera Attendance Verification for Clock In",
      desc: "Integrate HTML5 MediaDevices camera capture with timestamp watermark verification for employee clock-ins.",
      assignee: "Prince",
      status: "done",
      priority: "Urgent",
      dueDate: "2026-08-23",
      tags: ["Attendance", "Camera", "Frontend"],
      subtasks: [
        { id: 1, text: "Setup video stream & canvas frame", done: true },
        { id: 2, text: "Add snapshot capture button", done: true },
        { id: 3, text: "Save verified photo to attendance log", done: true }
      ],
      blockedBy: "",
      blocks: "TASK-102",
      attachments: [{ name: "camera-spec.png", size: "240 KB" }],
      comments: [
        { id: 1, user: "Prince Patel", avatar: "P", text: "Camera snapshot works seamlessly with fallback support!", time: "10 mins ago" }
      ]
    },
    {
      id: "TASK-102",
      title: "Kanban Drag-and-Drop Task Board Layout",
      desc: "Implement modern Kanban board columns with dragover highlight and state persistence.",
      assignee: "Ajay",
      status: "in-progress",
      priority: "High",
      dueDate: "2026-08-25",
      tags: ["UI/UX", "Kanban"],
      subtasks: [
        { id: 1, text: "Create drop zones for 4 columns", done: true },
        { id: 2, text: "Setup HTML5 dragstart & drop handlers", done: true },
        { id: 3, text: "Sync state to localStorage", done: false }
      ],
      blockedBy: "TASK-101",
      blocks: "",
      attachments: [],
      comments: [
        { id: 1, user: "Ajay", avatar: "A", text: "Tested drag-and-drop on modern browsers.", time: "1 hour ago" }
      ]
    },
    {
      id: "TASK-103",
      title: "Weekly Timesheets & Overtime Calculations",
      desc: "Automatically calculate weekly total hours and flag overtime hours exceeding 8 hours per day.",
      assignee: "Devyani",
      status: "in-review",
      priority: "Medium",
      dueDate: "2026-08-26",
      tags: ["Timesheets", "Payroll"],
      subtasks: [
        { id: 1, text: "Calculate daily working hours", done: true },
        { id: 2, text: "Deduct break times", done: true },
        { id: 3, text: "Calculate overtime delta", done: true }
      ],
      blockedBy: "",
      blocks: "",
      attachments: [{ name: "overtime-rules.pdf", size: "1.2 MB" }],
      comments: []
    },
    {
      id: "TASK-104",
      title: "Interactive Monthly Calendar View",
      desc: "Display tasks on their respective due dates with month navigation and task detail modals.",
      assignee: "Jigar",
      status: "todo",
      priority: "Medium",
      dueDate: "2026-08-28",
      tags: ["Calendar", "Frontend"],
      subtasks: [
        { id: 1, text: "Generate month grid cells", done: false },
        { id: 2, text: "Render task pills per date", done: false }
      ],
      blockedBy: "",
      blocks: "",
      attachments: [],
      comments: []
    },
    {
      id: "TASK-105",
      title: "Subtasks Checklists & Task Dependencies",
      desc: "Add interactive checklist items with live progress percentage bar and dependency linking.",
      assignee: "Tanisha",
      status: "in-progress",
      priority: "High",
      dueDate: "2026-08-27",
      tags: ["Checklist", "Tasks"],
      subtasks: [
        { id: 1, text: "Add subtask check toggle", done: true },
        { id: 2, text: "Calculate percentage progress", done: true },
        { id: 3, text: "Add task dependencies dropdown", done: true }
      ],
      blockedBy: "",
      blocks: "",
      attachments: [],
      comments: []
    },
    {
      id: "TASK-106",
      title: "Export Company Work Records to Excel & PDF",
      desc: "Add one-click export for company wide employee logs.",
      assignee: "Prince",
      status: "done",
      priority: "Low",
      dueDate: "2026-08-22",
      tags: ["Reporting", "Export"],
      subtasks: [
        { id: 1, text: "Configure jsPDF AutoTable", done: true },
        { id: 2, text: "Configure SheetJS XLSX", done: true }
      ],
      blockedBy: "",
      blocks: "",
      attachments: [],
      comments: []
    }
  ];
  localStorage.setItem("wt_tasks", JSON.stringify(defaultTasks));
  return defaultTasks;
}

function saveWmTasks() {
  localStorage.setItem("wt_tasks", JSON.stringify(wmTasks));
  $("#badge-work-management").text(wmTasks.length + " Tasks");
  $("#wmTotalTasksBadge").text(wmTasks.length + " Tasks");
}

function initWorkManagement() {
  wmTasks = getWmTasks();

  // View tabs
  $("#wmViewTabs .tab-btn").on("click", function () {
    const view = $(this).data("wm-view");
    switchWorkManagementView(view);
  });

  // Create Task button & modal
  $("#wmCreateTaskBtn, .kanban-add-quick").on("click", function () {
    const defaultStatus = $(this).data("status") || "todo";
    openCreateTaskModal(defaultStatus);
  });

  $("#closeCreateTaskModal, #cancelCreateTaskBtn, #createTaskModal .modal-overlay").on("click", function () {
    $("#createTaskModal").hide();
  });

  $("#createTaskForm").on("submit", function (e) {
    e.preventDefault();
    const title = $("#newTaskTitle").val();
    const desc = $("#newTaskDesc").val();
    const assignee = $("#newTaskAssignee").val();
    const status = $("#newTaskStatus").val();
    const priority = $("#newTaskPriority").val();
    const dueDate = $("#newTaskDueDate").val();
    const rawTags = $("#newTaskTags").val();
    const tags = rawTags ? rawTags.split(",").map(t => $.trim(t)).filter(Boolean) : ["General"];

    const nextId = "TASK-" + (100 + wmTasks.length + 1);

    const newTask = {
      id: nextId,
      title: title,
      desc: desc,
      assignee: assignee,
      status: status,
      priority: priority,
      dueDate: dueDate,
      tags: tags,
      subtasks: [],
      blockedBy: "",
      blocks: "",
      attachments: [],
      comments: []
    };

    wmTasks.unshift(newTask);
    saveWmTasks();
    $("#createTaskModal").hide();
    $("#createTaskForm")[0].reset();
    renderActiveWmView();
  });

  // Task Detail Modal Events
  $("#closeTaskDetailModal, #taskDetailModal .modal-overlay").on("click", function () {
    $("#taskDetailModal").hide();
    renderActiveWmView();
  });

  // Add checklist item
  $("#addSubtaskBtn").on("click", function () {
    if (!currentActiveTask) return;
    const txt = $.trim($("#newSubtaskInput").val());
    if (!txt) return;
    if (!currentActiveTask.subtasks) currentActiveTask.subtasks = [];
    currentActiveTask.subtasks.push({
      id: Date.now(),
      text: txt,
      done: false
    });
    $("#newSubtaskInput").val("");
    saveWmTasks();
    renderTaskModalChecklist();
  });

  // Add Tag input in Task Detail Modal
  $("#taskAddTagInput").on("keypress", function (e) {
    if (e.which === 13) {
      e.preventDefault();
      if (!currentActiveTask) return;
      const tag = $.trim($(this).val());
      if (tag && !currentActiveTask.tags.includes(tag)) {
        currentActiveTask.tags.push(tag);
        $(this).val("");
        saveWmTasks();
        renderTaskModalTags();
      }
    }
  });

  // Attachment input
  $("#taskAttachmentInput").on("change", function () {
    if (!currentActiveTask || !this.files.length) return;
    const file = this.files[0];
    if (!currentActiveTask.attachments) currentActiveTask.attachments = [];
    const sizeKb = Math.round(file.size / 1024) + " KB";
    currentActiveTask.attachments.push({
      name: file.name,
      size: sizeKb
    });
    saveWmTasks();
    renderTaskModalAttachments();
  });

  // Post comment
  $("#postCommentBtn").on("click", function () {
    if (!currentActiveTask) return;
    const txt = $.trim($("#newCommentInput").val());
    if (!txt) return;
    const currentUser = sessionStorage.getItem("wt_user_name") || "Prince Patel";
    const initial = currentUser.charAt(0).toUpperCase();

    if (!currentActiveTask.comments) currentActiveTask.comments = [];
    currentActiveTask.comments.push({
      id: Date.now(),
      user: currentUser,
      avatar: initial,
      text: txt,
      time: "Just now"
    });
    $("#newCommentInput").val("");
    saveWmTasks();
    renderTaskModalComments();
  });

  // Quick Mention tags
  $(".mention-tag").on("click", function () {
    const user = $(this).data("user");
    const $in = $("#newCommentInput");
    $in.val($in.val() + " @" + user + " ").focus();
  });

  // Task Meta Select changes
  $("#taskDetailStatusSelect").on("change", function () {
    if (!currentActiveTask) return;
    currentActiveTask.status = $(this).val();
    saveWmTasks();
  });
  $("#taskDetailPrioritySelect").on("change", function () {
    if (!currentActiveTask) return;
    currentActiveTask.priority = $(this).val();
    $("#taskDetailPriorityTag").text(currentActiveTask.priority).attr("class", "tag " + currentActiveTask.priority.toLowerCase());
    saveWmTasks();
  });
  $("#taskDetailAssigneeSelect").on("change", function () {
    if (!currentActiveTask) return;
    currentActiveTask.assignee = $(this).val();
    saveWmTasks();
  });
  $("#taskDetailDueDateInput").on("change", function () {
    if (!currentActiveTask) return;
    currentActiveTask.dueDate = $(this).val();
    saveWmTasks();
  });
  $("#taskBlockedBySelect").on("change", function () {
    if (!currentActiveTask) return;
    currentActiveTask.blockedBy = $(this).val();
    saveWmTasks();
  });
  $("#taskBlocksSelect").on("change", function () {
    if (!currentActiveTask) return;
    currentActiveTask.blocks = $(this).val();
    saveWmTasks();
  });

  // Inline Editable Title & Desc
  $("#taskDetailTitle").on("blur", function () {
    if (!currentActiveTask) return;
    currentActiveTask.title = $(this).text();
    saveWmTasks();
  });
  $("#taskDetailDesc").on("blur", function () {
    if (!currentActiveTask) return;
    currentActiveTask.desc = $(this).text();
    saveWmTasks();
  });

  // Delete Task
  $("#deleteTaskBtn").on("click", function () {
    if (!currentActiveTask) return;
    if (confirm("Are you sure you want to delete this task?")) {
      wmTasks = wmTasks.filter(t => t.id !== currentActiveTask.id);
      saveWmTasks();
      $("#taskDetailModal").hide();
      renderActiveWmView();
    }
  });

  // Calendar navigation
  $("#calPrevBtn").on("click", function () {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
      currentCalendarMonth = 11;
      currentCalendarYear--;
    }
    renderCalendar();
  });
  $("#calNextBtn").on("click", function () {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
      currentCalendarMonth = 0;
      currentCalendarYear++;
    }
    renderCalendar();
  });
  $("#calTodayBtn").on("click", function () {
    currentCalendarMonth = new Date().getMonth();
    currentCalendarYear = new Date().getFullYear();
    renderCalendar();
  });

  // Table filters
  $("#wmSearchInput, #wmStatusFilter, #wmPriorityFilter").on("input change", function () {
    renderTaskTable();
  });

  // Back button in Work Management
  $("#wmBackBtn").on("click", function () {
    $("#workManagementSection").hide();
    welcomeSection.style.display = "block";
    bcMember.textContent = "Overview";
    document.querySelectorAll(".nav-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-expanded", "false"); });
    document.querySelectorAll(".nav-submenu").forEach(s => s.classList.remove("open"));
    document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
  });

  // Initialize Kanban
  setupKanbanDragDrop();
  renderKanban();
}

function switchWorkManagementView(view) {
  $("#wmViewTabs .tab-btn").removeClass("active");
  $(`#wmViewTabs .tab-btn[data-wm-view="${view}"]`).addClass("active");

  $("#wmPanelKanban, #wmPanelCalendar, #wmPanelTable").hide();

  if (view === "kanban") {
    $("#wmPanelKanban").fadeIn(200);
    renderKanban();
  } else if (view === "calendar") {
    $("#wmPanelCalendar").fadeIn(200);
    renderCalendar();
  } else if (view === "table") {
    $("#wmPanelTable").fadeIn(200);
    renderTaskTable();
  }
}

function renderActiveWmView() {
  const activeView = $("#wmViewTabs .tab-btn.active").data("wm-view") || "kanban";
  if (activeView === "kanban") renderKanban();
  else if (activeView === "calendar") renderCalendar();
  else if (activeView === "table") renderTaskTable();
}

// Kanban Render & Drag-and-Drop
function renderKanban() {
  const columns = {
    "todo": $("#zoneTodo"),
    "in-progress": $("#zoneInProgress"),
    "in-review": $("#zoneInReview"),
    "done": $("#zoneDone")
  };

  const counts = { "todo": 0, "in-progress": 0, "in-review": 0, "done": 0 };
  Object.values(columns).forEach($col => $col.empty());

  wmTasks.forEach(t => {
    const colStatus = t.status || "todo";
    if (columns[colStatus]) {
      counts[colStatus]++;
      const card = createKanbanCardElement(t);
      columns[colStatus].append(card);
    }
  });

  $("#countTodo").text(counts["todo"]);
  $("#countInProgress").text(counts["in-progress"]);
  $("#countInReview").text(counts["in-review"]);
  $("#countDone").text(counts["done"]);
}

function createKanbanCardElement(t) {
  const priorityClass = (t.priority || "Medium").toLowerCase();
  const subtasksTotal = (t.subtasks || []).length;
  const subtasksDone = (t.subtasks || []).filter(s => s.done).length;
  const subtasksPct = subtasksTotal ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;

  const progressHtml = subtasksTotal > 0 ? `
    <div class="kanban-card-progress">
      <div class="kanban-progress-meta">
        <span>Checklist</span>
        <span>${subtasksDone}/${subtasksTotal} (${subtasksPct}%)</span>
      </div>
      <div class="progress-bar" style="height:4px;">
        <div class="progress-fill" style="width:${subtasksPct}%;"></div>
      </div>
    </div>
  ` : '';

  const tagsHtml = (t.tags || []).map(tag => `<span class="kanban-tag-chip">${tag}</span>`).join("");
  const attachCount = (t.attachments || []).length;
  const commentCount = (t.comments || []).length;
  const assigneeInitial = (t.assignee || "P").charAt(0).toUpperCase();

  const $card = $(`
    <div class="kanban-card" draggable="true" data-id="${t.id}">
      <div class="kanban-card-top">
        <span class="priority-tag ${priorityClass}">${t.priority || "Medium"}</span>
        <span class="task-id-badge">${t.id}</span>
      </div>
      <div class="kanban-card-title">${t.title}</div>
      <div class="kanban-card-desc">${t.desc || ""}</div>
      <div class="kanban-card-tags">${tagsHtml}</div>
      ${progressHtml}
      <div class="kanban-card-footer">
        <div class="kanban-card-meta">
          ${attachCount ? `<span><span class="material-icons" style="font-size:14px;">attach_file</span> ${attachCount}</span>` : ''}
          ${commentCount ? `<span><span class="material-icons" style="font-size:14px;">chat_bubble_outline</span> ${commentCount}</span>` : ''}
          <span><span class="material-icons" style="font-size:14px;">event</span> ${t.dueDate || "No date"}</span>
        </div>
        <div class="kanban-card-avatar" title="${t.assignee}">${assigneeInitial}</div>
      </div>
    </div>
  `);

  $card.on("click", function () {
    openTaskDetailModal(t.id);
  });

  return $card;
}

function setupKanbanDragDrop() {
  $(document).on("dragstart", ".kanban-card", function (e) {
    $(this).addClass("dragging");
    e.originalEvent.dataTransfer.setData("text/plain", $(this).data("id"));
  });

  $(document).on("dragend", ".kanban-card", function () {
    $(this).removeClass("dragging");
    $(".kanban-drop-zone").removeClass("drag-over");
  });

  $(".kanban-drop-zone").on("dragover", function (e) {
    e.preventDefault();
    $(this).addClass("drag-over");
  });

  $(".kanban-drop-zone").on("dragleave", function () {
    $(this).removeClass("drag-over");
  });

  $(".kanban-drop-zone").on("drop", function (e) {
    e.preventDefault();
    $(this).removeClass("drag-over");
    const taskId = e.originalEvent.dataTransfer.getData("text/plain");
    const targetStatus = $(this).closest(".kanban-col").data("status");

    const task = wmTasks.find(t => t.id === taskId);
    if (task && targetStatus) {
      task.status = targetStatus;
      saveWmTasks();
      renderKanban();
    }
  });
}

// Calendar View Render
function renderCalendar() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  $("#calMonthTitle").text(`${monthNames[currentCalendarMonth]} ${currentCalendarYear}`);

  const $grid = $("#calendarDaysGrid");
  $grid.empty();

  const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
  const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  const prevDaysInMonth = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentCalendarMonth && today.getFullYear() === currentCalendarYear;

  // Previous month padding days
  for (let x = firstDayIndex; x > 0; x--) {
    const dayNum = prevDaysInMonth - x + 1;
    $grid.append(`<div class="cal-day-cell other-month"><div class="cal-day-num">${dayNum}</div></div>`);
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = isCurrentMonth && today.getDate() === i;
    const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

    const matchingTasks = wmTasks.filter(t => t.dueDate === dateStr);

    let pillsHtml = "";
    matchingTasks.forEach(t => {
      let bg = "#7c3aed";
      if (t.priority === "Urgent") bg = "#ef4444";
      if (t.priority === "High") bg = "#f97316";
      if (t.priority === "Low") bg = "#10b981";
      pillsHtml += `<div class="cal-task-pill" style="background:${bg}" title="${t.title}" onclick="event.stopPropagation(); openTaskDetailModal('${t.id}')">${t.title}</div>`;
    });

    const $cell = $(`
      <div class="cal-day-cell ${isToday ? 'today' : ''}" data-date="${dateStr}">
        <div class="cal-day-num">${i} ${isToday ? '●' : ''}</div>
        <div class="cal-tasks-wrap">${pillsHtml}</div>
      </div>
    `);

    $cell.on("click", function () {
      openCreateTaskModal("todo", dateStr);
    });

    $grid.append($cell);
  }

  // Trailing days for grid balance
  const totalCells = firstDayIndex + daysInMonth;
  const trailingDays = 42 - totalCells;
  if (trailingDays > 0 && trailingDays < 7) {
    for (let j = 1; j <= trailingDays; j++) {
      $grid.append(`<div class="cal-day-cell other-month"><div class="cal-day-num">${j}</div></div>`);
    }
  }
}

// Table / List View Render
function renderTaskTable() {
  const search = $.trim($("#wmSearchInput").val()).toLowerCase();
  const statusFilter = $("#wmStatusFilter").val();
  const priorityFilter = $("#wmPriorityFilter").val();

  const filtered = wmTasks.filter(t => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (search) {
      const matchTitle = (t.title || "").toLowerCase().includes(search);
      const matchAssignee = (t.assignee || "").toLowerCase().includes(search);
      const matchTags = (t.tags || []).some(tag => tag.toLowerCase().includes(search));
      if (!matchTitle && !matchAssignee && !matchTags) return false;
    }
    return true;
  });

  const $tb = $("#wmTasksTableBody");
  $tb.empty();

  if (!filtered.length) {
    $tb.append('<tr><td colspan="8" style="text-align:center; color:#a099af; padding:20px;">No tasks match your filters.</td></tr>');
    return;
  }

  filtered.forEach(t => {
    const priorityClass = (t.priority || "Medium").toLowerCase();
    const subtasksTotal = (t.subtasks || []).length;
    const subtasksDone = (t.subtasks || []).filter(s => s.done).length;
    const subtasksPct = subtasksTotal ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;

    let statusBadge = '<span class="status-badge status-pending">To Do</span>';
    if (t.status === "in-progress") statusBadge = '<span class="status-badge status-progress">In Progress</span>';
    if (t.status === "in-review") statusBadge = '<span class="status-badge status-progress" style="background:#fef3c7; color:#d97706;">In Review</span>';
    if (t.status === "done") statusBadge = '<span class="status-badge status-completed">Completed</span>';

    $tb.append(`
      <tr>
        <td><strong>${t.id}</strong></td>
        <td><strong>${t.title}</strong></td>
        <td>${t.assignee || "Unassigned"}</td>
        <td><span class="priority-tag ${priorityClass}">${t.priority}</span></td>
        <td>${statusBadge}</td>
        <td>${subtasksTotal ? `${subtasksDone}/${subtasksTotal} (${subtasksPct}%)` : 'No subtasks'}</td>
        <td>${t.dueDate || "—"}</td>
        <td>
          <button class="action-btn edit-btn" onclick="openTaskDetailModal('${t.id}')" title="Edit Task">
            <span class="material-icons" style="font-size:16px;">edit</span>
          </button>
        </td>
      </tr>
    `);
  });
}

function openCreateTaskModal(status, dateStr) {
  const $assignee = $("#newTaskAssignee");
  $assignee.empty();
  Object.values(members).forEach(m => {
    $assignee.append(`<option value="${m.name}">${m.name}</option>`);
  });

  $("#newTaskStatus").val(status || "todo");
  $("#newTaskDueDate").val(dateStr || new Date().toISOString().split('T')[0]);
  $("#createTaskModal").show();
  $("#newTaskTitle").focus();
}

window.openTaskDetailModal = function (taskId) {
  const task = wmTasks.find(t => t.id === taskId);
  if (!task) return;
  currentActiveTask = task;

  $("#taskDetailId").text(task.id);
  $("#taskDetailPriorityTag").text(task.priority || "Medium").attr("class", "tag " + (task.priority || "Medium").toLowerCase());
  $("#taskDetailTitle").text(task.title);
  $("#taskDetailDesc").text(task.desc || "");

  $("#taskDetailStatusSelect").val(task.status || "todo");
  $("#taskDetailPrioritySelect").val(task.priority || "Medium");

  // Populate assignees
  const $assignee = $("#taskDetailAssigneeSelect");
  $assignee.empty();
  Object.values(members).forEach(m => {
    $assignee.append(`<option value="${m.name}">${m.name}</option>`);
  });
  $assignee.val(task.assignee || "Prince");
  $("#taskDetailDueDateInput").val(task.dueDate || "");

  // Dependencies selects
  const $blockedBy = $("#taskBlockedBySelect");
  const $blocks = $("#taskBlocksSelect");
  $blockedBy.empty().append('<option value="">None</option>');
  $blocks.empty().append('<option value="">None</option>');

  wmTasks.forEach(t => {
    if (t.id !== task.id) {
      $blockedBy.append(`<option value="${t.id}">${t.id} - ${t.title}</option>`);
      $blocks.append(`<option value="${t.id}">${t.id} - ${t.title}</option>`);
    }
  });
  $blockedBy.val(task.blockedBy || "");
  $blocks.val(task.blocks || "");

  renderTaskModalChecklist();
  renderTaskModalTags();
  renderTaskModalAttachments();
  renderTaskModalComments();

  $("#taskDetailModal").show();
};

function renderTaskModalChecklist() {
  if (!currentActiveTask) return;
  const $wrap = $("#taskChecklistItems");
  $wrap.empty();

  const subtasks = currentActiveTask.subtasks || [];
  const total = subtasks.length;
  const doneCount = subtasks.filter(s => s.done).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  $("#taskChecklistPct").text(pct + "%");
  $("#taskChecklistProgressBar").css("width", pct + "%");

  subtasks.forEach(s => {
    const $item = $(`
      <div class="checklist-item ${s.done ? 'done' : ''}">
        <input type="checkbox" ${s.done ? 'checked' : ''} />
        <span>${s.text}</span>
        <button type="button" class="btn-delete-check">&times;</button>
      </div>
    `);

    $item.find('input[type="checkbox"]').on("change", function () {
      s.done = $(this).is(":checked");
      saveWmTasks();
      renderTaskModalChecklist();
    });

    $item.find('.btn-delete-check').on("click", function () {
      currentActiveTask.subtasks = currentActiveTask.subtasks.filter(item => item.id !== s.id);
      saveWmTasks();
      renderTaskModalChecklist();
    });

    $wrap.append($item);
  });
}

function renderTaskModalTags() {
  if (!currentActiveTask) return;
  const $wrap = $("#taskDetailTagsWrap");
  $wrap.empty();

  (currentActiveTask.tags || []).forEach(tag => {
    const $chip = $(`<span class="tag" style="cursor:pointer;" title="Click to remove">${tag} &times;</span>`);
    $chip.on("click", function () {
      currentActiveTask.tags = currentActiveTask.tags.filter(t => t !== tag);
      saveWmTasks();
      renderTaskModalTags();
    });
    $wrap.append($chip);
  });
}

function renderTaskModalAttachments() {
  if (!currentActiveTask) return;
  const $wrap = $("#taskAttachmentsList");
  $wrap.empty();

  const atts = currentActiveTask.attachments || [];
  if (!atts.length) {
    $wrap.html('<span style="font-size:0.75rem; color:#a099af;">No files attached yet.</span>');
    return;
  }

  atts.forEach(a => {
    $wrap.append(`
      <div class="attachment-card">
        <span class="material-icons">description</span>
        <span>${a.name} (${a.size})</span>
      </div>
    `);
  });
}

function renderTaskModalComments() {
  if (!currentActiveTask) return;
  const $stream = $("#taskCommentsStream");
  $stream.empty();

  const comments = currentActiveTask.comments || [];
  if (!comments.length) {
    $stream.html('<span style="font-size:0.75rem; color:#a099af;">No comments yet. Be the first to comment!</span>');
    return;
  }

  comments.forEach(c => {
    $stream.append(`
      <div class="comment-bubble">
        <div class="comment-avatar">${c.avatar || c.user.charAt(0)}</div>
        <div class="comment-content">
          <div class="comment-meta">
            <strong>${c.user}</strong>
            <span>${c.time}</span>
          </div>
          <div class="comment-text">${c.text}</div>
        </div>
      </div>
    `);
  });
}

function showTimeTracking(subTab) {
  currentMember = null;
  currentTab = "time-tracking";
  const tabToOpen = subTab || "clock-in";

  welcomeSection.style.display = "none";
  memberDetail.style.display = "none";
  document.getElementById("companyRecordsSection").style.display = "none";
  const wmSec = document.getElementById("workManagementSection"); if (wmSec) wmSec.style.display = "none";

  const ttSection = document.getElementById("timeTrackingSection");
  if (ttSection) {
    ttSection.style.display = "block";
    ttSection.style.animation = "none";
    requestAnimationFrame(() => { ttSection.style.animation = "fadeIn 0.4s ease"; });
  }

  bcMember.textContent = "Time Tracking";

  // Collapse other submenus
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.setAttribute("aria-expanded", "false");
    b.classList.remove("active");
  });
  document.querySelectorAll(".nav-submenu").forEach(s => s.classList.remove("open"));

  const ttBtn = document.getElementById("timeTrackingBtn");
  if (ttBtn) {
    ttBtn.classList.add("active");
  }

  switchTimeTrackingTab(tabToOpen);
}

function showWorkManagement(subView) {
  currentMember = null;
  currentTab = "work-management";
  const viewToOpen = subView || "kanban";

  welcomeSection.style.display = "none";
  memberDetail.style.display = "none";
  document.getElementById("companyRecordsSection").style.display = "none";
  const ttSec = document.getElementById("timeTrackingSection"); if (ttSec) ttSec.style.display = "none";

  const wmSection = document.getElementById("workManagementSection");
  if (wmSection) {
    wmSection.style.display = "block";
    wmSection.style.animation = "none";
    requestAnimationFrame(() => { wmSection.style.animation = "fadeIn 0.4s ease"; });
  }

  bcMember.textContent = "Work Management";

  // Collapse other submenus
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.setAttribute("aria-expanded", "false");
    b.classList.remove("active");
  });
  document.querySelectorAll(".nav-submenu").forEach(s => s.classList.remove("open"));

  const wmBtn = document.getElementById("workManagementBtn");
  if (wmBtn) {
    wmBtn.setAttribute("aria-expanded", "true");
    wmBtn.classList.add("active");
  }
  const wmSub = document.getElementById("sub-work-management");
  if (wmSub) wmSub.classList.add("open");

  // Highlight sub-link
  document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
  const activeSubLink = document.querySelector(`.sub-link[data-section="work-management"][data-sub="${viewToOpen}"]`);
  if (activeSubLink) activeSubLink.classList.add("active");

  switchWorkManagementView(viewToOpen);
}

// ===== START APPLICATION =====
init();


