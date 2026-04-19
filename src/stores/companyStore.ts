import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";

/** Matches the `companies` table in Supabase. */
export type Company = {
  id: string;
  company_name: string;
  industries: string[];
  hq_location: string;
  business_operating_locations: string[];
  description: string;
  created_at: string;
};

type CompanyStore = {
  companies: Company[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: [],
  loading: false,
  error: null,
  fetchCompanies: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("company_name", { ascending: true });

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    set({ companies: (data ?? []) as Company[], loading: false, error: null });
  },
}));
