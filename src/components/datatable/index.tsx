import React from 'react'
//components
import { DataTable} from 'primereact/datatable'
import { Column } from 'primereact/column'

export default function Datatable() {
    const data = [
        {
            name: 'Thompson',
            type: 'single parent',
            status:'active',
            location: 'Toronto',
            mainMembers: 'Jason Smith',
            familyMembers: '4',
            localManagers: 'Steve Jobs'
        },
        {
            name: 'Brown',
            type: 'single parent',
            status:'active',
            location: 'Toronto',
            mainMembers: 'Jason Smith',
            familyMembers: '4',
            localManagers: 'Steve Jobs'
        },
        {
            name: 'Chung',
            type: 'couple',
            status:'active',
            location: 'Toronto',
            mainMembers: 'Jason Smith',
            familyMembers: '4',
            localManagers: 'Steve Jobs'
        },
        
    ]
    
    return (
        <DataTable value={data} >
            <Column selectionMode="multiple" headerStyle={{ background: 'red' }}></Column>
            <Column field="name" header="Name" sortable></Column>
            <Column field="type" header="Type" sortable></Column>
            <Column field="status" header="Status" sortable></Column>
            <Column field="location" header="Location" sortable></Column>
            <Column field="mainMembers" header="Main members" sortable></Column>
            <Column field="familyMembers" header="Family members" sortable></Column>
            <Column field="localManagers" header="Local manager" sortable></Column>
        </DataTable>
    )
}
