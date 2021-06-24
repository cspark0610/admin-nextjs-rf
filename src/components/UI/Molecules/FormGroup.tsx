import React from 'react'

type propTypes = {
    title: string,
    children : any,
    customClass?: string
}

interface Props {
    (props: propTypes): JSX.Element
}

const FormGroup : Props = ({title,customClass,children}) => {
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

export default FormGroup