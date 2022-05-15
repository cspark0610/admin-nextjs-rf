// main tools
import { useEffect, useState } from 'react'

// prime components
import { Rating } from 'primereact/rating'

// types
import { FC } from 'react'

type InputRateProps = {
  setRateOf: (fieldName: string, value: number) => void
  title: string
}

export const InputRate: FC<InputRateProps> = ({ setRateOf, title }) => {
  const [rate, setRate] = useState<number>(0)

  useEffect(() => setRateOf(title, rate), [rate, setRateOf, title])

  return (
    <>
      <h4>{title}</h4>
      <Rating
        value={rate}
        cancel={false}
        onChange={(e) => setRate(e.value as number)}
      />
    </>
  )
}
