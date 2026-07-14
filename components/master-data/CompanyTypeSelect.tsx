"use client";

import { MasterSelect, type MasterSelectProps } from "./MasterSelect";
import { masterDataService } from "@/services/masterDataService";
import type { CompanyTypeOption } from "@/types/master-data";

type CompanyTypeSelectProps = Omit<MasterSelectProps<CompanyTypeOption>, "fetcher" | "getOption">;

/** CompanyTypeSelect — business type dropdown, sourced from masterDataService.getCompanyTypes(). */
export function CompanyTypeSelect(props: CompanyTypeSelectProps) {
  return <MasterSelect {...props} fetcher={masterDataService.getCompanyTypes} placeholder={props.placeholder ?? "Select business type"} />;
}
