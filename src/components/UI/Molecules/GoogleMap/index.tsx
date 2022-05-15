// main tools
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'

// google maps
import { Loader } from '@googlemaps/js-api-loader'

// styles
import classes from 'styles/Map/Map.module.scss'

// types
import { FamilyDataType, FamilyLocationDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'

type MapProps = {
  setMarkers: (ev: FamilyLocationDataType) => void
  markers: FamilyLocationDataType
  family: FamilyDataType
  dispatch: Dispatch<{
    payload: FamilyLocationDataType
    type: string
  }>
}

export const Map: FC<MapProps> = ({
  setMarkers,
  dispatch,
  markers,
  family,
}) => {
  const [map, setMap] = useState<google.maps.Map>()
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
   * set info window to markers
   */
  const setInfoWindow = useCallback(
    (marker: google.maps.Marker) => {
      const infoWinfow = new google.maps.InfoWindow({
        content: `
      <h4>${family.name}</h4>
      <p>${family.home?.address}</p>
      `,
      })
      marker.addListener('click', () =>
        infoWinfow.open({ map: marker.getMap(), anchor: marker })
      )
    },
    [family.home?.address, family.name]
  )

  /**
   * handle draw and set config
   * to map markers
   */
  const drawMarkers = useCallback(() => {
    if (markers.latitude) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(markers.latitude, markers.longitude),
        icon: {
          url: '/assets/icons/map/House.svg',
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15),
          scaledSize: new window.google.maps.Size(30, 30),
        },
        map,
      })
      setInfoWindow(marker)
      return marker
    }
    return () => {}
  }, [map, markers, setInfoWindow])

  /**
   * handle load map and render map
   */
  useEffect(() => {
    loader.load().then(() => {
      setMap(
        new google.maps.Map(mapRef.current as HTMLDivElement, {
          zoom,
          center: {
            lat: markers.latitude ?? 45.50169,
            lng: markers.longitude ?? -73.567253,
          },
        })
      )
    })

    return () => {}
  }, [loader, markers, zoom])

  /**
   * add markers controllers when the
   * map is already loaded
   */
  map?.addListener('click', (e: any) => {
    setZoom(map.getZoom() as number)
    setMarkers({
      ...markers,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    })
    dispatch({
      type: 'handleFamilyLocationChange',
      payload: { latitude: e.latLng.lat(), longitude: e.latLng.lng() },
    })
  })

  /**
   * add markers controllers when the
   * map is already loaded
   */
  useEffect(() => {
    if (map) drawMarkers()
  }, [map, drawMarkers])

  return (
    <div className={classes.mapContainer}>
      <div className={classes.map} ref={mapRef} />
    </div>
  )
}
