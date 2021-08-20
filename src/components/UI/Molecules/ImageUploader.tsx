import React,{useState, useMemo, useContext} from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/client';
import FileUploader from 'components/UI/Atoms/FileUploader'
import { ProgressBar } from 'primereact/progressbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { confirmDialog } from 'primereact/confirmdialog'
import { Button } from "primereact/button";
//styles
import classes from 'styles/UI/Molecules/ImageUploader.module.scss'
//context
import {FamilyContext} from 'context/FamilyContext'
//services
import FamiliesService from 'services/Families'

const msFamily = 'ms-fands'

export default function ImageUploader({id, name, onChange, }) {
    const [pictures, setPictures] = useState([])
    const formData = useMemo(() => new FormData(), [])
    const [isLoading, setIsloading] = useState(false)
    const [progress, setProgress] = useState(0)
    const {family} = useContext(FamilyContext) 
    const [session] = useSession()
    const onChangeHandler = (e) => {
       formData.set(`familyPictures[${pictures.length}][picture]`, e.target.files[0])
       setPictures([...pictures,{src: URL.createObjectURL(e.target.files[0]), caption: e.target.files[0].name, id: pictures.length}])
    }
    const submit = () => {
        setIsloading(true)
            axios({
            url: `${process.env.NEXT_PUBLIC_API_URL}/${msFamily}/admin/families/${family._id}`,
            method: 'PUT',
            data: formData,
            onUploadProgress: (p) => {
                setProgress((p.loaded / p.total)*100)
            },
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${session?.token}`
            },
            })
    }
    const handleDelete = ({id}) => {
        const updatedData = [...pictures]
        updatedData.splice(id, 1)
        console.log(id)
        setPictures(updatedData)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        for(const picture of pictures){
            formData.set(`familyPictures[${picture.id}][caption]`, picture.caption)
        }

        for (var key of formData.keys()) {
        console.log(key, formData.get(key));
        }
        console.log(pictures)
        // submit()
    }
    const confirmDelete = data => {
        confirmDialog({
            message: `Are you sure you want to delete this picture?`,
            header: 'Confirm Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept: () =>{handleDelete(data)}, 
            reject: () => {}
        });
    }
    const pictureThumbnail = (rowData) =>{
        return(
            <img src={rowData.src} alt='' style={{width:'100px'}}/>
        )
    }
    const onEditorValueChange = (props, value) => {
        let updatedCaptions = [...props.value];
        updatedCaptions[props.rowIndex][props.field] = value;
        setPictures(updatedCaptions)
    }
    const inputTextEditor = (props, field) => {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => onEditorValueChange(props, e.target.value)} />;
    }
    const captionEditor = (props) => {
        return inputTextEditor(props, 'caption');
    }
    const deleteTemplate = (rowData)=>{
        return(
            <Button
            icon="pi pi-trash"
            className="p-button-danger p-button-rounded"
            onClick={() => confirmDelete(rowData)}
          />
        )
    } 

    return (
        <form onSubmit={handleSubmit}>
        <div className={classes.container}>
            <p>Drop your pictures here</p> 
            <FileUploader id={id} name={name} onChange={(e)=> {onChangeHandler(e)}} placeholder='Choose images'/>
        </div> 
        <DataTable value={pictures} style={{marginBottom: '2em'}}>
            <Column 
                body={pictureThumbnail} 
                header="Picture"
                headerStyle={{ borderTop:'none'}}
                ></Column>
            <Column 
                header="Caption" 
                field='caption'editor={(props) => captionEditor(props)}
                headerStyle={{ borderTop:'none'}}
                
                ></Column>
            <Column 
                header="Delete" 
                body={deleteTemplate}
                headerStyle={{textAlign: "center", borderTop:'none'}}
                bodyStyle={{ textAlign: "center", overflow: "visible" }}></Column>
        </DataTable>
        {isLoading && 
            <ProgressBar value={Math.round(progress)}></ProgressBar>
        }
        <div className="align_right">
            <Button type="submit">Save</Button>
        </div>
        
        </form>
    )
}
