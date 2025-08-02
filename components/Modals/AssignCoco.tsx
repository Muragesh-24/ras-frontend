import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import useStore from "@store/store";
import MagicSheetRequest from "@callbacks/admin/magicsheet/magicsheetAdmin";
import { useRouter } from "next/router"; 

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

interface AssignCocoForm {
  emailId: string;
}

interface AssignCocoProps {
  handleClose: () => void;
  rid: string;
  pids: number[];
  onAssignSuccess?: () => void; 
}

function AssignCoco({ handleClose, rid, pids, onAssignSuccess }: AssignCocoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssignCocoForm>();

  const { token } = useStore();
  const router = useRouter(); 

  const onSubmit = async (data: AssignCocoForm) => {
    const eid = data.emailId.trim();
    const res = await MagicSheetRequest.assigncoco(token, Number(rid), eid, pids);
    if (res) {
      reset();
      handleClose();
      onAssignSuccess?.();
    }
  };

  return (
    <Box sx={boxStyle}>
      <Stack spacing={3}>
        <h2>Assign Coco</h2>
        <TextField
          label="Email"
          variant="standard"
          error={!!errors.emailId}
          helperText={errors.emailId?.message}
          {...register("emailId", { required: "Email is required" })}
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={handleSubmit(onSubmit)}
          >
            Assign
          </Button>
          <Button
            variant="outlined"
            sx={{ width: "100%" }}
            onClick={() => reset()}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

AssignCoco.layout = "adminPhaseDashBoard";
export default AssignCoco;
