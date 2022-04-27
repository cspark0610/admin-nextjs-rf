// main tools
import { useRef, useEffect } from 'react'

// components
import { Navigation } from 'components/Navigation'

// prime components
import { Toast } from 'primereact/toast'

// bootstrap components
import { Spinner } from 'react-bootstrap'

//styles
import style from 'styles/Layout/mainLayout.module.scss'

// types
import { FC, ReactNode } from 'react'
import { SetStateType } from 'types'

type LayoutProps = {
  error?: string
  loading?: boolean
  noPadding?: boolean
  children: ReactNode
  setError?: SetStateType<string>
}

export const Layout: FC<LayoutProps> = ({
  error,
  loading,
  children,
  setError,
  noPadding,
}) => {
  const toast = useRef<Toast>(null)

  useEffect(() => {
    if (error) {
      toast.current?.show({
        detail: error,
        summary: 'Error',
        severity: 'error',
      })

      const timeout = setTimeout(() => setError && setError(''), 5000)
      return () => clearTimeout(timeout)
    }
  }, [error])

  return (
    <section>
      <Navigation />
      {loading ? (
        <main className={`${noPadding && 'p-0'} ${style.loading}`}>
          <Spinner variant='black' animation='grow' />
        </main>
      ) : (
        <>
          <main className={`${noPadding && 'p-0'} ${style.main}`}>
            {children}
          </main>
          {error && <Toast ref={toast} position='top-right' />}
        </>
      )}
    </section>
  )
}
