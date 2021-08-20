import React, { useState, useRef } from 'react'
import { Galleria } from 'primereact/galleria';
import dynamic from 'next/dynamic'
import { Menu } from 'primereact/menu';
import { Tooltip } from 'primereact/tooltip';
import Modal from 'components/UI/Molecules/Modal'
import FamilyPicturesModal from 'components/Families/modals/FamilyPicturesForm'
//styles
import classes from 'styles/UI/Organism/Gallery.module.scss'

type thumbnailType = {
    src: string
    alt: string
}
const removeSpaces = (sentence: string) => {
    return sentence.split('').filter(e => e.trim().length).join('').trim()
}

const thumbnailTemplate: React.FC<thumbnailType> = ({ src, alt }) => {
    return <>
        <Tooltip target={`#thumbnail-${removeSpaces(alt)}`}>{alt}</Tooltip>
        <img id={`thumbnail-${removeSpaces(alt)}`} className={`${classes.thumbnail}`} src={src} alt={alt} style={{ maxWidth: '100px', width: '100%', marginRight: '3vw', aspectRatio: '1/1' }} />
    </>
}


export default function Gallery({ images }) {
    const menu = useRef(null)
    const [showViewer, setShowViewer] = useState(false)
    const Viewer = dynamic(() => import('react-viewer'), { ssr: false })
    const [selectedItem, setSelectedItem] = useState(0)
    const [showCreateModal, setShowCreateModal] = useState(false)

    const itemTemplate = ({ src, alt, id }) => {
        setSelectedItem(id)
        return <img className={classes.image} src={src} alt={alt} onClick={() => { setShowViewer(true) }} style={{ maxWidth: '100%', aspectRatio: '2/1', cursor: 'pointer' }} />
    }
    let menuItems = [
        { label: 'New', icon: 'pi pi-fw pi-plus', command: () => { setShowCreateModal(true) } },
        // { label: 'Edit', icon: 'pi pi-pencil' },
        // { label: 'Delete', icon: 'pi pi-fw pi-trash'}
    ];
    return (
        <>
            <div className={classes.container}>
                <Galleria
                    className={classes.gallery}
                    value={images}
                    item={itemTemplate}
                    numVisible={5}
                    thumbnail={thumbnailTemplate}
                    style={{ maxWidth: '640px' }} />
                <Tooltip target=".menu" position="left">Options</Tooltip><button
                    className={`${classes.menu_button} menu`}
                    onClick={(event) => menu.current.toggle(event)}
                >
                    <i className="pi pi-ellipsis-v"></i>
                </button>
                <Menu
                    model={menuItems}
                    popup ref={menu}
                />
            </div>
            <Viewer activeIndex={selectedItem} onClose={() => { setShowViewer(false) }} visible={showViewer} images={images} />
            <Modal big title="Add new family photos" visible={showCreateModal} setVisible={setShowCreateModal} icon="family">
                <FamilyPicturesModal />
            </Modal>
        </>
    )
}