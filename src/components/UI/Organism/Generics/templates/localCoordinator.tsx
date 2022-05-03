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

export type CreateLocalCoordinatorProps = {
  handleChange: (ev: ChangeType & DropdownChangeParams) => void
  data: GenericDataType
}

export const CreateLocalCoordinator: FC<CreateLocalCoordinatorProps> = ({
  handleChange,
  data,
}) => {
  const { data: session } = useSession()
  const [communities, setCommunities] = useState<GenericDataType[] | undefined>(
    undefined
  )

  /**
   * handle get communities from backend
   */
  useEffect(() => {
    ;(async () => {
      const { data } = await GenericsService.getAllByModelnames(
        session?.token as string,
        ['community']
      )
      setCommunities(data.community)
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
          placeholder="Local coordinator's name"
        />
      </Col>
      <Col className={classes.col} xs={6}>
        <InputText
          required
          type='email'
          name='email'
          value={data.email}
          placeholder='Email'
          onChange={handleChange}
          className={classes.input}
        />
      </Col>
      <Col className={classes.col} xs={6}>
        <InputText
          required
          name='remarks'
          value={data.remarks}
          placeholder='Remark'
          onChange={handleChange}
          className={classes.input}
        />
      </Col>
      <Col className={classes.col} xs={6}>
        {communities === undefined ? (
          <Spinner animation='grow' />
        ) : (
          <Dropdown
            name='community'
            optionValue='_id'
            optionLabel='name'
            options={communities}
            value={data.community}
            placeholder='Community'
            onChange={handleChange}
            className={classes.input}
          />
        )}
      </Col>
    </Row>
  )
}
