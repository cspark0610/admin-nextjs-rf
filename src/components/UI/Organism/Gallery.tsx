import React,{useState} from 'react'
import { Galleria } from 'primereact/galleria';
import dynamic from 'next/dynamic'

const itemTemplate = ({src, alt}) => {
    return <img src={src} alt={alt} style={{ maxWidth: '100%', aspectRatio:'2/1' }} />
}
const thumbnailTemplate = ({src, alt}) => {
    return <img src={src} alt={alt}  style={{ maxWidth: '100px', width:'100%', marginRight:'3vw', aspectRatio:'1/1' }}/>
}
export default function Gallery({images}) {
    const [showViewer, setShowViewer] = useState(false)
    const Viewer = dynamic(()=> import('react-viewer'), {ssr: false})
    return (
        <>
            <Galleria value={images} item={itemTemplate} numVisible={5} thumbnail={thumbnailTemplate} style={{ maxWidth: '640px' }}/>
            <Viewer visible={showViewer} images={images}/>
        </>
    )
}
