import { NextRequest, NextResponse } from "next/server";

// Simple rate limiter for Nominatim (1 req/sec)
let lastNominatimRequest = 0;

async function geocodeWithNominatim(
  lat: string,
  lon: string
): Promise<{ city: string; state: string }> {
  // Enforce 1 request per second
  const now = Date.now();
  const timeSinceLast = now - lastNominatimRequest;
  if (timeSinceLast < 1000) {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 - timeSinceLast)
    );
  }
  lastNominatimRequest = Date.now();

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
    {
      headers: {
        "User-Agent": "Timecard/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nominatim request failed");
  }

  const data = await response.json();
  const address = data.address || {};

  return {
    city: address.city || address.town || address.village || address.hamlet || "",
    state: address.state || "",
  };
}

async function geocodeWithGoogle(
  lat: string,
  lon: string,
  apiKey: string
): Promise<{ city: string; state: string }> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Google Geocoding request failed");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return { city: "", state: "" };
  }

  let city = "";
  let state = "";

  for (const result of data.results) {
    for (const component of result.address_components) {
      if (component.types.includes("locality") && !city) {
        city = component.long_name;
      }
      if (
        component.types.includes("administrative_area_level_1") &&
        !state
      ) {
        state = component.short_name;
      }
    }
    if (city && state) break;
  }

  return { city, state };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon query parameters are required" },
      { status: 400 }
    );
  }

  try {
    const googleApiKey = process.env.GOOGLE_GEOCODING_API_KEY;

    let result: { city: string; state: string };

    if (googleApiKey) {
      result = await geocodeWithGoogle(lat, lon, googleApiKey);
    } else {
      result = await geocodeWithNominatim(lat, lon);
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Geocoding failed" },
      { status: 500 }
    );
  }
}
