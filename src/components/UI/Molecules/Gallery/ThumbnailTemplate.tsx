// main tools
import Image from 'next/image'

// bootstrap components
import { CloseButton } from 'react-bootstrap'

// styles
import classes from 'styles/UI/gallery.module.scss'

// types
import { FC } from 'react'

type GalleryThumbnailTemplateProps = {
  picture: { caption: string; photo: string }
  handleRemovePicture: (pic: { caption: string; photo: string }) => void
}

export const GalleryThumbnailTemplate: FC<GalleryThumbnailTemplateProps> = ({
  picture,
  handleRemovePicture,
}) => (
  <>
    <Image
      width={120}
      height={120}
      src={picture.photo}
      alt={picture.caption}
      className={classes.upload_preview_img}
    />
    <CloseButton
      className={classes.upload_preview_close}
      onClick={() => handleRemovePicture(picture)}
    />
  </>
)
