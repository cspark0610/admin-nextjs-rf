// main tools
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

// prime component
import { Dropdown } from 'primereact/dropdown'

// bootstrap components
import { Badge, Spinner } from 'react-bootstrap'

// generics
import { GenericsService } from 'services/Generics'
import { UsersService } from 'services/Users'

// options
import {
  UserTypesOptions,
  FamilyTpesOptions,
  FamilyStatusOptions,
  FamilyScoresOptions,
} from './options'

// types
import { ColumnFilterElementTemplateOptions } from 'primereact/column'
import { FamilyMemberDataType } from 'types/models/Family'
import { GenericDataType } from 'types/models/Generic'
import { FC } from 'react'

/**
 * ------------------------------ FILTERS ------------------------------
 */

export const TypeFilter: FC<ColumnFilterElementTemplateOptions> = (options) => (
  <Dropdown
    showClear
    value={options.value}
    options={UserTypesOptions}
    placeholder='Search by type'
    onChange={(e) => options.filterApplyCallback(e.value)}
  />
)
export const ScoreFilter: FC<ColumnFilterElementTemplateOptions> = (
  options
) => (
  <Dropdown
    showClear
    value={options.value}
    placeholder='Search by score'
    options={FamilyScoresOptions}
    onChange={(e) => options.filterApplyCallback(e.value)}
  />
)
export const FamilyTypeFilter: FC<ColumnFilterElementTemplateOptions> = (
  options
) => (
  <Dropdown
    showClear
    value={options.value}
    options={FamilyTpesOptions}
    placeholder='Search by score'
    onChange={(e) => options.filterApplyCallback(e.value)}
  />
)
export const StatusFilter: FC<ColumnFilterElementTemplateOptions> = (
  options
) => (
  <Dropdown
    showClear
    value={options.value}
    options={FamilyStatusOptions}
    placeholder='Search by status'
    onChange={(e) => options.filterApplyCallback(e.value)}
  />
)
export const GenericFilter: FC<
  ColumnFilterElementTemplateOptions & { key: string }
> = (options) => {
  const [generic, setGeneric] = useState(undefined)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          [options.key]
        )
        setGeneric(data[options.key])
      })()
    }
  }, [session?.token, status, options.key])

  return (
    <>
      {generic === undefined ? (
        <Spinner animation='grow' />
      ) : (
        <Dropdown
          showClear
          options={generic}
          optionValue='name'
          optionLabel='name'
          value={options.value}
          placeholder='Choose option'
          onChange={(e) => options.filterApplyCallback(e.value)}
        />
      )}
    </>
  )
}
export const LocalCoordinatorFilter: FC<ColumnFilterElementTemplateOptions> = (
  options
) => {
  const [coordinators, setCoordinators] = useState(undefined)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await UsersService.getLocalCoordinators(
          session.token as string
        )
        setCoordinators(data)
      })()
    }
  }, [status, session])

  return (
    <>
      {coordinators === undefined ? (
        <Spinner animation='grow' />
      ) : (
        <Dropdown
          showClear
          value={options.value}
          options={coordinators}
          optionValue='firstName'
          optionLabel='firstName'
          placeholder='Search by coordinator'
          onChange={(e) => options.filterApplyCallback(e.value)}
        />
      )}
    </>
  )
}

/**
 * ------------------------------ BODY ------------------------------
 */
export const GenericDateBody: FC<FamilyMemberDataType & { key: string }> = (
  props
) => <span>{formatDate(props[props.key as keyof typeof props] as string)}</span>

export const GenericAgeBody: FC<FamilyMemberDataType & { key: string }> = (
  props
) => {
  const age = dayjs(props[props.key as keyof typeof props] as string)

  const years = dayjs().diff(age, 'years')
  const months = dayjs().diff(age, 'months')
  const days = dayjs().diff(age, 'days')

  if (years) return <span>{years} years</span>
  if (months) return <span>{months} months</span>
  if (days) return <span>{days} days</span>

  return <span>Prefer not say</span>
}

export const GenericMultiDataBody: FC<
  FamilyMemberDataType & { generic: string }
> = (props) => (
  <span>
    {(props[props.generic as keyof typeof props] as GenericDataType[])?.map(
      (item) => (
        <Badge className='mx-1' key={item._id}>
          {item.name}
        </Badge>
      )
    )}
  </span>
)

const formatDate = (date: string) =>
  date ? dayjs(date).format('YYYY-MM-DD') : ''
