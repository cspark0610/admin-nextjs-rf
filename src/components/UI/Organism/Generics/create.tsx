// main tools
import { useSession } from 'next-auth/react'
import { useState } from 'react'

// bootstrap components
import { Container, Row, Col, Button } from 'react-bootstrap'
import { ArrowLeft } from 'react-bootstrap-icons'

// prime components
import { InputText } from 'primereact/inputtext'

//services
import { GenericsService } from 'services/Generics'

// styles
import classes from 'styles/Config/page.module.scss'

// types
import { ChangeType, SetStateType, SubmitType } from 'types'
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { CreateCityProps } from './templates/cities'
import { FC } from 'react'

type CreateGenericProps = {
  setShowCreate: SetStateType<boolean>
  setError: SetStateType<string>
  model: {
    url: string
    name: string
    model: string
    body?: FC<CreateCityProps>
  }
}

export const CreateGeneric: FC<CreateGenericProps> = ({
  setShowCreate,
  setError,
  model,
}) => {
  const { data: session } = useSession()
  const [data, setData] = useState<GenericDataType>({ name: '' })

  /**
   * handle change generic data
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    setData({ ...data, [ev.target.name]: ev.target.value })

  /**
   * handle submit for create generic
   */
  const handleSubmit = async (ev: SubmitType) => {
    ev.preventDefault()

    const { response } = await GenericsService.create(
      session?.token as string,
      model.url,
      data
    )
    if (!response) setShowCreate(false)
    else setError(response.data?.message)
  }

  return (
    <Container fluid className={classes.container}>
      <Row className='mb-5'>
        <Col xs={3}>
          <Button
            className={classes.button_back}
            onClick={() => setShowCreate(false)}
          >
            <ArrowLeft /> Back
          </Button>
        </Col>
      </Row>
      <h5>Create {model.name}</h5>
      <form onSubmit={handleSubmit}>
        {model.body ? (
          <model.body data={data} handleChange={handleChange} />
        ) : (
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
          </Row>
        )}
        <Row>
          <Col xs={3}>
            <Button type='submit' className={classes.button}>
              Save
            </Button>
          </Col>
        </Row>
      </form>
    </Container>
  )
}
