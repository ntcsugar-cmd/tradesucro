import type { QualityGrade } from "./marketplace";

/**
 * Transport Workspace Types
 * ------------------------------------------------------------------
 * Self-contained, mirroring how the Trader and Mill workspaces own
 * their own record types rather than reusing another module's shapes.
 */

export type VehicleType = "open-truck" | "covered-truck" | "trailer" | "container";
export type VehicleStatus = "available" | "on-trip" | "maintenance" | "inactive";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  capacityMt: number;
  status: VehicleStatus;
  currentDriverId: string | null;
  lastServiceDate: string;
  createdAt: string;
}

export type VehicleDraft = Pick<Vehicle, "registrationNumber" | "type" | "capacityMt">;

export type DriverStatus = "available" | "on-trip" | "off-duty";

export interface Driver {
  id: string;
  name: string;
  mobile: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: DriverStatus;
  assignedVehicleId: string | null;
  rating: number;
  totalTrips: number;
  createdAt: string;
}

export type DriverDraft = Pick<Driver, "name" | "mobile" | "licenseNumber" | "licenseExpiry">;

export interface TransportLocation {
  state: string;
  city: string;
}

export type LoadRequestStatus = "pending" | "accepted" | "rejected" | "assigned";

export interface LoadRequest {
  id: string;
  requestNumber: string;
  requestedBy: string;
  product: string;
  grade: QualityGrade;
  quantity: number;
  pickup: TransportLocation;
  delivery: TransportLocation;
  proposedRate: number;
  pickupDate: string;
  status: LoadRequestStatus;
  createdAt: string;
}

export type TransportDispatchStatus = "assigned" | "in-transit" | "delivered" | "delayed";

export interface DispatchStatusEvent {
  status: TransportDispatchStatus;
  timestamp: string;
  note: string;
}

export interface TransportDispatch {
  id: string;
  dispatchNumber: string;
  loadRequestId: string;
  vehicleId: string;
  driverId: string;
  product: string;
  grade: QualityGrade;
  quantity: number;
  pickup: TransportLocation;
  delivery: TransportLocation;
  status: TransportDispatchStatus;
  dispatchedAt: string;
  estimatedDelivery: string;
  actualDelivery: string | null;
  rate: number;
  statusHistory: DispatchStatusEvent[];
}

export interface TransportDashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  totalDrivers: number;
  availableDrivers: number;
  pendingLoadRequests: number;
  activeDispatches: number;
  completedTripsThisMonth: number;
  earningsThisMonth: number;
}

export interface TransportAnalyticsSummary {
  monthlyTripCounts: { month: string; trips: number }[];
  monthlyEarnings: { month: string; earnings: number }[];
  onTimeDeliveryRate: number;
  topRoutes: { route: string; trips: number }[];
  vehicleUtilization: number;
}
