import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';

// Define the type for the filters
interface Filters {
  [key: string]: any;
}

// define layout for data
interface Data {
  id: number;
  location: string;
  longitude: string;
  latitude: string;
  price: number;
  roomType: string; // encode room type as a number
  amenities: string[];
  bedrooms: number,
  bathrooms: number,
  beds: number,
  name: string,
  review_location: number,
  review_rating: number,
  review_value: number
}

// Create the context to hold the global state
const GlobalStateContext = createContext<{
  filters: Filters;
  setFilter: (filterName: string, value: any) => void;
  location: string,
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  listings: Data[];
  displayData: Data[];
  setDisplayData: React.Dispatch<React.SetStateAction<Data[]>>;
} | undefined>(undefined);

// Custom hook to access the context
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

// GlobalStateProvider component to manage state
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({children}) => {

  // default filter values here (some random values for now)
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    location: 'all',
    maxPrice: Number.MAX_VALUE,
    roomType: 'any',
    amenities: [],
    bedrooms: 0, // 0 means "any"
    bathrooms: 0,
    beds: 0,
  });

  const [location, setLocation] = useState<string>('all');

  // Function to update a specific filter
  const setFilter = (filterName: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const [displayData, setDisplayData] = useState<Data[]>([]);
  const [listings, setListings] = useState<Data[]>([]);

  // filter (may become inefficient with too much data) --> store separate variable --> neighborhood map
  useEffect(() => {
    const filteredData = listings.filter(elem => {
      let filterMatch: boolean = elem.price >= filters.minPrice && elem.price <= filters.maxPrice && filters.amenities.every((item : string) => elem.amenities.includes(item));

      if (location != 'all') {
        filterMatch = filterMatch && elem.location == location;
      }
      if (filters.roomType != 'any') {
        filterMatch = filterMatch && elem.roomType == filters.roomType;
      }

      if (filters.bedrooms != 0)
        filterMatch = filterMatch && elem.bedrooms >= filters.bedrooms;

      if (filters.bathrooms != 0)
        filterMatch = filterMatch && elem.bathrooms >= filters.bathrooms;

      if (filters.beds != 0)
        filterMatch = filterMatch && elem.beds >= filters.beds;

      return filterMatch;
    });
    setDisplayData(filteredData);
  }, [filters, listings, location]);

  // load entire dataset on initial page load
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/mapData');
      const rawData = await response.json(); // raw fetched data

      const data: Data[] = rawData.map((item: any) => {
        // Initialize the amenities list
        const amenities: string[] = [];

        // Check if amenities are present and add them to the list
        if (item.hasPool) {
          amenities.push("pool");
        }
        if (item.hasWifi) {
          amenities.push("wifi");
        }
        if (item.hasKitchen) {
          amenities.push("kitchen");
        }
        if (item.hasFreeParking) {
          amenities.push("parking");
        }
        if (item.hasBreakfast) {
          amenities.push("breakfast");
        }

        // Return the transformed data with the amenities list
        return {
          id: item.id,
          location: item.neighbourhood_group_cleansed,
          longitude: item.longitude,
          latitude: item.latitude,
          price: item.price,
          roomType: item.room_type,
          amenities: amenities, // Add the amenities array to the transformed object
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          beds: item.beds,
          name: item.name,
          review_rating: item.review_scores_rating,
          review_value: item.review_scores_value,
          review_location: item.review_scores_location
        };
      });
      setDisplayData(data);
      setListings(data);
    }
    fetchData();
  }, [])

  return (
    <GlobalStateContext.Provider value={{filters, setFilter, listings, displayData, setDisplayData, location, setLocation}}>
      {children}
    </GlobalStateContext.Provider>
  );
};
