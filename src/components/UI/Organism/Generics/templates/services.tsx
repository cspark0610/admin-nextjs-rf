// main tools
import Image from 'next/image'
import { useRef } from 'react'

// bootstrap components
import { Row, Col, CloseButton } from 'react-bootstrap'

// prime components
import { FileUpload } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'

// styles
import classes from 'styles/Config/page.module.scss'

// types
import { FileUploadSelectParams } from 'primereact/fileupload'
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { ChangeType } from 'types'
import { FC } from 'react'

export type CreateServiceProps = {
  handleChange: (ev: ChangeType | DropdownChangeParams) => void
  handleSelect: (ev: FileUploadSelectParams, key: string) => void
  handleDelete: (key: string) => void
  data: GenericDataType
}

export const CreateService: FC<CreateServiceProps> = ({
  data,
  handleDelete,
  handleSelect,
  handleChange,
}) => {
  const uploader = useRef<FileUpload>(null)

  const handleDeletePicture = () => {
    uploader.current?.clear()
    handleDelete('icon')
  }

  return (
    <Row>
      <Col className={classes.col} xs={6}>
        <InputText
          required
          name='name'
          value={data.name}
          onChange={handleChange}
          className={classes.input}
          placeholder="Generic's name"
        />
        <h4 className='mt-5 mb-4'>Icon url (optional)</h4>
        <InputText
          required
          type='url'
          name='icon'
          placeholder='Icon url'
          onChange={handleChange}
          className={classes.input}
          value={typeof data.icon === 'string' ? data.icon : ''}
        />
        {!data.isFreeComment && (
          <>
            <h4 className='my-4'>Icon</h4>
            <div className={classes.upload_img}>
              {!data.icon ? (
                <>
                  <FileUpload
                    name='icon'
                    mode='basic'
                    customUpload
                    ref={uploader}
                    accept='image/*'
                    maxFileSize={1000000}
                    onSelect={(ev) => handleSelect && handleSelect(ev, 'icon')}
                    chooseOptions={{ className: classes.upload_choose_img }}
                  />
                </>
              ) : (
                <>
                  {
                    /* eslint-disable @next/next/no-img-element */
                    <img
                      width={80}
                      height={80}
                      alt='profile'
                      src={
                        typeof data.icon === 'string'
                          ? data.icon
                          : (data.icon as any).objectURL
                      }
                    />
                  }
                  <CloseButton
                    onClick={handleDeletePicture}
                    className={classes.upload_preview_close}
                  />
                </>
              )}
            </div>
          </>
        )}
      </Col>
    </Row>
  )
}
