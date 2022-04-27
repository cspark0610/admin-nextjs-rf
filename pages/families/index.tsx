// main tools
import Link from "next/link";

// prime components
import { Button } from "primereact/button";

// components
import { Layout } from "components/Layout";
import Datatable from "components/Families/datatable";

// styles
import classes from "styles/Families/import.module.scss";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { GetSSPropsType } from "types";

const FamilyPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  session,
}) => {
  return (
    <Layout>
      <div className={classes.pageTitle}>
        <h1>Families</h1>
        <Link href='families/import'>
          <a className='p-button-link export-button'>
            <Button
              label='Go to import'
              icon='pi pi-external-link'
              className='p-button-link export-button'
            />
          </a>
        </Link>
      </div>
      <Datatable />
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);
  if (!session)
    return { redirect: { destination: "/login", permanent: false }, props: {} };

  return { props: { session } };
};

export default FamilyPage;
