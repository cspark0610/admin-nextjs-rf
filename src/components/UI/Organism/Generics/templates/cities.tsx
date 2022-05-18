// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// bootstrap components
import { Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'

//services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Config/page.module.scss'

// types
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { ChangeType } from 'types'
import { FC } from 'react'

export type CreateCityProps = {
  handleChange: (ev: ChangeType & DropdownChangeParams) => void
  data: GenericDataType
}

export const CreateCity: FC<CreateCityProps> = ({ handleChange, data }) => {
  const { data: session } = useSession()
  const [provinces, setProvinces] = useState<GenericDataType[] | undefined>(
    undefined
  )

  /**
   * handle get provinces from backend
   */
  useEffect(() => {
    ;(async () => {
      const { data } = await GenericsService.getAllByModelnames(
        session?.token as string,
        ['province']
      )
      setProvinces(data.province)
    })()
  }, [session])

  return (
    <Row>
      <Col className={classes.col} xs={6}>
        <InputText
          required
          name='name'
          value={data.name}
          onChange={handleChange}
          className={classes.input}
          placeholder="Generic's name"
        />
      </Col>
      <Col className={classes.col} xs={6}>
        {provinces === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <Dropdown
            name='province'
            optionValue='_id'
            optionLabel='name'
            options={provinces}
            value={data.province}
            placeholder='province'
            onChange={handleChange}
            className={classes.input}
          />
        )}
      </Col>
      <Col className={classes.col} xs={6}>
        <InputNumber
          mode='decimal'
          name='latitude'
          className='w-100'
          minFractionDigits={2}
          value={data.latitude}
          maxFractionDigits={20}
          placeholder='Latitude'
          onValueChange={handleChange}
          inputClassName={classes.input}
        />
      </Col>
      <Col className={classes.col} xs={6}>
        <InputNumber
          mode='decimal'
          name='longitude'
          className='w-100'
          minFractionDigits={2}
          value={data.longitude}
          maxFractionDigits={20}
          placeholder='Longitude'
          onValueChange={handleChange}
          inputClassName={classes.input}
        />
      </Col>
    </Row>
  )
}
