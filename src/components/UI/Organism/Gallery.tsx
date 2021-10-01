import React, { useState, useRef, Dispatch, SetStateAction } from 'react'
import { Galleria } from 'primereact/galleria'
import dynamic from 'next/dynamic'
import { Menu } from 'primereact/menu'
import { Tooltip } from 'primereact/tooltip'
import Modal from 'components/UI/Molecules/Modal'
import FamilyPicturesModal from 'components/Families/modals/FamilyPicturesForm'
import HomePicturesForm from 'components/Families/modals/HomePicturesModal'
//styles
import classes from 'styles/UI/Organism/Gallery.module.scss'

interface Props {
  images: thumbnailType[]
  options?: boolean
  homeCase?: boolean
  setHomePictures?: Dispatch<SetStateAction<any>>
}

type thumbnailType = {
  src: string
  alt: string
}
const removeSpaces = (sentence: string) => {
  return sentence
    ?.split('')
    .filter((e) => e.trim().length)
    .join('')
    .trim()
}

const thumbnailTemplate: React.FC<thumbnailType> = ({ src, alt }) => {
  return (
    <>
      <Tooltip target={`#thumbnail-${removeSpaces(alt)}`}>{alt}</Tooltip>
      <img
        id={`thumbnail-${removeSpaces(alt)}`}
        className={`${classes.thumbnail}`}
        src={src}
        alt={alt}
        style={{
          maxWidth: '100px',
          width: '100%',
          marginRight: '3vw',
          aspectRatio: '1/1',
        }}
      />
    </>
  )
}

const Gallery: React.FC<Props> = ({
  images,
  options,
  homeCase = false,
  setHomePictures = null,
}) => {
  const menu = useRef(null)
  const [showViewer, setShowViewer] = useState(false)
  const [selectedItem, setSelectedItem] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const Viewer = dynamic(() => import('react-viewer'), { ssr: false })

  const itemTemplate = ({ src, alt, id, idx }) => {
    setSelectedItem(idx !== undefined ? idx : id)

    return (
      <img
        className={classes.image}
        src={src}
        alt={alt}
        onClick={() => setShowViewer(true)}
        style={{ maxWidth: '100%', aspectRatio: '2/1', cursor: 'pointer' }}
      />
    )
  }
  let menuItems = [
    {
      label: 'New',
      icon: 'pi pi-fw pi-plus',
      command: () => setShowCreateModal(true),
    },
  ]

  return (
    <>
      <div className={classes.container}>
        {images?.length > 0 ? (
          <Galleria
            className={classes.gallery}
            value={images}
            item={itemTemplate}
            numVisible={5}
            thumbnail={thumbnailTemplate}
            style={{ maxWidth: '640px' }}
          />
        ) : (
          <img
            style={{ borderRadius: '14px', width: '100%' }}
            src='/assets/img/photoNotFound.svg'
            alt='You have not uploaded an image yet'
          />
        )}

        <Tooltip target='.menu' position='left'>
          Options
        </Tooltip>
        {options && (
          <button
            className={`${classes.menu_button} menu`}
            onClick={(event) => menu.current.toggle(event)}
          >
            <i className='pi pi-ellipsis-v'></i>
          </button>
        )}
        <Menu model={menuItems} popup ref={menu} />
      </div>
      <Viewer
        activeIndex={selectedItem}
        onClose={() => setShowViewer(false)}
        visible={showViewer}
        images={images}
        zIndex={999999}
      />
      <Modal
        big
        title='Add new family photos'
        visible={showCreateModal}
        setVisible={setShowCreateModal}
        icon='family'
      >
        {homeCase ? (
          <HomePicturesForm
            pictures={images}
            setVisible={setShowCreateModal}
            setPictures={setHomePictures}
          />
        ) : (
          <FamilyPicturesModal setVisible={setShowCreateModal} />
        )}
      </Modal>
    </>
  )
}
export default Gallery
