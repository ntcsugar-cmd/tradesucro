import { Badge } from "@/components/common/Badge";
import { TextInput, NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { ProductSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { CURRENCIES } from "@/lib/master-data/currencies";
import { formatINR } from "@/lib/utils/format";
import type { DealOriginType, DealStatus } from "@/lib/types/deal";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));
const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.value, label: `${c.label} (${c.symbol})` }));
const ORIGIN_OPTIONS: { value: DealOriginType; label: string }[] = [
  { value: "mill_offer", label: "Mill Offer" },
  { value: "tender_award", label: "Tender Award" },
  { value: "direct_negotiation", label: "Direct Negotiation" },
  { value: "marketplace_offer", label: "Marketplace Offer" },
];

interface DealInfoSectionProps {
  dealNumber?: string;
  status?: DealStatus;
  dealDate: string;
  originType: DealOriginType;
  originReference: string;
  mill: string;
  seller: string;
  buyer: string;
  broker: string;
  trader: string;
  grade: string;
  product: string;
  quantity: number;
  rate: number;
  currency: string;
  onChange: (patch: Record<string, unknown>) => void;
  readOnly?: boolean;
}

export function DealInfoSection({
  dealNumber, status, dealDate, originType, originReference, mill, seller, buyer, broker, trader,
  grade, product, quantity, rate, currency, onChange, readOnly = false,
}: DealInfoSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Deal Information</h2>
      <div className="mt-5 grid sm:grid-cols-2 gap-5">
        <div>
          <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">Deal Number</p>
          <p className="h-11 flex items-center px-3.5 rounded-sm border border-line dark:border-white/10 bg-charcoal/[0.02] font-mono text-sm text-ink-soft dark:text-white/50">
            {dealNumber ?? "Assigned automatically on save"}
          </p>
        </div>
        {status && (
          <div>
            <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">Status</p>
            <div className="h-11 flex items-center px-3.5 rounded-sm border border-line dark:border-white/10 bg-charcoal/[0.02]">
              <Badge tone="charcoal">{status.replace(/_/g, " ")}</Badge>
            </div>
          </div>
        )}

        <TextInput label="Deal Date" type="date" value={dealDate} disabled={readOnly} onChange={(e) => onChange({ dealDate: e.target.value })} />
        <Select label="Origin" defaultValue={originType} disabled={readOnly} options={ORIGIN_OPTIONS} onChange={(e) => onChange({ originType: e.target.value })} />
        <TextInput label="Origin Reference" placeholder="e.g. OFF-1024 or TND-1002" value={originReference} disabled={readOnly} onChange={(e) => onChange({ originReference: e.target.value })} className="sm:col-span-2" />

        <TextInput label="Mill" value={mill} disabled={readOnly} onChange={(e) => onChange({ mill: e.target.value })} />
        <TextInput label="Seller" value={seller} disabled={readOnly} onChange={(e) => onChange({ seller: e.target.value })} />
        <TextInput label="Buyer" value={buyer} disabled={readOnly} onChange={(e) => onChange({ buyer: e.target.value })} />
        <TextInput label="Broker" helperText="Optional" value={broker} disabled={readOnly} onChange={(e) => onChange({ broker: e.target.value })} />
        <TextInput label="Trader" helperText="Optional" value={trader} disabled={readOnly} onChange={(e) => onChange({ trader: e.target.value })} className="sm:col-span-2" />

        <ProductSelect label="Product" defaultValue={product} disabled={readOnly} onChange={(e) => onChange({ product: e.target.value })} />
        <Select label="Sugar Grade" defaultValue={grade} disabled={readOnly} options={GRADE_OPTIONS} onChange={(e) => onChange({ grade: e.target.value })} />

        <NumberInput label="Quantity" unit="MT" value={quantity || ""} disabled={readOnly} onChange={(e) => onChange({ quantity: Number(e.target.value) || 0 })} />
        <NumberInput label="Rate" unit="₹" value={rate || ""} disabled={readOnly} onChange={(e) => onChange({ rate: Number(e.target.value) || 0 })} />

        <div>
          <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">Total Value</p>
          <p className="h-11 flex items-center px-3.5 rounded-sm border border-line dark:border-white/10 bg-charcoal/[0.02] font-mono text-sm text-charcoal dark:text-white">
            {formatINR(quantity * rate)}
          </p>
        </div>
        <Select label="Currency" defaultValue={currency} disabled={readOnly} options={CURRENCY_OPTIONS} onChange={(e) => onChange({ currency: e.target.value })} />
      </div>
    </div>
  );
}
