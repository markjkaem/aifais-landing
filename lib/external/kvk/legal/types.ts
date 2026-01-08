/**
 * Legal Status Types
 *
 * Type definitions for bankruptcy, insolvency, and official announcements data.
 */

export interface InsolvencyRecord {
  publicatieNummer: string;
  type: "faillissement" | "surseance" | "schuldsanering" | "onbekend";
  status: "uitgesproken" | "beeindigd" | "omgezet" | "vernietigd";
  datumUitspraak: string; // ISO date
  datumEinde?: string; // ISO date
  rechtbank: string;
  insolventienummer: string;
  curator?: {
    naam: string;
    adres?: string;
    telefoon?: string;
  };
  bewindvoerder?: {
    naam: string;
    adres?: string;
  };
  schuldenaar: {
    naam: string;
    kvkNummer?: string;
    adres?: string;
  };
  publicatieUrl: string;
}

export interface AnnouncementRecord {
  id: string;
  type: AnnouncementType;
  titel: string;
  inhoud: string;
  datum: string; // ISO date
  bron: "staatscourant" | "rechtspraak" | "kvk";
  url: string;
  gerelateerdeKvk?: string;
}

export type AnnouncementType =
  | "oprichting"
  | "ontbinding"
  | "liquidatie"
  | "fusie"
  | "splitsing"
  | "naamswijziging"
  | "adreswijziging"
  | "statutenwijziging"
  | "bestuurswijziging"
  | "faillissement"
  | "surseance"
  | "schuldsanering"
  | "overig";

export interface LegalSearchParams {
  kvkNummer?: string;
  companyName?: string;
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
}

export interface RechtspraakSearchResult {
  records: InsolvencyRecord[];
  total: number;
  query: {
    kvkNummer?: string;
    naam?: string;
  };
}

export interface BekendmakingenSearchResult {
  announcements: AnnouncementRecord[];
  total: number;
  query: {
    kvkNummer?: string;
    naam?: string;
    dateRange?: { from: string; to: string };
  };
}
