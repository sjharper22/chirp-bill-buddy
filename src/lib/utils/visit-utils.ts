
import { Visit, SuperbillStatus } from "@/types/superbill";
import { generateId } from "./id-utils";

export const createEmptyVisit = (): Visit => {
  return {
    id: generateId(),
    date: new Date(),
    icdCodes: [],
    cptCodes: [],
    fee: 0,
    mainComplaints: [],
    status: 'draft' // Set default status
  };
};

export const duplicateVisit = (visit: Visit): Visit => {
  return {
    ...visit,
    id: generateId(),
    status: 'draft' // Reset status for duplicated visits
  };
};

export const getStatusVariant = (status: SuperbillStatus | string): "default" | "success" | "warning" | "info" | "error" => {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
    case "in_review":
      return "warning";
    case "draft":
      return "info";
    default:
      return "default";
  }
};
