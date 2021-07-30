import React, { useRef, useState, useEffect, useContext } from 'react'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Rating } from 'primereact/rating';
//styles
import classes from "styles/Families/Datatable.module.scss";
//context
import {FamilyContext} from 'context/FamilyContext'
//services
import ReviewsService from 'services/Reviews'
import { useSession } from 'next-auth/client';
export default function ReviewsForm() {
  const {family} = useContext(FamilyContext)
  const [selectedReviews, setSelectedReviews] = useState(null)
  const [globalFilter, setGlobalFilter] = useState("");
  const dt = useRef(null)
  const [session, ] = useSession()

  const [reviews, setReviews] = useState(null)
  useEffect(()=> {
    (async ()=>{
      ReviewsService.getReviewsFromAFamily(session?.token, family._id)
      .then((res)=> {
        const data = res.map(({studentPhoto, studentName, studentNationality, program, feedback, overallScore})=> {
          return(
            {
              photo: studentPhoto,
              name: studentName,
              nationality: studentNationality.name,
              program: program.name,
              comments: feedback,
              score: overallScore
            }
          )
        })
        setReviews(data) 
        console.log(res)
      })
      .catch(err => console.log(err))
    })()
    return () => {}
  }, [session])

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
  const imageBodyTemplate = ({photo}) => {
    console.log('photo:', photo)
    return <img src={photo || '/assets/img/user-avatar.svg'} alt='Student face' style={{ maxWidth: '100px', borderRadius: '50%' }} />
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
        <Column field='photo' header="Image" body={imageBodyTemplate}></Column>
        {columnComponents}
        <Column field="score" header="Score" body={ratingBodyTemplate} sortable></Column>
        <Column style={{textAlign: 'center'}} header="Actions" body={actionBodyTemplate}></Column>
      </DataTable>
    </div>
  )
}
