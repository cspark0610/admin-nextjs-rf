// main tools
import Image from 'next/image'

// bootstrap components
import { Row, Col } from 'react-bootstrap'

// styles
import classes from 'styles/UI/gallery.module.scss'

// types
import { PictureDataType } from 'types/models/Family'
import { FC } from 'react'

type PicturesListProps = {
  pictures?: (File | PictureDataType)[]
  handleRemovePicture: (pic: File | PictureDataType) => void
}

export const PicturesList: FC<PicturesListProps> = ({
  pictures,
  handleRemovePicture,
}) => (
  <Row>
    {pictures?.map((pic, idx) => (
      <Col key={idx} xl={3} lg={3} md={4} xs={6}>
        <Image
          width={130}
          height={130}
          role='button'
          className={classes.gallery_delete}
          onClick={() => handleRemovePicture(pic)}
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
      </Col>
    ))}
  </Row>
)
