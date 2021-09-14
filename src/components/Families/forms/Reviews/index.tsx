import React, { useRef, useState, useEffect, useContext } from 'react'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
import { Rating } from 'primereact/rating';
import ReviewForm from 'components/Families/modals/ReviewForm'
import Modal from 'components/UI/Molecules/Modal'
//styles
import classes from "styles/Families/Datatable.module.scss";
//context
import {FamilyContext} from 'context/FamilyContext'
//services
import ReviewsService from 'services/Reviews'
import { useSession } from 'next-auth/client';

const columns = [
  {
    field: "studentName",
    header: "Name",
    filterPlaceholder: "Search by name"
  },

  {
    field: "studentNationality.name",
    header: "Nationality",
    filterPlaceholder: "Search by nationality"
  },
  {
    field: "program.name",
    header: "Program or course",
    filterPlaceholder: "Search by program or course",
  },
  {
    field: "feedback",
    header: "Comments",
    filterPlaceholder: "Search by comment",
  },
];

export default function ReviewsForm() {
  const {family} = useContext(FamilyContext)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReviews, setSelectedReviews] = useState([])
  const [globalFilter, setGlobalFilter] = useState("");
  const [showCreateReviewModal, setShowCreateReviewModal] = useState(false)
  const dt = useRef(null)
  const [session, ] = useSession()
  const [selectedReview, setSelectedReview] = useState(null)

  const [reviews, setReviews] = useState(null)

  const getReviews = () => {
    setIsLoading(true)
    ReviewsService.getReviewsFromAFamily(session?.token, family._id)
        .then((res)=> {
          setReviews(res) 
          setIsLoading(false)
        })
        .catch(err => {
          console.error(err)
          setIsLoading(false)
        })
  }

  useEffect(()=> {
    getReviews()
  }, [session])

  const handleCreate = (e) => {
    setShowCreateReviewModal(true)
  }
  const createReview = (e) => {
    ReviewsService.createReview(session?.token, family._id, e)
    .then(()=> {
      getReviews()
      setShowCreateReviewModal(false)
    })
    .catch((err)=>{
      console.error(err)
    })
  }
  const editItem = (rowData) => {
    setSelectedReview(rowData)
    setShowCreateReviewModal(true)
  }

  const handleUpdateReview = (data) => {
    ReviewsService.updateReview(session?.token, family._id, selectedReview._id, data)
      .then(() => {
          getReviews()
          setShowCreateReviewModal(false)
      })
      .catch(err => {
          console.error(err)
      })
  }

  const confirmDeleteItem = (rowData) => {
    confirmDialog({
        message: `Are you sure you want to delete this review?`,
        header: 'Confirm Delete Review',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {    
            ReviewsService.deleteReview(session?.token, family._id, rowData._id)
                .then(() => {
                    getReviews()
                })
                .catch(err => {
                    console.error(err)
                })
        },
        reject: () => {}
    });
  }

  const confirmDeleteMany = () => {
    if (selectedReviews.length > 0) {
      confirmDialog({
        message: `Are you sure you want to delete these review?`,
        header: 'Confirm Delete Reviews',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {    
            ReviewsService.deleteManyReviews(session?.token, family._id, selectedReviews.map(aux => aux._id).join(','))
                .then(() => {
                    getReviews()
                    setSelectedReviews([])
                })
                .catch(err => {
                    console.error(err)
                })
        },
        reject: () => {}
    });
    }
  }

  const [selectedColumns, setSelectedColumns] = useState(columns);
  const columnComponents = selectedColumns.map((col) => {
    // const filterTemplate =  <InputText placeholder={col.filterPlaceholder} type="search"/>
    return (
      <Column
        key={col.field}
        field={col.field}
        header={col.header}
        filter
        // filterElement={filterTemplate}
        filterPlaceholder={col.filterPlaceholder}
        sortable
      />
    );
  });
  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.overallScore} readOnly className='customStars' cancel={false} />;
  }
  const imageBodyTemplate = ({ studentPhoto }) => {
    return <div style={{
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
    }}>
      <img src={studentPhoto || '/assets/img/user-avatar.svg'} alt='Student face' 
      style={{ 
      minHeight: '100px',
      minWidth: '100px',
       }} /> 
      </div>
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
            onClick={() => confirmDeleteMany()}
          />
          <Button label="New" icon="pi pi-plus" className="p-button-rounded" onClick={e => handleCreate(e)}/>
        </div>
      </div>
    );
  };
  return (
    <div>
      <h1>Reviews</h1>
      <div className="datatable-responsive-demo customRating">
        <div className="card">
      <DataTable
        globalFilter={globalFilter}
        ref={dt}
        loading={isLoading}
        className={`${classes.datatable} p-datatable-lg p-datatable-responsive-demo animation-dataIn`}
        header={renderHeader()}
        emptyMessage="No reviews found"
        selection={selectedReviews}
        onSelectionChange={(e) => setSelectedReviews(e.value)}
        value={reviews || []}
        sortField='name'
        sortOrder={1}
        defaultSortOrder={1}
      >
        <Column selectionMode="multiple" style={{ width: "3em" }} />
        <Column field='studentPhoto' header="Image" body={imageBodyTemplate}></Column>
        {columnComponents}
        <Column field="overallScore" header="Score" body={ratingBodyTemplate} sortable></Column>
        <Column style={{textAlign: 'center'}} header="Actions" body={actionBodyTemplate}></Column>
      </DataTable>
        </div>
      </div>
      <Modal 
         title="Create Review"
         visible={showCreateReviewModal}
         setVisible={setShowCreateReviewModal}
         icon='review'
         big
      >
        <ReviewForm
          data={selectedReview}
          onSubmit={createReview}
          onUpdate={handleUpdateReview}
        />
      </Modal>
    </div>
  )
}

