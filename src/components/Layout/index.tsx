// components
import { Navigation } from 'components/Navigation'

//styles
import style from 'styles/Layout/mainLayout.module.scss'

// types
import { FC, ReactNode } from 'react'
import { Spinner } from 'react-bootstrap'

type LayoutProps = {
  error?: string
  loading?: boolean
  noPadding?: boolean
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({
  error,
  loading,
  children,
  noPadding,
}) => (
  <section>
    <Navigation />
    {loading ? (
      <main className={`${noPadding && 'p-0'} ${style.loading}`}>
        <Spinner variant='black' animation='grow' />
      </main>
    ) : error ? (
      <main className={`${noPadding && 'p-0'} ${style.error}`}>
        <h3>{error}</h3>
      </main>
    ) : (
      <main className={`${noPadding && 'p-0'} ${style.main}`}>{children}</main>
    )}
  </section>
)
