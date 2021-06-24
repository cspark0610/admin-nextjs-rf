import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

export default function Map() {
    const [map, setMap] = React.useState(null)
    const containerStyle = {
        width: '100%',
        height: '600px'
      };
    const center = {
    lat: -3.745,
    lng: -38.523
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
          center={center}
          zoom={10}
          onUnmount={onUnmount}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          <></>
        </GoogleMap>
    ) : <></>
}
