// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// bootstrap components
import { Row, Col, Spinner } from 'react-bootstrap'

// prime components
import { InputText } from 'primereact/inputtext'
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

export type CreateProvinceProps = {
  handleChange: (ev: ChangeType & DropdownChangeParams) => void
  data: GenericDataType
}

export const CreateProvince: FC<CreateProvinceProps> = ({
  handleChange,
  data,
}) => {
  const { data: session } = useSession()
  const [countries, setCountries] = useState<GenericDataType[] | undefined>(
    undefined
  )

  /**
   * handle get countries from backend
   */
  useEffect(() => {
    ;(async () => {
      const { data } = await GenericsService.getAllByModelnames(
        session?.token as string,
        ['country']
      )
      setCountries(data.country)
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
        {countries === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <Dropdown
            name='country'
            optionValue='_id'
            optionLabel='name'
            options={countries}
            value={data.country}
            placeholder='Country'
            onChange={handleChange}
            className={classes.input}
          />
        )}
      </Col>
    </Row>
  )
}
