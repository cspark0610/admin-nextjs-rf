import React, { useRef, useState } from 'react'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Rating } from 'primereact/rating';
//styles
import classes from "styles/Families/Datatable.module.scss";
export default function ReviewsForm() {
  const [selectedReviews, setSelectedReviews] = useState(null)
  const [globalFilter, setGlobalFilter] = useState("");
  const dt = useRef(null)
  const data = [
    {
      picture: 'foto',
      name: 'nombre',
      nationality: 'Venezuelan',
      program: 'name of te program',
      comments: 'this is a comment for a review',
      score: 3
    }, {
      picture: 'foto',
      name: 'nombre',
      nationality: 'Mexican',
      program: 'name of te program',
      comments: 'this is a comment for a review',
      score: 3
    }, {
      picture: 'foto',
      name: 'nombre',
      nationality: 'Japanese',
      program: 'name of te program',
      comments: 'this is a comment for a review',
      score: 3
    },
  ]
  const [reviews, setReviews] = useState(data)
  //columns
  const columns = [
    {
      field: "name",
      header: "Name",
      filterPlaceholder: "Search by name"
    },

    {
      field: "nationality",
      header: "Nationality",
      filterPlaceholder: "Search by nationality"
    },
    {
      field: "program",
      header: "Program or course",
      filterPlaceholder: "Search by program or course",
    },
    {
      field: "comments",
      header: "Comments",
      filterPlaceholder: "Search by comment",
    },
  ];
  const editItem = (rowData) => { }
  const confirmDeleteItem = (rowData) => { }
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const columnComponents = selectedColumns.map((col) => {
    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        filter
        sortable
        filterPlaceholder={col.filterPlaceholder}
      />
    );
  });
  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.score} readOnly cancel={false} />;
  }
  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.picture && '/assets/img/user-avatar.svg'} alt={rowData.picture} style={{ maxWidth: '100px' }} />
  }
  const actionBodyTemplate = (rowData) => {
    return (
      <div className={classes.actions_field}>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-mr-2" onClick={() => editItem(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined" onClick={() => confirmDeleteItem(rowData)} />
      </div>
    );
  }
  const renderHeader = () => {
    return (
      <div className={`${classes.table_header} table-header`}>
        <div>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Global search"
            />
          </span>
        </div>

        <div className={classes.button_group}>
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger p-button-rounded"
            onClick={() => console.log("delete")}
          />
          <Button label="New" icon="pi pi-plus" className="p-button-rounded" />
        </div>
      </div>
    );
  };
  return (
    <div>
      <h1>Reviews</h1>
      <DataTable
        globalFilter={globalFilter}
        ref={dt}
        header={renderHeader()}
        emptyMessage="No reviews found"
        selection={selectedReviews}
        onSelectionChange={(e) => setSelectedReviews(e.value)}
        value={reviews || []}>
        <Column selectionMode="multiple" style={{ width: "3em" }} />
        <Column header="Image" body={imageBodyTemplate}></Column>
        {columnComponents}
        <Column field="score" header="Score" body={ratingBodyTemplate} sortable></Column>
        <Column style={{textAlign: 'center'}} header="Actions" body={actionBodyTemplate}></Column>
      </DataTable>
    </div>
  )
}
