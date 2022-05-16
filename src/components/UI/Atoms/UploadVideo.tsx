// main tools
import { useRef } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

// bootstrap components
import { CloseButton, Row } from 'react-bootstrap'

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
  data: string | File
  dataCase: 'family' | 'home'
  dispatch: Dispatch<{ type: string; payload: File | null }>
}

export const UploadVideo: FC<UploadVideoProps> = ({
  data,
  dataCase,
  dispatch,
}) => {
  const key = dataCase === 'home' ? 'Home' : 'Family'
  const uploader = useRef<FileUpload>(null)

  /**
   * handle delete family/home video
   */
  const handleDelete = () => {
    uploader.current?.clear()
    dispatch({ type: `handleRemove${key}Video`, payload: null })
  }

  /**
   * handle select family/home video
   */
  const handleSelect = async (ev: FileUploadSelectParams) =>
    dispatch({
      type: `handleAdd${key}Video`,
      payload: new File(
        [ev.files[0]],
        dayjs().toISOString().concat(`-${ev.files[0].name}`),
        { type: ev.files[0].type }
      ),
    })

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
          height={400}
          alt='upload video'
          src='/assets/img/notVideoFound.svg'
        />
      }
    />
  ) : (
    <Row className={inputStyles.upload_preview}>
      <video
        controls
        controlsList='nodownload'
        className={inputStyles.upload_preview_video}
        src={
          typeof data === 'string' ? data : URL.createObjectURL(data as File)
        }
      />
      <CloseButton
        onClick={handleDelete}
        className={inputStyles.upload_preview_close}
      />
    </Row>
  )
}
