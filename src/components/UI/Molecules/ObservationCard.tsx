import React from 'react'
import { useSession } from 'next-auth/client'
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
    onEdit?: (id: string,content: string)=> void
}

const ObservationCard : React.FC<Props>= ({author, content, updatedAt,onDelete, onEdit,id}) => {
    const [session] = useSession()
    // validation to not break the app
    if(!author){
        return null
    }
    return (
        <div className={classes.card}>
            <div className={classes.card_header}>
                {
                    session.user?.email === author.email && 
                <div>
                    <Button 
                        icon="pi pi-pencil"
                        className={`p-button-rounded ${classes.btn_white}`}
                        onClick={()=> {onEdit(id, content)}}
                        />
                    <Button 
                        icon="pi pi-trash"
                        className={`p-button-rounded p-button-danger ${classes.btn_white}`}
                        onClick={() => {onDelete(id)}}
                    />
                </div>
                }
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
