import { Building2, Warehouse, Landmark, Users, FileCheck2, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Avatar } from "@/components/ui/Avatar";
import { VerificationBadge } from "@/components/profile/VerificationBadge";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatNumber } from "@/lib/utils/format";
import type { MillProfile } from "@/lib/types/millProfile";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-line last:border-b-0">
      <span className="text-xs text-ink-faint">{label}</span>
      <span className="text-[13px] text-charcoal font-medium">{value || "—"}</span>
    </div>
  );
}

interface MillProfileViewProps {
  profile: MillProfile;
}

/** MillProfileView — reuses VerificationBadge (read-only import from the Company Profile module) rather than redefining the same badge. */
export function MillProfileView({ profile }: MillProfileViewProps) {
  return (
    <div className="space-y-6">
      <Card padding="lg">
        <CardBody className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-navy-800 text-white font-display text-lg">
              <Building2 size={22} />
            </div>
            <div>
              <p className="font-display text-xl text-charcoal">{profile.companyName}</p>
              <p className="text-[13px] text-ink-soft mt-1 flex items-center gap-1.5">
                <MapPin size={13} /> {profile.location.city}, {getMasterStateLabel(profile.location.state)} · Factory Code {profile.factory.factoryCode}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <VerificationBadge status={profile.verification.gst} />
          </div>
        </CardBody>
      </Card>

      <Grid cols={1} colsLg={2} gap="md">
        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Factory Details</CardTitle>
            </CardHeader>
            <CardBody>
              <Row label="Daily crushing capacity" value={`${formatNumber(profile.factory.dailyCrushingCapacityTcd)} TCD`} />
              <Row label="Sugar production capacity" value={`${formatNumber(profile.factory.sugarProductionCapacityTpd)} TPD`} />
              <Row label="Storage capacity" value={`${formatNumber(profile.factory.storageCapacityMt)} MT`} />
              <Row label="Established" value={String(profile.factory.establishedYear)} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-3">
                {([
                  ["GST", profile.verification.gst],
                  ["PAN", profile.verification.pan],
                  ["IEC", profile.verification.iec],
                  ["Factory License", profile.verification.factoryLicense],
                ] as const).map(([label, status]) => (
                  <div key={label} className="flex items-center justify-between rounded-sm border border-line p-3">
                    <span className="text-[13px] font-medium text-charcoal">{label}</span>
                    <VerificationBadge status={status} />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Grid cols={1} colsLg={2} gap="md">
        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Warehouse Details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {profile.warehouses.map((w) => (
                <div key={w.id} className="flex items-center gap-3 rounded-sm border border-line p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-charcoal/[0.04] text-ink-faint">
                    <Warehouse size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-charcoal">{w.name}</p>
                    <p className="text-xs text-ink-faint">{w.location}</p>
                  </div>
                  <p className="font-mono text-xs text-ink-faint">{formatNumber(w.capacityMt)} MT</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-charcoal/[0.04] text-ink-faint">
                  <Landmark size={16} />
                </span>
                <div>
                  <p className="text-[13px] font-medium text-charcoal">{profile.bankDetails.bankName}</p>
                  <p className="text-xs text-ink-faint">{profile.bankDetails.branch}</p>
                </div>
              </div>
              <Row label="Account holder" value={profile.bankDetails.accountHolderName} />
              <Row label="Account number" value={profile.bankDetails.accountNumber} />
              <Row label="IFSC" value={profile.bankDetails.ifscCode} />
              <Row label="GSTIN" value={profile.gstin} />
              <Row label="PAN" value={profile.pan} />
              <Row label="IEC" value={profile.iec} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Grid cols={1} colsLg={2} gap="md">
        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Contact Persons</CardTitle>
            </CardHeader>
            <CardBody className="divide-y divide-line">
              {profile.contactPersons.map((cp) => (
                <div key={cp.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar name={cp.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-charcoal">{cp.name}</p>
                    <p className="text-xs text-ink-faint">{cp.designation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-faint">{cp.phone}</p>
                    <p className="text-xs text-ink-faint">{cp.email}</p>
                  </div>
                </div>
              ))}
              {profile.contactPersons.length === 0 && (
                <p className="text-[13px] text-ink-faint italic flex items-center gap-2">
                  <Users size={14} /> No contact persons added.
                </p>
              )}
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2.5">
              {profile.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-sm border border-line p-3">
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 size={15} className={doc.fileName ? "text-success" : "text-ink-faint"} />
                    <span className="text-[13px] text-charcoal">{doc.label}</span>
                  </div>
                  <span className="text-xs text-ink-faint">{doc.fileName ? "Uploaded" : "Pending"}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
}
