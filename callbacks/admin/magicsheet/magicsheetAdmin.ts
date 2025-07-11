import axios, { AxiosResponse } from "axios";
import {
  ADMIN_APPLICATION_URL,
  ErrorType,
  SERVER_ERROR,
  responseBody,
  setConfig,
} from "@callbacks/constants";
import { errorNotification, successNotification } from "@callbacks/notifcation";
// import { de } from "date-fns/locale";

const adminMagicSheetInstance = axios.create({
  baseURL: ADMIN_APPLICATION_URL,
  timeout: 15000,
  timeoutErrorMessage: SERVER_ERROR,
});

export interface MagicSheet {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  roll_no: string;
  name: string;
  mobile: string;
  alt_contact: string;
  iitk_email: string;
  friend_name: string;
  friend_contact: string;
  primary_program: string;
  secondary_program: string;
  cpi: string;
  status: string;
  r1_in: string;
  r1_out: string;
  r2_in: string;
  r2_out: string;
  r3_in: string;
  r3_out: string;
  comments: string;
  description?: string;
  data?: any;
}
//coco assignment
const MagicSheetRequest = {
  getAll: (token: string) =>
    adminMagicSheetInstance
      .get<MagicSheet[]>("/magicsheet", setConfig(token))
      .then(responseBody)
      .catch((err: ErrorType) => {
        errorNotification(
          "Fetching Magic Sheets Failed",
          err.response?.data?.error
        );
        return [] as MagicSheet[];
      }),
  delete: (token: string, id: number) =>
    adminMagicSheetInstance
      .delete(`/magicsheet/${id}`, setConfig(token))
      .then((res) => {
        successNotification("Deleted Magicsheet", res.data.status);
        return true;
      })
      .catch((err: ErrorType) => {
        errorNotification(
          "Deleting Magic Sheet Failed",
          err.response?.data?.error
        );
        return {} as MagicSheet;
      }),

  create: (token: string, data: MagicSheet[]) =>
    adminMagicSheetInstance
      .post<MagicSheet>("/magicsheet", data, setConfig(token))
      .then((res) => {
        successNotification("created magicsheet", res.data.status);
        return res.data;
      })
      .catch((err: ErrorType) => {
        errorNotification(
          "Creating Magic Sheet Failed",
          err.response?.data?.error
        );
        return {} as MagicSheet;
      }),
  update: (token: string, data: MagicSheet) =>
    adminMagicSheetInstance
      .put<MagicSheet>(`/magicsheet/${data.ID}`, data, setConfig(token))
      .then((res) => {
        successNotification("Updated magicsheet", res.data.status);
        return res.data;
      })
      .catch((err: ErrorType) => {
        errorNotification(
          "Updating Magic Sheet Failed",
          err.response?.data?.error
        );
        return {} as MagicSheet;
      }),
};

export default MagicSheetRequest;
