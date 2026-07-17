import { STATES } from "@/lib/master-data/states";
import { CITIES } from "@/lib/master-data/cities";
import { PRODUCTS } from "@/lib/master-data/products";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { QualityGrade } from "@/lib/types/marketplace";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import type {
  Vehicle,
  VehicleDraft,
  VehicleStatus,
  VehicleType,
  Driver,
  DriverDraft,
  DriverStatus,
  TransportDispatch,
  TransportDispatchStatus,
  TransportLocation,
  TransportDashboardStats,
  TransportAnalyticsSummary,
} from "@/lib/types/transport";

const VEHICLES_KEY = "tradesucro-transport-vehicles";
const DRIVERS_KEY = "tradesucro-transport-drivers";
const DISPATCHES_KEY = "tradesucro-transport-dispatches";
const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const DRIVER_NAMES = ["Ramesh Yadav", "Suresh Kumar", "Arjun Singh", "Manoj Patil", "Vijay Sharma", "Deepak Rathod", "Ashok Gupta", "Sanjay Mane"];
const VEHICLE_TYPES: VehicleType[] = ["open-truck", "covered-truck", "trailer", "container"];

function pickLocation(seed: number): TransportLocation {
  const state = STATES[seed % 28];
  const citiesInState = CITIES.filter((c) => c.stateCode === state.value);
  const city = citiesInState[seed % (citiesInState.length || 1)]?.label ?? "";
  return { state: state.value, city };
}

function seedVehicles(): Vehicle[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: `veh-${String(i + 1).padStart(3, "0")}`,
    registrationNumber: `${["MH", "GJ", "UP", "KA", "PB"][i % 5]}${String(10 + (i % 40)).padStart(2, "0")} ${["AB", "CD", "EF", "GH"][i % 4]} ${String(1000 + i * 37).slice(0, 4)}`,
    type: VEHICLE_TYPES[i % VEHICLE_TYPES.length],
    capacityMt: [9, 16, 20, 25][i % 4],
    status: (["available", "on-trip", "available", "maintenance", "available", "on-trip", "inactive"] as VehicleStatus[])[i % 7],
    currentDriverId: i % 3 !== 2 ? `drv-${String((i % 8) + 1).padStart(3, "0")}` : null,
    lastServiceDate: daysFromNow(-(10 + i * 6)),
    createdAt: daysFromNow(-(180 + i * 5)),
  }));
}

function seedDrivers(): Driver[] {
  return DRIVER_NAMES.map((name, i) => ({
    id: `drv-${String(i + 1).padStart(3, "0")}`,
    name,
    mobile: `9${String(800000000 + i * 173).slice(0, 9)}`,
    licenseNumber: `DL-${String(2018 + (i % 6))}-${String(100000 + i * 911).slice(0, 6)}`,
    licenseExpiry: daysFromNow(180 + i * 40),
    status: (["available", "on-trip", "available", "off-duty"] as DriverStatus[])[i % 4],
    assignedVehicleId: i < 8 ? `veh-${String(i + 1).padStart(3, "0")}` : null,
    rating: [4.2, 4.5, 4.7, 4.8, 4.9, 4.3, 4.6, 4.4][i % 8],
    totalTrips: 40 + i * 17,
    createdAt: daysFromNow(-(200 + i * 8)),
  }));
}

function seedDispatches(): TransportDispatch[] {
  return Array.from({ length: 16 }, (_, i) => {
    const product = PRODUCTS[(i + 2) % PRODUCTS.length];
    const grade = QUALITY_GRADES[(i + 2) % QUALITY_GRADES.length];
    const status = (["in-transit", "delivered", "delivered", "assigned", "delayed", "delivered"] as TransportDispatchStatus[])[i % 6];
    const dispatchedAt = daysFromNow(-(2 + i));
    const statusHistory = [{ status: "assigned" as TransportDispatchStatus, timestamp: dispatchedAt, note: "Load assigned to vehicle and driver." }];
    if (status !== "assigned") statusHistory.push({ status: "in-transit" as TransportDispatchStatus, timestamp: daysFromNow(-(1 + i)), note: "Vehicle departed from pickup location." });
    if (status === "delivered") statusHistory.push({ status: "delivered" as TransportDispatchStatus, timestamp: daysFromNow(-(i % 3)), note: "Delivered and confirmed by consignee." });
    if (status === "delayed") statusHistory.push({ status: "delayed" as TransportDispatchStatus, timestamp: daysFromNow(-(i % 2)), note: "Delayed due to highway congestion." });

    return {
      id: `disp-${String(i + 1).padStart(3, "0")}`,
      dispatchNumber: `DSP-2026-${String(3000 + i).slice(1)}`,
      inquiryId: `fi-legacy-${String((i % 12) + 1).padStart(3, "0")}`,
      vehicleId: `veh-${String((i % 14) + 1).padStart(3, "0")}`,
      driverId: `drv-${String((i % 8) + 1).padStart(3, "0")}`,
      product: product.value,
      grade,
      quantity: 80 + ((i * 41) % 350),
      pickup: pickLocation(i + 1),
      delivery: pickLocation(i + 5),
      status,
      dispatchedAt,
      estimatedDelivery: daysFromNow(1 + (i % 4)),
      actualDelivery: status === "delivered" ? daysFromNow(-(i % 3)) : null,
      rate: 3600 + ((i * 233) % 4200),
      statusHistory,
    };
  });
}

