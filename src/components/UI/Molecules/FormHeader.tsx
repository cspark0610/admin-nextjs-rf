import React, {useContext} from 'react'
import { Button } from 'primereact/button';
//styles
import classes from 'styles/UI/Molecules/FormHeader.module.scss'
import { FamilyContext } from 'context/FamilyContext'
interface Props {
    title: string,
    isLoading?: boolean
    onClick: ()=> void
}

const FormHeader : React.FC<Props>= ({title, isLoading, onClick}) => {
    const { activeUserType } = useContext(FamilyContext)
    return (
        <div className={classes.container}>
            <h1>{title}</h1>
            {activeUserType !== 'Reader' &&
            <Button onClick={onClick} loading={isLoading} label="Save" icon="pi pi-save" className="p-button-rounded" />
            }
        </div>
    )
}

export default  FormHeader
