
import { Visit, SuperbillStatus } from "@/types/superbill";
import { generateId } from "./id-utils";

export const createEmptyVisit = (): Visit => {
  return {
    id: generateId(),
    date: new Date(),
    icdCodes: [],
    cptCodes: [],
    fee: 0,
    mainComplaints: []
  };
};

export const duplicateVisit = (visit: Visit): Visit => {
  return {
    ...visit,
    id: generateId()
  };
};

export const getStatusVariant = (status: SuperbillStatus): "default" | "success" | "warning" | "info" | "error" => {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "warning";
    case "in_review":
      return "info";
    case "draft":
      return "default";
    default:
      return "default";
  }
};
