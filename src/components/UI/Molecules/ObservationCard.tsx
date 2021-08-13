import React from 'react'
//components
import { Button } from 'primereact/button';
//style
import classes from 'styles/UI/Molecules/ObservationCard.module.scss'
export default function ObservationCard({author, content, updatedAt}) {
    return (
        <div className={classes.card}>
            <div className={classes.card_header}>
                <div>
                    <Button icon="pi pi-pencil" className={`p-button-rounded ${classes.btn_white}`} />
                    <Button icon="pi pi-trash" className={`p-button-rounded p-button-danger ${classes.btn_white}`} />
                </div>
                <p><strong>From:</strong> {author.email}</p>
            </div>
            <div className={classes.card_body}>
                <p>{content}</p>
                <span>{updatedAt}</span>
            </div>
        </div>
    )
}
