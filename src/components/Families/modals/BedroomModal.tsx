import { FC, useState, useEffect } from "react";
import InputContainer from "components/UI/Molecules/InputContainer";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { AvailabilityPicker } from "components/UI/Atoms/AvailabilityPicker";
//utils
import GenericsService from "services/Generics";
import { useSession } from "next-auth/client";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import Gallery from "components/UI/Organism/Gallery";

type bedroomData = any;
interface Props {
  data?: any;
  bedroomPictures: any;
  onSubmit: (e: any) => void;
  setShowPicturesModal: (e: any) => void;
  studentRooms: Array<any>;
}

const Types = ["Private", "Shared"];
const BathroomLocationTypes = ["In the Room", "Outside of the Room"];
const BathTypes = ["Private", "Shared"];
const BedTypes = ["Single", "Double/Full", "Queen", "King", "Twin/Single"];
const FloorTypes = ["Upper Level", "Main Level", "Lower Level"];

const BedroomModal: FC<Props> = ({
  data,
  bedroomPictures,
  onSubmit,
  setShowPicturesModal,
  studentRooms,
}) => {
  const [aditional, setAditional] = useState([]);
  const [session] = useSession();
  const [thisRoomNumber, setthisRoomNumber] = useState(studentRooms.length + 1);

  useEffect(() => {
    if (!!data?.roomNumber) {
      setthisRoomNumber(data?.roomNumber);
    } else {
      let tosum = 0;
      studentRooms.forEach((room) => {
        if (Number(room.roomNumber) === thisRoomNumber) {
          tosum++;
        }
      });
      let newval = tosum + thisRoomNumber;
      setthisRoomNumber(newval);
      formik.values.roomNumber = newval;
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { additionalRoomFeatures } = await GenericsService.getAll(
        session?.token,
        ["additionalRoomFeatures"]
      );
      setAditional(additionalRoomFeatures);
    })();
  }, [session]);

  const formatFeature = (idx): string[] => {
    const formatedItems = [];

    if (idx.length > 0 && idx[0]?._id) return idx;

    if (typeof idx === "object")
      aditional.map((item) => {
        const found = idx.find((itemToFind) => item._id === itemToFind);
        if (found) formatedItems.push(item);
      });
    else
      aditional.map((item) => {
        const found = idx.split(", ").find((att) => item.name === att);
        if (found) formatedItems.push(item);
      });

    return formatedItems;
  };

  const formik = useFormik({
    initialValues: {
      _id: data?._id || "",
      availability: data?.availability || [],
      type: data?.type || "",
      bathroomLocation: data?.bathroomLocation || "",
      bathType: data?.bathType || "",
      bedType: data?.bedType || "",
      floor: data?.floor || "",
      aditionalFeatures: data?.aditionalFeatures || [],
      photos: bedroomPictures,
      roomNumber: thisRoomNumber,
    },
    validate: (data) => {
      let errors: Partial<bedroomData> = {};
      if (data.availability === "") {
        errors.availability = "Availability is required";
      }
      if (data.type === "") {
        errors.type = "Type is required";
      }
      if (data.bathroomLocation === "") {
        errors.bathroomLocation = "Bathroom Location is required";
      }
      if (data.bathType === "") {
        errors.bathType = "Bath Type is required";
      }
      if (data.floor === "") {
        errors.floor = "Floor is required";
      }
      return errors;
    },
    onSubmit: (formikData) =>
      onSubmit({
        ...formikData,
        photos: bedroomPictures.map((pic) => ({
          ...pic,
          photo: pic.src || pic.photo,
        })),
      }),
  });
  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <input type="hidden" name="roomNumber" value={thisRoomNumber} />
      <InputContainer label="Photo">
        <Gallery homeCase images={bedroomPictures} />
        {!data.type && (
          <span>Please, save the bedroom after upload pictures</span>
        )}
        <Button
          disabled={!data.type ? true : false}
          style={{ width: "fit-content" }}
          type="button"
          label="Upload beedroom's pictures"
          onClick={() => setShowPicturesModal(true)}
        />
      </InputContainer>

      <InputContainer
        label="Room number"
        labelClass={classNames({ "p-error": isFormFieldValid("roomNumber") })}
      >
        <span>{data?.roomNumber || thisRoomNumber}</span>
        {getFormErrorMessage("roomNumber")}
      </InputContainer>

      <InputContainer
        label="Availability"
        labelClass={classNames({ "p-error": isFormFieldValid("availability") })}
      >
        <AvailabilityPicker
          dates={formik.values.availability}
          setDates={formik.handleChange}
        />
        {getFormErrorMessage("availability")}
      </InputContainer>
      <InputContainer
        label="Type"
        labelClass={classNames({ "p-error": isFormFieldValid("type") })}
      >
        <Dropdown
          id="type"
          options={Types}
          placeholder="Type"
          value={formik.values.type}
          onChange={formik.handleChange}
          className={classNames({ "p-invalid": isFormFieldValid("type") })}
        />
        {getFormErrorMessage("bathroomLocation")}
      </InputContainer>
      <InputContainer
        label="Bathroom Location"
        labelClass={classNames({
          "p-error": isFormFieldValid("bathroomLocation"),
        })}
      >
        <Dropdown
          id="bathroomLocation"
          options={BathroomLocationTypes}
          placeholder="Bathroom Location"
          value={formik.values.bathroomLocation}
          onChange={formik.handleChange}
          className={classNames({
            "p-invalid": isFormFieldValid("bathroomLocation"),
          })}
        />
        {getFormErrorMessage("bathroomLocation")}
      </InputContainer>
      <InputContainer
        label="Bath Type"
        labelClass={classNames({ "p-error": isFormFieldValid("bathType") })}
      >
        <Dropdown
          id="bathType"
          options={BathTypes}
          placeholder="Bath Type"
          value={formik.values.bathType}
          onChange={formik.handleChange}
          className={classNames({ "p-invalid": isFormFieldValid("bathType") })}
        />
        {getFormErrorMessage("bathType")}
      </InputContainer>
      <InputContainer
        label="Bed Type"
        labelClass={classNames({ "p-error": isFormFieldValid("bedType") })}
      >
        <Dropdown
          id="bedType"
          options={BedTypes}
          placeholder="Bed Type"
          value={formik.values.bedType}
          onChange={formik.handleChange}
          className={classNames({ "p-invalid": isFormFieldValid("bedType") })}
        />
        {getFormErrorMessage("bedType")}
      </InputContainer>
      <InputContainer
        label="Floor"
        labelClass={classNames({ "p-error": isFormFieldValid("floor") })}
      >
        <Dropdown
          id="floor"
          options={FloorTypes}
          placeholder="Select the floor"
          value={formik.values.floor}
          onChange={formik.handleChange}
          className={classNames({ "p-invalid": isFormFieldValid("floor") })}
        />
        {getFormErrorMessage("floor")}
      </InputContainer>
      <InputContainer
        label="Aditional Features"
        labelClass={classNames({
          "p-error": isFormFieldValid("aditionalFeatures"),
        })}
      >
        <MultiSelect
          id="aditionalFeatures"
          name="aditionalFeatures"
          optionLabel="name"
          options={aditional}
          value={formatFeature(formik.values.aditionalFeatures)}
          selectedItemTemplate={(item) => (item ? `${item?.name}, ` : "")}
          onChange={formik.handleChange}
          placeholder="Select aditional features"
        />
        {getFormErrorMessage("aditionalFeatures")}
      </InputContainer>
      <Button type="submit">Save</Button>
    </form>
  );
};
export default BedroomModal;
