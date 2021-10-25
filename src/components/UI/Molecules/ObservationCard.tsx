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
        <div className={classes.card}
        style={{
            margin: '16px 20px',
            borderRadius: '4px',
            border: '1px solid rgba(120,120,120,.3)',
            overflow:'auto'
        }}>
            <div className={classes.card_header} 
            style={{
                display:'flex',
                justifyContent:'space-between',
                alignContent:'center',
                borderBottom:'1px solid rgb(240,240,240)',
                padding: '8px 20px'
            }}>
                <p style={{margin:'0px'}}><strong>From:</strong> {author?.email}</p>
                {
                    session?.user?.email === author.email && 
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
            </div>
            <div className={classes.card_body}
            style={{
                padding:'8px 16px 12px'
            }}>
                <p style={{
                    margin:'4px 0px'
                }}><strong>Observation: </strong>{content}</p>
                <span>{updatedAt}</span>
            </div>
        </div>
    )
}
export default ObservationCard
