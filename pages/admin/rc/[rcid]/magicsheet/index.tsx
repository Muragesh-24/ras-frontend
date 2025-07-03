import { GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import { Button, IconButton, Modal, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataGrid from "@components/DataGrid"; 
import Meta from "@components/Meta";
import AddIcon from "@mui/icons-material/Add";
import Enroll from "@components/Modals/Enroll";
import { route } from "next/dist/server/router";

const columns: GridColDef[] = [
  { field: "roll_no", headerName: "Roll No.", width: 130 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "mobile", headerName: "Mobile", width: 150 },
  { field: "alt_contact", headerName: "Alternate Contact", width: 180 },
  { field: "friend_name", headerName: "Friend's Name", width: 180 },
  { field: "friend_contact", headerName: "Friend's Contact", width: 180 },
  { field: "iitk_email", headerName: "IITK Email ID", width: 200 },
  { field: "primary_program", headerName: "Primary Program", width: 160 },
  { field: "secondary_program", headerName: "Secondary Program", width: 180 },
  { field: "cpi", headerName: "CPI", width: 100 },
  { field: "status", headerName: "Status", width: 100 },
  { field: "r1_in", headerName: "R1 In Time", width: 150 },
  { field: "r1_out", headerName: "R1 Out Time", width: 150 },
  { field: "r2_in", headerName: "R2 In Time", width: 150 },
  { field: "r2_out", headerName: "R2 Out Time", width: 150 },
  { field: "r3_in", headerName: "R3 In Time", width: 150 },
  { field: "r3_out", headerName: "R3 Out Time", width: 150 },
  { field: "comments", headerName: "Comments", width: 250 },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    renderCell: () => (
      <Stack direction="row" spacing={1}>
      <Tooltip title="Edit">
        <IconButton
          size="small"
          href={`/admin/rc/[rcid]/magicsheet/student/${1}`} 
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={() => {
       
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
    ),
  },
];

const dummyData = [
  {
    id: 1,
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
  },
  {
    id: 2,
    roll_no: "210456",
    name: "Rohan",
    mobile: "9876500000",
    alt_contact: "9111111111",
    friend_name: "Amit",
    friend_contact: "9000000000",
    iitk_email: "rohan@iitk.ac.in",
    primary_program: "B.Tech EE",
    secondary_program: "Minor in ML",
    cpi: "9.2",
    status: "Active",
    r1_in: "9:15 AM",
    r1_out: "10:10 AM",
    r2_in: "11:05 AM",
    r2_out: "12:10 PM",
    r3_in: "2:15 PM",
    r3_out: "3:05 PM",
    comments: "Good performance",
  },
];

function Index() {
  const [rows] = useState(dummyData);
  const [loading] = useState(false);
    const [openEnroll, setOpenEnroll] = useState(false);
    const handleOpenEnroll = () => {
      setOpenEnroll(true);
    };
    const handleCloseEnroll = () => {
      setOpenEnroll(false);
    };

  return (
    <div>
      <Meta title="Student Custom List" />
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <h2>Magic Sheet</h2>
          <Tooltip title="Enroll Students">
               <IconButton onClick={handleOpenEnroll}>
                <AddIcon />
              </IconButton>
            </Tooltip>
      </Stack>
         <Modal open={openEnroll} onClose={handleCloseEnroll}>
              <Enroll handleClose={handleCloseEnroll} />
            </Modal>
      <DataGrid rows={rows} columns={columns} loading={loading} />
    </div>
  );
}

Index.layout = "adminPhaseDashBoard";
export default Index;
