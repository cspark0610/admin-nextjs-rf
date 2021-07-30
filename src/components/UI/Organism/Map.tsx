import { useRef, useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader"

let marker: google.maps.Marker

const defaultOptions = {
  center: {
    lat: 56.130367,
    lng: -106.346771,
  },
  zoom: 5,
}

interface IMaps {
    position?: {lat: number, lng: number},
    options?: google.maps.MarkerOptions
}

const Map = ({ setDataMarker, position, options = defaultOptions }) => {

  const mapRef = useRef(null)

  const loader = new Loader({
    apiKey: 'AIzaSyBA6CMSKf1VIijJRH8Q8d9qGk8ZL4APhF0',
    version: 'weekly',
    // libraries: ['places']
  })

  const [map, setMap] = useState<google.maps.Map>(null);

  function drawMarker(position) {
    if (marker) {
      setDataMarker({
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
      })
      return marker.setPosition(position)
    }
    marker = new google.maps.Marker({
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

  function mapEvent(ev) {
    drawMarker(ev.latLng)
  }

  useEffect(() => {
    loader
    .load()
      .then((google) => {
        const item = new google.maps.Map(mapRef.current, options)
        setMap(item)
      })
      .catch(e => {
        console.error(e)
      })
      return () => {
        loader
          .deleteScript()
      };
  }, []);
  useEffect(() => {
    if (map) {
      drawMarker(position)
      map.addListener('click', (mapEvent))
    }
    return () => {
      loader
          .deleteScript()
    }
  }, [map]);

  return (
    <>
      <div onClick={() => {mapEvent}} ref={mapRef} style={{width:'100%', height:'50vh'}} />
    </>
  );
}

export default Map;
