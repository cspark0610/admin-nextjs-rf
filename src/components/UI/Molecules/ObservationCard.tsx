import React from 'react'
//components
import { Button } from 'primereact/button';
//style
import classes from 'styles/UI/Molecules/ObservationCard.module.scss'
export default function ObservationCard() {
    return (
        <div className={classes.card}>
            <div className={classes.card_header}>
                <p>From: Jonh Smith</p>
                <div>
                    <Button icon="pi pi-pencil" className={`p-button-rounded ${classes.btn_white}`} />
                    <Button icon="pi pi-trash" className={`p-button-rounded p-button-danger ${classes.btn_white}`} />
                </div>
            </div>
            <div className={classes.card_body}>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In veniam unde facere illo officiis? Minima vitae aliquam cum nobis totam?</p>
                <span>12-12-2021</span>
            </div>
        </div>
    )
}
