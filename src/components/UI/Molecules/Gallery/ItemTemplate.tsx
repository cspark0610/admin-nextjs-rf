// main tools
import Image from 'next/image'

// types
import { PictureDataType } from 'types/models/Family'
import { FC } from 'react'

type GalleryItemTemplateProps = {
  pic: File | PictureDataType
}

export const GalleryItemTemplate: FC<GalleryItemTemplateProps> = ({ pic }) => (
  <Image
    width={500}
    height={300}
    objectFit='cover'
    alt={
      (pic as PictureDataType)?.caption
        ? (pic as PictureDataType)?.caption
        : URL.createObjectURL(pic as File)
    }
    src={
      (pic as PictureDataType)?.picture
        ? (pic as PictureDataType)?.picture
        : URL.createObjectURL(pic as File)
    }
  />
)
