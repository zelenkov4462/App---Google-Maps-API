import { Map, MODES } from "./components/Map";
import { useJsApiLoader } from "@react-google-maps/api";
import { Autocomplete } from "./components/Autocomplete";

import s from "./App.module.css";
import { useCallback, useEffect, useState } from "react";
import { getBrowserLocation } from "./utils/geo";

const API_KEY = process.env.REACT_APP_API_KEY;

const libraries = ["places"];

const defaultCenter = {
  lat: 55.7522,
  lng: 37.6156,
};
function App() {
  const [center, setCenter] = useState(defaultCenter);
  const [mode, setMode] = useState(MODES.MOVE);
  const [markers, setMarkers] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const onPlaceSelect = useCallback((coordinates) => {
    setCenter(coordinates);
  }, []);

  const toggleMode = useCallback(() => {
    switch (mode) {
      case MODES.MOVE:
        setMode(MODES.SET_MARKER);
        break;
      case MODES.SET_MARKER:
        setMode(MODES.MOVE);
        break;
      default:
        setMode(MODES.MOVE);
    }
    console.log(mode);
  }, [mode]);

  const onMarkerAdd = useCallback(
    (coordinates) => {
      setMarkers([...markers, coordinates]);
    },
    [markers]
  );

  const clear = useCallback(() => {
    setMarkers([]);
  }, []);

  useEffect(() => {
    getBrowserLocation()
      .then((corLoc) => {
        setCenter(corLoc);
      })
      .catch((defaultLocation) => {
        setCenter(defaultLocation);
      });
  }, []);

  return (
    <div>
      <div className={s.addressSearchContainer}>
        <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect} />
        <button onClick={toggleMode} className={s.modeToggle}>
          Set markers
        </button>
        <button onClick={clear} className={s.modeToggle}>
          Clear
        </button>
      </div>
      {isLoaded ? (
        <Map
          center={center}
          mode={mode}
          markers={markers}
          onMarkerAdd={onMarkerAdd}
        />
      ) : (
        <h2>Loading</h2>
      )}
    </div>
  );
}

export default App;
