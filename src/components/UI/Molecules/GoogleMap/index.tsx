// main tools
import { useState, useRef, useEffect, useMemo, FC, Dispatch } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

// styles
import classes from 'styles/Map/Map.module.scss'

// types
import { FamilyDataType, LocationDataType } from 'types/models/Family'

type MapProps = {
  setMarkers: (ev: LocationDataType) => void
  markers: LocationDataType
  family: FamilyDataType
  dispatch: Dispatch<{
    payload: LocationDataType
    type: string
  }>
}


export const Map: FC<MapProps> = ({
  setMarkers,
  dispatch,
  markers,
  family,
}) => {
  const [map, setMap] = useState<any>()
  const [zoom, setZoom] = useState(5)
  const mapRef = useRef<any>()

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
  const drawMarkers = () => {
    if(markers.latitude) {
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
  }

  /**
   * set info window to markers
   */
  const setInfoWindow = (marker: google.maps.Marker) => {
    const infoWinfow = new google.maps.InfoWindow({
      content: `
      <h4>${family.name}</h4>
      <p>${family.home?.address}</p>
      `,
    })
    marker.addListener('click', () =>
      infoWinfow.open({ map: marker.getMap(), anchor: marker })
    )
  }

  /**
   * handle load map and render map
   */
  useEffect(() => {
    loader.load().then(() => {
      setMap(
        new google.maps.Map(mapRef.current, {
          zoom,
          center: { 
            lat: markers.latitude ?? 45.50169,
            lng: markers.longitude ?? -73.567253
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
    setZoom(map.zoom)
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
  }, [map])

  return (
    <div className={classes.mapContainer}>
      <div className={classes.map} ref={mapRef} />
    </div>
  )
}
