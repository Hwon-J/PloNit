import React, { useState, useEffect, useRef } from "react";

function useGPS() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [onSearch, setOnSearch] = useState<boolean>(false);
  const preventDup = useRef<boolean>(true);

  interface GeolocationPosition {
    coords: GeolocationCoordinates;
    timestamp: number;
  }

  function getGPS(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  useEffect(() => {
    if (preventDup.current) {
      console.log(`first search`);
      getGPS()
        .then((response) => {
          const { latitude, longitude } = response.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        })
        .catch((error) => {
          console.error(error);
          alert(`https 환경에서만 GPS를 불러올 수 있습니다.`);
        });
    }

    return () => {
      if (preventDup.current) {
        preventDup.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!preventDup.current && onSearch) {
      console.log(`response to onSearch`);
      getGPS()
        .then((response) => {
          const { latitude, longitude } = response.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        })
        .catch((error) => {
          console.error(error);
          alert(`https 환경에서만 GPS를 불러올 수 있습니다.`);
        });
    }

    return () => {
      setOnSearch(false);
    };
  }, [onSearch]);

  return { latitude, longitude, setOnSearch };
}

export default useGPS;
