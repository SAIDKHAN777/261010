-- Migration: Enforce non-negative counters on download_stats and country_stats
-- Compatible with PostgreSQL / Supabase

ALTER TABLE "download_stats"
ADD CONSTRAINT "download_stats_total_nonnegative"
CHECK (total >= 0);

ALTER TABLE "country_stats"
ADD CONSTRAINT "country_stats_downloads_nonnegative"
CHECK (downloads >= 0);
