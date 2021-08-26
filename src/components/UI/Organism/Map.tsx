import { useRef, useEffect } from 'react';
import { Loader } from "@googlemaps/js-api-loader"

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

  let marker: google.maps.Marker


  const mapRef = useRef(null)

  const loader = new Loader({
    apiKey: 'AIzaSyBA6CMSKf1VIijJRH8Q8d9qGk8ZL4APhF0',
    version: 'weekly',
    // libraries: ['places']
  })

  let map: google.maps.Map

  function drawMarker(position, test) {
    if (marker) {
      setDataMarker({
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
      })
      return marker.setPosition(position)
    }
    marker = new google.maps.Marker({
      position,
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
    marker.setMap(test)
    setDataMarker({
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
    })    
  }

  function initMarkers() {
    if (position !== undefined && position.lat !== undefined && position.lng !== undefined) {
        drawMarker(position, map)
      }
      map.addListener('click', (mapEvent))
  }

  function mapEvent(ev) {
    drawMarker(ev.latLng, map)
  }

  function initialMap(){
    loader
    .load()
      .then((google) => {
        map = new google.maps.Map(mapRef.current, options)
        
        if (map) {
          initMarkers()
    }
      })
      .catch(e => {
        console.error(e)
      })
    
    
  }

  useEffect(() => {
    initialMap()
  }, []);

  return (
    <>
      <div onClick={() => {mapEvent}} ref={mapRef} style={{width:'100%', height:'50vh'}} />
    </>
  );
}

export default Map;