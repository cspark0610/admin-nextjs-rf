// main tools
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import dayjs from 'dayjs'

// prime component
import { Dropdown } from 'primereact/dropdown'

// bootstrap components
import { Badge, Button, Spinner } from 'react-bootstrap'
import { Check2Circle, XCircle } from 'react-bootstrap-icons'

// generics
import { GenericsService } from 'services/Generics'
import { UsersService } from 'services/Users'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// options
import {
  UserTypesOptions,
  FamilyTpesOptions,
  FamilyStatusOptions,
  FamilyScoresOptions,
} from './options'

// styles
import buttonClasses from 'styles/UI/buttons.module.scss'

// types
import { ColumnFilterElementTemplateOptions } from 'primereact/column'
import {
  FamilyDataType,
  FamilyMemberDataType,
  situationFromStrapiDataType,
} from 'types/models/Family'
import { GenericDataType } from 'types/models/Generic'
import { FC } from 'react'
import { StrapiService } from 'services/strapi'

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
          optionValue='firstName'
          optionLabel='firstName'
          placeholder='Search by coordinator'
          onChange={(e) => options.filterApplyCallback(e.value)}
          options={[{ firstName: 'Not assigned', _id: '' }, ...coordinators]}
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

export const GenericExternalUrl: FC<FamilyMemberDataType & { key: string }> = (
  props
) => (
  <Link href={(props[props.key as keyof typeof props] as string) || '/#'}>
    <a target='_blank' rel='noreferrer'>
      Watch picture/file
    </a>
  </Link>
)

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

export const LabelsBody: FC<FamilyMemberDataType & { key: string }> = (
  props
) => {
  if (props[props.key as keyof typeof props])
    return <span>{props[props.key as keyof typeof props] as string}</span>
  else return <span style={{ color: 'gray' }}>Not entered</span>
}

export const PasswordsBody: FC<FamilyMemberDataType & { key: string }> = (
  props
) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const handleClick = (textToCopy: string) => {
    setLoading(true)
    setSuccess(false)
    setError(false)

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setLoading(false)
        setSuccess(true)
      })
      .catch(() => {
        setLoading(false)
        setError(true)
      })
  }

  if (props[props.key as keyof typeof props])
    return (
      <Button
        className={buttonClasses.button_back}
        onClick={() =>
          handleClick(props[props.key as keyof typeof props] as string)
        }>
        {loading && <Spinner animation='border' className='me-2' />}
        <span>
          {success && <Check2Circle size={25} className='me-2' />}
          {error && <XCircle size={25} className='me-2' />}
          copy password
        </span>
      </Button>
    )
  else
    return (
      <span className='px-5' style={{ color: 'gray' }}>
        Not entered
      </span>
    )
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

export const FamilyLocationBody: FC<FamilyDataType> = (props) => {
  const { loading, province, city } = useGenerics(['province', 'city'])

  const handleFindProvince = () =>
    province.find((prov) => prov._id === props.home?.province)
  const handleFindCity = () => city.find((cit) => cit._id === props.home?.city)

  return loading ? (
    <Spinner animation='grow' />
  ) : (
    <span>
      {handleFindProvince()?.name} -{' '}
      {handleFindCity()?.name || props.home?.cityFreeComment}
    </span>
  )
}

export const FamilyMembersSituationBody: FC<FamilyMemberDataType> = (props) => {
  const [situations, setSituations] = useState<
    situationFromStrapiDataType[] | undefined
  >(undefined)
  console.log(props)

  useEffect(() => {
    ;(async () => {
      const res = await StrapiService.getMemberSituations()

      setSituations(res.data)
    })()
  }, [props])

  return situations === undefined ? (
    <Spinner animation='grow' />
  ) : (
    <span>
      {situations.find((situation) => situation.situationId === props.situation)
        ?.name || 'Not defined'}
    </span>
  )
}

export const FamilyUserBody: FC<FamilyDataType> = (props) => (
  <Link
    href={`/users${props?.user?.email ? `?filter=${props?.user?.email}` : ''}`}>
    <a>{props?.user?.email}</a>
  </Link>
)

const formatDate = (date: string) =>
  date ? dayjs(date).format('YYYY-MM-DD') : ''
