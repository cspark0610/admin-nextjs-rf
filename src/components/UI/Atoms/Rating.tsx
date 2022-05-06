// main tools
import { useState } from 'react'

// prime components
import { Rating as PrimeRating } from 'primereact/rating'

// types
import { FC } from 'react'

export const Rating: FC = () => {
  const [val, setVal] = useState(1)

  return (
    <PrimeRating
      value={val}
      cancel={false}
      onChange={(e) => setVal(e.value as number)}
    />
  )
}
