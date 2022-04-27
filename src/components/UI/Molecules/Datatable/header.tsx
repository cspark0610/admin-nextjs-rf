// bootstra component
import { Col, Row, Button } from 'react-bootstrap'

// prime components
import { MultiSelect, MultiSelectChangeParams } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'

// styles
import classes from 'styles/UI/Molecules/datatable.module.scss'

// types
import { ColumnProps } from 'primereact/column'
import { Icon } from 'react-bootstrap-icons'
import { FC } from 'react'

type HeaderDatatableProps = {
  schema: ColumnProps[]
  columnSelection: ColumnProps[]
  setFilters: (value: string) => void
  setColumnSelection: (value: ColumnProps[]) => void
  actions?: { [key: string]: { action: () => void; icon?: Icon } }
}

export const headerDatatable: FC<HeaderDatatableProps> = ({
  schema,
  actions,
  setFilters,
  columnSelection,
  setColumnSelection,
}) => {
  const onColumnToggle = (ev: MultiSelectChangeParams) =>
    setColumnSelection(
      schema.filter((col: ColumnProps) =>
        ev.value.some((sCol: ColumnProps) => sCol.field === col.field)
      )
    )

  return (
    <Row className='mb-4'>
      <Col xs={12} md={4} className='mb-1'>
        <span className='p-input-icon-left w-100'>
          <i className='pi pi-search' />
          <InputText
            className={classes.input}
            placeholder='Busqueda global'
            onChange={(e) => setFilters(e.target.value)}
          />
        </span>
      </Col>
      <Col xs={12} md={2} className='mb-1'>
        <MultiSelect
          options={schema}
          optionLabel='header'
          maxSelectedLabels={1}
          value={columnSelection}
          onChange={onColumnToggle}
          className={classes.input}
        />
      </Col>
      {actions && (
        <Col xs={12} classNAme='mb-1'>
          <Row className='flex-row-reverse'>
            {Object.entries(actions).map(([key, value]) => (
              <Col key={key} xs={6} md={2} lg={1}>
                <Button
                  onClick={value.action}
                  className={`w-100 my-1 ${classes.button}`}
                >
                  {value.icon && <value.icon />} {key}
                </Button>
              </Col>
            ))}
          </Row>
        </Col>
      )}
    </Row>
  )
}
