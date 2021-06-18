import React from 'react'

export default function FormGroup({title,children}) {
    return (
        <div>
            <p>{title}</p>
            <hr />
            <form>
                {children}
            </form>
        </div>
    )
}
