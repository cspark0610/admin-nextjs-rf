// main tools
import { useRef } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

// bootstrap components
import { Trash } from 'react-bootstrap-icons'

// prime components
import { FileUpload, FileUploadProps } from 'primereact/fileupload'

// styles
import classes from 'styles/UI/inputs.module.scss'

// types
import { FileUploadSelectParams } from 'primereact/fileupload'
import { ReviewDataType } from 'types/models/Review'
import { SetStateType } from 'types'
import { FC } from 'react'

interface IFileUploader extends FileUploadProps {
  data: string | File
  setData: SetStateType<ReviewDataType>
}
export const UploadFile: FC<IFileUploader> = ({ data, setData, ...props }) => {
  const uploader = useRef<FileUpload>(null)

  /**
   * handle delete picture/video
   */
  const handleDelete = () => {
    uploader.current?.clear()
    setData((prev) => ({ ...prev, [props.name as string]: null }))
  }

  /**
   * handle select picture/video
   */
  const handleSelect = async (ev: FileUploadSelectParams) => {
    const file = new File(
      [ev.files[0]],
      dayjs().toISOString().concat(` - ${ev.files[0].name}`),
      { type: ev.files[0].type }
    )

    setData((prev) => ({ ...prev, [props.name as string]: file }))
  }

  return (
    <div className={classes.upload_file}>
      {!data || data === 'null' ? (
        <FileUpload
          {...props}
          mode='basic'
          customUpload
          ref={uploader}
          maxFileSize={1000000}
          onSelect={handleSelect}
          accept={`${props.accept}/*`}
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
              className={classes.upload_preview_file}
              src={typeof data === 'string' ? data : URL.createObjectURL(data)}
            />
          ) : (
            <Image
              alt='profile'
              layout='fill'
              className={classes.upload_preview_file}
              src={typeof data === 'string' ? data : URL.createObjectURL(data)}
            />
          )}
          <div
            role='button'
            className={classes.upload_preview_trash}
            onClick={handleDelete}>
            <Trash />
          </div>
        </>
      )}
    </div>
  )
}
