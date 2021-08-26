import React from 'react'
//components
import { Button } from 'primereact/button';
//style
import classes from 'styles/UI/Molecules/ObservationCard.module.scss'

interface Props {
    id: string
    author: {
        id: string
        email:string
    },
    content: string
    updatedAt: string
    onDelete?: (id: string)=> void
}

const ObservationCard : React.FC<Props>= ({author, content, updatedAt,onDelete, id}) => {
    return (
        <div className={classes.card}>
            <div className={classes.card_header}>
                <div>
                    <Button icon="pi pi-pencil" className={`p-button-rounded ${classes.btn_white}`} />
                    <Button 
                        icon="pi pi-trash"
                        className={`p-button-rounded p-button-danger ${classes.btn_white}`}
                        onClick={() => {onDelete(id)}}
                    />
                </div>
                <p><strong>From:</strong> {author?.email}</p>
            </div>
            <div className={classes.card_body}>
                <p>{content}</p>
                <span>{updatedAt}</span>
            </div>
        </div>
    )
}
export default ObservationCard
