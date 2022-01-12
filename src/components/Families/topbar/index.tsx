import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
//components
import { Dropdown } from "primereact/dropdown";
import Icon from "components/UI/Atoms/Icon";
//styles
import classes from "styles/Families/Topbar.module.scss";
//Api
import FamiliesService from "services/Families";
import UsersService from "services/Users";

//required for localmanager dropdown
//import GenericsService from 'services/Generics'

//Context
import { FamilyContext } from "context/FamilyContext";
import { useSession } from "next-auth/client";

import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

export const Topbar: React.FC = () => {
  const { family, getFamily } = useContext(FamilyContext);

  const [status, setStatus] = useState(family.familyInternalData?.status);
  const [statusLoading, setStatusLoading] = useState(false);

  const [type, setType] = useState(family.familyInternalData?.type);
  const [typeLoading, setTypeLoading] = useState(false);

  const [score, setScore] = useState(family.familyScore);
  const [scoreLoading, setScoreLoading] = useState(false);
  //required for localmanager dropdown
  const [localManagerInput, setLocalManagerInput] = useState([]);
  const [localCoordinator, setLocalCoordinator] = useState({});
  const [session] = useSession();

  useEffect(() => {
    if (family.familyInternalData?.localManager?._id)
      setLocalCoordinator(
        localManagerInput.filter(
          (lm) => lm._id === family.familyInternalData.localManager._id
        )[0]
      );
  }, [family.familyInternalData?.localManager, localManagerInput.length]);

  useEffect(() => {
    UsersService.getUsers(session?.token)
      .then((response) =>
        setLocalManagerInput(
          response
            .filter((user) => user.userType === "LocalCoordinator")
            .map((user) => ({
              ...user,
              name: `${user.first_name} ${user.last_name} - ${user.email}`,
            }))
        )
      )
      .catch((error) => console.error(error));
  }, [session]);

  const handleChangeCoordinator = (e) => {
    (e) => setLocalCoordinator(e.target.value);

    FamiliesService.updatefamily(session?.token, family._id, {
      familyInternalData: {
        ...family.familyInternalData,
        localManager: e.target.value,
      },
    })
      .then(() => {
        getFamily();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //dropdowns options
  const scoreSelectItems = ["Gold", "Silver", "Bronze"];
  const statusSelectItems = [
    "Potential",
    "Pending",
    "Active",
    "Inactive",
    "Removed",
    "Rejected",
  ].sort();
  const typeSelectItems = [
    "Couple with Children",
    "Couple without Children ",
    "Mono Parental with Children",
    "Single Parental without Children",
  ].sort();

  //onChange
  const onScoreChange = async (e: { value: any }) => {
    setScoreLoading(true);
    try {
      await FamiliesService.updatefamily(session?.token, family._id, {
        familyScore: e.value,
      });
      getFamily();
      setScoreLoading(false);
    } catch (err) {
      console.error(err);
      setScoreLoading(false);
    }
    setScore(e.value);
  };
  const onTypeChange = async (e: { value: any }) => {
    setTypeLoading(true);
    try {
      await FamiliesService.updatefamily(session?.token, family._id, {
        familyInternalData: { ...family.familyInternalData, type: e.value },
      });
      getFamily();
      setTypeLoading(false);
    } catch (err) {
      console.error(err);
      setTypeLoading(false);
    }
    setType(e.value);
  };
  const onStatusChange = async (e: { value: any }) => {
    setStatusLoading(true);
    try {
      if (!!family.home?.city?._id === false && e.value === "Active") {
        confirmDialog({
          message: `Assign a registered city to this family before set as Active`,
          header: `Can't change the status of this family`,
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            setStatusLoading(false);
          },
          reject: () => {
            setStatusLoading(false);
          },
        });
      } else if (e.value === "Active") {
        console.log('we are here')
        if (
          (family?.location?.cordinate?.latitude === 0 &&
            family?.location?.cordinate?.longitude === 0) ||
          !!family?.location === false ||
          !!family?.location?.cordinate === false
        ) {
          confirmDialog({
            message: `You must assign a location and coordinates of the house in order to activate the family.`,
            header: `Can't change the status of this family`,
            icon: "pi pi-exclamation-triangle",
            accept: () => {
              setStatusLoading(false);
            },
            reject: () => {
              setStatusLoading(false);
            },
          });
        } else {
          confirmDialog({
            message: `Are you sure you want to change the status of this family?`,
            header: "Confirm Status Change",
            icon: "pi pi-exclamation-triangle",
            accept: async () => {
              await FamiliesService.updatefamily(session?.token, family._id, {
                familyInternalData: {
                  ...family.familyInternalData,
                  status: e.value,
                },
              });
              getFamily();
              setStatusLoading(false);
            },
            reject: () => {
              setStatusLoading(false);
            },
          });
          setStatus(e.value);
        }
      } else {
        confirmDialog({
          message: `Are you sure you want to change the status of this family?`,
          header: "Confirm Status Change",
          icon: "pi pi-exclamation-triangle",
          accept: async () => {
            await FamiliesService.updatefamily(session?.token, family._id, {
              familyInternalData: {
                ...family.familyInternalData,
                status: e.value,
              },
            });
            getFamily();
            setStatusLoading(false);
          },
          reject: () => {
            setStatusLoading(false);
          },
        });
        setStatus(e.value);
      }
    } catch (err) {
      setStatusLoading(false);
      console.error(err);
    }
  };

  const selectedScoreTemplate = (
    option: string,
    props: { placeholder: string }
  ) => {
    if (option) {
      return (
        <div className={classes.dropdown}>
          <Icon svg={`${option.toLowerCase()}-medal`} classes={classes.icon} />
          <div>{option}</div>
        </div>
      );
    }
    return <div className={classes.dropdown}>{props.placeholder}</div>;
  };
  const scoreOptionTemplate = (option) => {
    return (
      <div className={classes.dropdown}>
        <Icon svg={`${option.toLowerCase()}-medal`} classes={classes.icon} />
        <div>{option}</div>
      </div>
    );
  };
  const router = useRouter();
  const handleBack = () => {
    //save back on localstorage
    localStorage.setItem("isBack", JSON.stringify({ isBack: true }));
    //and go back with router
    router.back();
  };

  return (
    <header className={classes.topbar}>
      <div>
        <Button
          onClick={handleBack}
          icon="pi pi-chevron-left"
          className="p-button-link p-button-success"
          style={{
            minWidth: "200px",
            borderRadius: "2rem",
            padding: "4px",
            justifyContent: "flex-start",
          }}
        >
          <span style={{ marginLeft: "12px" }}>Back to search</span>
        </Button>
      </div>
      <section
        style={{
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          marginTop: "24px",
        }}
      >
        <div style={{ marginRight: "20px", maxWidth: "240px" }}>
          <label>Family:</label>
          <strong>{family.name}</strong>
        </div>

        <div style={{ marginRight: "20px" }}>
          <label>Local coordinator:</label>
          <Dropdown
            options={localManagerInput}
            placeholder="Local coordinator"
            optionLabel="name"
            value={localCoordinator}
            onChange={handleChangeCoordinator}
          />
        </div>
        <div style={{ marginRight: "20px" }}>
          <label>
            Status: {statusLoading && <i className="pi pi-spin pi-spinner" />}
          </label>
          <Dropdown
            options={statusSelectItems}
            placeholder="Status"
            value={status}
            onChange={onStatusChange}
          />
        </div>
        <div style={{ marginRight: "20px" }}>
          <label>
            Kind of family:{" "}
            {typeLoading && <i className="pi pi-spin pi-spinner" />}
          </label>
          <Dropdown
            options={typeSelectItems}
            placeholder="Kind of family"
            value={type}
            onChange={onTypeChange}
          />
        </div>
        <div style={{ marginRight: "20px" }}>
          <label>
            Category: {scoreLoading && <i className="pi pi-spin pi-spinner" />}
          </label>
          <Dropdown
            options={scoreSelectItems}
            placeholder="Score"
            value={score}
            onChange={onScoreChange}
            valueTemplate={selectedScoreTemplate}
            itemTemplate={scoreOptionTemplate}
          />
        </div>
      </section>
    </header>
  );
};
