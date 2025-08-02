import {
  Button,
  Card,
  FormControl,
  Stack,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Meta from "@components/Meta";
import { useRouter } from "next/router";
import useStore from "@store/store";
import MagicSheetRequest, { MagicSheet } from "@callbacks/admin/magicsheet/magicsheetAdmin";

const defaultValues: MagicSheet = {
  ID: 0,
  proforma_id: 0,
  CreatedAt: "",
  UpdatedAt: "",
  roll_no: "",
  name: "",
  mobile: "",
  alt_contact: "",
  iitk_email: "",
  friend_name: "",
  friend_phone: "",
  primary_program: "",
  secondary_program_department_id: "",
  cpi: "",
  status: "",
  r1_in_time: "",
  r1_out_time: "",
  comments: "",
};


const statusOptions = ["Not Started", "In Progress", "Completed"];
const editableFields: (keyof MagicSheet)[] = ["status", "r1_in_time", "r1_out_time", "comments"];
const hiddenFields: (keyof MagicSheet)[] = ["ID", "CreatedAt", "UpdatedAt"];

const formatLabel = (label: string) =>
  label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function MagicSheetDetails() {
  const router = useRouter();
  const { token } = useStore();
const { rcid, studentid } = router.query;


  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<MagicSheet>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dataFromQuery = router.query.data;
    if (dataFromQuery) {
      try {
        const parsedData = JSON.parse(dataFromQuery as string) as MagicSheet;
        reset(parsedData);
      } catch (error) {
        console.error("Failed to parse query data:", error);
      }
    }
  }, [router.query.data, reset]);
const onSubmit = async (data: MagicSheet) => {
  setIsLoading(true);
  try {
    const cleanData = {
      ID: Number(studentid),
      status: data.status,
      comments: data.comments,
      r1_in_time: data.r1_in_time ? new Date(data.r1_in_time).toISOString() : null,
      r1_out_time: data.r1_out_time ? new Date(data.r1_out_time).toISOString() : null,
    };
    console.log(cleanData)
    await MagicSheetRequest.update(token, cleanData, rcid);
    router.push(`/admin/rc/${rcid}/magicsheet`);
  } catch (error) {
    console.error("Update failed:", error);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div>
      <Meta title="Edit Magic Sheet Entry" />
      <Card
        elevation={5}
        sx={{
          padding: 3,
          width: { xs: "330px", md: "600px", margin: "0px auto" },
        }}
      >
        <Stack spacing={3}>
          <h2>Edit Magic Sheet Entry</h2>

          {(Object.keys(defaultValues) as (keyof MagicSheet)[])
            .filter((fieldName) => !hiddenFields.includes(fieldName))
            .map((fieldName) => (
              <FormControl sx={{ m: 1 }} key={fieldName}>
                <p style={{ fontWeight: 300 }}>{formatLabel(fieldName)}</p>

                {fieldName === "status" ? (
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} variant="standard">
                        {statusOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                ) : fieldName === "r1_in_time" || fieldName === "r1_out_time" ? (
                  <TextField
                    type="datetime-local"
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      readOnly: !editableFields.includes(fieldName),
                    }}
                    {...register(fieldName)}
                  />
                ) : (
                  <TextField
                    multiline
                    variant="standard"
                    InputProps={{
                      readOnly: !editableFields.includes(fieldName),
                    }}
                    {...register(fieldName)}
                  />
                )}
              </FormControl>
            ))}

          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Update"}
          </Button>
        </Stack>
      </Card>
    </div>
  );
}

MagicSheetDetails.layout = "adminPhaseDashBoard";
export default MagicSheetDetails;
