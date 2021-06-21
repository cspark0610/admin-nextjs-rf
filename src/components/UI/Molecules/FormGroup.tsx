import React from 'react'

interface props {
    title: string,
    children : any,
    customClass?: string
}

export default function FormGroup<props>({title,customClass,children}) {
    return (
        <div>
            <p className="info-color weight-medium">{title}</p>
            <hr />
            <div className={customClass}>
                {children}
            </div>
        </div>
    )
}
