import React, { createContext, useContext, useEffect, useState } from "react";

/* ================= TYPES ================= */
export type Theme = "light" | "dark" | "default";
export type Language = "en" | "am" | "ti" | "om" | "ar" | "zh";

export const rtlLanguages: Language[] = ["ar"];

/* ================= TRANSLATIONS ================= */
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Existing (unchanged)
    languageSettings: "Language Settings",
    selectLanguage: "Select the system language",
    direction: "Direction",
    ltr: "Left to Right",
    rtl: "Right to Left",
  
    lang_en: "English",
    lang_am: "Amharic",
    lang_ti: "Tigrinya",
    lang_om: "Oromiffa",
    lang_ar: "Arabic",
    lang_zh: "Chinese",
  
    overview: "Overview",
    users: "Manage Users",
    vendors: "Manage Vendors",
    events: "Manage Events",
    payments: "Payments",
    packages: "Packages",
    reports: "Full Reports",
    analytics: "Analytics",
    systemContent: "System Content",
    systemLogs: "System Logs",
    profile: "Profile",
    language: "Language",
    appearance: "Appearance",
    settings: "Settings",
    logout: "Logout",
  
    // 🔹 ADDED (missing)
    adminManageUsers: "Admin – Manage Users",
    welcomeBack: "Welcome back! Here's what's happening.",
    lastUpdated: "Last updated",
  
    name: "Name",
    email: "Email",
    role: "Role",
  
    addUser: "Add User",
    delete: "Delete",
    searchUsers: "Search users...",
    noUsersFound: "No users found.",
  
    confirmDeleteUser: "Are you sure you want to delete this user?",
  
    role_admin: "Admin",
    role_manager: "Manager",
    role_vendor: "Vendor",
    adminManageVendors: "Admin – Manage Vendors",

vendorName: "Vendor Name",
service: "Service",

addVendor: "Add Vendor",
edit: "Edit",
save: "Save",
cancel: "Cancel",

searchVendors: "Search vendors...",
noVendorsFound: "No vendors found.",

vendorRequired: "Vendor name and service are required!",
vendorEmptyError: "Vendor name and service cannot be empty!",
confirmDeleteVendor: "Are you sure you want to delete this vendor?",
adminManageEvents: "Admin – Manage Events",

eventName: "Event Name",
location: "Location",

addEvent: "Add Event",


searchEvents: "Search events...",
noEventsFound: "No events found.",

eventFillAll: "Please fill all fields!",
confirmDeleteEvent: "Are you sure you want to delete this event?",
eventLockedEdit: "Cannot edit locked events!",
eventLockedDelete: "Cannot delete locked events!",

toggleStatus: "Toggle Status",

eventStatus_draft: "Draft",
eventStatus_approved: "Approved",
eventStatus_locked: "Locked",
adminManagePayments: "Admin – Manage Payments",

searchPayments: "Search by method, amount, or date...",
sortByAmount: "Sort by Amount",
noPaymentsFound: "No payments found.",

paymentVia: "via",
adminManagePackages: "Admin – Manage Packages",

packageName: "Package Name",
price: "Price",

addPackage: "Add Package",


searchPackages: "Search packages...",
sortByPrice: "Sort by Price",
noPackagesFound: "No packages found.",

confirmDeletePackage: "Are you sure you want to delete this package?",

adminFullReports: "Admin – Full Reports",

metric: "Metric",
value: "Value",
adminAnalytics: "Admin – Analytics Dashboard",

totalUsers: "Total Users",
totalEvents: "Total Events",
totalVendors: "Total Vendors",
totalPayments: "Total Payments",

eventsPerMonth: "Events Per Month",
userRolesDistribution: "User Roles Distribution",

jan: "Jan",
feb: "Feb",
mar: "Mar",
apr: "Apr",
may: "May",
jun: "Jun",
jul: "Jul",
aug: "Aug",
sep: "Sep",
oct: "Oct",
nov: "Nov",
dec: "Dec",

generatedAt: "Generated At",
updateSystemContent: "Admin – Update System Content",

systemContentPlaceholder: "Enter system content here...",
systemContentSaved: "Content saved successfully!",
systemContentEmpty: "Content cannot be empty.",

admin_system_log_title: "Admin - System Log",
search_logs_placeholder: "Search logs...",
sort_label: "Sort",
newest: "Newest",
oldest: "Oldest",
refresh: "Refresh",
clear_all: "Clear All",
no_logs_found: "No logs found.",
actor: "Actor",
delete_log: "Delete log",

changeAvatar: "Change Avatar",
avatarPreview: "Avatar Preview",

saveChanges: "Save Changes",
profileUpdated: "Profile updated!",
defaultAdminName: "Admin User",
appearanceSettings: "Appearance Settings",
appearanceDescription: "Switch between Light, Dark, or System theme for your admin dashboard.",
chooseTheme: "Choose Theme:",
themeLight: "Light",
themeDark: "Dark",
themeSystem: "System",
livePreview: "This is a live preview. The current theme is",
attendeeOverview: "Attendee Overview",
eventInformation: "Event Information",
noConfirmedEvents: "No confirmed events yet",
locked: "Locked",
rsvps: "RSVPs",
seatAssignments: "Seat Assignments",
giftRegistry: "Gift Registry",
mySchedule: "My Schedule",
noScheduledEvents: "No scheduled events yet",
agendaNotPublished: "Agenda not published yet",

noGiftsRegistered: "No gifts registered yet.",
soldOut: "Sold Out",
available: "Available",
quantity: "Quantity",

uploadAvatar: "Upload Avatar",

enterName: "Enter your name",

enterEmail: "Enter your email",

boughtGifts: "Bought Gifts",
boughtAt: "Bought at",
giftSoldOut: "This gift is sold out.",

themeDescription: "Switch between Light, Dark, or System theme for your attendee dashboard.",

light: "Light",
dark: "Dark",
system: "System",

eventInfo: "Event Info",
schedule: "Schedule",
rsvp: "RSVP",
seatInfo: "Seat Info",
managerOverview: "Manager Overview",

upcoming: "upcoming",
totalGuests: "Total Guests",
acrossAllEvents: "Across all events",
vendorAssignments: "Vendor Assignments",
activeAssignments: "Active assignments",
avgGuestsPerEvent: "Avg. Guests/Event",
averageAttendance: "Average attendance",

recentGuests: "Recent Guests",
noGuestsFound: "No guests found",
assignedTo: "assigned to",
noVendorAssignmentsFound: "No vendor assignments found",
manageEvents: "Manage Events",

add: "Add",

draft: "Draft",
approved: "Approved",

guests: "Guests",

invalidStatusTransition: "Invalid status transition",
onlyDraftDelete: "Only draft events can be deleted.",
confirmDeleteDraftEvent: "Delete this draft event?",
event: "Event",
manageGuests: "Manage Guests",
  guestName: "Guest Name",
  guestEmail: "Guest Email",
  selectEvent: "Select Event",
  addGuest: "Add Guest",
  searchGuests: "Search guests by name, email, or event...",
  noGuestsForEvent: "No guests for this event.",
 
  yes: "Yes",
  no: "No",
 
  allFieldsRequired: "All fields are required!",
  invalidEventId: "Invalid Event ID!",
  confirmDeleteGuest: "Are you sure you want to delete this guest?",
  vendorCoordination: "Vendor Coordination",
 
  selectService: "Select Service",
  assignVendor: "Assign Vendor",
  searchAssignments: "Search assignments...",
  noVendorAssignments: "No vendor assignments found.",
 
  confirmRemoveVendor: "Are you sure you want to remove this vendor assignment?",
  remove: "Remove",
  managerTaskChecklist: "Manager Task Checklist",
  eventId: "Event ID",
  task: "Task",
  category: "Category",
  low: "Low",
  medium: "Medium",
  high: "High",
  done: "Done",

  searchTasks: "Search tasks...",
  taskAddError: "Event ID and task cannot be empty.",
  taskDeleteConfirm: "Are you sure you want to delete this task?",
  editTaskPrompt: "Edit task:",
  total: "Total",
  completed: "Completed",
  pending: "Pending",
  managerAddedTasks: "Manager Added Tasks",
  tasksFromCouples: "Tasks from Couples",
  tasksFromProtocol: "Tasks from Protocol",
  noTasksFound: "No tasks found.",
  managerBudgets: "Manager - Budgets",

  descriptionCategory: "Description / Category",
  amount: "Amount",

  searchBudgets: "Search budgets...",
  noBudgetsFound: "No budgets found.",
  fillAllFields: "Fill all fields!",
  deleteBudgetConfirm: "Are you sure you want to delete this budget?",
  pendingApproval: "Pending Approval",
  approvedByManager: "Approved by Manager",
  approve: "Approve",

  masterInventory: "Advanced Master Inventory",
  totalItems: "Total Items",

  itemName: "Item Name",

  vendorOptional: "Vendor (Optional)",
  vendor: "Vendor",
  couple: "Couple",
  source: "Source",
  status: "Status",
 
  searchInventory: "Search inventory...",

  deleteConfirm: "Delete this inventory item?",
  sortBy: "Sort By",

  assigned: "Assigned",
  delivered: "Delivered",
  actions: "Actions",
  paid: "Paid",
  taskChecklist: "Task Checklist",
  budget: "Budget",
  inventory: "Inventory",
  remaining: "Remaining",
  vendorOverview: "Vendor Overview",
  assignedEvents: "Assigned Events",
  manageAssignServices: "Manage & Assign Services",

  assign: "Assign",
  selectServiceAndEvent: "Select both service and event",
  noServicesAssigned: "No services assigned yet.",
  noDescription: "No description",
  vendorPayments: "Vendor Payments",
  noPaymentsAvailable: "No payments available",
  approveAddBank: "Approve & Add Bank Info",
  waitingForPayment: "Waiting for couple payment",
  confirmPayment: "Confirm Payment",

  paymentProof: "Payment Proof",
  bankNamePrompt: "Bank Name:",
  accountNamePrompt: "Account Name:",
  accountNumberPrompt: "Account Number:",
  swiftCodePrompt: "SWIFT Code (optional):",
  bankInfoRequired: "Bank name, account name, and account number are required",
  confirmPaymentPrompt: "Confirm payment received?",
  on: "on",
  vendorInventory: "Vendor Inventory",
  vendorGiftInventory: "Vendor Gift Inventory",
  item: "Item",


  addGift: "Add Gift",
  giftName: "Gift Name",
 
  image: "Image",
  search: "Search...",
  fillGiftFields: "Please fill all gift fields correctly!",
  noScheduleItems: "No schedule items available.",
  unpaid: "Unpaid",
  vendorReports: "Vendor Reports",

  paidPayments: "Paid Payments",
  totalAmount: "Total Amount",

  totalInventoryItems: "Total Inventory Items",
  totalQuantity: "Total Quantity",
  noReports: "No reports available yet.",
  themePreviewText: "This is a live preview. The current theme is",
  manageServices: "Manage Services",
  protocolOverview: "Protocol Overview",

totalAssignments: "Total Assignments",
totalAgendaItems: "Total Agenda Items",
totalTasksChecklist: "Total Tasks / Checklist",

assignments: "Assignments",
agenda: "Agenda",
tasksChecklist: "Tasks / Checklist",

staffId: "Staff ID",
taskId: "Task ID",

notAvailable: "N/A",
noActivity: "No activity",
noTask: "No task",
protocolAssignments: "Protocol Assignments",

staffName: "Staff Name",
roleResponsibility: "Role / Responsibility",

addAssignment: "Add Assignment",

noProtocolAssignments: "No protocol assignments added yet.",
eventAgenda: "Event Agenda",

agendaActivityPlaceholder: "Activity (e.g. Bride Entrance)",

addAgenda: "Add Agenda",

noAgendaItems: "No agenda items added yet.",

fillAllAgendaFields: "Please select an event and fill all fields",
unknownEvent: "Unknown Event",
eventDayChecklist: "Event Day Checklist",

addChecklistTaskPlaceholder: "Add task (e.g. Confirm stage setup)",

noChecklistItems: "No checklist items added yet.",
protocolTaskChecklist: "Protocol Task Checklist",

taskCannotBeEmpty: "Task cannot be empty.",
confirmDeleteTask: "Are you sure you want to delete this task?",



taskPlaceholder: "Task...",


noProtocolTasks: "No protocol tasks added yet.",
protocolManageEvents: "Protocol – Manage Events",

noApprovedEvents: "No approved events available yet.",
theme: "Theme",
coupleOverview: "Couple Overview",

noEventsAdded: "No events added yet.",