function readJSON<T>(key: string, seed: () => T): T {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // fall through to reseed
  }
  const seeded = seed();
  window.localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Transport Workspace Service (mock)
 * ------------------------------------------------------------------
 * localStorage-as-database, same pattern as every other workspace
 * service in the app (Trader, Contact, Product/Grade Master, etc.).
 */
export const transportService = {
  async getVehicles(): Promise<Vehicle[]> {
    return delay(readJSON(VEHICLES_KEY, seedVehicles));
  },
  async createVehicle(draft: VehicleDraft): Promise<Vehicle> {
    const vehicles = readJSON(VEHICLES_KEY, seedVehicles);
    const vehicle: Vehicle = {
      id: `veh-user-${Date.now()}`,
      ...draft,
      status: "available",
      currentDriverId: null,
      lastServiceDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    writeJSON(VEHICLES_KEY, [vehicle, ...vehicles]);
    return delay(vehicle, 400);
  },
  async setVehicleStatus(id: string, status: VehicleStatus): Promise<Vehicle> {
    const vehicles = readJSON(VEHICLES_KEY, seedVehicles);
    const existing = vehicles.find((v) => v.id === id);
    if (!existing) throw new Error("Vehicle not found.");
    const updated = { ...existing, status };
    writeJSON(VEHICLES_KEY, vehicles.map((v) => (v.id === id ? updated : v)));
    return delay(updated, 300);
  },

  async getDrivers(): Promise<Driver[]> {
    return delay(readJSON(DRIVERS_KEY, seedDrivers));
  },
  async createDriver(draft: DriverDraft): Promise<Driver> {
    const drivers = readJSON(DRIVERS_KEY, seedDrivers);
    const driver: Driver = {
      id: `drv-user-${Date.now()}`,
      ...draft,
      status: "available",
      assignedVehicleId: null,
      rating: 0,
      totalTrips: 0,
      createdAt: new Date().toISOString(),
    };
    writeJSON(DRIVERS_KEY, [driver, ...drivers]);
    return delay(driver, 400);
  },
  async setDriverStatus(id: string, status: DriverStatus): Promise<Driver> {
    const drivers = readJSON(DRIVERS_KEY, seedDrivers);
    const existing = drivers.find((d) => d.id === id);
    if (!existing) throw new Error("Driver not found.");
    const updated = { ...existing, status };
    writeJSON(DRIVERS_KEY, drivers.map((d) => (d.id === id ? updated : d)));
    return delay(updated, 300);
  },

  async getDispatches(activeOnly = false): Promise<TransportDispatch[]> {
    const all = readJSON(DISPATCHES_KEY, seedDispatches);
    return delay(activeOnly ? all.filter((d) => d.status !== "delivered") : all);
  },
  async getDispatchById(id: string): Promise<TransportDispatch | undefined> {
    return readJSON(DISPATCHES_KEY, seedDispatches).find((d) => d.id === id);
  },
  async updateDispatchStatus(id: string, status: TransportDispatchStatus, note: string): Promise<TransportDispatch> {
    const dispatches = readJSON(DISPATCHES_KEY, seedDispatches);
    const existing = dispatches.find((d) => d.id === id);
    if (!existing) throw new Error("Dispatch not found.");
    const updated: TransportDispatch = {
      ...existing,
      status,
      actualDelivery: status === "delivered" ? new Date().toISOString() : existing.actualDelivery,
      statusHistory: [...existing.statusHistory, { status, timestamp: new Date().toISOString(), note }],
    };
    writeJSON(DISPATCHES_KEY, dispatches.map((d) => (d.id === id ? updated : d)));
    return delay(updated, 400);
  },

  /** Completed trips are derived from dispatches, not a parallel data set. */
  async getCompletedTrips(): Promise<TransportDispatch[]> {
    const all = readJSON(DISPATCHES_KEY, seedDispatches);
    return delay(
      all
        .filter((d) => d.status === "delivered")
        .sort((a, b) => new Date(b.actualDelivery ?? 0).getTime() - new Date(a.actualDelivery ?? 0).getTime())
    );
  },

  /** pendingFreightInquiries is intentionally NOT computed here — see freight.service.ts, which owns all inquiry/quote data. Callers combine both. */
  async getDashboardStats(): Promise<Omit<TransportDashboardStats, "pendingFreightInquiries">> {
    const [vehicles, drivers, dispatches] = await Promise.all([
      transportService.getVehicles(),
      transportService.getDrivers(),
      transportService.getDispatches(),
    ]);
    const thisMonth = new Date().getMonth();
    const completedThisMonth = dispatches.filter((d) => d.status === "delivered" && d.actualDelivery && new Date(d.actualDelivery).getMonth() === thisMonth);

    return delay({
      totalVehicles: vehicles.length,
      availableVehicles: vehicles.filter((v) => v.status === "available").length,
      totalDrivers: drivers.length,
      availableDrivers: drivers.filter((d) => d.status === "available").length,
      activeDispatches: dispatches.filter((d) => d.status === "in-transit" || d.status === "assigned").length,
      completedTripsThisMonth: completedThisMonth.length,
      earningsThisMonth: completedThisMonth.reduce((sum, d) => sum + d.rate * d.quantity, 0),
    });
  },

  /** Creates a Dispatch from a confirmed Freight Inquiry + approved Quote — the bridge freight.service.ts calls once a trader confirms transport. Fleet assignment (vehicle/driver) defaults to the first available pair; a real dispatcher would pick explicitly. */
  async createDispatchFromInquiry(params: {
    inquiryId: string;
    product: string;
    grade: QualityGrade;
    quantity: number;
    pickup: TransportLocation;
    delivery: TransportLocation;
    rate: number;
    pickupDate: string;
  }): Promise<TransportDispatch> {
    const dispatches = readJSON(DISPATCHES_KEY, seedDispatches);
    const vehicles = readJSON(VEHICLES_KEY, seedVehicles);
    const drivers = readJSON(DRIVERS_KEY, seedDrivers);
    const vehicle = vehicles.find((v) => v.status === "available") ?? vehicles[0];
    const driver = drivers.find((d) => d.status === "available") ?? drivers[0];
    const now = new Date().toISOString();

    const dispatch: TransportDispatch = {
      id: `disp-${Date.now()}`,
      dispatchNumber: `DSP-2026-${String(dispatches.length + 1).padStart(4, "0")}`,
      inquiryId: params.inquiryId,
      vehicleId: vehicle?.id ?? "",
      driverId: driver?.id ?? "",
      product: params.product,
      grade: params.grade,
      quantity: params.quantity,
      pickup: params.pickup,
      delivery: params.delivery,
      status: "assigned",
      dispatchedAt: params.pickupDate,
      estimatedDelivery: new Date(new Date(params.pickupDate).getTime() + 3 * 86400000).toISOString(),
      actualDelivery: null,
      rate: params.rate,
      statusHistory: [{ status: "assigned", timestamp: now, note: "Transport confirmed and assigned by trader." }],
    };
    writeJSON(DISPATCHES_KEY, [...dispatches, dispatch]);
    return delay(dispatch, 400);
  },

  async getAnalyticsSummary(): Promise<TransportAnalyticsSummary> {
    const dispatches = readJSON(DISPATCHES_KEY, seedDispatches);
    const delivered = dispatches.filter((d) => d.status === "delivered");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    const routeCounts = new Map<string, number>();
    dispatches.forEach((d) => {
      const route = `${getMasterStateLabel(d.pickup.state)} → ${getMasterStateLabel(d.delivery.state)}`;
      routeCounts.set(route, (routeCounts.get(route) ?? 0) + 1);
    });
    const topRoutes = [...routeCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([route, trips]) => ({ route, trips }));

    return delay({
      monthlyTripCounts: months.map((month, i) => ({ month, trips: 8 + ((i * 7) % 14) })),
      monthlyEarnings: months.map((month, i) => ({ month, earnings: 180000 + ((i * 53000) % 260000) })),
      onTimeDeliveryRate: Math.round((delivered.length / Math.max(dispatches.length, 1)) * 100),
      topRoutes,
      vehicleUtilization: 68,
    });
  },
};
