import { NoteRequest } from "../types/NoteTypes";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentNote = () => {
  return useCRUDGeneric<NoteRequest>("/Note");
};
