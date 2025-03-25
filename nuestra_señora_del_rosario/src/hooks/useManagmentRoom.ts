
import { RoomType } from "../types/RoomType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentRoom = () => {
  return useCRUDGeneric<RoomType>("/Room");
};
