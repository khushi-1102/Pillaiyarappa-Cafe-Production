// Delivery Radius and Smart Validation Utility for Pillaiyarappa South Indian Corner
// Direct deliveries via in-house delivery partner are strictly within a 3.0 km radius.
// Deliveries beyond 3.0 km are seamlessly routed to Zomato & Swiggy.

export const MAX_DIRECT_DELIVERY_RADIUS_KM = 3.0;
export const MIN_FREE_DELIVERY_AMOUNT = 500;

export interface BranchLocation {
  id: string;
  name: string;
  shortName: string;
  address: string;
  lat: number;
  lng: number;
  zomatoUrl: string;
  swiggyUrl?: string;
}

export const BRANCH_LOCATIONS: BranchLocation[] = [
  {
    id: 'branch-1',
    name: 'Branch - 1 (South City-1)',
    shortName: 'South City-1',
    address: 'Shop No. 3, Opp. Mayom Hospital, South City-1, Gurugram',
    lat: 28.4552,
    lng: 77.0673,
    zomatoUrl: 'https://zomato.onelink.me/xqzv/gj35mxzd',
    swiggyUrl: 'https://www.swiggy.com/menu/759351?source=sharing',
  },
  {
    id: 'branch-2',
    name: 'Branch - 2 (Sector-40 Huda Market)',
    shortName: 'Sector-40',
    address: 'Shop No. 48, Sec-40, Huda Market, Gurugram',
    lat: 28.4485,
    lng: 77.0585,
    zomatoUrl: 'https://zomato.onelink.me/xqzv/eexteimj',
  },
];

// Curated list of popular Gurugram localities/sectors with verified distances & coordinates
export interface SectorPreset {
  name: string;
  category: 'within_3km' | 'beyond_3km';
  approxDistanceKm: number;
  closestBranch: string;
  lat: number;
  lng: number;
}

export const GURUGRAM_SECTOR_PRESETS: SectorPreset[] = [
  // Within 3 KM (Eligible for In-House Delivery)
  { name: 'South City-1', category: 'within_3km', approxDistanceKm: 0.3, closestBranch: 'South City-1', lat: 28.4552, lng: 77.0673 },
  { name: 'Sector 40', category: 'within_3km', approxDistanceKm: 0.2, closestBranch: 'Sector-40', lat: 28.4485, lng: 77.0585 },
  { name: 'Sector 41', category: 'within_3km', approxDistanceKm: 0.9, closestBranch: 'South City-1', lat: 28.4580, lng: 77.0620 },
  { name: 'Sector 39', category: 'within_3km', approxDistanceKm: 1.1, closestBranch: 'Sector-40', lat: 28.4450, lng: 77.0510 },
  { name: 'Sector 46', category: 'within_3km', approxDistanceKm: 1.7, closestBranch: 'Sector-40', lat: 28.4350, lng: 77.0630 },
  { name: 'Sector 31', category: 'within_3km', approxDistanceKm: 1.8, closestBranch: 'South City-1', lat: 28.4620, lng: 77.0520 },
  { name: 'Sector 45', category: 'within_3km', approxDistanceKm: 2.0, closestBranch: 'Sector-40', lat: 28.4420, lng: 77.0720 },
  { name: 'Sector 38 / Medanta', category: 'within_3km', approxDistanceKm: 2.3, closestBranch: 'Sector-40', lat: 28.4380, lng: 77.0420 },
  { name: 'HUDA City Centre / Sec 29', category: 'within_3km', approxDistanceKm: 1.9, closestBranch: 'South City-1', lat: 28.4600, lng: 77.0725 },
  { name: 'Sector 47', category: 'within_3km', approxDistanceKm: 2.6, closestBranch: 'Sector-40', lat: 28.4280, lng: 77.0580 },
  { name: 'Sushant Lok-1 / Sec 43', category: 'within_3km', approxDistanceKm: 2.7, closestBranch: 'South City-1', lat: 28.4640, lng: 77.0820 },
  { name: 'Jharsa / Patel Nagar', category: 'within_3km', approxDistanceKm: 1.4, closestBranch: 'Sector-40', lat: 28.4520, lng: 77.0480 },

  // Beyond 3 KM (Redirect to Zomato/Swiggy)
  { name: 'DLF Phase 1, 2, 4', category: 'beyond_3km', approxDistanceKm: 4.5, closestBranch: 'South City-1', lat: 28.4750, lng: 77.0950 },
  { name: 'DLF Phase 3 / Cyber City', category: 'beyond_3km', approxDistanceKm: 5.8, closestBranch: 'South City-1', lat: 28.4910, lng: 77.0880 },
  { name: 'Golf Course Road (Sec 54/55/56)', category: 'beyond_3km', approxDistanceKm: 5.5, closestBranch: 'South City-1', lat: 28.4380, lng: 77.1120 },
  { name: 'Sector 50 / Nirvana Country', category: 'beyond_3km', approxDistanceKm: 4.2, closestBranch: 'Sector-40', lat: 28.4180, lng: 77.0650 },
  { name: 'Sohna Road (Sec 48/49)', category: 'beyond_3km', approxDistanceKm: 4.8, closestBranch: 'Sector-40', lat: 28.4150, lng: 77.0420 },
  { name: 'Sector 14 / Sector 15', category: 'beyond_3km', approxDistanceKm: 4.6, closestBranch: 'South City-1', lat: 28.4720, lng: 77.0400 },
  { name: 'Palam Vihar / Old Gurugram', category: 'beyond_3km', approxDistanceKm: 8.5, closestBranch: 'South City-1', lat: 28.5080, lng: 77.0250 },
];

