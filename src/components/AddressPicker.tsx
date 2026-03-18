"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Check, Loader2 } from "lucide-react";

interface AddressPickerProps {
  onAddressConfirm: (data: {
    address: string;
    lat: number;
    lng: number;
    isHarare: boolean;
  }) => void;
  apiKey: string;
}

const HARARE_CENTER = { lat: -17.8292, lng: 31.0522 };
const HARARE_RADIUS_KM = 30;

function isInHarare(lat: number, lng: number): boolean {
  const R = 6371;
  const dLat = ((lat - HARARE_CENTER.lat) * Math.PI) / 180;
  const dLng = ((lng - HARARE_CENTER.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((HARARE_CENTER.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance <= HARARE_RADIUS_KM;
}

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

const AddressPicker = ({ onAddressConfirm, apiKey }: AddressPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", initMap);
      return;
    }

    window.initGoogleMaps = initMap;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setLoading(false);
      setLoadError(true);
    };
    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current) return;
      setLoading(false);

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: HARARE_CENTER,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const markerInstance = new window.google.maps.Marker({
        map: mapInstance,
        draggable: true,
        position: HARARE_CENTER,
      });

      const geocoder = new window.google.maps.Geocoder();
      geocoderRef.current = geocoder;

      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          markerInstance.setPosition({ lat, lng });
          setSelectedLat(lat);
          setSelectedLng(lng);
          setConfirmed(false);
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              setSelectedAddress(results[0].formatted_address);
            }
          });
        }
      });

      markerInstance.addListener("dragend", () => {
        const pos = markerInstance.getPosition();
        if (pos) {
          const lat = pos.lat();
          const lng = pos.lng();
          setSelectedLat(lat);
          setSelectedLng(lng);
          setConfirmed(false);
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              setSelectedAddress(results[0].formatted_address);
            }
          });
        }
      });

      if (inputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: "zw" },
          }
        );
        autocomplete.bindTo("bounds", mapInstance);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            mapInstance.setCenter({ lat, lng });
            mapInstance.setZoom(15);
            markerInstance.setPosition({ lat, lng });
            setSelectedLat(lat);
            setSelectedLng(lng);
            setSelectedAddress(place.formatted_address || place.name || "");
            setConfirmed(false);
          }
        });
      }

      setMap(mapInstance);
      setMarker(markerInstance);
    }
  }, [apiKey]);

  const handleConfirm = () => {
    if (selectedLat !== null && selectedLng !== null && selectedAddress) {
      setConfirmed(true);
      onAddressConfirm({
        address: selectedAddress,
        lat: selectedLat,
        lng: selectedLng,
        isHarare: isInHarare(selectedLat, selectedLng),
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for your address in Zimbabwe..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm"
          data-testid="input-address-search"
        />
      </div>

      <div className="relative rounded-lg overflow-hidden border border-border">
        {loading && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {loadError && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
            <p className="text-sm text-muted-foreground">Unable to load map. Please enter your address manually.</p>
          </div>
        )}
        <div ref={mapRef} className="w-full h-[250px]" data-testid="map-container" />
      </div>

      {selectedAddress && (
        <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-foreground" data-testid="text-selected-address">
              {selectedAddress}
            </p>
          </div>
          {selectedLat !== null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{isInHarare(selectedLat, selectedLng!) ? "Within Harare" : "Outside Harare"}</span>
            </div>
          )}
          {!confirmed ? (
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full gradient-accent py-2 rounded-lg text-sm font-medium text-secondary-foreground flex items-center justify-center gap-2"
              data-testid="button-confirm-address"
            >
              <Check className="h-4 w-4" />
              Confirm This Address
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium" data-testid="text-address-confirmed">
              <Check className="h-4 w-4" />
              Address confirmed
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { isInHarare };
export default AddressPicker;
