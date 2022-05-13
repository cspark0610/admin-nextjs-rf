// main tools
import { FC, Dispatch, ChangeEvent } from 'react'

// bootstrap components
import { Button, Col, Row, Spinner } from 'react-bootstrap'

// prime components
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Divider } from 'primereact/divider'

// services
import { useGenerics } from 'hooks/useGenerics'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { PetDataType } from 'types/models/Family'
import { ChangeType } from 'types'

interface PetsDataParams {
  data: PetDataType
  handleSave: () => void
  dispatch: Dispatch<{
    payload: {
      ev: ChangeType | DropdownChangeParams | ChangeEvent<HTMLTextAreaElement>
      idx?: number
    }
    type: string
  }>
  idx: number
}

export const PetsData: FC<PetsDataParams> = ({
  idx,
  data,
  dispatch,
  handleSave,
}) => {
  const { loading, petType: petTypes } = useGenerics(['petType'])

  /**
   * handle change user and dispatch data
   */
  const handlePetChange = (
    ev: ChangeType | DropdownChangeParams | ChangeEvent<HTMLTextAreaElement>,
    idx: number
  ) => dispatch({ type: 'handlePetsChange', payload: { ev, idx } })

  return (
    <>
      {loading ? (
        <Spinner animation='grow' />
      ) : (
        <Row key={idx}>
          <Divider />
          <Col className='mb-2' xs={12} md={4}>
            <p>Specie</p>
            {petTypes === undefined ? (
              <Spinner animation='grow' />
            ) : (
              <Dropdown
                showClear
                name='type'
                appendTo='self'
                value={data.type}
                optionLabel='name'
                options={petTypes}
                placeholder='Select'
                className={classes.input}
                onChange={(ev) => handlePetChange(ev, idx)}
              />
            )}
          </Col>
          <Col className='mb-4' xs={12} md={4}>
            <p>Name (optional)</p>
            <InputText
              name='name'
              value={data.name}
              placeholder='Name'
              className={classes.input}
              onChange={(ev) => handlePetChange(ev, idx)}
            />
          </Col>
          <Col className='mb-4' xs={12} md={4}>
            <p>Breed (optional)</p>
            <InputText
              name='race'
              value={data.race}
              placeholder='Breed'
              className={classes.input}
              onChange={(ev) => handlePetChange(ev, idx)}
            />
          </Col>
          <Col className='mb-4' xs={12} md={4}>
            <p>Age (optional)</p>
            <InputNumber
              min={0}
              max={100}
              mode='decimal'
              value={data.age}
              className='w-100'
              name='age'
              placeholder='Age'
              inputClassName={classes.input}
              onValueChange={(e) => handlePetChange(e, idx)}
            />
          </Col>
          <Col className='mb-4' xs={12} md={8}>
            <p>Note (optional)</p>
            <InputTextarea
              rows={4}
              name='remarks'
              value={data.remarks}
              placeholder='Breed'
              className={classes.input}
              onChange={(ev) => handlePetChange(ev, idx)}
            />
          </Col>
          <Col>
            <Button className={classes.button} onClick={handleSave}>
              Save
            </Button>
          </Col>
        </Row>
      )}
    </>
  )
}
