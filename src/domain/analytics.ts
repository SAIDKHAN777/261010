export interface CountryDownloadStat {
  countryCode: string;
  downloads: number;
  updatedAt: Date;
}

export interface AnalyticsStatsResponse {
  totalDownloads: number;
  countries: Array<{
    country_code: string;
    downloads: number;
  }>;
}
