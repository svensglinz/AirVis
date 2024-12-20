export interface RentalSummary {
  category: string;
  count: number;
  percentage: number;
}

export interface HistogramData {
  bin: string;
  count: number;
}

export interface ShortTermRentalData {
  summary: RentalSummary[];
  histogram: HistogramData[];
}

export const fetchShortTermRentals = async (location: string): Promise<ShortTermRentalData> => {
  const response = await fetch(`/shortTermRentals/${location}`);
  if (!response.ok) {
    throw new Error("Failed to fetch short-term rentals data");
  }
  return response.json();
};
