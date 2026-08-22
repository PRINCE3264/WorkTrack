// ===== GLOBAL RECORDS DATABASE & STATES =====
let dbRecords = [];
let masterQuery = { search: "", status: "all", sort: "date-desc", page: 1, limit: 5 };
let memberQuery = { search: "", status: "all", sort: "date-desc", page: 1, limit: 5 };
let activeDeleteId = null;

let members = {};

// ===== DEFAULT MEMBER DATA =====
const DEFAULT_MEMBERS = {
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
    info: { Email: "prince@hie.com", Phone: "+91 98765 00001", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Praveen Kumar", Joined: "26 March 2026", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name:"JavaScript", pct:90 },
      { name:"React", pct:82 },
      { name:"CSS", pct:75 },
      { name:"Node.js", pct:60 },
      { name:".Net", pct:70 },
      { name:"Angular", pct:78 },
      { name:"Pgadmin", pct:65 },
      { name:"Wordpress", pct:60 },
      { name:"Devops", pct:68 }
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
    reports: { completed:15, inProgress:3, pending:2 },
    workRecords: [
      { app:"EtaPrise",           feature:"Controlpanel",              task:"Design Summary Card Appointment, Contract, Contact, Leave" },
      { app:"EtaPrise",           feature:"Sales",                     task:"Integrated Sales module APIs with the frontend pages and implemented API data binding and functionality." },
      { app:"EtaPrise",           feature:"Job Definition",            task:"Worked on Job Definition module UI, API integration, database design, and frontend functionality for OMNI Inside." },
      { app:"EtaPrise(WHM)",      feature:"Account",                   task:"Integrated Account module APIs with the frontend pages and implemented API data binding and functionality." },
      { app:"EtaPrise",           feature:"Appointment",               task:"Integrated Appointment module APIs with the frontend pages and implemented API data binding and functionality" },
      { app:"EtaPrise",           feature:"Region & Territory",        task:"Create new component + Db Table + Backend integration" },
      { app:"EtaPrise",           feature:"Contract",                  task:"Integrated Appointment module APIs with the frontend pages and implemented API data binding and functionality" },
      { app:"EtaPrise",           feature:"WhatsApp Integration",      task:"Create ui in existing component + API config" },
      { app:"EtaPrise",           feature:"iOmni Integration",         task:"Ui Designing" },
      { app:"EtaPrise",           feature:"Elevator PM",               task:"Summary card designing & Table Create" },
      { app:"EtaPrise",           feature:"AI Studio",                 task:"AI Studio: Worked on AI Chatbot, Knowledge Base, Appointment, Account, Contact, Notifications, API Integration, WhatsApp/SMS, chat UI, polls, events, and database" },
      { app:"EtaPrise",           feature:"QA Testing (SonarQube)",    task:"Testing api response + security enhancement" },
      { app:"EtaPrise",           feature:"Docker",                    task:"Create Dockerfiles + build pipeline config" },
      { app:"DevOps",             feature:"Kubernetes",                task:"Cluster setup + deployment config" },
      { app:"DevOps",             feature:"Nginx",                     task:"Config backend + frontend routing" },
      { app:"DevOps",             feature:"Automation",                task:"Create backend + frontend config + database table" },
      { app:"DevOps",             feature:"Jenkins CI/CD",             task:"Create pipeline + build/test/deploy stages" },
      { app:"DevOps",             feature:"Enterprise Application",    task:"Create whole website application" },
      { app:"WordPress App (EtaPrise) live", feature:"Performance Optimization", task:"Testing api response + security enhancement" },
      { app:"WordPress App (EtaPrise) live", feature:"CI Change #1687",          task:"Ui Change Article, Footer, Header" }
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
    info: { Email: "ajay@hie.com", Phone: "+91 98765 00002", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Praveen Kumar", Joined: "26 March 2026", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name:"JavaScript", pct:90 },
      { name:"React", pct:82 },
      { name:"CSS", pct:75 },
      { name:"Node.js", pct:60 },
      { name:".Net", pct:70 },
      { name:"Angular", pct:78 },
      { name:"Pgadmin", pct:65 },
      { name:"Wordpress", pct:60 },
      { name:"Devops", pct:68 }
    ],
    taskList: [
      { title: "Build REST API for orders module", date: "22 Aug 2026", status: "progress" },
      { title: "Optimize database queries", date: "21 Aug 2026", status: "done" },
      { title: "Deploy microservices to staging", date: "24 Aug 2026", status: "pending" }
    ],
    reports: { completed:8, inProgress:2, pending:1 }
  },
  jigar: {
    name: "Jigar",
    role: "Full Stack Developer",
    color: "linear-gradient(135deg,#059669,#34d399)",
    solidColor: "#059669",
    tags: ["JavaScript", "React", "UI/UX", "DevOps", ".Net", "Angular", "PgAdmin"],
    tasks: 7,
    company: "Envision Beyond India Pvt Ltd",
    teamLead: "Praveen Kumar",
    info: { Email: "jigar@hie.com", Phone: "+91 98765 00003", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Praveen Kumar", Joined: "26 March 2026", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name:"JavaScript", pct:90 },
      { name:"React", pct:82 },
      { name:"CSS", pct:75 },
      { name:"Node.js", pct:60 },
      { name:".Net", pct:70 },
      { name:"Angular", pct:78 },
      { name:"Pgadmin", pct:65 },
      { name:"Wordpress", pct:60 },
      { name:"Devops", pct:68 }
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
    reports: { completed:15, inProgress:4, pending:3 }
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
    info: { Email: "devyani@hie.com", Phone: "+91 98765 00004", Company: "Envision Beyond India Pvt Ltd", "Team Lead": "Praveen Kumar", Joined: "26 March 2026", Location: "Surat, Gujarat", Status: "Active" },
    skills: [
      { name:"JavaScript", pct:90 },
      { name:"React", pct:82 },
      { name:"CSS", pct:75 },
      { name:"Node.js", pct:60 },
      { name:".Net", pct:70 },
      { name:"Angular", pct:78 },
      { name:"Pgadmin", pct:65 },
      { name:"Wordpress", pct:60 },
      { name:"Devops", pct:68 }
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
    reports: { completed:20, inProgress:1, pending:1 }
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
      { name:"JavaScript", pct:90 },
      { name:"React", pct:82 },
      { name:"CSS", pct:75 },
      { name:"Node.js", pct:60 },
      { name:".Net", pct:70 },
      { name:"Angular", pct:78 },
      { name:"Pgadmin", pct:65 },
      { name:"Wordpress", pct:60 },
      { name:"Devops", pct:68 }
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
    reports: { completed:18, inProgress:2, pending:2 }
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
}

// ===== MEMBERS GRID =====
function renderMembersGrid() {
  membersGrid.innerHTML = "";
  
  const totalMembersSpan = document.getElementById("overviewTotalMembers");
  if (totalMembersSpan) {
    totalMembersSpan.textContent = Object.keys(members).length;
  }
  
  const countBadge = document.getElementById("membersCountBadge");
  if (countBadge) {
    countBadge.textContent = `${Object.keys(members).length} Active`;
  }
  
  const totalTasksSpan = document.getElementById("overviewTotalTasks");
  if (totalTasksSpan) {
    totalTasksSpan.textContent = dbRecords.length;
  }
  
  Object.entries(members).forEach(([key, m]) => {
    const card = document.createElement("div");
    card.className = "member-card";
    card.style.setProperty("--color", m.solidColor + "33");
    const avatarHtml = m.avatar 
      ? `<div class="mc-avatar mc-avatar-img"><img src="${m.avatar}" alt="${m.name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; display:block;" /></div>`
      : `<div class="mc-avatar" style="background:${m.color}">${m.name[0]}</div>`;
    card.innerHTML = `
      ${avatarHtml}
      <div class="mc-name">${m.name}</div>
      <div class="mc-role">${m.role}</div>
      <div class="mc-tasks">Tasks: <span>${m.tasks}</span></div>
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
  const companyRecordsBtn = document.getElementById("companyRecordsBtn");
  if (companyRecordsBtn) companyRecordsBtn.classList.remove("active");
  
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
    tabContent.innerHTML = `
      <div class="profile-grid">
        <div class="info-card">
          <h3>Personal Information</h3>
          ${Object.entries(m.info).map(([k,v]) => `
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
            <select id="memberSortSelect" class="wr-search-input" style="padding-left:14px; width:auto; cursor:pointer;">
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
    $("#memberSearchInput").on("keyup input", function() {
      memberQuery.search = $(this).val();
      memberQuery.page = 1;
      renderMemberRecords();
    });

    $("#memberSortSelect").on("change", function() {
      memberQuery.sort = $(this).val();
      memberQuery.page = 1;
      renderMemberRecords();
    });

    $(".wr-filter-tags .filter-tag").on("click", function() {
      $(".wr-filter-tags .filter-tag").removeClass("active");
      $(this).addClass("active");
      memberQuery.status = $(this).data("filter");
      memberQuery.page = 1;
      renderMemberRecords();
    });

    $("#exportPdfBtn").on("click", function() {
      const list = getFilteredMemberRecords();
      exportPDF(m, list);
    });

    $("#exportExcelBtn").on("click", function() {
      const list = getFilteredMemberRecords();
      exportExcel(m, list);
    });

    $("#memberAddBtn").on("click", function() {
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
      document.querySelectorAll(".nav-btn").forEach(b => { b.setAttribute("aria-expanded","false"); b.classList.remove("active"); });
      document.querySelectorAll(".nav-submenu").forEach(s => s.classList.remove("open"));
      if (!isExpanded) {
        btn.setAttribute("aria-expanded","true");
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

  // Company Records master button — toggles submenu ONLY
  const companyRecordsBtn = document.getElementById("companyRecordsBtn");
  if (companyRecordsBtn) {
    companyRecordsBtn.addEventListener("click", () => {
      const subMenu = document.getElementById("sub-company-records");
      const isOpen = subMenu && subMenu.classList.contains("open");

      // Collapse all OTHER employee submenus (not this one)
      document.querySelectorAll(".nav-btn:not(#companyRecordsBtn)").forEach(b => {
        b.setAttribute("aria-expanded","false");
        b.classList.remove("active");
      });
      document.querySelectorAll(".nav-submenu:not(#sub-company-records)").forEach(s => s.classList.remove("open"));

      // Toggle this submenu
      if (isOpen) {
        subMenu.classList.remove("open");
        companyRecordsBtn.classList.remove("active");
        companyRecordsBtn.setAttribute("aria-expanded", "false");
      } else {
        companyRecordsBtn.classList.add("active");
        companyRecordsBtn.setAttribute("aria-expanded", "true");
        if (subMenu) subMenu.classList.add("open");
      }
    });
  }

  // Sub-links (employee tabs + company records filters)
  document.querySelectorAll(".sub-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const member = link.dataset.member;
      const section = link.dataset.section;
      const filter = link.dataset.filter; // only for company records

      document.querySelectorAll(".sub-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      if (filter !== undefined) {
        // Company records sub-link: apply filter
        showCompanyRecords();
        masterQuery.status = filter;
        masterQuery.page = 1;
        renderMasterTable();
        // Sync filter tags UI
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
    document.querySelectorAll(".nav-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-expanded","false"); });
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
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}`, 250, 20, { align: "right" });

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
    ["Generated:", new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })],
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
  $("#masterSearchInput").off("keyup input").on("keyup input", function() {
    masterQuery.search = $(this).val();
    masterQuery.page = 1;
    renderMasterRecords();
  });
  
  $("#masterSortSelect").off("change").on("change", function() {
    masterQuery.sort = $(this).val();
    masterQuery.page = 1;
    renderMasterRecords();
  });
  
  $(".company-records-section .filter-tag").off("click").on("click", function() {
    $(".company-records-section .filter-tag").removeClass("active");
    $(this).addClass("active");
    masterQuery.status = $(this).data("filter");
    masterQuery.page = 1;
    renderMasterRecords();
  });
  
  $("#masterAddBtn").off("click").on("click", function() {
    openAddModal();
  });
  
  // Initial render
  renderMasterRecords();
  
  if (window.innerWidth <= 768) closeMobileSidebar();
}

// ===== MASTER RECORDS RENDER ENGINE =====
function renderMasterRecords() {
  // 1. Filter
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
    tbody.append(`<tr><td colspan="7" style="text-align:center; padding:30px; color:#8c8599;">No records found matching criteria.</td></tr>`);
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
          <td class="wr-task" style="color:#6e6580; font-size:0.85rem;">
            <div style="font-weight:600; color:#5c536b; margin-bottom:2px;">${r.task.substring(0, 30)}...</div>
            <span style="font-size:0.75rem; color:#8c8599;">Work Date</span>
          </td>
          <td style="color:#6e6580; font-size:0.85rem;">
            ${new Date(r.date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
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
            ${new Date(r.date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
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
  container.find(".pag-btn").off("click").on("click", function() {
    if ($(this).hasClass("disabled") || $(this).hasClass("active")) return;
    queryObj.page = parseInt($(this).data("page"));
    renderFn();
  });
}

// ===== TABLE ACTIONS BINDINGS (CYCLE STATUS, EDIT, DELETE, DETAILS) =====
function bindTableActionEvents(tableId, renderFn) {
  // 1. Status cycle (Pending -> In Progress -> Completed)
  $(`${tableId} .badge-status`).off("click").on("click", function(e) {
    e.stopPropagation();
    const id = $(this).data("id");
    const record = dbRecords.find(r => r.id === id);
    if (record) {
      if (record.status === "pending") record.status = "progress";
      else if (record.status === "progress") record.status = "completed";
      else record.status = "pending";
      
      saveRecordsToLocal();
      renderFn();
    }
  });
  
  // 2. View details modal
  $(`${tableId} .btn-view`).off("click").on("click", function(e) {
    e.stopPropagation();
    const id = $(this).data("id");
    const r = dbRecords.find(x => x.id === id);
    if (r) {
      const emp = members[r.memberKey] || { name: "Unknown" };
      $("#detailRecordEmployee").text(emp.name);
      $("#detailRecordApp").text(r.app);
      $("#detailRecordFeature").text(r.feature);
      $("#detailRecordDate").text(new Date(r.date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }));
      
      const badge = $("#detailRecordStatus");
      badge.removeClass().addClass(`badge-status status-${r.status}`);
      badge.text(r.status === "completed" ? "Completed" : r.status === "progress" ? "In Progress" : "Pending");
      
      $("#detailRecordTask").text(r.task);
      $("#detailsModal").show();
    }
  });
  
  // 3. Edit modal
  $(`${tableId} .btn-edit`).off("click").on("click", function(e) {
    e.stopPropagation();
    const id = $(this).data("id");
    openEditModal(id, currentMember);
  });
  
  // 4. Delete modal confirmation
  $(`${tableId} .btn-delete`).off("click").on("click", function(e) {
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
  $(".modal-overlay, #cancelRecordModal, #closeRecordModal").on("click", function() {
    $("#recordModal").hide();
  });
  
  $(".modal-overlay, #cancelDeleteModal, #closeDeleteModal").on("click", function() {
    $("#deleteConfirmModal").hide();
  });
  
  $(".modal-overlay, #closeDetailsModal, #closeDetailsBtn").on("click", function() {
    $("#detailsModal").hide();
  });
  
  // Submit record form (Add / Edit save)
  $("#recordForm").on("submit", function(e) {
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
    $("#recordModal").hide();
    
    // Refresh the active view
    if (currentMember) {
      renderMemberRecords();
    } else {
      renderMasterRecords();
    }
  });
  
  // Confirm Delete Action
  $("#confirmDeleteBtn").on("click", function() {
    if (activeDeleteId) {
      dbRecords = dbRecords.filter(r => r.id !== activeDeleteId);
      saveRecordsToLocal();
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
  $("#addEmployeeBtn").off("click").on("click", function() {
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
  $("#editProfileBtn").off("click").on("click", function() {
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
      } catch (err) {}
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
  $("#closeEmployeeModal, #cancelEmployeeModal").on("click", function() {
    $("#employeeModal").hide();
  });

  // 4. Save Employee Form
  $("#employeeForm").off("submit").on("submit", function(e) {
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
  $("#deleteEmployeeBtn").off("click").on("click", function() {
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
    select.append(`<option value="${key}">${m.name}</option>`);
  });
}

function renderSidebarNav() {
  const list = $("#sidebarNavList");
  list.find("li:not(#nav-company-records)").remove();
  
  Object.entries(members).forEach(([key, m]) => {
    const taskCount = dbRecords.filter(r => r.memberKey === key).length;
    list.append(`
      <li class="nav-item" id="nav-${key}">
        <button class="nav-btn" data-member="${key}" aria-expanded="false">
          <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" stroke-width="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></span>
          <span class="nav-label">${m.name}</span>
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

// ===== START APPLICATION =====
init();

// ===== DYNAMIC TIME GREETING =====
(function setupGreeting() {
  function setGreeting() {
    var hour = new Date().getHours();
    var text;
    if (hour >= 5 && hour < 12)       { text = 'Good Morning'; }
    else if (hour >= 12 && hour < 17) { text = 'Good Afternoon'; }
    else if (hour >= 17 && hour < 21) { text = 'Good Evening'; }
    else                              { text = 'Good Night'; }

    var $el = $('#welcomeGreeting');
    if ($el.length) $el.text(text);
  }
  setGreeting();
  setInterval(setGreeting, 60000);
})();


// ===== LOGOUT / AVATAR DROPDOWN =====
(function setupLogout() {
  // Populate avatar with logged-in user initial
  var user = sessionStorage.getItem('wt_user') || 'admin';
  var initial = user.charAt(0).toUpperCase();

  var $avatar   = $('#topbarAvatar');
  var $ddIcon   = $('#avatarDdIcon');
  var $ddName   = $('#avatarDdName');
  var $dropdown = $('#avatarDropdown');

  if ($avatar.length) {
    $avatar.text(initial);
    $ddIcon.text(initial);
    $ddName.text(user.charAt(0).toUpperCase() + user.slice(1));
  }

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
    window.location.replace('login.html');
  });
})();
