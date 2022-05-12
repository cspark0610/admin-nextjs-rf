import { BathroomLocation, BathTypeBody, BedTypeBody, FeaturesBody, FloorTypeBody, RoomTypeBody } from "components/UI/Molecules/Datatable/templates";
import { ColumnProps } from "primereact/column";

export const schema: ColumnProps[] = [
  {
    header: 'Room Type',
    field: 'type',
    body: RoomTypeBody,
  },
  {
    header: 'Bath Type',
    field: 'bathType',
    body: BathTypeBody,
  },
  {
    header: 'Aditional Features ',
    field: 'aditionalFeatures',
    body: FeaturesBody,
  },
  {
    header: 'Bed Type',
    field: 'bedType',
    body: BedTypeBody,
  },
  {
    header: 'floor',
    field: 'floor',
    body: FloorTypeBody,
  },
  {
    header: 'Bathroom Location',
    field: 'bathroomLocation',
    body: BathroomLocation,
  },
]
