import type { TransporterProfile } from "@/lib/types/transport";

/**
 * The current logged-in Transport Workspace represents "Kaveri Logistics"
 * (mirrors the seeded workspace company name pattern in
 * services/workspace.service.ts — "{Company} Logistics"). Every other
 * entry is a separate transporter company in TradeSucro's network, so
 * matching, quote comparison, and admin approval have real
 * multi-transporter data rather than a single company talking to itself.
 */
export const TRANSPORTER_DIRECTORY: TransporterProfile[] = [
  { id: "tp-001", companyName: "Kaveri Logistics", coverageStates: ["maharashtra", "karnataka", "gujarat"], vehicleTypes: ["open-truck", "covered-truck", "trailer"], rating: 4.6, verified: true, isCurrentUser: true },
  { id: "tp-002", companyName: "Shree Balaji Roadlines", coverageStates: ["maharashtra", "gujarat", "madhya-pradesh"], vehicleTypes: ["open-truck", "trailer", "container"], rating: 4.3, verified: true },
  { id: "tp-003", companyName: "Deccan Freight Carriers", coverageStates: ["karnataka", "andhra-pradesh", "telangana"], vehicleTypes: ["covered-truck", "trailer"], rating: 4.5, verified: true },
  { id: "tp-004", companyName: "Punjab Grain Movers", coverageStates: ["punjab", "haryana", "uttar-pradesh"], vehicleTypes: ["open-truck", "covered-truck"], rating: 4.1, verified: true },
  { id: "tp-005", companyName: "Coastal Cargo Transport", coverageStates: ["gujarat", "maharashtra", "rajasthan"], vehicleTypes: ["container", "trailer"], rating: 3.9, verified: false },
  { id: "tp-006", companyName: "Sugarbelt Haulage Co.", coverageStates: ["uttar-pradesh", "bihar", "madhya-pradesh"], vehicleTypes: ["open-truck", "covered-truck", "trailer"], rating: 4.4, verified: true },
  { id: "tp-007", companyName: "Krishna Valley Transporters", coverageStates: ["karnataka", "tamil-nadu", "andhra-pradesh"], vehicleTypes: ["open-truck", "trailer"], rating: 4.0, verified: true },
  { id: "tp-008", companyName: "National Highway Freighters", coverageStates: ["maharashtra", "gujarat", "karnataka", "madhya-pradesh"], vehicleTypes: ["container", "covered-truck", "trailer"], rating: 4.7, verified: true },
  { id: "tp-009", companyName: "Malwa Roadways", coverageStates: ["punjab", "haryana", "himachal-pradesh"], vehicleTypes: ["open-truck", "covered-truck"], rating: 3.7, verified: false },
  { id: "tp-010", companyName: "Godavari Bulk Movers", coverageStates: ["andhra-pradesh", "telangana", "odisha"], vehicleTypes: ["open-truck", "trailer", "container"], rating: 4.2, verified: true },
];

export function getCurrentTransporterId(): string {
  return TRANSPORTER_DIRECTORY.find((t) => t.isCurrentUser)?.id ?? TRANSPORTER_DIRECTORY[0].id;
}
