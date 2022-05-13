// main tools
import { useRef } from 'react'
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
import { FC, Dispatch } from 'react'

type UploadPictureProps = {
  data: string
  dispatch: Dispatch<{
    type: string
    payload: { file: File; index?: number } | number | null
  }>
  index?: number
}

export const UploadMainMembersPicture: FC<UploadPictureProps> = ({
  data,
  index,
  dispatch,
}) => {
  const uploader = useRef<FileUpload>(null)

  const handleDelete = () => {
    uploader.current?.clear()
    dispatch({ type: 'handleRemoveMainMembersPhoto', payload: index! })
  }

  const handleSelect = async (ev: FileUploadSelectParams) =>
    dispatch({
      type: 'handleAddMainMembersPhoto',
      payload: { file: ev.files[0], index },
    })

  return (
    <div className={classes.upload_img}>
      {!data || data === 'undefined' ? (
        <FileUpload
          mode='basic'
          customUpload
          ref={uploader}
          accept='image/*'
          maxFileSize={1000000}
          onSelect={handleSelect}
          chooseOptions={{ className: classes.upload_choose_img }}
        />
      ) : (
        <>
          <Image
            width={120}
            height={120}
            alt='profile'
            className={classes.upload_preview_img}
            src={typeof data === 'string' ? data : (data as any).objectURL}
          />
          <CloseButton
            onClick={handleDelete}
            className={classes.upload_preview_close}
          />
        </>
      )}
    </div>
  )
}
