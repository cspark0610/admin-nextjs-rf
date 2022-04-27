// bootstra component
import { Col, Row } from 'react-bootstrap'

// prime components
import { MultiSelect, MultiSelectChangeParams } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'

// styles
import classes from 'styles/UI/Molecules/datatable.module.scss'

// types
import { FC } from 'react'
import { ColumnProps } from 'primereact/column'

type HeaderDatatableProps = {
  schema: ColumnProps[]
  columnSelection: ColumnProps[]
  setFilters: (value: string) => void
  setColumnSelection: (value: ColumnProps[]) => void
}

export const headerDatatable: FC<HeaderDatatableProps> = ({
  schema,
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
      <Col xs={12} md={4} className='mb-1'>
        <MultiSelect
          options={schema}
          optionLabel='header'
          maxSelectedLabels={1}
          value={columnSelection}
          onChange={onColumnToggle}
          className={classes.multiSelect}
        />
      </Col>
    </Row>
  )
}
