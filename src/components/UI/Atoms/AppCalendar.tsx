import React from 'react'
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

const AppCalendar = ({value, placeholder, onChange}) => {
    const monthNavigatorTemplate = (e: any) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }

    const yearNavigatorTemplate = (e: any) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
    }

    return(
       <Calendar
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            monthNavigator 
            yearNavigator 
            yearRange="2010:2030"
            monthNavigatorTemplate={monthNavigatorTemplate}
            yearNavigatorTemplate={yearNavigatorTemplate}
       /> 
    )
}
export default AppCalendar