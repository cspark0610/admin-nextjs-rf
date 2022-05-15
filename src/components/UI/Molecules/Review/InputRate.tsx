import { Rating } from 'primereact/rating'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

interface IRateInput {
  setRateOf: (fieldName: string, value: number) => void
  title: string
}

export const InputRate: FC<IRateInput> = ({ setRateOf, title }) => {
  const [rate, setRate] = useState<number>(0)
  useEffect(() => {
    setRateOf(title, rate)
  }, [rate])

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
