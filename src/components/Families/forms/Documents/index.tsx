import React from 'react'
//components
import Table from 'components/UI/Organism/Table'

export default function DocumentsForm() {
    
    const data= [{name:'Performance', description:'this is a doc', url:'https://wwww.docs.google.com'},{name:'Admin', description:'this is a doc', url:'https://wwww.docs.google.com'},{name:'Revenue', description:'this is a doc', url:'https://wwww.docs.google.com'}]
    const docsColumns = [
        {field: 'name', header: 'Name', filterPlaceholder: 'Search by name'},
        {field: 'description', header: 'Description', filterPlaceholder: 'Search by description'},
        {field: 'url', header: 'Url', filterPlaceholder: 'Search by url'},
    ]
    return (
        <div>
            <h1>Documents</h1>
            <Table name='Documents' columns={docsColumns} content={data} />
        </div>
    )
}
