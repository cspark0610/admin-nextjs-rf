// main tools
import { useState, useRef } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

// bootstrap components
import { Trash } from 'react-bootstrap-icons'
import { Button } from 'react-bootstrap'

// prime components
import { FileUpload, FileUploadProps } from 'primereact/fileupload'

// styles
import classes from 'styles/UI/inputs.module.scss'

// types
import { FileUploadSelectParams } from 'primereact/fileupload'
import { FC } from 'react'

export const UploadFile: FC<FileUploadProps> = ({ ...props }) => {
  const [data, setData] = useState('')
  const [file, setFile] = useState(data)
  const uploader = useRef<FileUpload>(null)

  const handleDelete = () => {
    uploader.current?.clear()
    setFile('')
    setData((prev: any) => ({ ...prev, profilePicture: null }))
  }

  const handleSelect = async (ev: FileUploadSelectParams) => {
    const file = new File(
      [ev.files[0]],
      dayjs().toISOString().concat(` - ${ev.files[0].name}`),
      { type: ev.files[0].type }
    )

    setData((prev: any) => ({ ...prev, profilePicture: file }))
    setFile(URL.createObjectURL(file))
  }

  return (
    <div className={classes.upload_file}>
      {!file ? (
        <FileUpload
          {...props}
          mode='basic'
          customUpload
          ref={uploader}
          accept={`${props.accept}/*`}
          maxFileSize={1000000}
          onSelect={handleSelect}
          chooseOptions={{
            icon: 'pi pi-cloud-upload',
            className: classes.upload_choose_file,
          }}
        />
      ) : (
        <>
          {props.accept === 'video' ? (
            <video
              controls
              src={file}
              className={classes.upload_preview_file}
            />
          ) : (
            <Image
              src={file}
              alt='profile'
              layout='fill'
              className={classes.upload_preview_file}
            />
          )}
          <div role='button' className={classes.upload_preview_trash} onClick={handleDelete}>
            <Trash  />
          </div>
        </>
      )}
    </div>
  )
}
