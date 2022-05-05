// main tools
import { useState, useRef } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

// bootstrap components
import { CloseButton } from 'react-bootstrap'

// prime components
import { FileUpload } from 'primereact/fileupload'

// styles
import classes from 'styles/UI/inputs.module.scss'

// types
import { FileUploadSelectParams } from 'primereact/fileupload'
import { FC } from 'react'

export const UploadPicture: FC = () => {
  const [data, setData] = useState('')
  const [picture, setPicture] = useState(data)
  const uploader = useRef<FileUpload>(null)

  const handleDelete = () => {
    uploader.current?.clear()
    setPicture('')
    setData((prev: any) => ({ ...prev, profilePicture: null }))
  }

  const handleSelect = async (ev: FileUploadSelectParams) => {
    const picture = new File(
      [ev.files[0]],
      dayjs().toISOString().concat(` - ${ev.files[0].name}`),
      { type: ev.files[0].type }
    )

    setData((prev: any) => ({ ...prev, profilePicture: picture }))
    setPicture(URL.createObjectURL(picture))
  }

  return (
    <div className={classes.upload}>
      <div className={classes.upload_container}>
        {!picture ? (
          <FileUpload
            mode='basic'
            customUpload
            ref={uploader}
            accept='image/*'
            maxFileSize={1000000}
            onSelect={handleSelect}
            chooseOptions={{ className: classes.upload_input }}
          />
        ) : (
          <div className={classes.upload_preview}>
            <Image
              src={picture}
              alt='profile'
              width={120}
              height={120}
              className={classes.upload_preview_img}
            />
            <CloseButton
              onClick={handleDelete}
              className={classes.upload_preview_close}
            />
          </div>
        )}
      </div>
    </div>
  )
}
