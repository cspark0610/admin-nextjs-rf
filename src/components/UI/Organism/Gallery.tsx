import React,{useState} from 'react'
import { Galleria } from 'primereact/galleria';
import dynamic from 'next/dynamic'


const thumbnailTemplate = ({src, alt}) => {
    return <img src={src} alt={alt}  style={{ maxWidth: '100px', width:'100%', marginRight:'3vw', aspectRatio:'1/1' }}/>
}
export default function Gallery({images}) {
    const [showViewer, setShowViewer] = useState(false)
    const Viewer = dynamic(()=> import('react-viewer'), {ssr: false})
    const [selectedItem, setSelectedItem] = useState(0)
    
    const itemTemplate = ({src, alt, id}) => {
        setSelectedItem(id)
        return <img src={src} alt={alt}  onClick={()=>{setShowViewer(true)}} style={{ maxWidth: '100%', aspectRatio:'2/1', cursor:'pointer' }} />
        }
    return (
        <>
            <div>
                <Galleria 
                    value={images} 
                    item={itemTemplate} 
                    numVisible={5} 
                    thumbnail={thumbnailTemplate} 
                    style={{ maxWidth: '640px' }}/>
            </div>
            <Viewer activeIndex={selectedItem} onClose={()=> {setShowViewer(false)}} visible={showViewer} images={images}/>
        </>
    )
}
