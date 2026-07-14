"use client";

import { Search, MapPin, Package, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { PRODUCING_STATES } from "@/lib/constants/states";

const GRADE_OPTIONS = QUALITY_GRADES.map((label) => ({ label, value: label }));
const REGION_OPTIONS = PRODUCING_STATES.map((s) => ({ label: s.label, value: s.label }));
const QUICK_FILTERS = ["Export grade", "Under 500 MT", "Verified mills only", "Posted today"];

/** Shared dark, borderless field styling for this toolbar — passed to each ghost Input/Select. */
const DARK_FIELD_CLASS = "bg-charcoal text-white placeholder:text-white/35 rounded-sm";

export function SearchOffers() {
  return (
    <section className="bg-charcoal">
      <div className="container-page py-16">
        <p className="text-eyebrow !text-gold-bright mb-3">Find an Offer</p>
        <h2 className="font-display text-3xl sm:text-4xl font-medium text-white max-w-xl">
          Search live offers by grade, quantity, and mandi
        </h2>

        <div className="mt-10 bg-charcoal-soft border border-white/10 rounded-sm p-2 sm:p-2.5">
          <div className="grid md:grid-cols-[1.4fr_1fr_1fr_auto] gap-2">
            <Input
              variant="ghost"
              size="lg"
              placeholder="Search grade, mill, or location…"
              leadingIcon={<Search size={16} className="text-white/35 shrink-0" />}
              className={DARK_FIELD_CLASS}
            />

            <Select
              variant="ghost"
              size="lg"
              placeholder="Grade"
              leadingIcon={<Package size={16} className="text-white/35 shrink-0" />}
              optionClassName="bg-charcoal text-white"
              options={GRADE_OPTIONS}
              className={DARK_FIELD_CLASS}
            />

            <Select
              variant="ghost"
              size="lg"
              placeholder="Region"
              leadingIcon={<MapPin size={16} className="text-white/35 shrink-0" />}
              optionClassName="bg-charcoal text-white"
              options={REGION_OPTIONS}
              className={DARK_FIELD_CLASS}
            />

            <Button variant="gold" size="lg" className="justify-center">
              Search
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest2 text-white/35 mr-1">
            <SlidersHorizontal size={12} /> Quick filters
          </span>
          {QUICK_FILTERS.map((f) => (
            <Button key={f} variant="outline-dark" size="sm" rounded="full">
              {f}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
