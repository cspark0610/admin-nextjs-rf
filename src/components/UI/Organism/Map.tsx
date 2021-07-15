import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

const center = {
lat: -3.745,
lng: -38.523
};

export default function Map( {familyCenter = center, markers = null} ) {
    const [map, setMap] = React.useState(null)
    const containerStyle = {
        width: '100%',
        height: '600px'
      };
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBA6CMSKf1VIijJRH8Q8d9qGk8ZL4APhF0"
      })
    // const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds();
    // map.fitBounds(bounds);
    // setMap(map)
    //   }, [])      
    const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
    }, [])
    return isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={familyCenter.lat ? familyCenter : center}
          zoom={10}
          onUnmount={onUnmount}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          {
            markers?.map((marker, idx) => (
              <Marker
                key={idx}
                position={{ lat: marker.lat, lng: marker.lng }}
                // onClick={() => setDetails(marker)}
                icon={{
                  url: marker.icon,
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15)
                }}
              />
            ))
          }
        </GoogleMap>
    ) : <></>
}
