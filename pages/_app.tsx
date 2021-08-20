// types
import type { AppProps } from 'next/app'
import { FC, useEffect, useRef } from 'react'
import { Provider } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Toast } from "primereact/toast";
import { FamilyProvider } from 'context/FamilyContext'

// styles
import 'styles/globals.scss'
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const ERROR_RESPONSES : any = {
  'CredentialsSignin': 'Invalid Credentials'
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  const toast = useRef(null);

  useEffect(() => {
    if(router.query.error){
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: ERROR_RESPONSES[router.query.error as string],
        life: 4000,
      });
    }
  },[router.query])
  

  return (
    <>
      <Toast ref={toast} />
      <Provider session={pageProps.session}>
        <FamilyProvider>
          <Component {...pageProps} />
        </FamilyProvider>
      </Provider>
    </>
  )
}

export default MyApp