guestList: "Guest List",
    
    normal: "Normal",
    vip: "VIP",
    family: "Family",
   
    fillGuestFields: "Please provide Guest Name, Email, and Type!",

    rsvpAccepted: "RSVP Accepted",
    rsvpPending: "RSVP Pending",
    seatingArrangement: "Seating Arrangement",
    selectGuest: "Select Guest",
    seatNumber: "Seat Number",
    rowNumber: "Row / Table Number",
  
    assignSeat: "Assign Seat",
    table: "Table",
    guest: "Guest",
    seat: "Seat",
    type: "Type",
    fillSeatFields: "Please fill all fields",
    tableFull: "This table already has 8 guests",
    seatNumberAssigned: "Seat number already assigned at this table",
    noSeatsAssigned: "No seating assigned yet",
    coupleBudgetSummary: "Couple Budget Summary",
   
    submit: "Submit",
    pay: "Pay",
    rsvpTracking: "RSVP Tracking",
    noGuests: "No guests available.",
    attending: "Attending",
  
    selectVendorService: "Select Vendor Service",
   
    taskOptional: "Task (optional)",
    inventoryManagement: "Couple Inventory Management",
  
    assignedVendorOptional: "Assigned Vendor (Optional)",
    addItem: "Add Item",
    searchItems: "Search items...",
    noInventoryItems: "No inventory items found.",
 
    confirmDeleteItem: "Delete this item?",
    generalTask: "General",
 
    taskName: "Task name...",
  
    noTasksYet: "No tasks yet.",
    budgetSummary: "Budget Summary",
    protocol: "Protocol",
  },
  

  am: {
    // Existing (unchanged)
    budgetSummary: "የበጀት እይታ",
    taskChecklist: "የተግባር ዝርዝር",
    total: "አጠቃላይ",
    completed: "ተጠናቀቀ",
    pending: "በመጠባበቅ ላይ",
    high: "ከፍተኛ",
    medium: "መካከለኛ",
    low: "ዝቅተኛ",
    taskName: "የተግባር ስም...",
    category: "ምድብ",
    add: "አክል",
    noTasksYet: "ግንዛቤ የለም።",
    done: "ተጠናቀቀ",
    delete: "ሰርዝ",
    confirmDeleteTask: "ይህን ተግባር ሰርዝ?",
    taskCannotBeEmpty: "ተግባር ባዶ ሊሆን አይችልም።",
    eventId: "የክስተት መለያ",
    couple: "ጋብቻ",
    protocol: "ፕሮቶኮል",
    inventoryManagement: "የተዋሕዶ እቃዎች አስተዳደር",
    totalItems: "አጠቃላይ እቃዎች",
    totalQuantity: "አጠቃላይ ብዛት",
    itemName: "የእቃ ስም",
    quantity: "ብዛት",

    assigned: "ተመደበ",
    delivered: "ተላከ",
    assignedVendorOptional: "የተመደበ አቅራቢ (እንደአማካይ)",
    addItem: "እቃ አክል",
    searchItems: "እቃዎችን ፈልግ...",
    noInventoryItems: "እቃ የለም።",
    item: "እቃ",
    status: "ሁኔታ",
    source: "ምንጭ",
    vendor: "አቅራቢ",
    actions: "ተግባር",
  
    confirmDeleteItem: "ይህን እቃ ሰርዝ?",
    vendorCoordination: "የቻንነት አስተዳደር",
    selectVendorService: "የቻንነት አገልግሎት ይምረጡ",
    selectEvent: "ዝግጅት ይምረጡ",
    taskOptional: "ተግባር (እንደአማካይ)",
    addAssignment: "ተግባር አክል",
    noVendorAssignments: "እስካሁን ምንም የቻንነት ተግባር የለም።",
    event: "ዝግጅት",
    task: "ተግባር",
    generalTask: "አጠቃላይ",
    rsvpTracking: "የእግብዓት መከታተያ",
    noGuests: "እንግዶች የሉም።",
    attending: "ተሳትፎ አለዎት",
    coupleBudgetSummary: "የጋብቻ በጀት ማጠቃለያ",

 
    amount: "መጠን",
    submit: "አስገባ",
    pay: "ክፍያ አድርግ",
    remaining: "ቀሪ",
    fillAllFields: "እባክዎ ሁሉንም መስኮች ያስገቡ",
    seatingArrangement: "የቦታ ዝርዝር",
    selectGuest: "እንግዳ ይምረጡ",
    seatNumber: "የመቀመጫ ቁጥር",
    rowNumber: "ረድፍ / ገበታ ቁጥር",
    normal: "መደበኛ",
    vip: "አስተዋፅኦ እንግዳ",
    family: "ቤተሰብ",
    assignSeat: "ቦታ ይሰጡ",
    table: "ገበታ",
    guest: "እንግዳ",
    seat: "ቦታ",
    type: "አይነት",
    fillSeatFields: "እባክዎ ሁሉንም መስኮች ያስገቡ",
    tableFull: "ይህ ገበታ ከ8 እንግዳዎች በላይ አለበት",
    seatNumberAssigned: "የመቀመጫ ቁጥር በዚህ ገበታ ቀድሞ ተመዘገበ",
    noSeatsAssigned: "ምንም ቦታ አልተመደበም",
    guestList: "የእንግዳ ዝርዝር",
    guestName: "የእንግዳ ስም",
    guestEmail: "የኢሜል አድራሻ",

    addGuest: "እንግዳ አክል",
    searchGuests: "እንግዳዎችን ፈልግ...",
    noGuestsFound: "እንግዳ አልተገኙም።",
    fillGuestFields: "እባክዎ የእንግዳ ስም፣ ኢሜል፣ እና አይነት ያስገቡ።",
    allFieldsRequired: "ሁሉም መስኮች አስፈላጊ ናቸው!",
    confirmDeleteGuest: "እርግጠኛ ነህ ይህን እንግዳ ማጥፋት ይፈልጋሉ?",
    edit: "አርትዕ",

    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    rsvpAccepted: "RSVP ተቀባ",
    rsvpPending: "RSVP በሂደት ላይ",
    noEventsAdded: "ገና ክስተቶች አልታከሉም።",
    protocolManageEvents: "የፕሮቶኮል ዝግጅቶች አስተዳደር",
    theme: "ገጽታ",
    coupleOverview: "የውርጃ ጥቅም እይታ",
noApprovedEvents: "እስካሁን የተፈቀዱ ዝግጅቶች የሉም።",


    protocolTaskChecklist: "የፕሮቶኮል ተግባር ማረጋገጫ ዝርዝር",



taskPlaceholder: "ተግባር...",





noProtocolTasks: "እስካሁን ምንም የፕሮቶኮል ተግባር አልተጨመረም።",
    eventAgenda: "የዝግጅት አጀንዳ",
    eventDayChecklist: "የዝግጅት ቀን ማረጋገጫ ዝርዝር",
   
    addChecklistTaskPlaceholder: "ተግባር ጨምር (ለምሳሌ፦ የመድረክ አዘጋጅት ማረጋገጥ)",
    
    noChecklistItems: "እስካሁን ምንም የማረጋገጫ ነገር አልተጨመረም።",
    

agendaActivityPlaceholder: "እንቅስቃሴ (ለምሳሌ፦ የሙሽራ መግቢያ)",

addAgenda: "አጀንዳ ጨምር",

noAgendaItems: "እስካሁን ምንም አጀንዳ አልተጨመረም።",

fillAllAgendaFields: "እባክዎ ዝግጅት ይምረጡ እና ሁሉንም መስኮች ይሙሉ",
unknownEvent: "ያልታወቀ ዝግጅት",
    protocolOverview: "የፕሮቶኮል አጠቃላይ እይታ",
    protocolAssignments: "የፕሮቶኮል ምደባዎች",

    staffName: "የሰራተኛ ስም",
    roleResponsibility: "ሚና / ኃላፊነት",
    

    noProtocolAssignments: "እስካሁን ምንም የፕሮቶኮል ምደባ አልተጨመረም።",
totalAssignments: "ጠቅላላ ምደባዎች",
totalAgendaItems: "ጠቅላላ የአጀንዳ ንጥሎች",
totalTasksChecklist: "ጠቅላላ ተግባሮች / ማረጋገጫ ዝርዝር",

assignments: "ምደባዎች",
agenda: "አጀንዳ",
tasksChecklist: "ተግባሮች / ማረጋገጫ ዝርዝር",

staffId: "የሰራተኛ መለያ",
taskId: "የተግባር መለያ",

notAvailable: "የለም",
noActivity: "ምንም እንቅስቃሴ የለም",
noTask: "ተግባር የለም",


    themePreviewText: "ይህ ቀን ቅርጸ ትምህርት ነው፤ አሁን ያለው ቅርጸ ትምህርት",
    manageServices: "አገልግሎት አስተዳደር",
    vendorReports: "የአቅራቢ ሪፖርቶች",
    payments: "ክፍያዎች",
    totalPayments: "ጠቅላላ ክፍያዎች",
    paidPayments: "ተከፍሏል",
    totalAmount: "ጠቅላላ መጠን",
    inventory: "እቃ ዝርዝር",
    totalInventoryItems: "እቃዎች ጠቅላላ",
  
    noReports: "ሪፖርቶች አሁን አልተገኙም።",
    vendorInventory: "የአቅራቢ እቃዎች",
  vendorGiftInventory: "የአቅራቢ ስጦታ እቃዎች",

 
  addGift: "ስጦታ አክል",
  giftName: "የስጦታ ስም",
  price: "ዋጋ",
  image: "ምስል",
  search: "ፈልግ...",
  fillGiftFields: "እባክዎ ስጦታ መስኮችን በትክክል ይሙሉ!",
    mySchedule: "የኔ ሰዓት ሰሌዳ",
    noScheduleItems: "ምንም የሰዓት እቅዶች አልተገኙም",
    vendorPayments: "የአቅራቢ ክፍያዎች",
    noPaymentsAvailable: "ክፍያ አልተገኘም",
    approveAddBank: "ማረጋገጥ & የባንክ መረጃ አክል",
    waitingForPayment: "ከጋብቻ ክፍያ ማጠበቅ ላይ",
    confirmPayment: "ክፍያ ያረጋግጡ",
    paid: "ተከፍሏል",
    paymentProof: "የክፍያ ማስረጃ",
    bankNamePrompt: "የባንክ ስም:",
    accountNamePrompt: "የመለያ ስም:",
    accountNumberPrompt: "የመለያ ቁጥር:",
    swiftCodePrompt: "SWIFT ኮድ (ከፍ እንዲሁም አማራጭ):",
    bankInfoRequired: "የባንክ ስም፣ የመለያ ስም እና የመለያ ቁጥር ያስፈልጋሉ",
    confirmPaymentPrompt: "ክፍያ ተቀባ እንደሆነ ያረጋግጡ?",
    assignedEvents: "የተመደቡ ክስተቶች",
  noConfirmedEvents: "እስካሁን ምክንያት የተጠበቁ ክስተቶች አልተመደቡም",
  locked: "ተዘግቷል",
    manageAssignServices: "አገልግሎቶችን አስተዳደር & ማስመዝገብ",
    selectService: "አገልግሎት ይምረጡ",
  
    assign: "ማስመዝገብ",
    selectServiceAndEvent: "አገልግሎትና ክስተት ሁለቱንም ይምረጡ",
    noServicesAssigned: "አገልግሎት እስካሁን አልተመደበም",
    noDescription: "መግለጫ የለም",
    assignedTo: "ተመደበው ወደ",
    on: "በ",
    vendorOverview: "የአቅራቢ እይታ",

    unpaid: "አልተከፈለም",


    budget: "በጀት",
 

    managerBudgets: "አስተዳደር - በጀት",
    masterInventory: "የምርት ዝርዝር አስተዳደር",

  
    vendorOptional: "አቅራቢ (እንደ ተፈለገ) ",


    searchInventory: "የምርትን ፈልግ...",
    
    deleteConfirm: "ይህን እቃ ማጥፋት ይፈልጋሉ?",
    sortBy: "ይስራል",
  


  descriptionCategory: "መግለጫ / ምድብ",

 
  searchBudgets: "በጀቶችን ፈልግ...",
  noBudgetsFound: "በጀቶች አልተገኙም።",

  deleteBudgetConfirm: "ይህን በጀት ማጥፋት ይፈልጋሉ?",
  pendingApproval: "በሂደት ላይ እየተፈተነ",
  approvedByManager: "በአስተዳደር ተፈቅዷል",
  approve: "ፈቀድ",


  approved: "ተፈቅዷል",
 
 

    managerTaskChecklist: "የአስተዳደር ተግባር ዝርዝር",


    searchTasks: "ተግባሮችን ፈልግ...",
    taskAddError: "የክስተት መለያ እና ተግባር አይቀርም።",
    taskDeleteConfirm: "ይህን ተግባር ማጥፋት ይፈልጋሉ?",
    editTaskPrompt: "ተግባር አርትዕ:",
  
  
   
    managerAddedTasks: "የአስተዳደር የተጨመረ ተግባር",
    tasksFromCouples: "ከጋርብ የተገኙ ተግባሮች",
    tasksFromProtocol: "ከፕሮቶኮል የተገኙ ተግባሮች",
    noTasksFound: "ተግባሮች አልተገኙም።",
  

  vendorName: "የአቅራቢ ስም",
  
  assignVendor: "አቅራቢ ያስመዝግቡ",
  searchAssignments: "የአቅራቢ ስራዎችን ፈልግ...",
 

  confirmRemoveVendor: "ይህን የአቅራቢ ስራ ማጥፋት ይፈልጋሉ?",
  remove: "ሰርዝ",
    manageGuests: "እንግዶችን አስተዳደር",
 
   
    noGuestsForEvent: "ለዚህ ክስተት እንግዶች የሉም።",
    rsvp: "እስቲ መልስ",
    yes: "አዎ",
    no: "አይ",
   

    invalidEventId: "የተሳሳተ ክስተት መለያ!",

    manageEvents: "ክስተቶችን አስተዳደር",
  eventName: "የክስተት ስም",
  location: "ቦታ",

  searchEvents: "ክስተቶችን ይፈልጉ...",
  noEventsFound: "ክስተቶች አልተገኙም።",
  draft: "ስብስብ",


  guests: "እንግዶች",
  vendors: "ንግዶች",

  invalidStatusTransition: "የሁኔታ ለውጥ የተሳሳተ ነው",
  onlyDraftDelete: "ስብስብ ክስተቶች ብቻ ሊሰረዙ ይችላሉ።",
  confirmDeleteDraftEvent: "ይህን ስብስብ ክስተት ማጥፋት ይፈልጋሉ?",
    managerOverview: "የአስተዳደር እይታ",
    totalEvents: "ጠቅላላ ክስተቶች",
    upcoming: "ቀጣዩ",
    totalGuests: "ጠቅላላ እንግዶች",
    acrossAllEvents: "በሁሉም ክስተቶች",
    vendorAssignments: "የንግድ ተወዳድሮች",
    activeAssignments: "ንግድ ተወዳድሮች በተንቀሳቃሽ ሁኔታ",
    avgGuestsPerEvent: "አማካይ እንግዶች/ክስተት",
    averageAttendance: "አማካይ እንግዶች",
    events: "ክስተቶች",
    
    recentGuests: "የቅርብ ጊዜ እንግዶች",

   
    noVendorAssignmentsFound: "የንግድ ተወዳድሮች አልተገኙም",
    confirmDeleteEvent: "እርግጠኛ ነህ ይህን ክስተት ማጥፋት ይፈልጋሉ?",
 
    overview: "እይታ",
    eventInfo: "የክስተት መረጃ",
    schedule: "ሰሌዳ",

    seatInfo: "የቦታ መረጃ",
    giftRegistry: "የስጦታ ምዝገባ",
    profile: "መገለጫ",
    language: "ቋንቋ",
    appearance: "የቅርጸ ተግባር",
    settings: "ቅንብሮች",
    logout: "ውጣ",
    appearanceSettings: "የቅርጸ ተግባር ቅንብሮች",
    themeDescription: "ለእንግዳ ዳሽቦርድዎ መብራር, ጨለማ, ወይም ስርዓት ቅርጸ ተግባር ይምረጡ።",
    chooseTheme: "ቅርጸ ተግባር ይምረጡ:",
    light: "ብርሃን",
    dark: "ጨለማ",
    system: "ስርዓት",
    livePreview: "ይህ ቀጥታ አሳይ ነው። የአሁኑ ቅርጸ ተግባር ነው",
   
  avatarPreview: "የፎቶ አሳይ",
  uploadAvatar: "ፎቶ አስገባ",
  name: "ስም",
  enterName: "ስምዎን ያስገቡ",
  email: "ኢሜል",
  enterEmail: "ኢሜልዎን ያስገቡ",
  saveChanges: "ለውጦችን አስቀምጥ",
  profileUpdated: "መገለጫ ተስተካክሏል",
 
noGiftsRegistered: "ምንም ስጦታ አልተመዘገበም",
soldOut: "ተሽጦ ነው",
available: "ይገኛል",


boughtGifts: "የገዛው ስጦታ",
boughtAt: "ተገዝቷል",
giftSoldOut: "ይህ ስጦታ ተሽጦ ነው",
  
noScheduledEvents: "እስካሁን የተመደቡ ክስተቶች የለም",
agendaNotPublished: "የተሰጠ እቅድ አልተሰጠም",
    attendeeOverview: "የተሳታፊ እይታ",

rsvps: "RSVP ምዝገቦች",
seatAssignments: "የቦታ መመዝገቦች",

    admin_system_log_title: "ማስተናገድ - ስርዓተ መዝግብ",
search_logs_placeholder: "መዝግቦችን ፈልግ...",
sort_label: "ደረጃ ያስወግድ",
changeAvatar: "ፎቶ ቀይር",

defaultAdminName: "አስተዳዳሪ ተጠቃሚ",
newest: "አዲስ",
oldest: "አሮጌ",
refresh: "አዘምን",
clear_all: "ሁሉን ሰርዝ",
no_logs_found: "ምንም መዝግብ አልተገኘም",
actor: "አካላት",
delete_log: "መዝግብ ሰርዝ",
    adminManageVendors: "አቅራቢዎች አስተዳደር (አድሚን)",
    adminManageEvents: "ክስተቶች አስተዳደር (አድሚን)",
    adminManagePayments: "ክፍያዎች አስተዳደር (አድሚን)",
    adminManagePackages: "ጥቅሎች አስተዳደር (አድሚን)",
    adminFullReports: "ሙሉ ሪፖርቶች (አድሚን)",
    adminAnalytics: "የአድሚን ትንተና ዳሽቦርድ",
    updateSystemContent: "አድሚን – የስርዓት ይዘት አዘምን",

    systemContentPlaceholder: "የስርዓት ይዘትን እዚህ ያስገቡ...",
    systemContentSaved: "ይዘቱ በተሳካ ሁኔታ ተቀምጧል!",
    systemContentEmpty: "ይዘቱ ባዶ መሆን አይችልም።",
  
    totalUsers: "ጠቅላላ ተጠቃሚዎች",

    totalVendors: "ጠቅላላ አቅራቢዎች",
 
    
    eventsPerMonth: "ክስተቶች በወር",
    userRolesDistribution: "የተጠቃሚ ሚናዎች ክፍፍል",
    
    jan: "ጃን",
    feb: "ፌብ",
    mar: "ማር",
    apr: "ኤፕሪ",
    may: "ሜይ",
    jun: "ጁን",
    jul: "ጁላይ",
    aug: "ኦገስ",
    sep: "ሴፕ",
    oct: "ኦክቶ",
    nov: "ኖቬ",
    dec: "ዲሴ",
    
    metric: "መለኪያ",
    value: "እሴት",
    
    generatedAt: "የተፈጠረበት ጊዜ",
    
    packageName: "የጥቅል ስም",

    
    addPackage: "ጥቅል ጨምር",
 
    
    searchPackages: "ጥቅል ፈልግ...",
    sortByPrice: "በዋጋ ደርድር",
    noPackagesFound: "ምንም ጥቅል አልተገኘም።",
    
    confirmDeletePackage: "ይህን ጥቅል ለመሰረዝ እርግጠኛ ነዎት?",
    
    searchPayments: "በመንገድ፣ መጠን ወይም ቀን ፈልግ...",
    sortByAmount: "በመጠን ደርድር",
    noPaymentsFound: "ምንም ክፍያ አልተገኘም።",
    
    paymentVia: "በ",
    

    
    addEvent: "ክስተት ጨምር",

    
    eventFillAll: "ሁሉንም መስኮች ይሙሉ!",
   
    eventLockedEdit: "የተቆለፈ ክስተት ማስተካከል አይቻልም!",
    eventLockedDelete: "የተቆለፈ ክስተት መሰረዝ አይቻልም!",
    
    toggleStatus: "ሁኔታ ቀይር",
    
    eventStatus_draft: "ረቂቅ",
    eventStatus_approved: "ተፈቅዷል",
    eventStatus_locked: "ተቆልፏል",
    

service: "አገልግሎት",

addVendor: "አቅራቢ ጨምር",


searchVendors: "አቅራቢ ፈልግ...",
noVendorsFound: "ምንም አቅራቢ አልተገኘም።",

vendorRequired: "የአቅራቢ ስም እና አገልግሎት ያስፈልጋሉ!",
vendorEmptyError: "የአቅራቢ መረጃ ባዶ መሆን አይችልም!",
confirmDeleteVendor: "ይህን አቅራቢ ለመሰረዝ እርግጠኛ ነዎት?",

   
    users: "ተጠቃሚዎችን አስተዳደር",

    eventInformation: "የክስተት መረጃ",
  

    packages: "ጥቅሎች",
    reports: "ሙሉ ሪፖርቶች",
    analytics: "ትንተና",
    systemContent: "የስርዓት ይዘት",
    systemLogs: "የስርዓት መዝገቦች",
  
  
    
  
    languageSettings: "የቋንቋ ቅንብሮች",
    selectLanguage: "የስርዓቱን ቋንቋ ይምረጡ",
    direction: "አቅጣጫ",
    ltr: "ከግራ ወደ ቀኝ",
    rtl: "ከቀኝ ወደ ግራ",
  
    lang_en: "እንግሊዝኛ",
    lang_am: "አማርኛ",
    lang_ti: "ትግርኛ",
    lang_om: "ኦሮምኛ",
    lang_ar: "ዓረብኛ",
    lang_zh: "ቻይንኛ",
  
    // 🔹 ADDED (missing)
    adminManageUsers: "ተጠቃሚዎች አስተዳደር (አድሚን)",
    welcomeBack: "እንኳን ደህና መጡ! የሚካሄዱ ነገሮችን ይመልከቱ።",
    lastUpdated: "መጨረሻ የተዘመነበት",

    appearanceDescription: "ለአስተዳዳሪ ዳሽቦርድዎ መብራት፣ ጨለማ፣ ወይም ስርዓተ መለወጥ ይቀይሩ።",

    themeLight: "ብሩህ",
    themeDark: "ጨለማ",
    themeSystem: "ስርዓት",
 
   
    role: "ሚና",
  
    addUser: "ተጠቃሚ ጨምር",
  
    searchUsers: "ተጠቃሚ ፈልግ...",
    noUsersFound: "ምንም ተጠቃሚ አልተገኘም።",
  
    confirmDeleteUser: "ይህን ተጠቃሚ ለመሰረዝ እርግጠኛ ነዎት?",
  
    role_admin: "አድሚን",
    role_manager: "አስተዳዳሪ",
    role_vendor: "አቅራቢ",
  },
  

  ti: {
    languageSettings: "ቅንብር ቋንቋ",
    selectLanguage: "ቋንቋ ስርዓት ምረጽ",
    direction: "ኣንፈት",
    ltr: "ብሸነኽ ጸጋማይ ናብ የማን",
    rtl: "ብሸነኽ የማን ናብ ጸጋማይ",
    
    lang_en: "እንግሊዝኛ",
    lang_am: "ኣማርኛ",
    lang_ti: "ትግርኛ",
    lang_om: "ኦሮምኛ",
    lang_ar: "ዓረብኛ",
    lang_zh: "ቻይንኛ",
    
    overview: "ሓፈሻዊ ትርኢት",
    users: "ተጠቃሚታት ኣዳል",
    vendors: "ኣቕራብቲ ኣዳል",
    events: "ዝግባራት ኣዳል",
    payments: "ክፍሊታት",
    packages: "ፓኬጆታት",
    reports: "ምሉእ ሪፖርት",
    analytics: "ትንተና",
    systemContent: "ናይ ስርዓት ዝርዝር",
    systemLogs: "ምዝገባ ስርዓት",
    profile: "መግለጺ",
    language: "ቋንቋ",
    appearance: "መልክዕ",
    settings: "ቅንብራት",
    logout: "ውጻእ",
    
    adminManageUsers: "ኣስተዳደር – ተጠቃሚታት ኣዳል",
    welcomeBack: "እንቋዕ ብድሓን መጻእኩም! እዚ እተገብረ ዘሎ እዩ።",
    lastUpdated: "ናይ መወዳእታ ምምሕያሻት",
    
    name: "ስም",
    email: "ኢመይል",
    role: "ርትዓዊ ቦታ",
    
    addUser: "ተጠቃሚ ወድእ",
    delete: "ሰርዝ",
    searchUsers: "ተጠቃሚታት ድለይ...",
    noUsersFound: "ተጠቃሚታት ኣይተረኽቡን።",
    
    confirmDeleteUser: "እዚ ተጠቃሚ ክትሰርዞ ርግጸኛ ዲኻ?",
    
    role_admin: "ኣስተዳደር",
    role_manager: "ማኔጀር",
    role_vendor: "ኣቕራቢ",
    adminManageVendors: "ኣስተዳደር – ኣቕራብቲ ኣዳል",
    
    vendorName: "ስም ኣቕራቢ",
    service: "ኣገልግሎት",
    
    addVendor: "ኣቕራቢ ወድእ",
    edit: "ኣርግጽ",
    save: "ቀጽል",
    cancel: "ድምርስ",
    
    searchVendors: "ኣቕራብቲ ድለይ...",
    noVendorsFound: "ኣቕራብቲ ኣይተረኽቡን።",
    
    vendorRequired: "ስም ኣቕራብቲን ኣገልግሎትን ኣድላይ እዩ!",
    vendorEmptyError: "ስም ኣቕራብቲን ኣገልግሎትን ባዶ ክኸውን ኣይክእልን!",
    confirmDeleteVendor: "እዚ ኣቕራቢ ክትሰርዞ ርግጸኛ ዲኻ?",
    adminManageEvents: "ኣስተዳደር – ዝግባራት ኣዳል",
    
    eventName: "ስም ዝግባር",
    location: "ቦታ",
    
    addEvent: "ዝግባር ወድእ",
    
    searchEvents: "ዝግባራት ድለይ...",
    noEventsFound: "ዝግባራት ኣይተረኽቡን።",
    
    eventFillAll: "ብኽብረት ኩሉ መደብ መልአ!",
    confirmDeleteEvent: "እዚ ዝግባር ክትሰርዞ ርግጸኛ ዲኻ?",
    eventLockedEdit: "ተበልጽ ዝግባራት ክትቅይሮም ኣይትኽእልን!",
    eventLockedDelete: "ተበልጽ ዝግባራት ክትሰርዞም ኣይትኽእልን!",
    
    toggleStatus: "ስታተስ ቀይር",
    
    eventStatus_draft: "ንድፊ",
    eventStatus_approved: "እተኣመነ",
    eventStatus_locked: "ተበልጺ",
    adminManagePayments: "ኣስተዳደር – ክፍሊታት ኣዳል",
    
    searchPayments: "ብኣገባብ፡ ብጠቕላላ፡ ወይ ብዕለት ድለይ...",
    sortByAmount: "ብጠቕላላ ደርድር",
    noPaymentsFound: "ክፍሊታት ኣይተረኽቡን።",
    
    paymentVia: "በቲ",
    adminManagePackages: "ኣስተዳደር – ፓኬጆታት ኣዳል",
    
    packageName: "ስም ፓኬጅ",
    price: "ዋጋ",
    
    addPackage: "ፓኬጅ ወድእ",
    
    searchPackages: "ፓኬጆታት ድለይ...",
    sortByPrice: "ብዋጋ ደርድር",
    noPackagesFound: "ፓኬጆታት ኣይተረኽቡን።",
    
    confirmDeletePackage: "እዚ ፓኬጅ ክትሰርዞ ርግጸኛ ዲኻ?",
    
    adminFullReports: "ኣስተዳደር – ምሉእ ሪፖርት",
    
    metric: "ሜትሪክ",
    value: "ትምግማት",
    adminAnalytics: "ኣስተዳደር – መስኮት ትንተና",
    
    totalUsers: "ጠቕላል ተጠቃሚታት",
    totalEvents: "ጠቕላል ዝግባራት",
    totalVendors: "ጠቕላል ኣቕራብቲ",
    totalPayments: "ጠቕላል ክፍሊታት",
    
    eventsPerMonth: "ዝግባራት ኣብ ሓደ ወርሒ",
    userRolesDistribution: "ምትላል ርትዓዊ ቦታታት ተጠቃሚታት",
    
    jan: "ጃን",
    feb: "ፈብ",
    mar: "ማር",
    apr: "ኤፕር",
    may: "መይ",
    jun: "ጁን",
    jul: "ጁላይ",
    aug: "ኦገስ",
    sep: "ሰፕቴምበር",
    oct: "ኦክቶበር",
    nov: "ኖቬምበር",
    dec: "ዲሴምበር",
    
    generatedAt: "ኣብ ግዜ ተፈጢሩ",
    updateSystemContent: "ኣስተዳደር – ናይ ስርዓት ዝርዝር ኣሕዲር",
    
    systemContentPlaceholder: "እዚ ናይ ስርዓት ዝርዝር ኣእቱ...",
    systemContentSaved: "ዝርዝር ብኽብረት ተቐሚጡ!",
    systemContentEmpty: "ዝርዝር ባዶ ክኸውን ኣይክእልን።",
    
    admin_system_log_title: "ኣስተዳደር - ምዝገባ ስርዓት",
    search_logs_placeholder: "ምዝገባታት ድለይ...",
    sort_label: "ደርድር",
    newest: "ሓደስቲ",
    oldest: "ሓደስቲ ዘይኮኑ",
    refresh: "ኣድስ",
    clear_all: "ኩሉ ኣንጸባርቕ",
    no_logs_found: "ምዝገባታት ኣይተረኽቡን።",
    actor: "ተግባራዊ ዝገብሮ",
    delete_log: "ምዝገባ ሰርዝ",
    
    changeAvatar: "ኣባባል ቀይር",
    avatarPreview: "ቅድመ ትርኢት ኣባባል",
    
    saveChanges: "ለውጥታት ኣቅምል",
    profileUpdated: "መግለጺ ተሓዲሱ!",
    defaultAdminName: "ተጠቃሚ ኣስተዳደር",
    appearanceSettings: "ቅንብራት መልክዕ",
    appearanceDescription: "ኣብ መስኮት ኣስተዳደርካ ኣብ መንጎ ብርሃን፡ ጸልማት፡ ወይ ብስርዓት ቅየራ ምግባር።",
    chooseTheme: "ቅየራ ምረጽ:",
    themeLight: "ብርሃን",
    themeDark: "ጸልማት",
    themeSystem: "ስርዓት",
    livePreview: "እዚ ህያው ቅድመ ትርኢት እዩ። ሕጂ ዘሎ ቅየራ",
    attendeeOverview: "ሓፈሻዊ ትርኢት ተሳቲፍ",
    eventInformation: "ሓበሬታ ዝግባር",
    noConfirmedEvents: "ገና ዝተኣምነ ዝግባራት የለን",
    locked: "ተበልጺ",
    rsvps: "RSVPታት",
    seatAssignments: "ኣተካኢ መንበር",
    giftRegistry: "ምዝገባ ህያብ",
    mySchedule: "ናይደይ መደብ",
    noScheduledEvents: "ገና ዝተደርደረ ዝግባራት የለን",
    agendaNotPublished: "ኣጀንዳ ገና ኣይተሓትመን",
    
    noGiftsRegistered: "ገና ዝተመዝገበ ህያብ የለን።",
    soldOut: "ተሸጢ",
    available: "ተርእዮ",
    quantity: "ብዝሒ",
    
    uploadAvatar: "ኣባባል ኣስተቕል",
    
    enterName: "ስምካ ኣእቱ",
    
    enterEmail: "ኢመይልካ ኣእቱ",
    
    boughtGifts: "ዝተገዝአ ህያባት",
    boughtAt: "ዝተገዛአሉ ግዜ",
    giftSoldOut: "እዚ ህያብ ተሸጢ እዩ።",
    
    themeDescription: "ኣብ መስኮት ተሳቲፍካ ኣብ መንጎ ብርሃን፡ ጸልማት፡ ወይ ብስርዓት ቅየራ ምግባር።",
    
    light: "ብርሃን",
    dark: "ጸልማት",
    system: "ስርዓት",
    
    eventInfo: "ሓበሬታ ዝግባር",
    schedule: "መደብ",
    rsvp: "RSVP",
    seatInfo: "ሓበሬታ መንበር",
    managerOverview: "ሓፈሻዊ ትርኢት ማኔጀር",
    
    upcoming: "ዝመጽእ",
    totalGuests: "ጠቕላል ኣጋይሽ",
    acrossAllEvents: "ኣብ ኩሉ ዝግባራት",
    vendorAssignments: "ኣተካኢ ኣቕራብቲ",
    activeAssignments: "ንጡፍ ኣተካኣይታት",
    avgGuestsPerEvent: "ኣብ ሓደ ዝግባር ጸብቂ ኣጋይሽ",
    averageAttendance: "ጸብቂ ምህላው",
    
    recentGuests: "ቀረባ ኣጋይሽ",
    noGuestsFound: "ኣጋይሽ ኣይተረኽቡን",
    assignedTo: "ተኸፊሉ ኣብ",
    noVendorAssignmentsFound: "ኣተካኢ ኣቕራብቲ ኣይተረኽቡን",
    manageEvents: "ዝግባራት ኣዳል",
    
    add: "ወድእ",
    
    draft: "ንድፊ",
    approved: "እተኣመነ",
    
    guests: "ኣጋይሽ",
    
    invalidStatusTransition: "ዘይሕጋዊ ምልውዋጥ ስታተስ",
    onlyDraftDelete: "ንድፊ ዝግባራት ጥራይ ክትሰርዞም ትኽእል።",
    confirmDeleteDraftEvent: "እዚ ንድፊ ዝግባር ክትሰርዞ ርግጸኛ ዲኻ?",
    event: "ዝግባር",
    manageGuests: "ኣጋይሽ ኣዳል",
    guestName: "ስም ኣጋይሽ",
    guestEmail: "ኢመይል ኣጋይሽ",
    selectEvent: "ዝግባር ምረጽ",
    addGuest: "ኣጋይሽ ወድእ",
    searchGuests: "ብስም፡ ብኢመይል፡ ወይ ብዝግባር ኣጋይሽ ድለይ...",
    noGuestsForEvent: "ኣብዚ ዝግባር ኣጋይሽ የለን።",
    
    yes: "ወይ",
    no: "ኣይፋል",
    
    allFieldsRequired: "ኩሉ መደብ ኣድላይ እዩ!",
    invalidEventId: "ዘይሕጋዊ ID ዝግባር!",
    confirmDeleteGuest: "እዚ ኣጋይሽ ክትሰርዞ ርግጸኛ ዲኻ?",
    vendorCoordination: "ምስምርዓ ኣቕራብቲ",
    
    selectService: "ኣገልግሎት ምረጽ",
    assignVendor: "ኣቕራቢ ኣተክእ",
    searchAssignments: "ኣተካኣይታት ድለይ...",
    noVendorAssignments: "ኣተካኢ ኣቕራብቲ ኣይተረኽቡን።",
    
    confirmRemoveVendor: "እዚ ኣተካኢ ኣቕራቢ ክትልወጦ ርግጸኛ ዲኻ?",
    remove: "ኣልግስ",
    managerTaskChecklist: "ናይ ማኔጀር ናይ ግድን ዕማም ናይ ስራሕ ዝርዝር",
    eventId: "ID ዝግባር",
    task: "ስራሕ",
    category: "መደብ",
    low: "ትሑት",
    medium: "ማእከላይ",
    high: "ልዑል",
    done: "ተፈጺሙ",
    
    searchTasks: "ስራሓት ድለይ...",
    taskAddError: "ID ዝግባርን ስራሕን ባዶ ክኸውን ኣይክእልን።",
    taskDeleteConfirm: "እዚ ስራሕ ክትሰርዞ ርግጸኛ ዲኻ?",
    editTaskPrompt: "ስራሕ ኣርግጽ:",
    total: "ጠቕላል",
    completed: "ተፈጺሙ",
    pending: "ጽዕነት ዘለዎ",
    managerAddedTasks: "ማኔጀር ዝወደኦም ስራሓት",
    tasksFromCouples: "ካብ መጻምድቲ ዝመጹ ስራሓት",
    tasksFromProtocol: "ካብ ፕሮቶኮል ዝመጹ ስራሓት",
    noTasksFound: "ስራሓት ኣይተረኽቡን።",
    managerBudgets: "ማኔጀር - በጃታት",
    
    descriptionCategory: "መግለጺ / መደብ",
    amount: "ጠቕላላ",
    
    searchBudgets: "በጃታት ድለይ...",
    noBudgetsFound: "በጃታት ኣይተረኽቡን።",
    fillAllFields: "ኩሉ መደብ መልአ!",
    deleteBudgetConfirm: "እዚ በጃ ክትሰርዞ ርግጸኛ ዲኻ?",
    pendingApproval: "ጽዕነት ኣፍላግ",
    approvedByManager: "ብማኔጀር ተኣሚኑ",
    approve: "ኣመን",
    
    masterInventory: "ላዕለዋይ ሓበሬታ ንብረት",
    totalItems: "ጠቕላል ኣቕሑ",
    
    itemName: "ስም ኣቕሑ",
    
    vendorOptional: "ኣቕራቢ (ኣፍራይ)",
    vendor: "ኣቕራቢ",
    couple: "መጻምድቲ",
    source: "ምንጪ",
    status: "ስታተስ",
    
    searchInventory: "ሓበሬታ ንብረት ድለይ...",
    
    deleteConfirm: "እዚ ኣቕሑ ሓበሬታ ንብረት ክትሰርዞ ርግጸኛ ዲኻ?",
    sortBy: "በዚ ደርድር",
    
    assigned: "ተኸፊሉ",
    delivered: "ተዓዲሙ",
    actions: "ተግባራት",
    paid: "ተኸፊሉ",
    taskChecklist: "ናይ ግድን ዕማም ናይ ስራሕ ዝርዝር",
    budget: "በጃ",
    inventory: "ሓበሬታ ንብረት",
    remaining: "ዝተረፈ",
    vendorOverview: "ሓፈሻዊ ትርኢት ኣቕራቢ",
    assignedEvents: "ተኸፊሎም ዘለዉ ዝግባራት",
    manageAssignServices: "ኣገልግሎታት ኣዳል & ኣተክእ",
    
    assign: "ኣተክእ",
    selectServiceAndEvent: "ኩሉኡ ኣገልግሎትን ዝግባርን ምረጽ",
    noServicesAssigned: "ገና ዝተኸፈለ ኣገልግሎት የለን።",
    noDescription: "መግለጺ የለን",
    vendorPayments: "ክፍሊታት ኣቕራብቲ",
    noPaymentsAvailable: "ክፍሊታት የለን",
    approveAddBank: "ኣመን & ሓበሬታ ባንክ ወድእ",
    waitingForPayment: "ክፍሊት መጻምድቲ ተጽዒኑ ኣሎ",
    confirmPayment: "ክፍሊት ኣረጋግጽ",
    
    paymentProof: "ምርካብ ክፍሊት",
    bankNamePrompt: "ስም ባንክ:",
    accountNamePrompt: "ስም ሕሳብ:",
    accountNumberPrompt: "ቁጽሪ ሕሳብ:",
    swiftCodePrompt: "SWIFT ኮድ (ኣፍራይ):",
    bankInfoRequired: "ስም ባንክ፡ ስም ሕሳብ፡ ከምኡውን ቁጽሪ ሕሳብ ኣድላይ እዩ",
    confirmPaymentPrompt: "ክፍሊት ተቐቢልካ ከም ዘሎካ ኣረጋግጽ?",
    on: "ኣብ",
    vendorInventory: "ሓበሬታ ንብረት ኣቕራቢ",
    vendorGiftInventory: "ሓበሬታ ህያባት ኣቕራቢ",
    item: "ኣቕሑ",
    
    addGift: "ህያብ ወድእ",
    giftName: "ስም ህያብ",
    
    image: "ምስሊ",
    search: "ድለይ...",
    fillGiftFields: "ብኽብረት ኩሉ መደብ ህያብ ቅኑዕ መልአ!",
    noScheduleItems: "ኣቕሑ መደብ የለን።",
    unpaid: "ዘይተኸፊሉ",
    vendorReports: "ሪፖርት ኣቕራብቲ",
    
    paidPayments: "ተኸፊሎም ዘለዉ ክፍሊታት",
    totalAmount: "ጠቕላል ጠቕላላ",
    
    totalInventoryItems: "ጠቕላል ኣቕሑ ሓበሬታ ንብረት",
    totalQuantity: "ጠቕላል ብዝሒ",
    noReports: "ገና ሪፖርት የለን።",
    themePreviewText: "እዚ ህያው ቅድመ ትርኢት እዩ። ሕጂ ዘሎ ቅየራ",
    manageServices: "ኣገልግሎታት ኣዳል",
    protocolOverview: "ሓፈሻዊ ትርኢት ፕሮቶኮል",
    
    totalAssignments: "ጠቕላል ኣተካኣይታት",
    totalAgendaItems: "ጠቕላል ኣቕሑ ኣጀንዳ",
    totalTasksChecklist: "ጠቕላል ስራሓት / ናይ ግድን ዕማም ዝርዝር",
    
    assignments: "ኣተካኣይታት",
    agenda: "ኣጀንዳ",
    tasksChecklist: "ስራሓት / ናይ ግድን ዕማም ዝርዝር",
    
    staffId: "ID ሰራሕተኛ",
    taskId: "ID ስራሕ",
    
    notAvailable: "የለን",
    noActivity: "ተግባር የለን",
    noTask: "ስራሕ የለን",
    protocolAssignments: "ኣተካኣይታት ፕሮቶኮል",
    
    staffName: "ስም ሰራሕተኛ",
    roleResponsibility: "ርትዓዊ ቦታ / ሓላፍነት",
    
    addAssignment: "ኣተካኢ ወድእ",
    
    noProtocolAssignments: "ገና ዝተወደአ ኣተካኢ ፕሮቶኮል የለን።",
    eventAgenda: "ኣጀንዳ ዝግባር",
    
    agendaActivityPlaceholder: "ተግባር (ከም ምእታው ሰበይቲ)",
    
    addAgenda: "ኣጀንዳ ወድእ",
    
    noAgendaItems: "ገና ዝተወደአ ኣቕሑ ኣጀንዳ የለን።",
    
    fillAllAgendaFields: "ብኽብረት ዝግባር ምረጽን ኩሉ መደብ መልአን",
    unknownEvent: "ዘይፍለጥ ዝግባር",
    eventDayChecklist: "ናይ ግድን ዕማም ዝርዝር መዓልቲ ዝግባር",
    
    addChecklistTaskPlaceholder: "ስራሕ ወድእ (ከም ምርግጋጽ መድረኽ ምድላው)",
    
    noChecklistItems: "ገና ዝተወደአ ኣቕሑ ናይ ግድን ዕማም ዝርዝር የለን።.",
    protocolTaskChecklist: "ናይ ግድን ዕማም ዝርዝር ስራሕ ፕሮቶኮል",
    
    taskCannotBeEmpty: "ስራሕ ባዶ ክኸውን ኣይክእልን።",
    confirmDeleteTask: "እዚ ስራሕ ክትሰርዞ ርግጸኛ ዲኻ?",
    
    taskPlaceholder: "ስራሕ...",
    
    noProtocolTasks: "ገና ስራሕ ፕሮቶኮል የለን።",
    protocolManageEvents: "ፕሮቶኮል – ዝግባራት ኣዳል",
    
    noApprovedEvents: "ገና ዝተኣመነ ዝግባራት የለን።",
    theme: "ቅየራ",
    coupleOverview: "ሓፈሻዊ ትርኢት መጻምድቲ",
    
    noEventsAdded: "ገና ዝተወደአ ዝግባራት የለን።",
    
    guestList: "ዝርዝር ኣጋይሽ",
    
    normal: "ንቡር",
    vip: "VIP",
    family: "ስድራ",
    
    fillGuestFields: "ብኽብረት ስም ኣጋይሽ፡ ኢመይል፡ ከምኡውን ዓይነት ኣቕርብ!",
    
    rsvpAccepted: "RSVP ተቐቢሉ",
    rsvpPending: "RSVP ጽዕነት ዘለዎ",
    seatingArrangement: "ምድላው መንበር",
    selectGuest: "ኣጋይሽ ምረጽ",
    seatNumber: "ቁጽሪ መንበር",
    rowNumber: "ቁጽሪ መንበር / ትራፕ",
    
    assignSeat: "መንበር ኣተክእ",
    table: "ጣውላ",
    guest: "ኣጋይሽ",
    seat: "መንበር",
    type: "ዓይነት",
    fillSeatFields: "ብኽብረት ኩሉ መደብ መልአ",
    tableFull: "እዚ ጣውላ ሕጂ 8 ኣጋይሽ ኣለዎ",
    seatNumberAssigned: "ቁጽሪ መንበር ኣብዚ ጣውላ ሕጂ ተኸፊሉ ኣሎ",
    noSeatsAssigned: "ገና መንበር ኣይተኸፍለን",
    coupleBudgetSummary: "ማጠቓላል በጃ መጻምድቲ",
    
    submit: "ኣቕርብ",
    pay: "ኣክፍል",
    rsvpTracking: "ምክትታል RSVP",
    noGuests: "ኣጋይሽ የለን።",
    attending: "ተሳቲፍ ኣሎ",
    
    selectVendorService: "ኣገልግሎት ኣቕራቢ ምረጽ",
    
    taskOptional: "ስራሕ (ኣፍራይ)",
    inventoryManagement: "ኣዳል ሓበሬታ ንብረት መጻምድቲ",
    
    assignedVendorOptional: "ኣቕራቢ ተኸፊሉ (ኣፍራይ)",
    addItem: "ኣቕሑ ወድእ",
    searchItems: "ኣቕሑ ድለይ...",
    noInventoryItems: "ኣቕሑ ሓበሬታ ንብረት ኣይተረኽቡን።",
    
    confirmDeleteItem: "እዚ ኣቕሑ ክትሰርዞ ርግጸኛ ዲኻ?",
    generalTask: "ሓፈሻዊ",
    
    taskName: "ስም ስራሕ...",
    
    noTasksYet: "ገና ስራሓት የለን።",
    budgetSummary: "ማጠቓላል በጃ",
    protocol: "ፕሮቶኮል",
  },

  om: {
    languageSettings: "Sirna Afaanii",
    selectLanguage: "Afaan sirnaa filadhu",
    direction: "Qajeelfama",
    ltr: "Bitaa irraa mirgaatti",
    rtl: "Mirga irraa bitaatti",
    
    lang_en: "Ingliffa",
    lang_am: "Amaariffa",
    lang_ti: "Tigrinya",
    lang_om: "Oromiffa",
    lang_ar: "Arabiffa",
    lang_zh: "Chaayinaa",
    
    overview: "Daqiiqaa",
    users: "Fayyadamaa To'achuu",
    vendors: "Daldalaa To'achuu",
    events: "Dhimmoota To'achuu",
    payments: "Kaffaltiiwwan",
    packages: "Paakeejiiwwan",
    reports: "Ripoortii Guutuu",
    analytics: "Qorannoo",
    systemContent: "Qabiyyee Sirnaa",
    systemLogs: "Galmeewwan Sirnaa",
    profile: "Saaphilee",
    language: "Afaan",
    appearance: "Mul'ata",
    settings: "Sirreeffama",
    logout: "Ba'i",
    
    adminManageUsers: "Admin – Fayyadamaa To'achuu",
    welcomeBack: "Baga nagaan dhufte! As akka ta'etti.",
    lastUpdated: "Garaagaraa dhumaa",
    
    name: "Maqaa",
    email: "Iimeelii",
    role: "Sadarkaa",
    
    addUser: "Fayyadamaa Dabaladhu",
    delete: "Haqu",
    searchUsers: "Fayyadamaa barbaadi...",
    noUsersFound: "Fayyadamaa hin argamne.",
    
    confirmDeleteUser: "Fayyadamichii haquu ni barbaaddaa?",
    
    role_admin: "Admin",
    role_manager: "Manager",
    role_vendor: "Daldalaa",
    adminManageVendors: "Admin – Daldalaa To'achuu",
    
    vendorName: "Maqaa Daldalaa",
    service: "Tajaajilaa",
    
    addVendor: "Daldalaa Dabaladhu",
    edit: "Gara galchii",
    save: "Qabadhu",
    cancel: "Haqi",
    
    searchVendors: "Daldalaa barbaadi...",
    noVendorsFound: "Daldalaa hin argamne.",
    
    vendorRequired: "Maqaa daldalaa fi tajaajilaa barbaachisaa dha!",
    vendorEmptyError: "Maqaa daldalaa fi tajaajilaa duwwaa ta'uu hin danda'an!",
    confirmDeleteVendor: "Daldalachii haquu ni barbaaddaa?",
    adminManageEvents: "Admin – Dhimmoota To'achuu",
    
    eventName: "Maqaa Dhimmaa",
    location: "Bakka",
    
    addEvent: "Dhimmoo Dabaladhu",
    
    searchEvents: "Dhimmoota barbaadi...",
    noEventsFound: "Dhimmoo hin argamne.",
    
    eventFillAll: "Maalummaa hunda guutaa!",
    confirmDeleteEvent: "Dhimmicha haquu ni barbaaddaa?",
    eventLockedEdit: "Dhimmoon cufame hin jijjiramu!",
    eventLockedDelete: "Dhimmoon cufame hin haqqamu!",
    
    toggleStatus: "Haala Jijjiiru",
    
    eventStatus_draft: "Saaphilee",
    eventStatus_approved: "Mirkame",
    eventStatus_locked: "Cufame",
    adminManagePayments: "Admin – Kaffaltiiwwan To'achuu",
    
    searchPayments: "Karaa, baay'ina, ykn guyyaa barbaadi...",
    sortByAmount: "Baay'inaan Jarjaraa",
    noPaymentsFound: "Kaffaltii hin argamne.",
    
    paymentVia: "waliin",
    adminManagePackages: "Admin – Paakeejiiwwan To'achuu",
    
    packageName: "Maqaa Paakeejii",
    price: "Gatii",
    
    addPackage: "Paakeejii Dabaladhu",
    
    searchPackages: "Paakeejii barbaadi...",
    sortByPrice: "Gatiin Jarjaraa",
    noPackagesFound: "Paakeejii hin argamne.",
    
    confirmDeletePackage: "Paakeejichii haquu ni barbaaddaa?",
    
    adminFullReports: "Admin – Ripoortii Guutuu",
    
    metric: "Meetrii",
    value: "Gatiin",
    adminAnalytics: "Admin – Daashboorii Qorannoo",
    
    totalUsers: "Fayyadamaa Waliigala",
    totalEvents: "Dhimmoota Waliigala",
    totalVendors: "Daldalaa Waliigala",
    totalPayments: "Kaffaltii Waliigala",
    
    eventsPerMonth: "Dhimmoota Ji'a Tokkotti",
    userRolesDistribution: "Qoodinsi Sadarkaa Fayyadamootaa",
    
    jan: "Amajjii",
    feb: "Guraandhala",
    mar: "Bitooteessa",
    apr: "Elba",
    may: "Caamsaa",
    jun: "Waxabajjii",
    jul: "Adooleessa",
    aug: "Hagayya",
    sep: "Fuulbana",
    oct: "Onkololeessa",
    nov: "Sadaasa",
    dec: "Muddee",
    
    generatedAt: "Yeroo Uumame",
    updateSystemContent: "Admin – Qabiyyee Sirnaa Gara Galchii",
    
    systemContentPlaceholder: "Qabiyyee sirnaa asitti galchi...",
    systemContentSaved: "Qabiyyeen milkaa'inaan qabame!",
    systemContentEmpty: "Qabiyyeen duwwaa ta'uu hin danda'u.",
    
    admin_system_log_title: "Admin - Galmee Sirnaa",
    search_logs_placeholder: "Galmeewwan barbaadi...",
    sort_label: "Jarjaraa",
    newest: "Haaraa",
    oldest: "Kan durii",
    refresh: "Haaraasu",
    clear_all: "Hunda Qulqulleessi",
    no_logs_found: "Galmee hin argamne.",
    actor: "Hojjetaa",
    delete_log: "Galmee haqu",
    
    changeAvatar: "Avataaraa Jijjiiri",
    avatarPreview: "Aduu Dursaa Avataaraa",
    
    saveChanges: "Jijjiiramoota Qabadhu",
    profileUpdated: "Saaphileen gara galmee!",
    defaultAdminName: "Fayyadamaa Admin",
    appearanceSettings: "Sirreeffama Mul'ataa",
    appearanceDescription: "Daashboorii keessan adminii keessatti ifa, dukkana, ykn sirna qilleensa filadhu.",
    chooseTheme: "Qilleensa Filadhu:",
    themeLight: "Ifa",
    themeDark: "Dukkana",
    themeSystem: "Sirna",
    livePreview: "Kun aduu dursaa jireenyaadha. Qilleensi ammaa",
    attendeeOverview: "Daqiiqaa Hirmaataa",
    eventInformation: "Odeeffannoo Dhimmaa",
    noConfirmedEvents: "Dhimmoon mirkame hin jiru",
    locked: "Cufame",
    rsvps: "RSVPwwan",
    seatAssignments: "Sadarkaa Teessumaa",
    giftRegistry: "Galmee Kennaa",
    mySchedule: "Sakeelii Koo",
    noScheduledEvents: "Dhimmoon ajajame hin jiru",
    agendaNotPublished: "Ajandaan hin maxxanfame",
    
    noGiftsRegistered: "Kenneen galmaa'ee hin jiru.",
    soldOut: "Gurgurame",
    available: "Jiru",
    quantity: "Baay'ina",
    
    uploadAvatar: "Avataaraa Baasuu",
    
    enterName: "Maqaa kee galchi",
    
    enterEmail: "Iimeelii kee galchi",
    
    boughtGifts: "Kennee Bittaa",
    boughtAt: "Yeroo bittaa",
    giftSoldOut: "Kennaan kana gurgurameera.",
    
    themeDescription: "Daashboorii keessan hirmaataa keessatti ifa, dukkana, ykn sirna qilleensa filadhu.",
    
    light: "Ifa",
    dark: "Dukkana",
    system: "Sirna",
    
    eventInfo: "Odeeffannoo Dhimmaa",
    schedule: "Sakeelii",
    rsvp: "RSVP",
    seatInfo: "Odeeffannoo Teessumaa",
    managerOverview: "Daqiiqaa Manager",
    
    upcoming: "kan dhufu",
    totalGuests: "Hirmaataa Waliigala",
    acrossAllEvents: "Dhimmoota hunda keessatti",
    vendorAssignments: "Sadarkaa Daldalaa",
    activeAssignments: "Sadarkaa sochii qaban",
    avgGuestsPerEvent: "Hirmaataa Giddugaleessa/Dhimma",
    averageAttendance: "Hirmaannaa Giddugaleessa",
    
    recentGuests: "Hirmaataa Dhiyoo",
    noGuestsFound: "Hirmaataa hin argamne",
    assignedTo: "kennirame",
    noVendorAssignmentsFound: "Sadarkaa daldalaa hin argamne",
    manageEvents: "Dhimmoota To'achuu",
    
    add: "Dabaladhu",
    
    draft: "Saaphilee",
    approved: "Mirkame",
    
    guests: "Hirmaataa",
    
    invalidStatusTransition: "Jijjiiramaa haalaa dogoggoraa",
    onlyDraftDelete: "Dhimmoon saaphilee qofa haqqamu danda'a.",
    confirmDeleteDraftEvent: "Dhimmicha saaphilee haquu?",
    event: "Dhimmoo",
    manageGuests: "Hirmaataa To'achuu",
    guestName: "Maqaa Hirmaataa",
    guestEmail: "Iimeelii Hirmaataa",
    selectEvent: "Dhimmoo Filadhu",
    addGuest: "Hirmaataa Dabaladhu",
    searchGuests: "Maqaa, iimeelii, ykn dhimmoo hirmaataa barbaadi...",
    noGuestsForEvent: "Hirmaataan dhimmichaaf hin jiru.",
    
    yes: "Eeyyee",
    no: "Lakkii",
    
    allFieldsRequired: "Maalummaa hunda barbaachisaa dha!",
    invalidEventId: "ID Dhimmaa Dogoggoraa!",
    confirmDeleteGuest: "Hirmaataa kana haquu ni barbaaddaa?",
    vendorCoordination: "Waliigala Daldalaa",
    
    selectService: "Tajaajilaa Filadhu",
    assignVendor: "Daldalaa Kennaa",
    searchAssignments: "Sadarkaa barbaadi...",
    noVendorAssignments: "Sadarkaa daldalaa hin argamne.",
    
    confirmRemoveVendor: "Sadarkaa daldalaa kana haquu ni barbaaddaa?",
    remove: "Haqi",
    managerTaskChecklist: "Gaaffii Hojii Manager",
    eventId: "ID Dhimmaa",
    task: "Hojii",
    category: "Garee",
    low: "Gadi",
    medium: "Giddugaleessa",
    high: "Olaanaa",
    done: "Xumurame",
    
    searchTasks: "Hojii barbaadi...",
    taskAddError: "ID dhimmaa fi hojii duwwaa ta'uu hin danda'an.",
    taskDeleteConfirm: "Hojii kana haquu ni barbaaddaa?",
    editTaskPrompt: "Hojii gara galchii:",
    total: "Waliigala",
    completed: "Xumurame",
    pending: "Eegamaa",
    managerAddedTasks: "Hojii Manager Dabalate",
    tasksFromCouples: "Hojii Gurbaa fi Dubartii irraa",
    tasksFromProtocol: "Hojii Protokoolii irraa",
    noTasksFound: "Hojii hin argamne.",
    managerBudgets: "Manager - Baajeta",
    
    descriptionCategory: "Ibsa / Garee",
    amount: "Baay'ina",
    
    searchBudgets: "Baajeta barbaadi...",
    noBudgetsFound: "Baajeta hin argamne.",
    fillAllFields: "Maalummaa hunda guutaa!",
    deleteBudgetConfirm: "Baajeticha haquu ni barbaaddaa?",
    pendingApproval: "Eegamaa Hayyama",
    approvedByManager: "Managerin Mirkame",
    approve: "Hayyami",
    
    masterInventory: "Galmee Adda Addaa",
    totalItems: "Waliigala Mallattoolee",
    
    itemName: "Maqaa Mallattoo",
    
    vendorOptional: "Daldalaa (Filannoo)",
    vendor: "Daldalaa",
    couple: "Gurbaa fi Dubartii",
    source: "Bu'uura",
    status: "Haala",
    
    searchInventory: "Galmee barbaadi...",
    
    deleteConfirm: "Mallattoo galmee kana haquu?",
    sortBy: "Waliin Jarjaraa",
    
    assigned: "Kennirame",
    delivered: "Geessame",
    actions: "Hojiiwwan",
    paid: "Kaffalame",
    taskChecklist: "Gaaffii Hojii",
    budget: "Baajeta",
    inventory: "Galmee",
    remaining: "Haalaa",
    vendorOverview: "Daqiiqaa Daldalaa",
    assignedEvents: "Dhimmoota Kenname",
    manageAssignServices: "Tajaajilaa To'achuu & Kennaa",
    
    assign: "Kennaa",
    selectServiceAndEvent: "Tajaajilaa fi dhimma lamaan filadhu",
    noServicesAssigned: "Tajaajilaan hin kennamne.",
    noDescription: "Ibsa hin qabu",
    vendorPayments: "Kaffaltii Daldalaa",
    noPaymentsAvailable: "Kaffaltiin hin jiru",
    approveAddBank: "Hayyami & Odeeffannoo Baankii Dabaladhu",
    waitingForPayment: "Kaffaltii Gurbaa fi Dubartii eegama",
    confirmPayment: "Kaffaltii Mirkanaa'i",
    
    paymentProof: "Ragaa Kaffaltii",
    bankNamePrompt: "Maqaa Baankii:",
    accountNamePrompt: "Maqaa Herregaa:",
    accountNumberPrompt: "Lakkoofsa Herregaa:",
    swiftCodePrompt: "Koodii SWIFT (filannoo):",
    bankInfoRequired: "Maqaa baankii, maqaa herregaa, fi lakkoofsa herregaa barbaachisaa dha",
    confirmPaymentPrompt: "Kaffaltiin argameera jechuu mirkanaa'uu?",
    on: "irratti",
    vendorInventory: "Galmee Daldalaa",
    vendorGiftInventory: "Galmee Kennaa Daldalaa",
    item: "Mallattoo",
    
    addGift: "Kennaa Dabaladhu",
    giftName: "Maqaa Kennaa",
    
    image: "Suuraa",
    search: "Barbaadi...",
    fillGiftFields: "Maalummaa kennaa hunda sirriitti guutaa!",
    noScheduleItems: "Mallattoo sakeelii hin jiru.",
    unpaid: "Kaffalamuu Dhabe",
    vendorReports: "Ripoortii Daldalaa",
    
    paidPayments: "Kaffaltiiwwan Kaffalame",
    totalAmount: "Baay'ina Waliigala",
    
    totalInventoryItems: "Waliigala Mallattoolee Galmee",
    totalQuantity: "Baay'ina Waliigala",
    noReports: "Ripoortiin amma hin jiru.",
    themePreviewText: "Kun aduu dursaa jireenyaadha. Qilleensi ammaa",
    manageServices: "Tajaajilaa To'achuu",
    protocolOverview: "Daqiiqaa Protokoolii",
    
    totalAssignments: "Sadarkaa Waliigala",
    totalAgendaItems: "Ajandaa Mallattoo Waliigala",
    totalTasksChecklist: "Hojii Waliigala / Gaaffii",
    
    assignments: "Sadarkaa",
    agenda: "Ajandaa",
    tasksChecklist: "Hojii / Gaaffii",
    
    staffId: "ID Hojjettaa",
    taskId: "ID Hojii",
    
    notAvailable: "N/A",
    noActivity: "Sochii hin qabu",
    noTask: "Hojii hin qabu",
    protocolAssignments: "Sadarkaa Protokoolii",
    
    staffName: "Maqaa Hojjettaa",
    roleResponsibility: "Sadarkaa / Danda'ama",
    
    addAssignment: "Sadarkaa Dabaladhu",
    
    noProtocolAssignments: "Sadarkaan protokoolii amma hin dabalamne.",
    eventAgenda: "Ajandaa Dhimmaa",
    
    agendaActivityPlaceholder: "Sochii (fkn. Seenuu Dubartii)",
    
    addAgenda: "Ajandaa Dabaladhu",
    
    noAgendaItems: "Mallattoo ajandaa amma hin dabalamne.",
    
    fillAllAgendaFields: "Maalib, dhimma filadhu fi maalummaa hunda guutaa",
    unknownEvent: "Dhimmoo Hin Beekamne",
    eventDayChecklist: "Gaaffii Guyyaa Dhimmaa",
    
    addChecklistTaskPlaceholder: "Hojii dabaladhu (fkn. Sakatta'uun sadarkaa mirkanaa'uu)",
    
    noChecklistItems: "Mallattoo gaaffii amma hin dabalamne.",
    protocolTaskChecklist: "Gaaffii Hojii Protokoolii",
    
    taskCannotBeEmpty: "Hojii duwwaa ta'uu hin danda'u.",
    confirmDeleteTask: "Hojii kana haquu ni barbaaddaa?",
    
    taskPlaceholder: "Hojii...",
    
    noProtocolTasks: "Hojii protokoolii amma hin jiru.",
    protocolManageEvents: "Protokoolii – Dhimmoota To'achuu",
    
    noApprovedEvents: "Dhimmoon mirkame amma hin jiru.",
    theme: "Qilleensa",
    coupleOverview: "Daqiiqaa Gurbaa fi Dubartii",
    
    noEventsAdded: "Dhimmoon amma hin dabalamne.",
    
    guestList: "Tarree Hirmaataa",
    
    normal: "Caalaa",
    vip: "VIP",
    family: "Maatii",
    
    fillGuestFields: "Maalib, maqaa hirmaataa, iimeelii, fi gosa kennaa!",
    
    rsvpAccepted: "RSVP Fudhatame",
    rsvpPending: "RSVP Eegamaa",
    seatingArrangement: "Sajoo Teessumaa",
    selectGuest: "Hirmaataa Filadhu",
    seatNumber: "Lakkoofsa Teessumaa",
    rowNumber: "Lakkoofsa Qindaa / Gaabbaa",
    
    assignSeat: "Teessumaa Kennaa",
    table: "Gaabbaa",
    guest: "Hirmaataa",
    seat: "Teessumaa",
    type: "Gosa",
    fillSeatFields: "Maalummaa hunda guutaa",
    tableFull: "Gaabban kun amma hirmaataa 8 qaba",
    seatNumberAssigned: "Lakkoofsi teessumaa gaabbaa kana irratti amma kennameera",
    noSeatsAssigned: "Teessumaan amma hin kennamne",
    coupleBudgetSummary: "Xumura Baajeta Gurbaa fi Dubartii",
    
    submit: "Dhiyeessi",
    pay: "Kaffali",
    rsvpTracking: "Hordoffii RSVP",
    noGuests: "Hirmaataan hin jiru.",
    attending: "Hirmaachaa",
    
    selectVendorService: "Tajaajilaa Daldalaa Filadhu",
    
    taskOptional: "Hojii (Filannoo)",
    inventoryManagement: "To'achuu Galmee Gurbaa fi Dubartii",
    
    assignedVendorOptional: "Daldalaa Kenname (Filannoo)",
    addItem: "Mallattoo Dabaladhu",
    searchItems: "Mallattoo barbaadi...",
    noInventoryItems: "Mallattoo galmee hin argamne.",
    
    confirmDeleteItem: "Mallattoo kana haquu?",
    generalTask: "Waliigala",
    
    taskName: "Maqaa hojii...",
    
    noTasksYet: "Hojii amma hin jiru.",
    budgetSummary: "Xumura Baajeta",
    protocol: "Protokoolii",
  },

  ar: {
    languageSettings: "إعدادات اللغة",
    selectLanguage: "اختر لغة النظام",
    direction: "الاتجاه",
    ltr: "من اليسار إلى اليمين",
    rtl: "من اليمين إلى اليسار",
    
    lang_en: "الإنجليزية",
    lang_am: "الأمهرية",
    lang_ti: "التغرينية",
    lang_om: "الأورومية",
    lang_ar: "العربية",
    lang_zh: "الصينية",
    
    overview: "نظرة عامة",
    users: "إدارة المستخدمين",
    vendors: "إدارة الموردين",
    events: "إدارة الفعاليات",
    payments: "المدفوعات",
    packages: "الحزم",
    reports: "التقارير الكاملة",
    analytics: "التحليلات",
    systemContent: "محتوى النظام",
    systemLogs: "سجلات النظام",
    profile: "الملف الشخصي",
    language: "اللغة",
    appearance: "المظهر",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    
    adminManageUsers: "المسؤول - إدارة المستخدمين",
    welcomeBack: "مرحباً بعودتك! هذا ما يحدث الآن.",
    lastUpdated: "آخر تحديث",
    
    name: "الاسم",
    email: "البريد الإلكتروني",
    role: "الدور",
    
    addUser: "إضافة مستخدم",
    delete: "حذف",
    searchUsers: "بحث عن المستخدمين...",
    noUsersFound: "لم يتم العثور على مستخدمين.",
    
    confirmDeleteUser: "هل أنت متأكد من رغبتك في حذف هذا المستخدم؟",
    
    role_admin: "مسؤول",
    role_manager: "مدير",
    role_vendor: "مورد",
    adminManageVendors: "المسؤول - إدارة الموردين",
    
    vendorName: "اسم المورد",
    service: "الخدمة",
    
    addVendor: "إضافة مورد",
    edit: "تعديل",
    save: "حفظ",
    cancel: "إلغاء",
    
    searchVendors: "بحث عن الموردين...",
    noVendorsFound: "لم يتم العثور على موردين.",
    
    vendorRequired: "اسم المورد والخدمة مطلوبان!",
    vendorEmptyError: "لا يمكن أن يكون اسم المورد والخدمة فارغين!",
    confirmDeleteVendor: "هل أنت متأكد من رغبتك في حذف هذا المورد؟",
    adminManageEvents: "المسؤول - إدارة الفعاليات",
    
    eventName: "اسم الفعالية",
    location: "الموقع",
    
    addEvent: "إضافة فعالية",
    
    searchEvents: "بحث عن الفعاليات...",
    noEventsFound: "لم يتم العثور على فعاليات.",
    
    eventFillAll: "يرجى ملء جميع الحقول!",
    confirmDeleteEvent: "هل أنت متأكد من رغبتك في حذف هذه الفعالية؟",
    eventLockedEdit: "لا يمكن تعديل الفعاليات المقفلة!",
    eventLockedDelete: "لا يمكن حذف الفعاليات المقفلة!",
    
    toggleStatus: "تبديل الحالة",
    
    eventStatus_draft: "مسودة",
    eventStatus_approved: "معتمد",
    eventStatus_locked: "مقفل",
    adminManagePayments: "المسؤول - إدارة المدفوعات",
    
    searchPayments: "بحث بالطريقة، المبلغ، أو التاريخ...",
    sortByAmount: "ترتيب حسب المبلغ",
    noPaymentsFound: "لم يتم العثور على مدفوعات.",
    
    paymentVia: "عبر",
    adminManagePackages: "المسؤول - إدارة الحزم",
    
    packageName: "اسم الحزمة",
    price: "السعر",
    
    addPackage: "إضافة حزمة",
    
    searchPackages: "بحث عن الحزم...",
    sortByPrice: "ترتيب حسب السعر",
    noPackagesFound: "لم يتم العثور على حزم.",
    
    confirmDeletePackage: "هل أنت متأكد من رغبتك في حذف هذه الحزمة؟",
    
    adminFullReports: "المسؤول - التقارير الكاملة",
    
    metric: "المقياس",
    value: "القيمة",
    adminAnalytics: "المسؤول - لوحة التحليلات",
    
    totalUsers: "إجمالي المستخدمين",
    totalEvents: "إجمالي الفعاليات",
    totalVendors: "إجمالي الموردين",
    totalPayments: "إجمالي المدفوعات",
    
    eventsPerMonth: "الفعاليات لكل شهر",
    userRolesDistribution: "توزيع أدوار المستخدمين",
    
    jan: "يناير",
    feb: "فبراير",
    mar: "مارس",
    apr: "أبريل",
    may: "مايو",
    jun: "يونيو",
    jul: "يوليو",
    aug: "أغسطس",
    sep: "سبتمبر",
    oct: "أكتوبر",
    nov: "نوفمبر",
    dec: "ديسمبر",
    
    generatedAt: "تم إنشاؤه في",
    updateSystemContent: "المسؤول - تحديث محتوى النظام",
    
    systemContentPlaceholder: "أدخل محتوى النظام هنا...",
    systemContentSaved: "تم حفظ المحتوى بنجاح!",
    systemContentEmpty: "لا يمكن أن يكون المحتوى فارغاً.",
    
    admin_system_log_title: "المسؤول - سجل النظام",
    search_logs_placeholder: "بحث في السجلات...",
    sort_label: "ترتيب",
    newest: "الأحدث",
    oldest: "الأقدم",
    refresh: "تحديث",
    clear_all: "مسح الكل",
    no_logs_found: "لم يتم العثور على سجلات.",
    actor: "الفاعل",
    delete_log: "حذف السجل",
    
    changeAvatar: "تغيير الصورة الرمزية",
    avatarPreview: "معاينة الصورة الرمزية",
    
    saveChanges: "حفظ التغييرات",
    profileUpdated: "تم تحديث الملف الشخصي!",
    defaultAdminName: "مستخدم مسؤول",
    appearanceSettings: "إعدادات المظهر",
    appearanceDescription: "تبديل بين السمة الفاتحة، الداكنة، أو تبعاً للنظام للوحة التحكم.",
    chooseTheme: "اختر السمة:",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeSystem: "النظام",
    livePreview: "هذه معاينة حية. السمة الحالية هي",
    attendeeOverview: "نظرة عامة على الحضور",
    eventInformation: "معلومات الفعالية",
    noConfirmedEvents: "لا توجد فعاليات مؤكدة بعد",
    locked: "مقفل",
    rsvps: "الردود",
    seatAssignments: "تعيين المقاعد",
    giftRegistry: "سجل الهدايا",
    mySchedule: "جدولي",
    noScheduledEvents: "لا توجد فعاليات مجدولة بعد",
    agendaNotPublished: "لم يتم نشر الأجندة بعد",
    
    noGiftsRegistered: "لا توجد هدايا مسجلة بعد.",
    soldOut: "نفذت الكمية",
    available: "متاح",
    quantity: "الكمية",
    
    uploadAvatar: "رفع صورة رمزية",
    
    enterName: "أدخل اسمك",
    
    enterEmail: "أدخل بريدك الإلكتروني",
    
    boughtGifts: "الهدايا المشتراة",
    boughtAt: "تم الشراء في",
    giftSoldOut: "هذه الهدية نفذت.",
    
    themeDescription: "تبديل بين السمة الفاتحة، الداكنة، أو تبعاً للنظام للوحة التحكم.",
    
    light: "فاتح",
    dark: "داكن",
    system: "النظام",
    
    eventInfo: "معلومات الفعالية",
    schedule: "الجدول",
    rsvp: "الرد",
    seatInfo: "معلومات المقعد",
    managerOverview: "نظرة عامة للمدير",
    
    upcoming: "القادمة",
    totalGuests: "إجمالي الضيوف",
    acrossAllEvents: "عبر جميع الفعاليات",
    vendorAssignments: "تعيينات الموردين",
    activeAssignments: "التعيينات النشطة",
    avgGuestsPerEvent: "متوسط الضيوف/الفعالية",
    averageAttendance: "متوسط الحضور",
    
    recentGuests: "الضيوف الأخيرون",
    noGuestsFound: "لم يتم العثور على ضيوف",
    assignedTo: "معين إلى",
    noVendorAssignmentsFound: "لم يتم العثور على تعيينات موردين",
    manageEvents: "إدارة الفعاليات",
    
    add: "إضافة",
    
    draft: "مسودة",
    approved: "معتمد",
    
    guests: "الضيوف",
    
    invalidStatusTransition: "انتقال حالة غير صالح",
    onlyDraftDelete: "يمكن حذف الفعاليات المسودة فقط.",
    confirmDeleteDraftEvent: "حذف فعالية المسودة هذه؟",
    event: "الفعالية",
    manageGuests: "إدارة الضيوف",
    guestName: "اسم الضيف",
    guestEmail: "بريد الضيف الإلكتروني",
    selectEvent: "اختر فعالية",
    addGuest: "إضافة ضيف",
    searchGuests: "بحث عن الضيوف بالاسم، البريد الإلكتروني، أو الفعالية...",
    noGuestsForEvent: "لا توجد ضيوف لهذه الفعالية.",
    
    yes: "نعم",
    no: "لا",
    
    allFieldsRequired: "جميع الحقول مطلوبة!",
    invalidEventId: "معرف الفعالية غير صالح!",
    confirmDeleteGuest: "هل أنت متأكد من رغبتك في حذف هذا الضيف؟",
    vendorCoordination: "تنسيق الموردين",
    
    selectService: "اختر الخدمة",
    assignVendor: "تعيين مورد",
    searchAssignments: "بحث في التعيينات...",
    noVendorAssignments: "لم يتم العثور على تعيينات موردين.",
    
    confirmRemoveVendor: "هل أنت متأكد من رغبتك في إزالة تعيين المورد هذا؟",
    remove: "إزالة",
    managerTaskChecklist: "قائمة مهام المدير",
    eventId: "معرف الفعالية",
    task: "المهمة",
    category: "الفئة",
    low: "منخفض",
    medium: "متوسط",
    high: "مرتفع",
    done: "منجز",
    
    searchTasks: "بحث في المهام...",
    taskAddError: "معرف الفعالية والمهمة لا يمكن أن يكونا فارغين.",
    taskDeleteConfirm: "هل أنت متأكد من رغبتك في حذف هذه المهمة؟",
    editTaskPrompt: "تعديل المهمة:",
    total: "الإجمالي",
    completed: "منجز",
    pending: "قيد الانتظار",
    managerAddedTasks: "المهام المضافة من المدير",
    tasksFromCouples: "المهام من الأزواج",
    tasksFromProtocol: "المهام من البروتوكول",
    noTasksFound: "لم يتم العثور على مهام.",
    managerBudgets: "المدير - الميزانيات",
    
    descriptionCategory: "الوصف / الفئة",
    amount: "المبلغ",
    
    searchBudgets: "بحث في الميزانيات...",
    noBudgetsFound: "لم يتم العثور على ميزانيات.",
    fillAllFields: "املأ جميع الحقول!",
    deleteBudgetConfirm: "هل أنت متأكد من رغبتك في حذف هذه الميزانية؟",
    pendingApproval: "قيد الموافقة",
    approvedByManager: "تمت الموافقة من المدير",
    approve: "موافقة",
    
    masterInventory: "الجرد الرئيسي المتقدم",
    totalItems: "إجمالي العناصر",
    
    itemName: "اسم العنصر",
    
    vendorOptional: "المورد (اختياري)",
    vendor: "المورد",
    couple: "الزوجان",
    source: "المصدر",
    status: "الحالة",
    
    searchInventory: "بحث في المخزون...",
    
    deleteConfirm: "حذف عنصر المخزون هذا؟",
    sortBy: "ترتيب حسب",
    
    assigned: "معين",
    delivered: "تم التسليم",
    actions: "الإجراءات",
    paid: "مدفوع",
    taskChecklist: "قائمة المهام",
    budget: "الميزانية",
    inventory: "المخزون",
    remaining: "المتبقي",
    vendorOverview: "نظرة عامة للمورد",
    assignedEvents: "الفعاليات المعينة",
    manageAssignServices: "إدارة وتعيين الخدمات",
    
    assign: "تعيين",
    selectServiceAndEvent: "اختر الخدمة والفعالية معاً",
    noServicesAssigned: "لم يتم تعيين خدمات بعد.",
    noDescription: "لا يوجد وصف",
    vendorPayments: "مدفوعات المورد",
    noPaymentsAvailable: "لا توجد مدفوعات متاحة",
    approveAddBank: "الموافقة وإضافة معلومات البنك",
    waitingForPayment: "في انتظار دفع الزوجين",
    confirmPayment: "تأكيد الدفع",
    
    paymentProof: "إثبات الدفع",
    bankNamePrompt: "اسم البنك:",
    accountNamePrompt: "اسم الحساب:",
    accountNumberPrompt: "رقم الحساب:",
    swiftCodePrompt: "رمز السويفت (اختياري):",
    bankInfoRequired: "اسم البنك، اسم الحساب، ورقم الحساب مطلوبون",
    confirmPaymentPrompt: "تأكيد استلام الدفع؟",
    on: "في",
    vendorInventory: "مخزون المورد",
    vendorGiftInventory: "مخزون هدايا المورد",
    item: "العنصر",
    
    addGift: "إضافة هدية",
    giftName: "اسم الهدية",
    
    image: "الصورة",
    search: "بحث...",
    fillGiftFields: "يرجى ملء جميع حقول الهدية بشكل صحيح!",
    noScheduleItems: "لا توجد عناصر في الجدول.",
    unpaid: "غير مدفوع",
    vendorReports: "تقارير المورد",
    
    paidPayments: "المدفوعات المدفوعة",
    totalAmount: "إجمالي المبلغ",
    
    totalInventoryItems: "إجمالي عناصر المخزون",
    totalQuantity: "إجمالي الكمية",
    noReports: "لا توجد تقارير متاحة بعد.",
    themePreviewText: "هذه معاينة حية. السمة الحالية هي",
    manageServices: "إدارة الخدمات",
    protocolOverview: "نظرة عامة على البروتوكول",
    
    totalAssignments: "إجمالي التعيينات",
    totalAgendaItems: "إجمالي بنود الأجندة",
    totalTasksChecklist: "إجمالي المهام / القوائم",
    
    assignments: "التعيينات",
    agenda: "الأجندة",
    tasksChecklist: "المهام / القوائم",
    
    staffId: "معرف الموظف",
    taskId: "معرف المهمة",
    
    notAvailable: "غير متاح",
    noActivity: "لا يوجد نشاط",
    noTask: "لا توجد مهمة",
    protocolAssignments: "تعيينات البروتوكول",
    
    staffName: "اسم الموظف",
    roleResponsibility: "الدور / المسؤولية",
    
    addAssignment: "إضافة تعيين",
    
    noProtocolAssignments: "لم تتم إضافة تعيينات بروتوكول بعد.",
    eventAgenda: "أجندة الفعالية",
    
    agendaActivityPlaceholder: "النشاط (مثل دخول العروس)",
    
    addAgenda: "إضافة أجندة",
    
    noAgendaItems: "لم تتم إضافة بنود أجندة بعد.",
    
    fillAllAgendaFields: "يرجى اختيار فعالية وملء جميع الحقول",
    unknownEvent: "فعالية غير معروفة",
    eventDayChecklist: "قائمة يوم الفعالية",
    
    addChecklistTaskPlaceholder: "إضافة مهمة (مثل تأكيد إعداد المنصة)",
    
    noChecklistItems: "لم تتم إضافة بنود قائمة بعد.",
    protocolTaskChecklist: "قائمة مهام البروتوكول",
    
    taskCannotBeEmpty: "لا يمكن أن تكون المهمة فارغة.",
    confirmDeleteTask: "هل أنت متأكد من رغبتك في حذف هذه المهمة؟",
    
    taskPlaceholder: "المهمة...",
    
    noProtocolTasks: "لا توجد مهام بروتوكول بعد.",
    protocolManageEvents: "البروتوكول - إدارة الفعاليات",
    
    noApprovedEvents: "لا توجد فعاليات معتمدة بعد.",
    theme: "السمة",
    coupleOverview: "نظرة عامة للزوجين",
    
    noEventsAdded: "لم تتم إضافة فعاليات بعد.",
    
    guestList: "قائمة الضيوف",
    
    normal: "عادي",
    vip: "مهم",
    family: "عائلة",
    
    fillGuestFields: "يرجى تقديم اسم الضيف، البريد الإلكتروني، والنوع!",
    
    rsvpAccepted: "تم قبول الرد",
    rsvpPending: "الرد معلق",
    seatingArrangement: "ترتيب المقاعد",
    selectGuest: "اختر ضيفاً",
    seatNumber: "رقم المقعد",
    rowNumber: "رقم الصف / الطاولة",
    
    assignSeat: "تعيين مقعد",
    table: "طاولة",
    guest: "ضيف",
    seat: "مقعد",
    type: "النوع",
    fillSeatFields: "يرجى ملء جميع الحقول",
    tableFull: "هذه الطاولة بها بالفعل 8 ضيوف",
    seatNumberAssigned: "رقم المقعد معين بالفعل في هذه الطاولة",
    noSeatsAssigned: "لم يتم تعيين مقاعد بعد",
    coupleBudgetSummary: "ملخص ميزانية الزوجين",
    
    submit: "إرسال",
    pay: "دفع",
    rsvpTracking: "تتبع الردود",
    noGuests: "لا توجد ضيوف.",
    attending: "حاضر",
    
    selectVendorService: "اختر خدمة المورد",
    
    taskOptional: "المهمة (اختيارية)",
    inventoryManagement: "إدارة مخزون الزوجين",
    
    assignedVendorOptional: "المورد المعين (اختياري)",
    addItem: "إضافة عنصر",
    searchItems: "بحث في العناصر...",
    noInventoryItems: "لم يتم العثور على عناصر مخزون.",
    
    confirmDeleteItem: "حذف هذا العنصر؟",
    generalTask: "عام",
    
    taskName: "اسم المهمة...",
    
    noTasksYet: "لا توجد مهام بعد.",
    budgetSummary: "ملخص الميزانية",
    protocol: "البروتوكول",
  },

  zh: {
    languageSettings: "语言设置",
    selectLanguage: "选择系统语言",
    direction: "方向",
    ltr: "从左到右",
    rtl: "从右到左",
    
    lang_en: "英语",
    lang_am: "阿姆哈拉语",
    lang_ti: "提格里尼亚语",
    lang_om: "奥罗莫语",
    lang_ar: "阿拉伯语",
    lang_zh: "中文",
    
    overview: "概览",
    users: "管理用户",
    vendors: "管理供应商",
    events: "管理活动",
    payments: "付款",
    packages: "套餐",
    reports: "完整报告",
    analytics: "分析",
    systemContent: "系统内容",
    systemLogs: "系统日志",
    profile: "个人资料",
    language: "语言",
    appearance: "外观",
    settings: "设置",
    logout: "退出",
    
    adminManageUsers: "管理员 - 管理用户",
    welcomeBack: "欢迎回来！以下是当前动态。",
    lastUpdated: "最后更新",
    
    name: "姓名",
    email: "邮箱",
    role: "角色",
    
    addUser: "添加用户",
    delete: "删除",
    searchUsers: "搜索用户...",
    noUsersFound: "未找到用户。",
    
    confirmDeleteUser: "您确定要删除此用户吗？",
    
    role_admin: "管理员",
    role_manager: "经理",
    role_vendor: "供应商",
    adminManageVendors: "管理员 - 管理供应商",
    
    vendorName: "供应商名称",
    service: "服务",
    
    addVendor: "添加供应商",
    edit: "编辑",
    save: "保存",
    cancel: "取消",
    
    searchVendors: "搜索供应商...",
    noVendorsFound: "未找到供应商。",
    
    vendorRequired: "供应商名称和服务是必需的！",
    vendorEmptyError: "供应商名称和服务不能为空！",
    confirmDeleteVendor: "您确定要删除此供应商吗？",
    adminManageEvents: "管理员 - 管理活动",
    
    eventName: "活动名称",
    location: "地点",
    
    addEvent: "添加活动",
    
    searchEvents: "搜索活动...",
    noEventsFound: "未找到活动。",
    
    eventFillAll: "请填写所有字段！",
    confirmDeleteEvent: "您确定要删除此活动吗？",
    eventLockedEdit: "无法编辑已锁定的活动！",
    eventLockedDelete: "无法删除已锁定的活动！",
    
    toggleStatus: "切换状态",
    
    eventStatus_draft: "草稿",
    eventStatus_approved: "已批准",
    eventStatus_locked: "已锁定",
    adminManagePayments: "管理员 - 管理付款",
    
    searchPayments: "按方式、金额或日期搜索...",
    sortByAmount: "按金额排序",
    noPaymentsFound: "未找到付款。",
    
    paymentVia: "通过",
    adminManagePackages: "管理员 - 管理套餐",
    
    packageName: "套餐名称",
    price: "价格",
    
    addPackage: "添加套餐",
    
    searchPackages: "搜索套餐...",
    sortByPrice: "按价格排序",
    noPackagesFound: "未找到套餐。",
    
    confirmDeletePackage: "您确定要删除此套餐吗？",
    
    adminFullReports: "管理员 - 完整报告",
    
    metric: "指标",
    value: "数值",
    adminAnalytics: "管理员 - 分析仪表板",
    
    totalUsers: "总用户数",
    totalEvents: "总活动数",
    totalVendors: "总供应商数",
    totalPayments: "总付款数",
    
    eventsPerMonth: "每月活动数",
    userRolesDistribution: "用户角色分布",
    
    jan: "一月",
    feb: "二月",
    mar: "三月",
    apr: "四月",
    may: "五月",
    jun: "六月",
    jul: "七月",
    aug: "八月",
    sep: "九月",
    oct: "十月",
    nov: "十一月",
    dec: "十二月",
    
    generatedAt: "生成时间",
    updateSystemContent: "管理员 - 更新系统内容",
    
    systemContentPlaceholder: "在此处输入系统内容...",
    systemContentSaved: "内容保存成功！",
    systemContentEmpty: "内容不能为空。",
    
    admin_system_log_title: "管理员 - 系统日志",
    search_logs_placeholder: "搜索日志...",
    sort_label: "排序",
    newest: "最新",
    oldest: "最早",
    refresh: "刷新",
    clear_all: "清除全部",
    no_logs_found: "未找到日志。",
    actor: "操作者",
    delete_log: "删除日志",
    
    changeAvatar: "更改头像",
    avatarPreview: "头像预览",
    
    saveChanges: "保存更改",
    profileUpdated: "个人资料已更新！",
    defaultAdminName: "管理员用户",
    appearanceSettings: "外观设置",
    appearanceDescription: "为您的管理仪表板在浅色、深色或系统主题之间切换。",
    chooseTheme: "选择主题：",
    themeLight: "浅色",
    themeDark: "深色",
    themeSystem: "系统",
    livePreview: "这是实时预览。当前主题是",
    attendeeOverview: "与会者概览",
    eventInformation: "活动信息",
    noConfirmedEvents: "尚无确认的活动",
    locked: "已锁定",
    rsvps: "RSVPs",
    seatAssignments: "座位分配",
    giftRegistry: "礼物登记",
    mySchedule: "我的日程",
    noScheduledEvents: "尚无计划的活动",
    agendaNotPublished: "议程尚未发布",
    
    noGiftsRegistered: "尚无登记的礼物。",
    soldOut: "售罄",
    available: "可用",
    quantity: "数量",
    
    uploadAvatar: "上传头像",
    
    enterName: "输入您的姓名",
    
    enterEmail: "输入您的邮箱",
    
    boughtGifts: "已购礼物",
    boughtAt: "购买时间",
    giftSoldOut: "此礼物已售罄。",
    
    themeDescription: "为您的与会者仪表板在浅色、深色或系统主题之间切换。",
    
    light: "浅色",
    dark: "深色",
    system: "系统",
    
    eventInfo: "活动信息",
    schedule: "日程",
    rsvp: "RSVP",
    seatInfo: "座位信息",
    managerOverview: "经理概览",
    
    upcoming: "即将到来",
    totalGuests: "总宾客数",
    acrossAllEvents: "跨所有活动",
    vendorAssignments: "供应商分配",
    activeAssignments: "活跃分配",
    avgGuestsPerEvent: "平均宾客数/活动",
    averageAttendance: "平均出席率",
    
    recentGuests: "最近宾客",
    noGuestsFound: "未找到宾客",
    assignedTo: "分配给",
    noVendorAssignmentsFound: "未找到供应商分配",
    manageEvents: "管理活动",
    
    add: "添加",
    
    draft: "草稿",
    approved: "已批准",
    
    guests: "宾客",
    
    invalidStatusTransition: "无效的状态转换",
    onlyDraftDelete: "只能删除草稿活动。",
    confirmDeleteDraftEvent: "删除此草稿活动？",
    event: "活动",
    manageGuests: "管理宾客",
    guestName: "宾客姓名",
    guestEmail: "宾客邮箱",
    selectEvent: "选择活动",
    addGuest: "添加宾客",
    searchGuests: "按姓名、邮箱或活动搜索宾客...",
    noGuestsForEvent: "此活动尚无宾客。",
    
    yes: "是",
    no: "否",
    
    allFieldsRequired: "所有字段都是必需的！",
    invalidEventId: "无效的活动ID！",
    confirmDeleteGuest: "您确定要删除此宾客吗？",
    vendorCoordination: "供应商协调",
    
    selectService: "选择服务",
    assignVendor: "分配供应商",
    searchAssignments: "搜索分配...",
    noVendorAssignments: "未找到供应商分配。",
    
    confirmRemoveVendor: "您确定要移除此供应商分配吗？",
    remove: "移除",
    managerTaskChecklist: "经理任务清单",
    eventId: "活动ID",
    task: "任务",
    category: "类别",
    low: "低",
    medium: "中",
    high: "高",
    done: "完成",
    
    searchTasks: "搜索任务...",
    taskAddError: "活动ID和任务不能为空。",
    taskDeleteConfirm: "您确定要删除此任务吗？",
    editTaskPrompt: "编辑任务：",
    total: "总计",
    completed: "已完成",
    pending: "待处理",
    managerAddedTasks: "经理添加的任务",
    tasksFromCouples: "来自新人的任务",
    tasksFromProtocol: "来自协议的任务",
    noTasksFound: "未找到任务。",
    managerBudgets: "经理 - 预算",
    
    descriptionCategory: "描述 / 类别",
    amount: "金额",
    
    searchBudgets: "搜索预算...",
    noBudgetsFound: "未找到预算。",
    fillAllFields: "填写所有字段！",
    deleteBudgetConfirm: "您确定要删除此预算吗？",
    pendingApproval: "待批准",
    approvedByManager: "经理已批准",
    approve: "批准",
    
    masterInventory: "高级主库存",
    totalItems: "总项目数",
    
    itemName: "项目名称",
    
    vendorOptional: "供应商（可选）",
    vendor: "供应商",
    couple: "新人",
    source: "来源",
    status: "状态",
    
    searchInventory: "搜索库存...",
    
    deleteConfirm: "删除此库存项目？",
    sortBy: "排序方式",
    
    assigned: "已分配",
    delivered: "已交付",
    actions: "操作",
    paid: "已付款",
    taskChecklist: "任务清单",
    budget: "预算",
    inventory: "库存",
    remaining: "剩余",
    vendorOverview: "供应商概览",
    assignedEvents: "分配的活动",
    manageAssignServices: "管理与分配服务",
    
    assign: "分配",
    selectServiceAndEvent: "同时选择服务和活动",
    noServicesAssigned: "尚无分配的服务。",
    noDescription: "无描述",
    vendorPayments: "供应商付款",
    noPaymentsAvailable: "无可用付款",
    approveAddBank: "批准并添加银行信息",
    waitingForPayment: "等待新人付款",
    confirmPayment: "确认付款",
    
    paymentProof: "付款证明",
    bankNamePrompt: "银行名称：",
    accountNamePrompt: "账户名称：",
    accountNumberPrompt: "账户号码：",
    swiftCodePrompt: "SWIFT代码（可选）：",
    bankInfoRequired: "银行名称、账户名称和账户号码是必需的",
    confirmPaymentPrompt: "确认已收到付款？",
    on: "在",
    vendorInventory: "供应商库存",
    vendorGiftInventory: "供应商礼品库存",
    item: "项目",
    
    addGift: "添加礼物",
    giftName: "礼物名称",
    
    image: "图片",
    search: "搜索...",
    fillGiftFields: "请正确填写所有礼物字段！",
    noScheduleItems: "无日程项目。",
    unpaid: "未付款",
    vendorReports: "供应商报告",
    
    paidPayments: "已付款",
    totalAmount: "总金额",
    
    totalInventoryItems: "总库存项目数",
    totalQuantity: "总数量",
    noReports: "尚无可用报告。",
    themePreviewText: "这是实时预览。当前主题是",
    manageServices: "管理服务",
    protocolOverview: "协议概览",
    
    totalAssignments: "总分配数",
    totalAgendaItems: "总议程项目数",
    totalTasksChecklist: "总任务/清单数",
    
    assignments: "分配",
    agenda: "议程",
    tasksChecklist: "任务/清单",
    
    staffId: "员工ID",
    taskId: "任务ID",
    
    notAvailable: "不可用",
    noActivity: "无活动",
    noTask: "无任务",
    protocolAssignments: "协议分配",
    
    staffName: "员工姓名",
    roleResponsibility: "角色/职责",
    
    addAssignment: "添加分配",
    
    noProtocolAssignments: "尚无协议分配。",
    eventAgenda: "活动议程",
    
    agendaActivityPlaceholder: "活动（例如新娘入场）",
    
    addAgenda: "添加议程",
    
    noAgendaItems: "尚无议程项目。",
    
    fillAllAgendaFields: "请选择活动并填写所有字段",
    unknownEvent: "未知活动",
    eventDayChecklist: "活动日清单",
    
    addChecklistTaskPlaceholder: "添加任务（例如确认舞台设置）",
    
    noChecklistItems: "尚无清单项目。",
    protocolTaskChecklist: "协议任务清单",
    
    taskCannotBeEmpty: "任务不能为空。",
    confirmDeleteTask: "您确定要删除此任务吗？",
    
    taskPlaceholder: "任务...",
    
    noProtocolTasks: "尚无协议任务。",
    protocolManageEvents: "协议 - 管理活动",
    
    noApprovedEvents: "尚无批准的活动。",
    theme: "主题",
    coupleOverview: "新人概览",
    
    noEventsAdded: "尚无添加的活动。",
    
    guestList: "宾客名单",
    
    normal: "普通",
    vip: "VIP",
    family: "家庭",
    
    fillGuestFields: "请提供宾客姓名、邮箱和类型！",
    
    rsvpAccepted: "RSVP已接受",
    rsvpPending: "RSVP待定",
    seatingArrangement: "座位安排",
    selectGuest: "选择宾客",
    seatNumber: "座位号",
    rowNumber: "行号/桌号",
    
    assignSeat: "分配座位",
    table: "桌子",
    guest: "宾客",
    seat: "座位",
    type: "类型",
    fillSeatFields: "请填写所有字段",
    tableFull: "此桌已有8位宾客",
    seatNumberAssigned: "此桌已分配座位号",
    noSeatsAssigned: "尚无分配的座位",
    coupleBudgetSummary: "新人预算摘要",
    
    submit: "提交",
    pay: "付款",
    rsvpTracking: "RSVP跟踪",
    noGuests: "无宾客。",
    attending: "出席",
    
    selectVendorService: "选择供应商服务",
    
    taskOptional: "任务（可选）",
    inventoryManagement: "新人库存管理",
    
    assignedVendorOptional: "分配供应商（可选）",
    addItem: "添加项目",
    searchItems: "搜索项目...",
    noInventoryItems: "未找到库存项目。",
    
    confirmDeleteItem: "删除此项目？",
    generalTask: "一般",
    
    taskName: "任务名称...",
    
    noTasksYet: "尚无任务。",
    budgetSummary: "预算摘要",
    protocol: "协议",
  },
};

/* ================= CONTEXT ================= */
interface AppSettingsContextType {
  theme: Theme;
  language: Language;
  isRTL: boolean;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AppSettingsContext =
  createContext<AppSettingsContextType | null>(null);

/* ================= PROVIDER ================= */
export const AppSettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "default"
  );

  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem("language") as Language) || "en"
  );

  const isRTL = rtlLanguages.includes(language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language, isRTL]);

  const t = (key: string) =>
    translations[language][key] ?? key;

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        language,
        isRTL,
        setTheme: setThemeState,
        setLanguage: setLanguageState,
        t,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider");
  }
  return ctx;
};
