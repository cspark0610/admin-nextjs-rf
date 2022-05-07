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
  dispatch: Dispatch<{ type: string; payload: File | null }>
}

export const UploadPicture: FC<UploadPictureProps> = ({ data, dispatch }) => {
  const uploader = useRef<FileUpload>(null)

  const handleDelete = () => {
    uploader.current?.clear()
    dispatch({ type: 'handleRemoveMainMembersPhoto', payload: null })
  }

  const handleSelect = async (ev: FileUploadSelectParams) => {
    dispatch({
      type: 'handleAddMainMembersPhoto',
      payload: new File(
        [ev.files[0]],
        dayjs().toISOString().concat(`-${ev.files[0].name}`),
        { type: ev.files[0].type }
      ),
    })
  }

  return (
    <div className={classes.upload_img}>
      {!data ? (
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
            src={data}
            alt='profile'
            width={120}
            height={120}
            className={classes.upload_preview_img}
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
