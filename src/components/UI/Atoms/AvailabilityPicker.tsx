// main tools
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// bootstrap
import { ButtonGroup, Button } from 'react-bootstrap'

// utils
import { CalendarLocaleOptions } from 'utils/calendarLocaleOptions'

// prime components
import { Calendar } from 'primereact/calendar'
import { addLocale } from 'primereact/api'

// styles
import classes from 'styles/UI/Atoms/availabilityPicker.module.scss'

// types
import { CalendarDateTemplateParams } from 'primereact/calendar'
import { FC, Dispatch } from 'react'

type AvailabilityPicker = {
  idx: number
  dates: Date[]
  editable?: boolean
  dispatch: Dispatch<{ type: string; payload: any }>
}

export const AvailabilityPicker: FC<AvailabilityPicker> = ({
  idx,
  dates,
  editable,
  dispatch,
}) => {
  const [rangeDates, setRangeDates] = useState<Date[]>([])
  const disabledDays = [0, 1, 2, 3, 4, 5, 6, 7]
  const [remove, setRemove] = useState(false)
  const { locale } = useRouter()

  addLocale('es', CalendarLocaleOptions)

  /**
   * format date
   */
  const getDates = (dates: string[] | Date[]) =>
    dates.map((date) => (typeof date === 'string' ? new Date(date) : date))

  /**
   * verify if there are some
   * selected dates in the dates array
   */
  const isSelected = (date: CalendarDateTemplateParams) => {
    let found = false
    getDates(dates).map((selectedDate) => {
      if (
        selectedDate?.getDate() === date.day &&
        selectedDate?.getMonth() === date.month &&
        selectedDate?.getFullYear() === date.year
      ) {
        found = true
        return
      }
    })

    return found
  }

  /**
   * disable before dates
   */
  const isDisabled = (date: CalendarDateTemplateParams) => {
    const now = new Date()
    if (
      date.year < now.getFullYear() ||
      (date.month < now.getMonth() && date.year === now.getFullYear()) ||
      (date.day < now.getDate() &&
        date.month === now.getMonth() &&
        date.year === now.getFullYear())
    )
      return true
  }

  /**
   * handle add range of dates to home's data
   * and clean calendar selected dates
   */
  useEffect(() => {
    if (rangeDates[0] && rangeDates[1]) {
      dispatch({
        type: remove ? 'handleRemoveAvailability' : 'handleAvailabilityChange',
        payload: { value: rangeDates, idx },
      })
      remove && setRangeDates([])
    }
  }, [rangeDates, dispatch, idx, remove])

  /**
   * calendar's date template
   *
   * @param {object} date
   */
  const template = (date: CalendarDateTemplateParams) => (
    <div
      className={`${classes.day} ${isSelected(date) && classes.selected} ${
        isDisabled(date) && classes.disabled
      }`}
    >
      <span>{date.day}</span>
    </div>
  )

  return (
    <>
      <Calendar
        inline
        locale={locale}
        numberOfMonths={3}
        value={rangeDates}
        name='availability'
        minDate={new Date()}
        dateFormat='dd/mm/yy'
        selectionMode='range'
        dateTemplate={template}
        className={classes.calendar}
        disabledDays={!editable ? disabledDays : []}
        onChange={(ev) => setRangeDates(ev.value as Date[])}
      />
      {editable && (
        <ButtonGroup className={classes.buttons}>
          <Button
            onClick={() => setRemove(!remove)}
            className={classes.buttons_single}
          >
            {remove ? 'Add' : 'Remove'}
          </Button>
          <Button
            className={classes.buttons_single}
            onClick={() => {
              dispatch({ type: 'handleClearAvailability', payload: { idx } })
              setRangeDates([])
            }}
          >
            Clear
          </Button>
        </ButtonGroup>
      )}
    </>
  )
}
