import React, { useState, useRef, useEffect } from "react";
import Link from 'next/link'
//components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from 'primereact/multiselect';
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
//styles
import classes from "styles/Families/Datatable.module.scss";
import FamiliesService from "services/Families";
//utils 
import formatName from 'utils/formatName'
import { useSession } from "next-auth/client";

export default function Datatable() {
  const [selectedFamilies, setSelectedFamilies] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const dt = useRef(null);
  const [families, setFamilies] = useState([]);
  const toast = useRef(null);
  const [session, loading] = useSession()  

  const getFamilies = async () => {
    try {
      const data = await FamiliesService.getFamilies(session?.token);
      console.table('data: ',data)
      setFamilies(
        data.map((family) => {
          return {
            ...family,
            name: formatName(family.mainMembers),
            location: family.location
              ? `${family.location.province}, ${family.location.city}`
              : "No assigned",
            localManager:
              family.localManager ? family.localManager.name : "No assigned",
            status: family.status ? family.status : "no status",
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFamilies()
  }, [session]);

  //--- Status ------------------------------------------------------------
  const statuses = [
    "unqualified",
    "qualified",
    "new",
    "Low",
    "renewal",
    "Active",
  ];
  const onStatusChange = (e) => {
    dt.current.filter(e.value, "status", "equals");
    setSelectedStatus(e.value);
  };
  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };
  const statusBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className={`customer-badge status-${rowData.status}`}>
          {rowData.status}
        </span>
      </React.Fragment>
    );
  };
  const statusFilter = (
    <Dropdown
      value={selectedStatus}
      options={statuses}
      onChange={onStatusChange}
      itemTemplate={statusItemTemplate}
      placeholder="Select a Status"
      className="p-column-filter filter_dropdown"
      showClear
    />
  );

  //End status -----------------------------------------------------------------

  const actionBodyTemplate = (rowData) => {
    return (
      <Link href={`/families/${rowData.id}`}>
      <a>
      <Button
        type="button"
        icon="pi pi-pencil"
        className="p-button-secondary"
      ></Button>
      </a>
      </Link>
    );
  };

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setSelectedColumns(orderedSelectedColumns);
  };
  const columns = [
    { field: "name", header: "Name", filterPlaceholder: "Search by name" },
    { field: "type", header: "Type", filterPlaceholder: "Search by type" },
    {
      field: "location",
      header: "Location",
      filterPlaceholder: "Search by location",
    },
    {
      field: "familyMembers",
      header: "Number of aditional family members",
      filterPlaceholder: "Search by number of aditional family members",
    },
    {
      field: "localManagers",
      header: "Local Coordinator",
      filterPlaceholder: "Search by local coordinator",
    },
  ];
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
  const getFamiliesIds = (families) => {
    return families.map((family) => family.id);
  };
  const deleteFamilies = async () => {
    await FamiliesService.deleteFamilies(session?.token, { ids: getFamiliesIds(selectedFamilies) });
    console.log("families erased");
  };
  const accept = () => {
    deleteFamilies()
      .then(response => {
        getFamilies()
        toast.current.show({
          severity: "success",
          summary: "Confirmed",
          detail: "Families deleted successfully!",
          life: 3000,
        });
      })
      .catch(error => console.error(error))
  };

  const confirmDelete = () => {
    if(selectedFamilies){
      confirmDialog({
      message: "Do you want to delete this family?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
    });
    }
    
  };
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
          <MultiSelect
            value={selectedColumns}
            options={columns}
            optionLabel="header"
            onChange={onColumnToggle}
            style={{ width: "18em" }}
          />
        </div>

        <div className={classes.button_group}>
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger p-button-rounded"
            onClick={() => confirmDelete()}
          />
          <Button label="New" icon="pi pi-plus" className="p-button-rounded" />
        </div>
      </div>
    );
  };
  const header = renderHeader();
  return (
    <>
    <Toast ref={toast} />
    <DataTable
      ref={dt}
      className={`${classes.datatable} p-datatable-lg`}
      rowHover
      emptyMessage="No families found"
      value={families || []}
      header={header}
      globalFilter={globalFilter}
      selection={selectedFamilies}
      onSelectionChange={(e) => setSelectedFamilies(e.value)}
    >
      <Column selectionMode="multiple" style={{ width: "3em" }} />
      <Column field="name" header="Name" filterMatchMode="contains" filter sortable filterPlaceholder="Search by name"/> 

      <Column field="type" header="Type" filter filterPlaceholder="Search by type"/>
      <Column
        field="status"
        header="Status"
        sortable
        body={statusBodyTemplate}
        filter
        filterElement={statusFilter}
      />
      <Column field="location" header="Location" filterMatchMode="contains" filter filterPlaceholder="Search by location"/>
      <Column field="familyMembers" header="Number of family members" filter filterPlaceholder="Search by number of family members"/>
      <Column field="localManager" header="Local Coordinator" filter filterPlaceholder="Search by local coordinator"/>
      <Column
        body={actionBodyTemplate}
        headerStyle={{ width: "8em", textAlign: "center" }}
        bodyStyle={{ textAlign: "center", overflow: "visible" }}
      />
    </DataTable>
    </>
  );
}
