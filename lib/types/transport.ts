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

/**
 * Freight Coordination — the actual business model
 * ------------------------------------------------------------------
 * TradeSucro is a coordinator, not a directory: a trader/buyer/mill
 * posts a Freight Inquiry, TradeSucro's matching engine identifies and
 * broadcasts it to eligible transporters (by loading state/city and
 * vehicle type — the "Transport Broadcast" feature), each matched
 * transporter can accept/decline and submit a FreightQuote, TradeSucro
 * staff review and approve exactly one quote, and only THEN is that
 * quote (never the transporter's contact details, never the other
 * quotes) shared with the requester. Confirming creates a
 * TransportDispatch for tracking — the existing fleet/dispatch system
 * below is reused unchanged as the fulfillment layer once a quote is
 * confirmed.
 */

/** The broader network of transporter companies TradeSucro coordinates — not just the current user's own fleet. Matching runs against this. */
export interface TransporterProfile {
  id: string;
  companyName: string;
  coverageStates: string[];
  vehicleTypes: VehicleType[];
  rating: number;
  verified: boolean;
  /** Links a directory entry to the logged-in transporter workspace it represents, if any — lets "my own" inquiries/quotes be filtered from the shared mock directory. */
  isCurrentUser?: boolean;
}

export type FreightInquiryStatus = "broadcasting" | "quotes_received" | "quote_approved" | "confirmed" | "in_transit" | "delivered" | "cancelled";

export interface FreightLoadingLocation {
  locationType: "mill" | "warehouse" | "city";
  refName?: string;
  state: string;
  city: string;
}

export interface FreightInquiry {
  id: string;
  requestNumber: string;
  requestedByCompany: string;
  requestedByRole: "trader" | "buyer" | "mill";
  loading: FreightLoadingLocation;
  destination: TransportLocation;
  product: string;
  grade: QualityGrade | null;
  quantity: number;
  vehicleTypeRequired: VehicleType;
  expectedLoadingDate: string;
  specialInstructions: string;
  status: FreightInquiryStatus;
  matchedTransporterIds: string[];
  approvedQuoteId: string | null;
  dispatchId: string | null;
  createdAt: string;
}

export type FreightQuoteResponse = "pending" | "accepted" | "declined";
export type FreightQuoteAdminStatus = "awaiting_quote" | "pending_review" | "approved" | "not_selected";

export interface FreightQuote {
  id: string;
  inquiryId: string;
  transporterId: string;
  transporterName: string;
  transporterRating: number;
  transporterVerified: boolean;
  response: FreightQuoteResponse;
  freightAmount: number | null;
  vehicleAvailability: string | null;
  loadingTime: string | null;
  transitTime: string | null;
  remarks: string | null;
  adminStatus: FreightQuoteAdminStatus;
  submittedAt: string | null;
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
  inquiryId: string;
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
  pendingFreightInquiries: number;
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
