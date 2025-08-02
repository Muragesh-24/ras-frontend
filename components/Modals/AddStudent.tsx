import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import useStore from "@store/store";

const boxStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "330px", md: "500px" },
  bgcolor: "background.paper",
  border: "white solid 2px",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  alignItems: "center",
};


interface AddStudentForm {
  rollNumbers: string;
}

function AddStudent({ handleClose, handleSubmitStudent }: { handleClose: () => void, handleSubmitStudent: (rollNumbers: string[]) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddStudentForm>();

  const router = useRouter();
  const { rcid } = router.query;
  const rid = (rcid || "").toString();

  const { token } = useStore();

  const onSubmit = async (data: AddStudentForm) => {

 const rollNos = data.rollNumbers
  .replace(/,\s+/g, ",")
  .split(/[\n,\s+]/)
  .map((x) => x.trim())
  .filter((x) => x.length > 0);

    handleSubmitStudent(rollNos);
    handleClose(); 
  };

  return (
    <Box sx={boxStyle}>
      <Stack spacing={3}>
        <h2>Add Student</h2>
        <TextField
          multiline
          error={errors.rollNumbers !== undefined}
          label="Enter Roll Numbers"
          id="rollNumbers"
          variant="standard"
          {...register("rollNumbers", {
            required: true,
          })}
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={handleSubmit(onSubmit)}
          >
            Add Student
          </Button>
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={() => {
              reset({
                rollNumbers: "",
              });
            }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

AddStudent.layout = "adminPhaseDashBoard";
export default AddStudent;
