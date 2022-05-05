// main tools
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

// prime component
import { Dropdown } from 'primereact/dropdown'

// bootstrap components
import { Spinner } from 'react-bootstrap'

// generics
import { GenericsService } from 'services/Generics'

// options
import {
  UserTypesOptions,
  FamilyStatusOptions,
  FamilyScoresOptions,
} from './options'

// types
import { ColumnFilterElementTemplateOptions } from 'primereact/column'
import { GenericDataType } from 'types/models/Generic'
import { FamilyDataType } from 'types/models/Family'
import { UserDataType } from 'types/models/User'
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
export const LocalCoordinatorFilter: FC<ColumnFilterElementTemplateOptions> = (
  options
) => {
  const [coordinators, setCoordinators] = useState(undefined)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          ['localManager']
        )
        setCoordinators(data.localManager)
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
          optionValue='_id'
          optionLabel='name'
          value={options.value}
          options={coordinators}
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
export const CalendarBody: FC<UserDataType> = ({ createdAt }) => (
  <span>{formatDate(createdAt as string)}</span>
)
export const BooleanBody: FC<GenericDataType> = ({ isFreeComment }) => (
  <span>{isFreeComment ? 'True' : 'False'}</span>
)
export const HostsNameTemplare: FC<FamilyDataType> = (props) => {
  const names = props.mainMembers?.map((member) => member.firstName)
  return (
    // @ts-ignore
    <p>{new Intl.ListFormat('en', { type: 'conjunction' }).format(names)}</p>
  )
}

const formatDate = (date: string) =>
  date ? dayjs(date).format('YYYY-MM-DD') : ''
