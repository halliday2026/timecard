"use client";

import { useState, useEffect, useCallback } from "react";

interface LocationData {
  city: string;
  state: string;
  loading: boolean;
  error: string | null;
}

const CACHE_KEY = "timecard_last_location";

function getCachedLocation(): { city: string; state: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedLocation(city: string, state: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ city, state }));
  } catch {
    // localStorage not available
  }
}

export function useGeolocation(): LocationData & { refresh: () => void } {
  const cached = getCachedLocation();
  const [city, setCity] = useState(cached?.city || "");
  const [state, setState] = useState(cached?.state || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000, // Cache for 5 minutes
          });
        }
      );

      const { latitude, longitude } = position.coords;
      // Round to 4 decimal places (~11m precision) for cache efficiency
      const lat = latitude.toFixed(4);
      const lon = longitude.toFixed(4);

      const response = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);

      if (!response.ok) {
        throw new Error("Failed to reverse geocode");
      }

      const data = await response.json();

      if (data.city || data.state) {
        setCity(data.city);
        setState(data.state);
        setCachedLocation(data.city, data.state);
      }
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied. Enter your city/state manually.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location unavailable. Enter your city/state manually.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out. Enter your city/state manually.");
            break;
        }
      } else {
        setError("Could not determine location. Enter your city/state manually.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { city, state, loading, error, refresh: fetchLocation };
}
