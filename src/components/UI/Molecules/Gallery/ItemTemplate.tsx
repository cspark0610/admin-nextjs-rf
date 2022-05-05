// main tools
import Image from 'next/image'

// styles
import classes from 'styles/UI/gallery.module.scss'

// types
import { FC } from 'react'

type GalleryItemTemplateProps = {
  caption: string
  photo: string
}

export const GalleryItemTemplate: FC<GalleryItemTemplateProps> = ({
  caption,
  photo,
}) => <Image src={photo} width={300} height={300} alt={caption} />
