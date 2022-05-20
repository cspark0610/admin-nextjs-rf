// main tools
import { useState, useEffect } from 'react'

// bootstrap components
import { Spinner } from 'react-bootstrap'

// prime components
import { AutoComplete } from 'primereact/autocomplete'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import {
  AutoCompleteChangeParams,
  AutoCompleteCompleteMethodParams,
} from 'primereact/autocomplete'
import { GenericDataType } from 'types/models/Generic'
import { FC } from 'react'

interface LocationDataType extends GenericDataType {
  cities?: GenericDataType[]
  isProvince?: boolean
}

type LocationFilterProps = {
  location: LocationDataType | null | undefined
  handleChange: (ev: AutoCompleteChangeParams) => void
}

export const LocationFilter: FC<LocationFilterProps> = ({
  handleChange,
  location,
}) => {
  const [filteredLocations, setFilteredLocations] = useState<
    LocationDataType[] | undefined
  >([])
  const [locations, setLocations] = useState<LocationDataType[] | undefined>(
    undefined
  )
  const { loading, city, province } = useGenerics(['city', 'province'])

  /**
   * handle searcher locations change for
   * filter the locations array on every type
   *
   * @param {string} query
   */
  const handleSearchLocation = ({
    query,
  }: AutoCompleteCompleteMethodParams) => {
    const updateFilteredLocations: LocationDataType[] = []

    locations?.forEach((province: LocationDataType) => {
      const filteredItems = province.cities?.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .indexOf(
              query
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            ) !== -1
      )
      if (filteredItems && filteredItems.length)
        updateFilteredLocations.push({ ...province, cities: filteredItems })
    })

    setFilteredLocations([...updateFilteredLocations])
  }

  useEffect(() => {
    if (!loading) {
      province?.forEach((prov: LocationDataType) => {
        prov['cities'] = [
          { ...prov, isProvince: true },
          ...city
            .filter((cit: GenericDataType) => cit.province === prov._id)
            .map((cit: GenericDataType) => ({ ...cit, isProvince: false })),
        ]
      })

      setLocations(province)
    }
  }, [loading, city, province])

  /**
   * template for location item
   */
  const locationTemplate = (
    item: GenericDataType & { isProvince: boolean }
  ) => (
    <span>
      <i
        className={`pi ${item.isProvince ? 'pi-globe' : 'pi-map-marker'} ${
          classes.inputs_items
        }`}
      />{' '}
      {item.name}
    </span>
  )

  return locations === undefined ? (
    <Spinner animation='grow' />
  ) : (
    <AutoComplete
      dropdown
      field='name'
      id='location'
      name='location'
      appendTo='self'
      value={location}
      className='w-100'
      optionGroupLabel='name'
      onChange={handleChange}
      optionGroupChildren='cities'
      placeholder='Select location'
      inputClassName={classes.input}
      itemTemplate={locationTemplate}
      suggestions={filteredLocations}
      completeMethod={handleSearchLocation}
      onClick={(ev) =>
        ((ev.target as HTMLElement).nextSibling as HTMLElement).click()
      }
    />
  )
}