// Great-circle Haversine formula calculation in kilometers
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal precision e.g. 1.8
}

// Find closest known Gurugram sector to given coordinates
export function findClosestSectorPreset(lat: number, lng: number): SectorPreset | null {
  let minDistance = Infinity;
  let closestPreset: SectorPreset | null = null;

  for (const preset of GURUGRAM_SECTOR_PRESETS) {
    const dist = calculateHaversineDistanceKm(lat, lng, preset.lat, preset.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestPreset = preset;
    }
  }

  return closestPreset;
}

// Reverse geocode GPS coordinates to a friendly Gurugram address
export async function reverseGeocodeCoords(lat: number, lng: number): Promise<string> {
  const closestSector = findClosestSectorPreset(lat, lng);

  // Fast reverse-geocoding attempt via BigDataCloud client API (CORS enabled, high performance)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2600);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.city || '';
      const parts = [closestSector?.name || locality, 'Gurugram'].filter(Boolean);
      return parts.join(', ');
    }
  } catch {
    // Graceful fallback to closest preset
  }

  if (closestSector) {
    return `${closestSector.name}, Gurugram`;
  }
  return `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)}), Gurugram`;
}

export interface AccurateGpsResult {
  lat: number;
  lng: number;
  accuracyMeters: number;
  mapsUrl: string;
}

// Check Geolocation permission state
export async function checkGeolocationPermissionStatus(): Promise<'granted' | 'prompt' | 'denied' | 'unknown'> {
  try {
    if (typeof window !== 'undefined' && navigator.permissions?.query) {
      const res = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return res.state;
    }
  } catch {
    // Safari and some mobile webviews throw on geolocation permission queries
  }
  return 'unknown';
}

// Acquire Phone Hardware GPS Location with Maximum Precision
export function acquireHighAccuracyGps(
  onProgress?: (message: string) => void
): Promise<AccurateGpsResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return reject(
        new Error('Your device or browser does not support GPS location. Please pick your sector from the list below.')
      );
    }

    onProgress?.('Accessing phone GPS hardware & satellites...');

    let bestPosition: GeolocationPosition | null = null;
    let isResolved = false;

    // Safety timeout: 12 seconds max
    const timeoutTimer = setTimeout(() => {
      if (isResolved) return;
      isResolved = true;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      if (bestPosition) {
        const { latitude, longitude, accuracy } = bestPosition.coords;
        resolve({
          lat: latitude,
          lng: longitude,
          accuracyMeters: Math.round(accuracy),
          mapsUrl: `https://maps.google.com/?q=${latitude.toFixed(5)},${longitude.toFixed(5)}`,
        });
      } else {
        reject(
          new Error('GPS satellite lock timed out. Please make sure Location/GPS is ON in your phone settings and try again.')
        );
      }
    }, 12000);

    let watchId: number | null = null;

    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (isResolved) return;
          const acc = pos.coords.accuracy;

          if (!bestPosition || acc < bestPosition.coords.accuracy) {
            bestPosition = pos;
            onProgress?.(`Phone GPS locked (Accuracy: ±${Math.round(acc)}m)...`);
          }

          // If accuracy is high precision (<= 30 meters), finalize immediately
          if (acc <= 30) {
            isResolved = true;
            clearTimeout(timeoutTimer);
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            const { latitude, longitude } = pos.coords;
            resolve({
              lat: latitude,
              lng: longitude,
              accuracyMeters: Math.round(acc),
              mapsUrl: `https://maps.google.com/?q=${latitude.toFixed(5)},${longitude.toFixed(5)}`,
            });
          }
        },
        (err) => {
          if (isResolved) return;
          isResolved = true;
          clearTimeout(timeoutTimer);
          if (watchId !== null) navigator.geolocation.clearWatch(watchId);

          if (bestPosition) {
            const { latitude, longitude, accuracy } = bestPosition.coords;
            return resolve({
              lat: latitude,
              lng: longitude,
              accuracyMeters: Math.round(accuracy),
              mapsUrl: `https://maps.google.com/?q=${latitude.toFixed(5)},${longitude.toFixed(5)}`,
            });
          }

          let friendlyMsg = 'Could not get exact GPS location. Please select your sector below.';
          if (err.code === 1) {
            friendlyMsg = 'PERMISSION_DENIED: Phone location permission is blocked. Please allow location access in your browser or phone settings to verify exact 3 km delivery.';
          } else if (err.code === 2) {
            friendlyMsg = 'POSITION_UNAVAILABLE: GPS hardware is turned off or has no satellite signal. Please turn on Location in your phone Quick Settings.';
          } else if (err.code === 3) {
            friendlyMsg = 'TIMEOUT: GPS satellite lock took too long. Please ensure GPS is ON and try again.';
          }
          reject(new Error(friendlyMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // CRITICAL: 0 forces fresh GPS fix, no cached cell/IP data!
        }
      );
    } catch {
      clearTimeout(timeoutTimer);
      reject(new Error('Unable to start GPS sensor. Please pick your sector below.'));
    }
  });
}

