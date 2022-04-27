// main tools
import { useState } from 'react'

// bootstrap components
import {
  ArrowClockwise,
  FileEarmark,
  Pencil,
  Trash,
  List,
} from 'react-bootstrap-icons'
import { Row, Button, Navbar, Offcanvas, Col } from 'react-bootstrap'

// styles
import classes from 'styles/Users/page.module.scss'

// types
import { FC } from 'react'

type DashboardHeaderProps = {
  create: () => void
  reload: () => void
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  create,
  reload,
}) => {
  const [showToggle, setShowToggle] = useState(false)
  const items = [
    { label: 'Exportar CVS', preIcon: <FileEarmark /> },
    { label: 'Recargar', function: reload, preIcon: <ArrowClockwise /> },
    { label: 'Crear', function: create, preIcon: <Pencil /> },
    { preIcon: <Trash /> },
  ]

  return (
    <>
      <Row className={classes.header}>
        {items.map((item, idx) => (
          <Col xs={idx !== items.length - 1 ? 3 : 2}>
            <Button
              key={idx}
              onClick={item.function}
              className={classes.button}
            >
              {item.preIcon}
              {item.label}
            </Button>
          </Col>
        ))}
      </Row>
      <Navbar className={classes.menuMobile}>
        <Button variant='light' onClick={() => setShowToggle(true)}>
          <List className={classes.icon} />
        </Button>
        <Offcanvas
          placement='end'
          show={showToggle}
          className={classes.sidebar}
          onHide={() => setShowToggle(false)}
        >
          <Offcanvas.Header closeButton />
          <Offcanvas.Body>
            {items.map((item, idx) => (
              <Row key={idx} className='w-100 justify-content-center'>
                <Button onClick={item.function} className={classes.button}>
                  {item.preIcon}
                  {item.label}
                </Button>
              </Row>
            ))}
          </Offcanvas.Body>
        </Offcanvas>
      </Navbar>
    </>
  )
}
