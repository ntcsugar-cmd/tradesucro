"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Factory, Warehouse, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { TraderSubNav } from "@/components/trader";
import { ProductSelect, StateSelect, CitySelect } from "@/components/master-data";
import { QUALITY_GRADES, type QualityGrade } from "@/lib/types/marketplace";
import { freightService } from "@/services/freight.service";
import { workspaceService } from "@/services/workspace.service";
import type { FreightLoadingLocation, VehicleType } from "@/lib/types/transport";

const LOCATION_TYPE_OPTIONS = [
  { value: "mill", label: "Sugar Mill" },
  { value: "warehouse", label: "Warehouse" },
  { value: "city", label: "City (no specific facility)" },
];
const VEHICLE_TYPE_OPTIONS = [
  { value: "open-truck", label: "Open Truck" },
  { value: "covered-truck", label: "Covered Truck" },
  { value: "trailer", label: "Trailer" },
  { value: "container", label: "Container" },
];
const GRADE_OPTIONS = [{ value: "", label: "Not specified" }, ...QUALITY_GRADES.map((g) => ({ value: g, label: g }))];
const LOCATION_ICON = { mill: Factory, warehouse: Warehouse, city: MapPin };

interface FormState {
  locationType: FreightLoadingLocation["locationType"];
  refName: string;
  loadingState: string;
  loadingCity: string;
  destState: string;
  destCity: string;
  product: string;
  grade: string;
  quantity: string;
  vehicleTypeRequired: string;
  expectedLoadingDate: string;
  specialInstructions: string;
}

const INITIAL: FormState = {
  locationType: "mill",
  refName: "",
  loadingState: "",
  loadingCity: "",
  destState: "",
  destCity: "",
  product: "",
  grade: "",
  quantity: "",
  vehicleTypeRequired: "open-truck",
  expectedLoadingDate: "",
  specialInstructions: "",
};

export default function RequestFreightPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const LocationIcon = LOCATION_ICON[form.locationType];

  async function handleSubmit() {
    if (!form.loadingState || !form.loadingCity || !form.destState || !form.destCity || !form.product || !form.quantity || !form.expectedLoadingDate) {
      setError("Fill in loading location, destination, product, quantity, and expected loading date.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const workspace = workspaceService.getActiveWorkspace();
      const inquiry = await freightService.createInquiry({
        requestedByCompany: workspace?.companyName ?? "Unknown Company",
        requestedByRole: "trader",
        loading: {
          locationType: form.locationType,
          refName: form.locationType !== "city" ? form.refName || undefined : undefined,
          state: form.loadingState,
          city: form.loadingCity,
        },
        destination: { state: form.destState, city: form.destCity },
        product: form.product,
        grade: form.grade ? (form.grade as QualityGrade) : null,
        quantity: Number(form.quantity) || 0,
        vehicleTypeRequired: form.vehicleTypeRequired as VehicleType,
        expectedLoadingDate: form.expectedLoadingDate,
        specialInstructions: form.specialInstructions,
      });
      router.push(`/trader/freight/${inquiry.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <TraderSubNav />
      <PageHeader title="Request Freight" description="Post a freight inquiry — TradeSucro automatically identifies and broadcasts it to matching transporters by route and vehicle type." />

      <Card padding="lg" className="max-w-3xl">
        <CardBody className="space-y-6">
          {error && <Alert variant="danger">{error}</Alert>}

          <div>
            <p className="text-[13px] font-medium text-charcoal dark:text-white mb-2 flex items-center gap-2">
              <LocationIcon size={15} className="text-gold-dim" /> Loading Location
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <Select label="Location Type" defaultValue={form.locationType} options={LOCATION_TYPE_OPTIONS} onChange={(e) => set("locationType", e.target.value as FormState["locationType"])} />
              {form.locationType !== "city" && (
                <TextInput label={form.locationType === "mill" ? "Mill Name" : "Warehouse Name"} value={form.refName} onChange={(e) => set("refName", e.target.value)} />
              )}
              <StateSelect label="State" onChange={(e) => set("loadingState", e.target.value)} />
              <CitySelect label="City" state={form.loadingState} onChange={(e) => set("loadingCity", e.target.value)} />
            </div>
          </div>

          <div>
            <p className="text-[13px] font-medium text-charcoal dark:text-white mb-2 flex items-center gap-2">
              <MapPin size={15} className="text-gold-dim" /> Destination
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <StateSelect label="State" onChange={(e) => set("destState", e.target.value)} />
              <CitySelect label="City" state={form.destState} onChange={(e) => set("destCity", e.target.value)} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <ProductSelect label="Product" onChange={(e) => set("product", e.target.value)} />
            <Select label="Sugar Grade (optional)" defaultValue="" options={GRADE_OPTIONS} onChange={(e) => set("grade", e.target.value)} />
            <TextInput label="Quantity (MT)" type="number" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
            <Select label="Vehicle Type Required" defaultValue={form.vehicleTypeRequired} options={VEHICLE_TYPE_OPTIONS} onChange={(e) => set("vehicleTypeRequired", e.target.value)} />
            <TextInput label="Expected Loading Date" type="date" value={form.expectedLoadingDate} onChange={(e) => set("expectedLoadingDate", e.target.value)} />
          </div>

          <Textarea label="Special Instructions (optional)" rows={3} value={form.specialInstructions} onChange={(e) => set("specialInstructions", e.target.value)} />

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="lg" loading={submitting} onClick={handleSubmit}>
              Broadcast to Transporters
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
