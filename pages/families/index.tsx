//main tools
import React, { useState, useRef, useEffect, FC } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { GetSSPropsType } from "types";
import { useRouter } from "next/router";

// styles import classes from "styles/Families/import.module.scss";
//components
import { Layout } from "components/Layout";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import FiltersModal from "components/Families/modals/FiltersModal";

//services
import FamiliesService from "services/Families";
//utils
import formatName from "utils/formatName";
import { exportCsv as ExportCsv } from "utils/exportCsv";
import { DataTable } from "components/UI/Molecules/Datatable";
import { ArrowClockwise, Pencil, Search, Trash } from "react-bootstrap-icons";
import { schema } from "components/UI/Organism/Families/utils";

const FamilyPage: NextPage<GetSSPropsType<typeof getServerSideProps>> = ({
  session,
}) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const filter = schema.map((item) => item.field);
  //we need implement a dropdown template for datatable column body
  const [selectedStatus, setSelectedStatus] = useState(null);
  //we need a loading state for datatable actions
  const [exportLoading, setExportLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [families, setFamilies] = useState([]);
  const toast = useRef<any>(null);

  const getFamilies = async () => {
    try {
      setLoading(true);
      if (session?.token) {
        const data = (await FamiliesService.getFamilies(session?.token)) || [];
        if (data.length > 0) {
          setFamilies(
            data.map((family: any) => {
              return {
                ...family,
                name: formatName(family.mainMembers),
                location: family.location
                  ? `${family.location.province}, ${family.location.city}`
                  : "No assigned",
                localManager: family.localManager
                  ? family.localManager.name
                  : "No assigned",
                status: family.status ? family.status : "no status",
              };
            })
          );
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFamilies();
  }, []);

  const showToast = (
    severity: "warn" | "danger" | "success" = "success",
    summary: "Warn Message" | "Confirmed" | "Error" = "Confirmed",
    detail: string
  ) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  // Delete Families ------------------------------------------------------------

  const deleteFamilies = async () => {
    await FamiliesService.deleteFamilies(session?.token as string, {
      ids: selected.map((family: any) => family.id),
    })
      .then(() => {
        getFamilies();
        showToast("success", "Confirmed", "Families  successfully deleted");
      })
      .catch((error) => console.error(error));
  };

  const confirmDelete = () => {
    if (selected) {
      const activeFamilies = selected.filter((family: any) => {
        return family?.status === "Active";
      });
      if (activeFamilies.length !== 0) {
        showToast("warn", "Warn Message", "You cannot delete active families");
      } else {
        confirmDialog({
          message: "Do you want to delete this family?",
          header: "Delete Confirmation",
          icon: "pi pi-info-circle",
          acceptClassName: "p-button-danger",
          accept: deleteFamilies,
        });
      }
    }
  };

  // Delete Families End -----------------------------------------------------------------

  const handleExportCsv = async () => {
    if (selected.length > 0) {
      setExportLoading(true);
      await FamiliesService.exportFamiliesToCsv(
        session?.token as string,
        selected.map((family: any) => family.id)
      )
        .then((response) => {
          setExportLoading(false);
          ExportCsv(response);
          showToast("success", "Confirmed", "Families successfully exported!");
        })
        .catch((error) => {
          setExportLoading(false);
          showToast("danger", "Error", "An error has ocurred");
          console.error(error);
        });
    } else {
      showToast(
        "warn",
        "Warn Message",
        "You need to select the families to export"
      );
    }
  };

  const router = useRouter();
  const handleAdvancedSearch = () => setShowFilterModal(true);
  const handleDeleteMany = () => {
    confirmDelete();
  };
  const handleCreate = () => {
    router.push("/families/create");
  };
  const handleEdit = ({ data }: any) => router.push(`/families/${data._id}`);

  return (
    <Layout>
      <DataTable
        schema={schema}
        value={families}
        loading={loading}
        selection={selected}
        selectionMode='checkbox'
        onRowEditChange={handleEdit}
        globalFilterFields={filter as string[]}
        onSelectionChange={(e) => setSelected(e.value)}
        actions={{
          "Advanced Search": { action: handleAdvancedSearch, icon: Search },
          "Export CSV": { action: handleExportCsv, icon: Search },
          Delete: { action: handleDeleteMany, icon: Trash },
          Create: { action: handleCreate, icon: Pencil },
          Reload: { action: getFamilies, icon: ArrowClockwise },
        }}
      />
      {showFilterModal && (
        <FiltersModal
          visible={showFilterModal}
          setVisible={setShowFilterModal}
          setFamilies={setFamilies}
        />
      )}
      <Toast ref={toast} />
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
