import React from 'react'
//components
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
//styles
import classes from 'styles/Families/Topbar.module.scss'

export default function Topbar() {
    const items = [
        {label: 'Home details', icon: 'pi pi-fw pi-home'},
        {label: 'Family', icon: 'pi pi-fw pi-calendar'},
        {label: 'Description', icon: 'pi pi-fw pi-pencil'},
        {label: 'Reviews', icon: 'pi pi-fw pi-file'},
        {label: 'Activity', icon: 'pi pi-fw pi-cog'},
        {label: 'Documents', icon: 'pi pi-fw pi-cog'},
        {label: 'Contact', icon: 'pi pi-fw pi-cog'},
        {label: 'Others', icon: 'pi pi-fw pi-cog'}
    ];
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
            <TabMenu model={items} />
        </header>
    )
}
