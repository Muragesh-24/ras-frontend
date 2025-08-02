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
  friend_phone: string;
  primary_program: string;
  secondary_program_department_id: string;
  cpi: string;
  status: string;
  r1_in_time: string | null;
  r1_out_time: string | null;
  proforma_id : number;

  comments: string;
  description?: string;
  data?: any;
}
//coco assignment
const MagicSheetRequest = {
  getAll: (token: string,id : number) =>
    adminMagicSheetInstance
      .get<MagicSheet[]>(`rc/${id}/magicsheet`, setConfig(token))
      .then(responseBody)
      .catch((err: ErrorType) => {
        errorNotification(
          "Fetching Magic Sheets Failed",
          err.response?.data?.error
        );
        return [] as MagicSheet[];
      }),
     getAllCompany: (token: string, id: number, pids: number[]) =>
  adminMagicSheetInstance
    .post<MagicSheet[]>(`rc/${id}/magicsheet/company`, { pids }, setConfig(token))
    .then(responseBody)
    .catch((err: ErrorType) => {
      errorNotification(
        "Fetching Company Magic Sheet Failed",
        err.response?.data?.error || err.message
      );
      return [] as MagicSheet[];
    }),

  delete: (token: string, id: number,rcid : number) =>
    adminMagicSheetInstance
      .delete(`rc/${rcid}/magicsheet/delete/${id}`, setConfig(token))
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

  create: (token: string, data: string[],id :any,pid :any) =>
    adminMagicSheetInstance
      .post<MagicSheet>(`rc/${id}/magicsheet/${pid}`, data, setConfig(token))
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
 update: (token: string, data: Partial<MagicSheet>, id: any) =>
  adminMagicSheetInstance
    .put<MagicSheet>(`rc/${id}/magicsheet/Update/`, data, setConfig(token))
    .then((res) => {
      console.log(data);
      successNotification("Updated magicsheet", res.data.status);
      return res.data;
    })
    .catch((err: ErrorType) => {
      console.log(data);
      errorNotification(
        "Updating Magic Sheet Failed",
        err.response?.data?.error
      );
      return {} as MagicSheet;
    }),

   assigncoco: (token: string, rcId: number, emailId: string, proformaIds: number[]) =>
  adminMagicSheetInstance
    .post(
      `rc/${rcId}/magicsheet/assigncoco`,
      {
        email_id: emailId,
        pids: {
          ids: proformaIds,
        },
      },
      setConfig(token)
    )
    .then((res) => {
      successNotification("Coco Assigned", res.data.message || "Success");
      return res.data;
    })
    .catch((err: ErrorType) => {
      errorNotification(
        "Assigning Coco Failed",
        err.response?.data?.error || "Unknown error"
      );
      return null;
    }),


};

export default MagicSheetRequest;
