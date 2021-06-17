import React,{useState} from 'react'
//components
import { Dropdown } from 'primereact/dropdown';

//styles
import classes from 'styles/Families/Topbar.module.scss'

export default function Topbar() {
    const citySelectItems = [
        {label: 'New York', value: 'NY'},
        {label: 'Rome', value: 'RM'},
        {label: 'London', value: 'LDN'},
        {label: 'Istanbul', value: 'IST'},
        {label: 'Paris', value: 'PRS'}
    ];
    return (
        <header className={classes.topbar}>
            <section>
                <div>Family: <strong>Alex & Leslie Smith</strong></div>
                <div>Status: <Dropdown options={citySelectItems} placeholder="active"/></div>
                <div>Kind of family: <Dropdown options={citySelectItems} placeholder="Couple"/></div>
                <div>Category: <Dropdown options={citySelectItems} placeholder="Gold"/></div>
            </section>
        </header>
    )
}
