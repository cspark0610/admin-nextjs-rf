// import React from 'react'
// import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

// let center = {
// lat: -3.745,
// lng: -38.523
// };

// // type map = {
// //     obligatoria: string
// //     opcional?: number | loquesea
// // }

// export default function Map({ familyCenter = center, marker = null, setMarker, changeMark = false }) {
//     const [map, setMap] = React.useState(null)
//     const containerStyle = {
//         width: '100%',
//         height: '600px'
//       };
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBA6CMSKf1VIijJRH8Q8d9qGk8ZL4APhF0"
//       })
//     // const onLoad = React.useCallback(function callback(map) {
//     // const bounds = new window.google.maps.LatLngBounds();
//     // map.fitBounds(bounds);
//     // setMap(map)
//     //   }, [])      
  
//   const handleClick = (e) => {
//     if (changeMark) {
//       setMarker([{
//         lat: e.latLng.lat(),
//         lng: e.latLng.lng(),
//         icon: '/assets/icons/map/House.svg'
//       }])
//     }
//   }
  
//     const onUnmount = React.useCallback(function callback(map) {
//     setMap(null)
//     }, [])
//     return isLoaded ? (
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={familyCenter.lat ? familyCenter : center}
//           zoom={10}
//           onUnmount={onUnmount}
//           onClick={handleClick}
//         >
//           { /* Child components, such as markers, info windows, etc. */ }
//           {
//             marker?.map((marker, idx) => (
//               <Marker
//                 key={idx}
//                 position={{ lat: marker.lat, lng: marker.lng }}
//                 // onClick={() => setDetails(marker)}
//                 icon={{
//                   url: marker.icon,
//                   // scaledSize: new window.google.maps.Size(30, 30),
//                   // origin: new window.google.maps.Point(0, 0),
//                   // anchor: new window.google.maps.Point(15, 15)
//                 }}
//               />
//             ))
//           }
//         </GoogleMap>
//     ) : <></>
// }

import { useRef, useEffect, useState } from 'react';

let map: google.maps.Map

let marker: google.maps.Marker

// interface IMaps {
//     position?: {lat: number, lng: number},
//     options?: google.maps.MarkerOptions
// }

const Map = ({ setDataMarker, position, options }) => {

  const markers = []

  const coorditanes = [
    {
    lat: 15.284185,
    lng: 22.053289
    },
    {
    lat: 13.284185,
    lng: 22.053289
    },
    {
    lat: 11.284185,
    lng: 22.053289
    },
    {
    lat: 12.284185,
    lng: 22.053289
    },
  ]

  const mapRef = useRef()

  const handleClick = (e) => {
    map.addListener('click',((e) => drawMarker(e.latLng)))
  }

  function drawMarker(position) {
    if (marker) {
      setDataMarker({
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
      })
      return marker.setPosition(position)
    }
    marker = new window.google.maps.Marker({
      position,
      map,
      icon: {
        url: '/assets/icons/map/House.svg',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(30, 30),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(15, 15),
      }
    })
    setDataMarker({
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
      })
  }

  function drawMarkers (positions) {
    positions.map((position) => {
      const marker: google.maps.Marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(position.lat, position.lng),
        map
      })
    })
  }


  const removeMarker = () => {
    if (markers.length !== 0) {
      markers.map((marker) => {
        marker.setMap(null)
      })
    }
  }

  useEffect(() => {
    function initMap () {
      map = new window.google.maps.Map(mapRef.current, {center: { lat: 37.090, lng: -95.712  }, zoom: 5})
    }

    initMap()
    drawMarker(position)
  }, []);


  return (
    <>
      <div onClick={handleClick} id='Map' ref={mapRef} style={{width:'100%', height:'50vh'}} />
    </>
  );
}

export default Map;
