import {MapContainer, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {useEffect, useState} from "react";
import "leaflet.heat";
import ActionButton from "./ActionButton.tsx";
import HeatLayer from "./Map/HeatLayer.tsx";
import KreisBoundaries from "./Map/KreisBoundaries.tsx";
import PointLayer from "./Map/PointLayer.tsx";
import CityBoundaries from "./Map/CityBoundaries.tsx";

const ResizeContainer = function ({width1, width2}: { width1: boolean, width2: boolean}) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize({pan: false})
    }, 500) // wait until sidebar is completely closed
  }, [map, width1, width2]);
  return null;
}

function Map({width1, width2} : { width1: boolean, width2 : boolean}) {


  // map layers
  const [cityBounds, setCityBounds] = useState<any>(null);
  const [kreisBounds, setKreisBounds] = useState<any>(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/geojson'); // Replace with your GeoJSON file path
        const data = await response.json();
        setCityBounds(data); // Set the GeoJSON data to state
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };
    fetchGeoJSON();
  }, []);

  useEffect(() => {
    const fetchGeoNeighbourhood = async () => {
      const response = await fetch('/geojsonNeighbourhood'); // Replace with your GeoJSON file path
      const data = await response.json();

      setKreisBounds(data); // Set the GeoJSON data to state
    }
    fetchGeoNeighbourhood();
  }, []);


  return (
    <>
      {/*<SmoothZoom geoJSON={geoJSON} map={mapRef}/>*/}

      <MapContainer
        center={[47.3769, 8.517]} // Default center of the map (latitude, longitude)
        zoom={14} // Zoom level
        className="container-fluid"
      >
        <ResizeContainer width1={width1} width2={width2}/>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <ActionButton/>
        <CityBoundaries data={cityBounds}/>
        <KreisBoundaries data={kreisBounds}/>
        <HeatLayer/>
        <PointLayer/>
      </MapContainer>
    </>
  );
}

export default Map;
