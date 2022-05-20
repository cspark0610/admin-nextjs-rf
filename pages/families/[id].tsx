// main tools
import { getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

// components
import { EditFamilies } from '@organisms/Families/edit'

//services
import { FamiliesService } from 'services/Families'

// types
import { GetServerSidePropsContext, NextPage } from 'next'
import { GetSSPropsType } from 'types'
import { Layout } from 'components/Layout'
import { FamilyDataType } from 'types/models/Family'

const SingleFamilyPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  session,
  familyId,
}) => {
  const [family, setFamily] = useState<FamilyDataType | undefined>(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      const { data, response } = await FamiliesService.getFamily(
        session?.token as string,
        familyId as string,
        [
          'user',
          'home',
          'labels',
          'pets.type',
          'schools.school',
          'rulesForStudents',
          'tenantList.gender',
          'schools.transports',
          'familyMembers.gender',
          'tenantList.occupation',
          'welcomeStudentGenders',
          'mainMembers.occupation',
          'noRedLeafStudentsList.gender',
          'familyMembers.spokenLanguages',
          'familyInternalData.localManager',
          'familyMembers.familyRelationship',
          'noRedLeafStudentsList.nationality',
          'familyInternalData.availablePrograms',
          'familyInternalData.workshopsAttended',
        ]
      )

      if (!response) setFamily(data)
      else setError(response.data?.message)
    })()
  }, [session?.token, familyId])

  return (
    <Layout setError={setError} error={error} loading={!!!family}>
      <EditFamilies setError={setError} data={family as FamilyDataType} />
    </Layout>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx)
  if (!session)
    return { redirect: { destination: '/login', permanent: false }, props: {} }

  return { props: { session, familyId: ctx.params?.id } }
}

export default SingleFamilyPage
