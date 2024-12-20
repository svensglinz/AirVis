import {useMap} from "react-leaflet";
import {useEffect, useRef} from "react";
import {useGlobalState} from "../../context/state.tsx";
import * as turf from '@turf/turf';
import L from 'leaflet';
import {GeoJsonProperties} from 'geojson';

const styleNeighborhood : GeoJsonProperties = {
  fillColor: 'grey', // Blue fill color for neighborhoods
  weight: 2,            // Outline weight
  opacity: 1,
  fillOpacity: 0.3,     // Fill opacity
  color: "transparent"
};

function KreisBoundaries({data}: { data: any }) {
  const map = useMap();
  const {location} = useGlobalState();
  const geoJsonLayer = useRef<L.GeoJSON | null>(null);

  // Effect to update bounds when filters.location changes
  useEffect(() => {
    let currentBounds = null;

    if (location == "all") {
      const zoom = Math.min(Math.max(Math.max(window.innerWidth, 573) / 90, 13.2), 12.5);
      map.flyTo([47.3769, 8.5417], zoom);
      currentBounds = null;
    } else if (data != null) {

      currentBounds = data.features.filter((val: { properties: { neighbourhood_group: string; }; }) => {
        return val.properties.neighbourhood_group != location;
      })
      const curKreis = data.features.filter((val: { properties: { neighbourhood_group: string; }; }) => {
        return val.properties.neighbourhood_group == location;
      })

      let coords: number[][] = [];
      // @ts-ignore
      curKreis.forEach(k => {
        coords.push(k.geometry.coordinates.flat());
      })

      // @ts-ignore
      let d = turf.polygon([].concat(...coords));
      let center = turf.centroid(d);

      if (center.geometry.coordinates != null) {
        const coords = center.geometry.coordinates;
        const zoom = Math.min(Math.max(Math.max(window.innerWidth, 573) / 135, 13.2), 18);

        map.flyTo([coords[1], coords[0]], zoom);
      }
    }

    if (geoJsonLayer.current) {
      map.removeLayer(geoJsonLayer.current);
      geoJsonLayer.current = null;
    }

    map.once("moveend", () => {
      const geoJSONLayerNew = L.geoJSON(currentBounds, styleNeighborhood);
      geoJSONLayerNew.addTo(map);
      geoJsonLayer.current = geoJSONLayerNew;
    })

    return () => {
      if (geoJsonLayer.current)
        map.removeLayer(geoJsonLayer.current);
    }
  }, [location]);  // Dependency on filters.location
  return null;
}

export default KreisBoundaries;