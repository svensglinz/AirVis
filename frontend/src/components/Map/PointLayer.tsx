import {Marker, useMap} from "react-leaflet";
import {useGlobalState} from "../../context/state.tsx";
import L from "leaflet";
import {useEffect, useRef, useState} from "react";

const dotIcon = L.divIcon({
  className: "custom-dot", // CSS class for styling
  iconSize: [10, 10], // Size of the dot
});

function PointLayer() {
  const {displayData, location} = useGlobalState();
  const curLocation = useRef<string>(location);
  const map = useMap();
  const activePopup = useRef<L.Popup | null>(null);

  const [markersVisible, setMarkersVisible] = useState(false);

  // Render markers
  function renderMarkers() {
    return displayData.map((elem) => (
      <Marker
        key={elem.id}
        position={[parseFloat(elem.latitude), parseFloat(elem.longitude)]}
        icon={dotIcon}
        eventHandlers={{
          add: (e) => {
            const marker = e.target;
            marker.bindPopup(
              `<div style="padding: 0; margin: 0;">
                  <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">
                    ${elem.name || "No Name"}
                  </div>
                  <hr/>
                  <p style="font-style: italic;">Review Scores (1-5):</p>
                  <ul style="list-style: none; display: flex; padding: 0; margin: 0;">
                      <li style="text-align: center; margin-right: 10px;"><b>Overall:</b><br> ${
                elem.review_rating || "No Reviews"
              }</li>
                      <li style="text-align: center; margin-right: 10px;"><b>Value for Money:</b><br>${
                elem.review_value || "No Reviews"
              }</li>
                      <li style="text-align: center;"><b>Location:</b><br> ${
                elem.review_location || "No Reviews"
              }</li>
                  </ul>
                  <hr/>
                  <b>Price per Night:</b> CHF ${elem.price || "Not Available"}
                </div>`
            );

            // Open popup on hover
            marker.on("mouseover", () => {
              if (activePopup.current == null)
                marker.openPopup();
            });

            // Close popup on mouseout
            marker.on("mouseout", () => {
              if (activePopup.current == null)
                marker.closePopup();
            });

            marker.on("click", () => {
              if (activePopup.current != null) {
                activePopup.current.close();
                activePopup.current = null;
              } else {
                activePopup.current = marker;
                marker.openPopup();
              }
            })
          },
        }}
      />
    ));
  }

  // popup is closed when clicking next to it automatically
  // set ref to null as well
  map.on("click", () => {
    activePopup.current = null;
  })

  // Effect to handle location changes
  useEffect(() => {
    if (location === "all" || displayData.length > 1000) {
      setMarkersVisible(false);
      return;
    }

    // If location changes, wait for the map to finish moving
    if (location !== curLocation.current) {
      setMarkersVisible(false); // Hide markers while the map moves
      map.once("moveend", () => {
        setMarkersVisible(true); // Show markers after map movement ends
        curLocation.current = location; // Update the reference
      });
    } else {
      // Show markers immediately if location hasn't changed
      setMarkersVisible(true);
    }
  }, [location, displayData, map]);

  // Render conditionally based on markersVisible state
  return markersVisible ? <>{renderMarkers()}</> : null;
}

export default PointLayer;
