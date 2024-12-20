import {useMap} from "react-leaflet";
import {useEffect, useRef} from "react";
import {useGlobalState} from "../../context/state.tsx";
import L from "leaflet";

function HeatLayer() {
  const map = useMap();
  const {location, displayData} = useGlobalState();
  const curLocation = useRef<string>(location);
  // @ts-ignore
  const layerRef = useRef<L.HeatLayer | null>(null);

  // Function to render the heat layer
  function renderHeatLayer(heatData: any) {
    if (!heatData || heatData.length === 0) {
      return;
    }

    // Add heat layer only for "all" location
    if (location === "all" && heatData.length > 0) {
      // Add the layer if not already present
      if (!layerRef.current) {
        // @ts-ignore
        const layer = L.heatLayer(heatData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
        });

        try {
          layer.addTo(map);
        } catch (e) {
        }
        layerRef.current = layer;
      } else {
        // Update heatmap data dynamically if already present
        layerRef.current.setLatLngs(heatData);
      }
    } else {
      // Remove the heat layer if the location is not "all"
      if (layerRef.current && map.hasLayer(layerRef.current)) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    }
  }

  // Effect to handle map and location changes
  useEffect(() => {
    const heatData = displayData?.map((coord) => [
      parseFloat(coord.latitude),
      parseFloat(coord.longitude),
      0.5, // Intensity
    ]);

    // Only render heat layer after the location changes and map movement ends
    if (location !== curLocation.current) {
      // Wait for the map to complete the movement
      map.once("moveend", () => {
        renderHeatLayer(heatData);
        curLocation.current = location; // Update the reference to the new location
      });
    } else {
      renderHeatLayer(heatData); // Render the heat layer directly if the location hasn't changed
    }

    // Cleanup the heat layer when location changes or the component unmounts
    return () => {
      if (layerRef.current && map.hasLayer(layerRef.current)) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [location, displayData]);

  return null;
}

export default HeatLayer;
