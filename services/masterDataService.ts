import { PRODUCTS } from "@/lib/master-data/products";
import { PACKAGING } from "@/lib/master-data/packaging";
import { UNITS } from "@/lib/master-data/units";
import { PAYMENT_TERMS } from "@/lib/master-data/paymentTerms";
import { DISPATCH_TERMS } from "@/lib/master-data/dispatchTerms";
import { COMPANY_TYPES } from "@/lib/master-data/companyTypes";
import { STATES } from "@/lib/master-data/states";
import { CITIES } from "@/lib/master-data/cities";
import { MILLS } from "@/lib/master-data/mills";
import { COUNTRIES } from "@/lib/master-data/countries";
import { CURRENCIES } from "@/lib/master-data/currencies";

import type {
  Product,
  PackagingOption,
  UnitOption,
  PaymentTermOption,
  DispatchTermOption,
  CompanyTypeOption,
  StateOption,
  CityOption,
  Mill,
  CountryOption,
  CurrencyOption,
} from "@/types/master-data";

const NETWORK_DELAY_MS = 250;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Master Data Service
 * ------------------------------------------------------------------
 * The single centralized access point for every reference/lookup list
 * in the app (products, packaging, units, payment/dispatch terms,
 * company types, states, cities, mills, countries, currencies).
 *
 * No backend yet — every function resolves from lib/master-data/*.ts
 * with a short simulated delay. Business pages and the reusable
 * <XSelect /> components (components/master-data/) should always call
 * a function here, never import a lib/master-data array directly —
 * that's the seam that makes swapping in a real API later a one-file
 * change instead of a project-wide find-and-replace.
 */
export const masterDataService = {
  async getProducts(): Promise<Product[]> {
    return delay(PRODUCTS);
  },

  async getPackaging(): Promise<PackagingOption[]> {
    return delay(PACKAGING);
  },

  async getUnits(): Promise<UnitOption[]> {
    return delay(UNITS);
  },

  async getPaymentTerms(): Promise<PaymentTermOption[]> {
    return delay(PAYMENT_TERMS);
  },

  async getDispatchTerms(): Promise<DispatchTermOption[]> {
    return delay(DISPATCH_TERMS);
  },

  async getCompanyTypes(): Promise<CompanyTypeOption[]> {
    return delay(COMPANY_TYPES);
  },

  async getStates(): Promise<StateOption[]> {
    return delay(STATES);
  },

  async getCities(stateCode: string): Promise<CityOption[]> {
    return delay(CITIES.filter((c) => c.stateCode === stateCode));
  },

  async getMills(): Promise<Mill[]> {
    return delay(MILLS);
  },

  async getMillsByState(stateCode: string): Promise<Mill[]> {
    return delay(MILLS.filter((m) => m.state === stateCode));
  },

  async getCountries(): Promise<CountryOption[]> {
    return delay(COUNTRIES);
  },

  async getCurrencies(): Promise<CurrencyOption[]> {
    return delay(CURRENCIES);
  },
};
