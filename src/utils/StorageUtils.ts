// src/utils/storageUtils.ts

// 🔑 Storage keys (SINGLE SOURCE OF TRUTH)
export const STORAGE_KEYS = {
  USERS: "users",
  EVENTS: "events",
  GUESTS: "guests",
  VENDORS: "vendors",
  TASKS: "tasks",
  PAYMENTS: "payments",
  PACKAGES: "packages",
  INVENTORY: "inventory",
  AGENDA: "agenda",

  /* System */
  SYSTEMLOG: "systemLog",
  SYSTEM_CONTENT: "systemContent",

  /* Shared across roles */
  BUDGETS: "budgets",
  ASSIGNMENTS: "assignments",
  EVENT_DAY_CHECKLIST: "eventDayChecklist",
  RSVP: "rsvp",
  SEATS: "seats",
  GIFT_REGISTRY: "giftRegistry",

  /* Manager / Vendor / Couple */
  VENDOR_ASSIGNMENTS: "vendorAssignments",
  VENDOR_PAYMENTS: "vendorPayments",
  COUPLE_BUDGETS: "coupleBudgets",

  /* Vendor */
  VENDOR_PROFILE: "vendorProfile",
  VENDOR_BANK_FORM: "vendorBankForm",
  VENDOR_INVENTORY: "vendorInventory",
  VENDORS_SERVICES: "vendorsServices",

  /* Couple */
  COUPLE_INVENTORY: "coupleInventory",
  COUPLE_VENDOR_COORDINATION: "coupleVendorCoordination",

  /* Gifts */
  GIFT_INVENTORY: "giftInventory",
  GIFT_BOUGHT: "giftBought",
} as const;



/* ------------------------------------------------------------------ */
/* 🔹 Core System Types */
/* ------------------------------------------------------------------ */

export type User = {
  id: string;
  name: string;
  role: "admin" | "manager" | "protocol" | "vendor" | "attendee" | "couple";
};

export type EventStatus = "draft" | "approved" | "locked";

export type EventItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
};

export type Guest = {
  id: string;
  eventId: string;
  name: string;
  rsvp?: boolean;
};

export type Vendor = {
  id: string;
  name: string;
  services?: string[];
};

export type Task = {
  id: string;
  eventId: string;
  title: string;
  completed: boolean;
};

export type Payment = {
  id: string;
  eventId: string;
  amount: number;
  paid: boolean;
};

export type PackageItem = {
  id: string;
  name: string;
  price: number;
};

export type InventoryItem = {
  id: string;
  eventId: string;
  item: string;
  quantity: number;
};

export type AgendaItem = {
  id: string;
  eventId: string;
  time: string;
  activity: string;
};

export type SystemLog = {
  id: string;
  action: string;
  userId: string;
  timestamp: string;
};

/* ------------------------------------------------------------------ */
/* 🔹 Manager / Protocol / Attendee Shared Types */
/* ------------------------------------------------------------------ */

export type Budget = {
  id: string;
  eventId: string;
  category: string;
  amount: number;
  spent: number;
};

export type Assignment = {
  id: string;
  eventId: string;
  staffId: string;
  taskId: string;
};

export type EventDayChecklistItem = {
  id: string;
  eventId: string;
  task: string;
  done: boolean;
};

export type RSVPItem = {
  id: string;
  eventId: string;
  guestId: string;
  status: boolean;
};

export type Seat = {
  id: string;
  eventId: string;
  guestId: string;
  seatNumber: string;
};

export type GiftRegistryItem = {
  id: string;
  eventId: string;
  item: string;
  claimed: boolean;
};

/* ------------------------------------------------------------------ */
/* 🔹 Local Storage Helpers (SAFE + TYPED) */
/* ------------------------------------------------------------------ */

export function getFromStorage<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try {
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function addToStorageArray<T>(key: string, item: T): void {
  const arr = getFromStorage<T[]>(key, []);
  arr.push(item);
  saveToStorage(key, arr);
}

export function updateStorageArray<T>(
  key: string,
  predicate: (item: T) => boolean,
  updateFn: (item: T) => T
): void {
  const arr = getFromStorage<T[]>(key, []);
  saveToStorage(
    key,
    arr.map(item => (predicate(item) ? updateFn(item) : item))
  );
}

export function deleteFromStorageArray<T>(
  key: string,
  predicate: (item: T) => boolean
): void {
  const arr = getFromStorage<T[]>(key, []);
  saveToStorage(
    key,
    arr.filter(item => !predicate(item))
  );
}

/* ------------------------------------------------------------------ */
/* 🔹 Event-Specific Helpers (Typed + Safe) */
/* ------------------------------------------------------------------ */

/** Get all events from storage */
export function getEventsFromStorage(): EventItem[] {
  const stored = getFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, []);
  // Ensure every event has a status
  return stored.map(e => ({ ...e, status: e.status || "draft" }));
}

/** Add a new event to storage */
export function addEventToStorage(event: EventItem): void {
  addToStorageArray<EventItem>(STORAGE_KEYS.EVENTS, event);
}

/** Update an event in storage by id */
export function updateEventInStorage(
  id: string,
  updateFn: (event: EventItem) => EventItem
): void {
  updateStorageArray<EventItem>(STORAGE_KEYS.EVENTS, e => e.id === id, updateFn);
}

/** Delete an event from storage by id */
export function deleteEventFromStorage(id: string): void {
  deleteFromStorageArray<EventItem>(STORAGE_KEYS.EVENTS, e => e.id === id);
}