export interface DeliveryCheckResult {
  status: 'eligible' | 'out_of_range' | 'unknown';
  distanceKm?: number;
  closestBranch?: BranchLocation;
  locationSummary?: string;
  source: 'gps' | 'preset' | 'text' | 'none';
  message: string;
  coords?: {
    lat: number;
    lng: number;
    accuracyMeters?: number;
  };
  mapsUrl?: string;
}

// Check GPS Coordinates against both branches
export function checkDeliveryRadiusByCoords(
  lat: number,
  lng: number,
  accuracyMeters?: number
): DeliveryCheckResult {
  let minDistance = Infinity;
  let nearestBranch = BRANCH_LOCATIONS[0];

  BRANCH_LOCATIONS.forEach((branch) => {
    const dist = calculateHaversineDistanceKm(lat, lng, branch.lat, branch.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestBranch = branch;
    }
  });

  const isEligible = minDistance <= MAX_DIRECT_DELIVERY_RADIUS_KM;
  const closestPreset = findClosestSectorPreset(lat, lng);
  const locationName = closestPreset ? closestPreset.name : 'Gurugram';

  return {
    status: isEligible ? 'eligible' : 'out_of_range',
    distanceKm: minDistance,
    closestBranch: nearestBranch,
    locationSummary: locationName,
    source: 'gps',
    coords: {
      lat,
      lng,
      accuracyMeters,
    },
    mapsUrl: `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`,
    message: isEligible
      ? `Within 3 km direct delivery zone (~${minDistance} km from ${nearestBranch.shortName})`
      : `Location is ~${minDistance} km away (In-house direct rider limit is 3 km)`,
  };
}

// Check User Input Address / Selected Sector
export function checkDeliveryRadiusByText(query: string): DeliveryCheckResult {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return {
      status: 'unknown',
      source: 'none',
      message: 'Enter address or select your sector to check 3 km direct delivery eligibility.',
    };
  }

  // Check against our curated preset list
  const matchedPreset = GURUGRAM_SECTOR_PRESETS.find((preset) =>
    trimmed.includes(preset.name.toLowerCase()) || preset.name.toLowerCase().includes(trimmed)
  );

  if (matchedPreset) {
    const isEligible = matchedPreset.approxDistanceKm <= MAX_DIRECT_DELIVERY_RADIUS_KM;
    const branch =
      BRANCH_LOCATIONS.find((b) => b.shortName.toLowerCase() === matchedPreset.closestBranch.toLowerCase()) ||
      BRANCH_LOCATIONS[0];

    return {
      status: isEligible ? 'eligible' : 'out_of_range',
      distanceKm: matchedPreset.approxDistanceKm,
      closestBranch: branch,
      locationSummary: matchedPreset.name,
      source: 'preset',
      message: isEligible
        ? `Within 3 km direct delivery zone (~${matchedPreset.approxDistanceKm} km from ${branch.shortName})`
        : `Location is ~${matchedPreset.approxDistanceKm} km away (In-house direct rider limit is 3 km)`,
    };
  }

  // Regex rules for sectors clearly within 3 km
  const within3kmPatterns = [
    /\b(south\s*city\s*1|southcity\s*1|sc\s*1)\b/i,
    /\b(sec|sector)\s*(40|41|39|46|31|45|38|47|43|29)\b/i,
    /\b(mayom|huda\s*city|millennium|jharsa|patel\s*nagar|unitech\s*cyber)\b/i,
  ];

  for (const pattern of within3kmPatterns) {
    if (pattern.test(trimmed)) {
      return {
        status: 'eligible',
        distanceKm: 1.5,
        closestBranch: BRANCH_LOCATIONS[0],
        source: 'text',
        message: 'Within 3 km direct delivery zone (Near South City-1 / Sector-40)',
      };
    }
  }

  // Regex rules for areas clearly beyond 3 km
  const beyond3kmPatterns = [
    /\b(dlf|cyber\s*city|golf\s*course|nirvana|sohna\s*road|palam\s*vihar)\b/i,
    /\b(sec|sector)\s*(14|15|17|21|22|23|48|49|50|51|52|53|54|55|56|57|65|66|67|82)\b/i,
  ];

  for (const pattern of beyond3kmPatterns) {
    if (pattern.test(trimmed)) {
      return {
        status: 'out_of_range',
        distanceKm: 5.0,
        closestBranch: BRANCH_LOCATIONS[0],
        source: 'text',
        message: 'Location is beyond our 3 km in-house direct rider radius',
      };
    }
  }

  // If unknown, return neutral state with prompt
  return {
    status: 'unknown',
    source: 'text',
    message: 'Check your sector or click "Detect GPS" to verify 3 km direct delivery.',
  };
}
