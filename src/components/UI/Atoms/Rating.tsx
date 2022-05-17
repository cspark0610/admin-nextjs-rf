// main tools
import { useEffect, useState } from 'react'
// prime components
import { Rating as PrimeRating } from 'primereact/rating'
// types
import { FC } from 'react'
import { Col } from 'react-bootstrap'

import classes from 'styles/Families/page.module.scss'
interface IRating {
  title?: string
  name: string
  setRate: (name: string, val: number) => void
  value: number
}

export const Rating: FC<IRating> = ({ name, title = null, setRate, value }) => {
  const [val, setVal] = useState(value)
  useEffect(() => {
    setRate(name, val)
  }, [val])

  return (
    <Col className={`${classes.col} my-2`} xs={12} sm={6} lg={4}>
      <p className='text-capitalize'>{!!title ? title : name}</p>
      <PrimeRating
        value={val}
        cancel={false}
        onChange={(e) => setVal(e.value as number)}
      />
    </Col>
  )
}
