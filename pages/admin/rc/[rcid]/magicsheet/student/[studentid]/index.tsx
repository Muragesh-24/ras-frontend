import {
  Button,
  Card,
  FormControl,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Meta from "@components/Meta";
import { useRouter } from "next/router";

type MagicSheetEntry = {
  roll_no: string;
  name: string;
  mobile: string;
  alt_contact: string;
  friend_name: string;
  friend_contact: string;
  iitk_email: string;
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
};

function MagicSheetDetails() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<MagicSheetEntry>();
  const [loading, setLoading] = useState(false);

  // Dummy data for now
  const dummyStudent: MagicSheetEntry = {
    roll_no: "210123",
    name: "Muragesh",
    mobile: "9876543210",
    alt_contact: "9123456789",
    friend_name: "Ravi",
    friend_contact: "9988776655",
    iitk_email: "muragesh@iitk.ac.in",
    primary_program: "B.Tech CSE",
    secondary_program: "Minor in AI",
    cpi: "8.9",
    status: "Active",
    r1_in: "9:00 AM",
    r1_out: "10:00 AM",
    r2_in: "11:00 AM",
    r2_out: "12:00 PM",
    r3_in: "2:00 PM",
    r3_out: "3:00 PM",
    comments: "No remarks",
  };

  useEffect(() => {
   
    setLoading(true);
    setTimeout(() => {
      reset(dummyStudent);
      setLoading(false);
    }, 500);
  }, [reset]);

  const onSubmit = (data: MagicSheetEntry) => {
    console.log("Updated Magic Sheet Entry:", data);
    router.push("/admin/magic-sheet"); // or wherever your main list is
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

          {Object.keys(dummyStudent).map((fieldName) => (
            <FormControl sx={{ m: 1 }} key={fieldName}>
              <p style={{ fontWeight: 300 }}>{fieldName.replace(/_/g, " ")}</p>
              <TextField
                multiline
                variant="standard"
                {...register(fieldName as keyof MagicSheetEntry)}
              />
            </FormControl>
          ))}

          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </Stack>
      </Card>
      <br />
    </div>
  );
}

MagicSheetDetails.layout = "adminPhaseDashBoard";
export default MagicSheetDetails;
