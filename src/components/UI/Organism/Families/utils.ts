import { ColumnProps } from "primereact/column";

export const schema: ColumnProps[] = [
  { field: "name", header: "Name", filterPlaceholder: "Search by name" },
  { field: "type", header: "Type", filterPlaceholder: "Search by type" },
  {
    field: "status",
    header: "Status",
    filterPlaceholder: "Search by status",
  },
  {
    field: "location",
    header: "Location",
    filterPlaceholder: "Search by location",
  },
  {
    field: "familyMembers",
    header: "Number of aditional family members",
    filterPlaceholder: "Search by number of aditional family members",
  },
  {
    field: "localManager",
    header: "Local Coordinator",
    filterPlaceholder: "Search by local coordinator",
  },
];

export const statuses = [
  "Active",
  "Inactive",
  "Pending",
  "Potential",
  "Rejected",
  "Removed",
];
