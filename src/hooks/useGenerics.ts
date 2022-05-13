import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { GenericsService } from 'services/Generics'
import { UseGenericsModelsDataType } from 'types/models/Generic'

export const useGenerics = (
  modelNames: (keyof UseGenericsModelsDataType)[]
) => {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [generics, setGenerics] = useState<
    UseGenericsModelsDataType | undefined
  >(undefined)

  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          modelNames
        )

        setGenerics(data)
        setLoading(false)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.token])

  return { ...(generics as UseGenericsModelsDataType), loading }
}
