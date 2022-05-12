// main tools
import { useState, useRef } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

// bootstrap components
import { CloseButton } from 'react-bootstrap'

// prime components
import { FileUpload } from 'primereact/fileupload'

// styles
import inputStyles from 'styles/UI/inputs.module.scss'
import buttonStyles from 'styles/UI/buttons.module.scss'

// types
import { FileUploadHeaderTemplateOptions } from 'primereact/fileupload'
import { FileUploadSelectParams } from 'primereact/fileupload'
import { FC, Dispatch } from 'react'

type UploadVideoProps = {
  data: string
  dispatch: Dispatch<{ type: string; payload: File | null }>
}

export const UploadVideo: FC<UploadVideoProps> = ({ data, dispatch }) => {
  const uploader = useRef<FileUpload>(null)

  const handleDelete = () => {
    uploader.current?.clear()
    dispatch({ type: 'handleRemoveHomeVideo', payload: null })
  }

  const handleSelect = async (ev: FileUploadSelectParams) => {
    dispatch({
      type: 'handleAddHomeVideo',
      payload: new File(
        [ev.files[0]],
        dayjs().toISOString().concat(`-${ev.files[0].name}`),
        { type: ev.files[0].type }
      ),
    })
  }

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => (
    <div className={`mb-3 ${buttonStyles.button}`}>{options.chooseButton}</div>
  )

  return !data ? (
    <FileUpload
      customUpload
      ref={uploader}
      maxFileSize={99999999}
      onSelect={handleSelect}
      chooseLabel='Choose video'
      className={inputStyles.upload}
      headerTemplate={headerTemplate}
      accept='video/mp4,video/x-m4v,video/*'
      contentClassName={inputStyles.upload_video}
      emptyTemplate={
        <Image
          width={300}
          height={300}
          alt='upload video'
          src='/assets/img/notVideoFound.svg'
        />
      }
    />
  ) : (
    <div className={inputStyles.upload_preview}>
      <video
        controls
        src={data}
        controlsList='nodownload'
        className={inputStyles.upload_preview_video}
      />
      <CloseButton
        onClick={handleDelete}
        className={inputStyles.upload_preview_close}
      />
    </div>
  )
}
