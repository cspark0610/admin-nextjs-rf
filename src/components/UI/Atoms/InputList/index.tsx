// main tools
import { FC, useState } from 'react'

// bootstrap components
import { Button } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'
import { Chip } from 'primereact/chip'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { GenericDataType } from 'types/models/Generic'

type InputListProps = {
  name: string
  placeholder: string
  list?: GenericDataType[]
  onChange: (ev: any) => void
  onRemove: (ev: GenericDataType[], name: string) => void
}

export const InputList: FC<InputListProps> = ({
  list,
  name,
  onRemove,
  onChange,
  placeholder,
}) => {
  const [value, setValue] = useState('')

  /**
   * update value and clean state
   * for add another element
   */
  const handleClick = () => {
    if (value !== '' && value.trim() !== '') {
      onChange({
        target: { name, value: [{ isFreeComment: true, name: value }] },
      })
      setValue('')
    }
  }

  /**
   * handle remove item for list
   */
  const handleRemove = (item: GenericDataType) => {
    const removed = list?.filter((_, idx) => list.indexOf(item) !== idx)
    onRemove(removed as GenericDataType[], name)
  }

  return (
    <>
      <div className='d-flex'>
        <InputText
          value={value}
          className={classes.input}
          placeholder={placeholder}
          style={{ borderRadius: '19px 0 0 19px' }}
          onChange={(ev) => setValue(ev.target.value)}
        />
        <Button
          onClick={handleClick}
          className={`px-4 ${classes.button}`}
          style={{ borderRadius: '0 19px 19px 0' }}
        >
          add
        </Button>
      </div>
      {list?.map((item, idx) => (
        <Chip
          label={item.name}
          className='mx-1 my-3 pl-2'
          key={`${item.isFreeComment}-${idx}`}
          removable={idx === list.length - 1}
          onRemove={() => handleRemove(item)}
        />
      ))}
    </>
  )
}
