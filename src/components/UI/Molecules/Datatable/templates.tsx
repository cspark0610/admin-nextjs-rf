// main tools
import dayjs from 'dayjs'

// prime component
import { Dropdown } from 'primereact/dropdown'

// options
import { UserTypesOptions } from './options'

// types
import { ColumnFilterElementTemplateOptions } from 'primereact/column'
import { GenericDataType } from 'types/models/Generic'
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
    placeholder='Search by rol'
    onChange={(e) => options.filterApplyCallback(e.value)}
  />
)

/**
 * ------------------------------ BODY ------------------------------
 */
export const CalendarBody: FC<UserDataType> = ({ createdAt }) => (
  <span>{formatDate(createdAt as string)}</span>
)
export const BooleanBody: FC<GenericDataType> = ({ isFreeComment }) => (
  <span>{isFreeComment ? 'True' : 'False'}</span>
)

const formatDate = (date: string) =>
  date ? dayjs(date).format('YYYY-MM-DD') : ''
