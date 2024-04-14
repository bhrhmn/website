import { useEffect, useState } from "react";
import { Map, ZoomControl, Marker, Overlay } from "pigeon-maps";
import { Cluster } from "pigeon-maps-cluster";
import MarkerOverlay from "./MarkerOverlay.tsx";

// Fetch coordinates from backend
const fetchCoordinates = async () => {
  const response = await fetch("http://localhost:8080/map");
  const data = await response.json();
  return data;
};

function MapComponent() {
  // Start position for the map
  const linkoping: [number, number] = [58.4, 15.625278];

  // State for markers so they can be displayed on the map
  const [markersData, setMarkersData] = useState<[number, number, number][]>(
    []
  );

  // State for selected marker so the overlay can be updated
  const [selectedMarker, setSelectedMarker] = useState<
    [number, number, number] | null
  >(null);

  const handleMarkerClick = (marker: [number, number, number]) => {
    setSelectedMarker(marker);
  };

  // Fetch coordinates only once on component mount
  useEffect(() => {
    fetchCoordinates().then((data) => {
      let markersData: [number, number, number][] = data.markers.map(
        (marker: { id: number; lat: number; lng: number }) => [
          marker.id,
          marker.lat,
          marker.lng,
        ]
      );
      setMarkersData(markersData);
    });
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <Map defaultCenter={linkoping} defaultZoom={3} onClick={() => setSelectedMarker(null)}>
      <ZoomControl />
      <Cluster>
        {markersData.map((marker: [number, number, number]) => (
          <Marker
            onClick={() => handleMarkerClick(marker)}
            key={marker[0]} // Unique id for each marker
            anchor={[marker[1], marker[2]]} // Latitude and longitude
          />
        ))}
      </Cluster>
      {selectedMarker && (
        <Overlay
          anchor={[selectedMarker[1], selectedMarker[2]]}
          offset={[120, 79]}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <MarkerOverlay markerID={selectedMarker[0]} />
        </Overlay>
      )}
    </Map>
  );
}

export default MapComponent;
