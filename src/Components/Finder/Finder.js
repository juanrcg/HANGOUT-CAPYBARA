import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Feed_Header from "../User/feed_header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import SubMenu from "./SubMenu";

const loadGoogleMapsScript = (callback) => {
  if (!window.google) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
  } else {
    callback();
  }
};

const BusinessFinder = () => {
  const [businesses, setBusinesses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchKeyword = params.get("keyword") || "restaurant"; // Default search
    setKeyword(searchKeyword);
  }, [location]);

  useEffect(() => {
    if (!keyword) return;

    loadGoogleMapsScript(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });

            // Fetch city name
            fetchCityName(latitude, longitude);

            // Fetch businesses from Google Places API
            fetchNearbyBusinesses(latitude, longitude, keyword);
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Geolocation is required for this feature.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    });
  }, [keyword]);

  const fetchCityName = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const addressComponents = results[0].address_components;
        const cityComponent = addressComponents.find((component) =>
          component.types.includes("locality")
        );
        setCity(cityComponent ? cityComponent.long_name : "Unknown City");
      } else {
        console.error("Geocoder failed:", status);
      }
    });
  };

  const fetchNearbyBusinesses = (lat, lng, searchQuery) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps JavaScript API is not loaded.");
      return;
    }

    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 5000,
      keyword: searchQuery,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const formattedBusinesses = results.map((place) => ({
          name: place.name,
          address: place.vicinity,
          status: place.business_status === "OPERATIONAL" ? "Open" : "Closed",
        distance: getDistance(lat, lng, place.geometry.location.lat(), place.geometry.location.lng()),
        geometry: place.geometry,
    }));

        setBusinesses(formattedBusinesses);
      } else {
        console.error("Places API request failed:", status);
      }
    });
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2) + " km";
  };
  const openNavigation = (latitude, longitude) => {
    // Make sure to handle numbers correctly by parsing latitude and longitude
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
        console.error('Invalid coordinates');
        return;
    }

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    const wazeUrl = `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;

    // Try opening Waze first
    const wazeWindow = window.open(wazeUrl, '_blank');

    setTimeout(() => {
        if (!wazeWindow || wazeWindow.closed) {
            // Fallback to Google Maps if Waze doesn't open
            window.open(googleMapsUrl, '_blank');
        }
    }, 500);
};



  return (
    <>
    <Feed_Header />
    <SubMenu keyword={keyword} />
    <div className="container mt-4 text-white bg-dark p-4 rounded">
      <h2 className="fw-bold">Nearby "{keyword}" Places</h2>
      {city && (
        <p className="mt-2">
          <strong>My Location:</strong> {city}
        </p>
      )}
      <ul className="list-group mt-3">
        {businesses.length > 0 ? (
          businesses.map((business, index) => (
            <li key={index} className="list-group-item bg-secondary text-white d-flex justify-content-between align-items-center">
              <div>
                <strong>{business.name}</strong> - {business.address} <br />
                Status:{" "}
                <span className={business.status === "Open" ? "text-success fw-bold" : "text-danger fw-bold"}>
                  {business.status}
                </span>{" "}
                | {business.distance}
              </div>
    
              {/* Navigation Button */}
              <button
                className="btn btn-dark"
                onClick={() => openNavigation(business.geometry.location.lat(), business.geometry.location.lng())}
                title="Get Directions"
              >
                <FontAwesomeIcon icon={faCar} />
              </button>
            </li>
          ))
        ) : (
          <p>No businesses found.</p>
        )}
      </ul>
    </div>
    </>
  );
};

export default BusinessFinder;
