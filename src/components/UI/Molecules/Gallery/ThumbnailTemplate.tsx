// main tools
import Image from 'next/image'

// styles
import classes from 'styles/UI/gallery.module.scss'

// types
import { PictureDataType } from 'types/models/Family'
import { FC } from 'react'

type GalleryThumbnailTemplateProps = {
  picture: PictureDataType | File
}

export const GalleryThumbnailTemplate: FC<GalleryThumbnailTemplateProps> = ({
  picture,
}) => (
  <Image
    width={60}
    height={60}
    className={classes.upload_preview_img}
    alt={
      (picture as PictureDataType)?.caption
        ? (picture as PictureDataType)?.caption
        : URL.createObjectURL(picture as File)
    }
    src={
      (picture as PictureDataType)?.picture
        ? (picture as PictureDataType)?.picture
        : URL.createObjectURL(picture as File)
    }
  />
)
