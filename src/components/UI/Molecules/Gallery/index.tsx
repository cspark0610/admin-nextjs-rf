// main tools
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

// prime components
import { FileUpload } from 'primereact/fileupload'
import { Galleria } from 'primereact/galleria'

// components
import { GalleryThumbnailTemplate } from './ThumbnailTemplate'
import { GalleryItemTemplate } from './ItemTemplate'
import { PicturesList } from './PicturesList'

// styles
import classes from 'styles/UI/gallery.module.scss'

// types
import { FileUploadHeaderTemplateOptions } from 'primereact/fileupload'
import { FileUploadSelectParams } from 'primereact/fileupload'
import { PictureDataType } from 'types/models/Family'
import { Button, Col, Row } from 'react-bootstrap'
import { FC, Dispatch } from 'react'

type PhotoGalleryProps = {
  selectedCategory?: string
  dataCase: 'home' | 'family'
  pictures?: (File | PictureDataType)[]
  dispatch: Dispatch<{
    type: string
    payload:
      | File
      | { file: File; category?: string }
      | { picture: File | PictureDataType; category?: string }
  }>
}

export const PhotoGallery: FC<PhotoGalleryProps> = ({
  dataCase,
  pictures,
  dispatch,
  selectedCategory,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const uploader = useRef<FileUpload>(null)
  const responsiveOptions = [
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 },
  ]
  const key = dataCase === 'family' ? 'Family' : 'Home'

  /**
   * handle active/disable delete pictures
   */
  const handleDeletePictures = () => setDeleting(!deleting)

  /**
   * handle remove picture
   */
  const handleRemovePicture = (picture: File | PictureDataType) =>
    dispatch({
      type: `handleRemove${key}Picture`,
      payload: {
        picture,
        category: dataCase === 'home' ? selectedCategory : undefined,
      },
    })

  /**
   * handle select new picture
   */
  const handleSelect = async (ev: FileUploadSelectParams) => {
    dispatch({
      type: `handleAdd${key}Picture`,
      payload:
        dataCase === 'family'
          ? new File(
              [ev.files[0]],
              dayjs().toISOString().concat(`-${ev.files[0].name}`),
              { type: ev.files[0].type }
            )
          : {
              file: new File(
                [ev.files[0]],
                dayjs().toISOString().concat(`-${ev.files[0].name}`),
                { type: ev.files[0].type }
              ),
              category: selectedCategory,
            },
    })
    uploader.current?.clear()
  }

  /**
   * header template
   */
  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => (
    <div className={`mb-3 ${classes.button}`}>{options.chooseButton}</div>
  )

  /**
   * handle return to index 0 on deleting pictures
   */
  useEffect(() => setActiveIndex(0), [deleting])

  return (
    <>
      {pictures?.length === 0 ? (
        <FileUpload
          customUpload
          accept='image/*'
          maxFileSize={1000000}
          onSelect={handleSelect}
          chooseLabel='Add Picture'
          className={classes.upload}
          headerTemplate={headerTemplate}
          contentClassName={classes.upload_video}
          emptyTemplate={
            <Image
              width={300}
              height={400}
              alt='upload video'
              src='/assets/img/notVideoFound.svg'
            />
          }
        />
      ) : (
        <>
          <Row>
            <Col xs={6}>
              <FileUpload
                mode='basic'
                customUpload
                ref={uploader}
                accept='image/*'
                maxFileSize={1000000}
                onSelect={handleSelect}
                chooseLabel='Add Picture'
                className={`mb-3 ${classes.button}`}
              />
            </Col>
            <Col xs={6}>
              <Button
                onClick={handleDeletePictures}
                className={`w-100 ${classes.button_cancel}`}>
                {deleting ? 'Stop deleting' : 'Delete pictures'}
              </Button>
            </Col>
          </Row>
          {deleting ? (
            <PicturesList
              pictures={pictures}
              handleRemovePicture={handleRemovePicture}
            />
          ) : (
            <Galleria
              numVisible={4}
              value={pictures}
              activeIndex={activeIndex}
              thumbnailsPosition='bottom'
              className={classes.gallery}
              responsiveOptions={responsiveOptions}
              item={(pic) => GalleryItemTemplate({ pic })}
              onItemChange={(e) => setActiveIndex(e.index)}
              thumbnail={(picture) => GalleryThumbnailTemplate({ picture })}
            />
          )}
        </>
      )}
    </>
  )
}
