// main tools
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'

// google maps
import { Loader } from '@googlemaps/js-api-loader'

// styles
import classes from 'styles/Map/Map.module.scss'

// types
import { GenericDataType } from 'types/models/Generic'
import { FC } from 'react'

type SchoolsMapProps = {
  handleChangeLocation: (ev: {
    latLng: { lat: () => number; lng: () => number }
  }) => void
  school: GenericDataType
}

export const SchoolsMap: FC<SchoolsMapProps> = ({
  handleChangeLocation,
  school,
}) => {
  const [map, setMap] = useState<google.maps.Map>()
  const [loadMap, setLoadMap] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(5)

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? '',
        version: 'weekly',
      }),
    []
  )

  /**
   * handle draw and set config
   * to map markers
   */
  const drawMarkers = useCallback(() => {
    if (school?.latitude) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(school?.latitude, school?.longitude),
        icon: {
          url: '/assets/icons/map/School.svg',
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15),
          scaledSize: new window.google.maps.Size(30, 30),
        },
        map,
      })
      return marker
    }
    return () => {}
  }, [map, school])

  /**
   * handle load map and render map
   */
  useEffect(() => {
    if (loadMap) {
      loader.load().then(() => {
        setMap(
          new google.maps.Map(mapRef.current as HTMLDivElement, {
            zoom,
            center: {
              lat: school?.latitude ?? 45.50169,
              lng: school?.longitude ?? -73.567253,
            },
          })
        )
      })
    }
    return () => {}
  }, [loadMap, loader, school, zoom])

  /**
   * add markers controllers when the
   * map is already loaded
   */
  map?.addListener('click', (e: any) => {
    setZoom(map.getZoom() as number)

    handleChangeLocation(e)
  })

  /**
   * add markers controllers when the
   * map is already loaded
   */
  useEffect(() => {
    if (map) drawMarkers()
  }, [map, drawMarkers])

  useEffect(() => setLoadMap(true), [])

  return (
    <div className={classes.mapContainer}>
      <div className={classes.map} ref={mapRef} />
    </div>
  )
}
