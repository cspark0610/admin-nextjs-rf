import { useRef, useEffect, useMemo, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const defaultOptions = {
  center: {
    lat: 56.130367,
    lng: -106.346771,
  },
  zoom: 5,
}

interface IMaps {
  position?: { lat: number; lng: number }
  options?: google.maps.MarkerOptions
}

const Map = ({
  setDataMarker,
  position,
  options = defaultOptions,
  iconType = 'house',
}: any) => {
  let [marker, setMarker] = useState<any>(null)

  let [map, setMap] = useState<any>(null)

  const mapRef = useRef<HTMLDivElement>(null)

  const actualPosition = useMemo(() => position, [position])

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
        version: 'weekly',
      }),
    []
  )

  useEffect(() => {
    if (loader) {
      loader
        .load()
        .then((google) => {
          setMap(new google.maps.Map(mapRef.current as HTMLElement, options))
          setMarker(
            new google.maps.Marker({
              icon: {
                url:
                  iconType === 'house'
                    ? '/assets/icons/map/House.svg'
                    : '/assets/icons/map/School.svg',
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(30, 30),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(15, 15),
              },
            })
          )
        })
        .catch((e) => console.error(e))
    }
  }, [loader, iconType, options])

  useEffect(() => {
    if (marker && map) {
      marker.setPosition(actualPosition)
      // map.panTo(options.center)
    }
  }, [actualPosition, marker, map, options])

  useEffect(() => {
    if (marker && map) marker.setMap(map)
  }, [marker, map])

  useEffect(() => {
    if (map)
      map.addListener('click', (ev: any) =>
        setDataMarker({
          lat: ev.latLng.lat(),
          lng: ev.latLng.lng(),
        })
      )
  }, [map])

  useEffect(() => {
    if (map) {
      map.setCenter(options.center)
      map.setZoom(options.zoom)
    }
  }, [options.center, options.zoom])

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '50vh' }} />
    </>
  )
}

export default Map
