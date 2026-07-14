import type { PackagingOption } from "@/types/master-data";

export const PACKAGING: PackagingOption[] = [
  { value: "50kg-pp-bag", label: "50 Kg PP Bag", weightKg: 50 },
  { value: "50kg-jute-bag", label: "50 Kg Jute Bag", weightKg: 50 },
  { value: "25kg-bag", label: "25 Kg Bag", weightKg: 25 },
  { value: "1kg-packet-bag", label: "1Kg Packet Bag", weightKg: 1 },
  { value: "5kg-packet-bag", label: "5Kg Packet Bag", weightKg: 5 },
];
