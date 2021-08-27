import React from 'react'
import Image from 'next/image'

export default function ServiceBox({icon,title,onChangeState, svcId, selector}) {
    const handleSelecService = (e) => {
        onChangeState(e.target.getAttribute('id'))
    }
    let isSelected = (selector.filter(svc => svc === svcId).length === 1) ? true : false
    return (
        <div className={`service-box ${isSelected && 'selected'}`} onClick={handleSelecService}>
             {/*<Icon classes={classes.icon} svg={icon || 'misc' }/>*/}
             <Image src={icon} width={40} height={40} className="svcicon" />
            <h5>{title || 'Aire Acondicionado'}</h5>
            {/*grants click on the same layer to catch the svcId*/}
            <div className="overlay" id={svcId}></div>
        </div>
    )
}
