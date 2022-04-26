// components
import { Navigation } from 'components/Navigation'

//styles
import style from 'styles/Layout/mainLayout.module.scss'

// types
import { FC, ReactNode } from 'react'

type LayoutProps = {
  noPadding: boolean
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children, noPadding }) => (
  <section>
    <Navigation />
    <main className={`${noPadding && 'p-0'} ${style.main}`}>{children}</main>
  </section>
)
