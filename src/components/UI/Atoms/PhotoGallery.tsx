// main tools
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

// prime components
import { Galleria } from 'primereact/galleria'
import { FileUpload } from 'primereact/fileupload'

// components
import { GalleryThumbnailTemplate } from '../Molecules/Gallery/thumbnailTemplate'
import { GalleryItemTemplate } from '../Molecules/Gallery/ItemTemplate'

// styles
import inputStyles from 'styles/UI/inputs.module.scss'
import buttonStyles from 'styles/UI/buttons.module.scss'
import galleryStyles from 'styles/UI/gallery.module.scss'

// types
import { FileUploadHeaderTemplateOptions } from 'primereact/fileupload'
import { FileUploadSelectParams } from 'primereact/fileupload'
import { FC, Dispatch } from 'react'

type PhotoGalleryProps = {
  pictures: { name: string; photos: { photo: string }[] }[]
  dispatch: Dispatch<{
    type: string
    payload: {
      file: File | { caption: string; photo: string }
      selectedCategory: string
    }
  }>
  selectedCategory: string
}

export const PhotoGallery: FC<PhotoGalleryProps> = ({
  selectedCategory,
  pictures,
  dispatch,
}) => {
  const uploader = useRef<FileUpload>(null)
  const responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 },
  ]

  const handleRemovePicture = (pic: { caption: string; photo: string }) =>
    dispatch({
      type: 'handleRemoveHomePictures',
      payload: { file: pic, selectedCategory },
    })
  // setGallery(gallery.filter((picture) => picture !== pic))

  const handleSelect = async (ev: FileUploadSelectParams) =>
    dispatch({
      type: 'handleAddHomePictures',
      payload: {
        file: new File(
          [ev.files[0]],
          dayjs().toISOString().concat(`-${ev.files[0].name}`),
          { type: ev.files[0].type }
        ),
        selectedCategory,
      },
    })

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => (
    <div className={`mb-3 ${buttonStyles.button}`}>{options.chooseButton}</div>
  )

  return pictures.length === 0 ? (
    <FileUpload
      customUpload
      ref={uploader}
      accept='image/*'
      maxFileSize={1000000}
      onSelect={handleSelect}
      chooseLabel='Add Picture'
      className={inputStyles.upload}
      headerTemplate={headerTemplate}
      contentClassName={inputStyles.upload_video}
      emptyTemplate={
        <Image
          width={300}
          height={300}
          alt='upload video'
          src='/assets/img/notVideoFound.svg'
        />
      }
    />
  ) : (
    <Galleria
      numVisible={5}
      thumbnailsPosition='bottom'
      className={galleryStyles.gallery}
      responsiveOptions={responsiveOptions}
      item={(pic) => GalleryItemTemplate(pic)}
      value={pictures.find((pic) => pic.name === selectedCategory)?.photos}
      thumbnail={(picture) =>
        GalleryThumbnailTemplate({ picture, handleRemovePicture })
      }
    />
  )
}
