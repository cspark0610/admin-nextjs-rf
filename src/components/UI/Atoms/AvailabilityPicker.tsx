// main tools
import { useState, useEffect } from 'react'

// prime components
import { Calendar, CalendarDateTemplateParams } from 'primereact/calendar'
import { Button } from 'primereact/button'

// styles
import classes from 'styles/UI/Atoms/availabilityPicker.module.scss'

export const AvailabilityPicker = ({ dates, setDates }) => {
  const [remove, setRemove] = useState(false)
  const [rangeDates, setRangeDates] = useState([])

  const getDates = (dates: Date[] | string[]) =>
    dates.map((date: Date | string) =>
      typeof date === 'string' ? new Date(date) : date
    )

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

  const isDisabled = (date) => {
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

  const template = (date: CalendarDateTemplateParams) => (
    <div
      className={`${classes.day} ${isSelected(date) && classes.selected} ${
        isDisabled(date) && classes.disabled
      }`}
    >
      <span>{date.day}</span>
    </div>
  )

  useEffect(() => {
    if (rangeDates[0] && rangeDates[1]) {
      let day = rangeDates[0].getDate()
      let month = rangeDates[0].getMonth() + 1
      let year = rangeDates[0].getFullYear()

      const endDay = rangeDates[1].getDate()
      const endMonth = rangeDates[1].getMonth() + 1
      const endYear = rangeDates[1].getFullYear()
      const updateDates = []

      while (true) {
        updateDates.push(new Date(`${month}/${day}/${year}`))

        if (year < endYear) {
          const daysOfTheMonth = new Date(year, month, 0).getDate()
          if (month < 12) {
            if (day < daysOfTheMonth) day++
            else {
              month++
              day = 1
            }
          } else {
            if (day < daysOfTheMonth) day++
            else if (day >= daysOfTheMonth) {
              year++
              month = 1
              day = 1
            }
          }
        } else {
          if (month < endMonth) {
            const daysOfTheMonth = new Date(year, month, 0).getDate()
            if (day < daysOfTheMonth) day++
            else {
              month++
              day = 1
            }
          } else {
            if (day < endDay) day++
            else if (day >= endDay) break
          }
        }
      }

      if (!remove)
        setDates({
          target: { id: 'availability', value: [...dates, ...updateDates] },
        })
      else {
        const itemsToRemove = [
          ...updateDates
            .filter(
              (item) =>
                dates
                  .map((item: Date | string) => {
                    const formatedItem =
                      typeof item === 'string' ? new Date(item) : item
                    return formatedItem.toISOString()
                  })
                  .indexOf(item.toISOString()) !== -1
            )
            .map((item) => item.toISOString()),
        ]
        const removedItems = dates.filter((item: Date | string) => {
          const formatedItem = typeof item === 'string' ? new Date(item) : item
          return itemsToRemove.indexOf(formatedItem.toISOString()) === -1
        })

        setDates({ target: { id: 'availability', value: [...removedItems] } })
      }
      remove && setRangeDates([])
    }
  }, [rangeDates])

  return (
    <>
      <Calendar
        inline
        numberOfMonths={2}
        selectionMode='range'
        className={classes.calendar}
        dateTemplate={template}
        value={rangeDates}
        id='availability'
        name='availability'
        minDate={new Date()}
        onChange={(ev) => setRangeDates(ev.value as Date[])}
      />
      <div className={classes.buttons}>
        <Button
          type='button'
          onClick={() => setRemove(!remove)}
          className={classes.buttons_single}
        >
          {remove ? 'Removing' : 'Adding'}
        </Button>
        <Button
          type='button'
          onClick={() => {
            setDates({ target: { id: 'availability', value: [] } })
            setRangeDates([])
          }}
          className={classes.buttons_single}
        >
          Clear
        </Button>
      </div>
    </>
  )
}
