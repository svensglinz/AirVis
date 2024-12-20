import {useEffect, useRef} from "react";
import {useGlobalState} from "../../context/state.tsx";
import L from 'leaflet';
import {useMap} from "react-leaflet";
import {GeoJsonProperties} from 'geojson';

const style: GeoJsonProperties = {
  fillColor: 'black', // Blue fill color for neighborhoods
  weight: 2,            // Outline weight
  opacity: 1,
  fillOpacity: 0.3,     // Fill opacity
  color: "transparent"
};

// borders are rerendered after every transition for smoother appearance on screen
function CityBoundaries({data}: { data: any }) {
  const map = useMap();
  const {location} = useGlobalState();
  const prevLocation = useRef<string>(location);

  let layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    // ensure borders are rendered on initial load
    if (layerRef.current == null && data != null) {
      layerRef.current = L.geoJSON(data, style);
      layerRef.current.addTo(map);
    }
    else if (layerRef.current != null && prevLocation.current != location && prevLocation.current != null) {
      map.removeLayer(layerRef.current);
      setTimeout(() => {
        map.once("moveend", () => {
          layerRef.current?.addTo(map);
          prevLocation.current = location;
        }, 200)
      })
      return () => {
        if (layerRef.current) {
          map.removeLayer(layerRef.current);
        }
      };
    }
  }, [location, data]);

  return null;
}

export default CityBoundaries;

