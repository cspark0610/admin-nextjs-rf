// main tools
import { useEffect, useState } from 'react'
// prime components
import { Rating as PrimeRating } from 'primereact/rating'
// types
import { FC } from 'react'
interface IRating {
  title: string
  fieldName: string
  setRate: (fieldName: string, val: number) => void
}

export const Rating: FC<IRating> = ({ fieldName, title, setRate }) => {
  const [val, setVal] = useState(1)
  useEffect(() => {
    setRate(fieldName, val)
  }, [val])

  return (
    <>
      <p>{title}</p>
      <PrimeRating
        value={val}
        cancel={false}
        onChange={(e) => setVal(e.value as number)}
      />
    </>
  )
}
