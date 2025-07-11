import AddIcon from "@mui/icons-material/Add";

import { Box, Button,  Modal } from "@mui/material";


import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { IconButton, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Meta from "@components/Meta";
import DataGrid from "@components/DataGrid";
import { useRouter } from "next/router";
import { useState } from "react";
//  import Enroll from "@components/Modals/Enroll";
import EnrollMagicsheet from "@components/Modals/EnrollMagisheet";


// Define columns
const columns: GridColDef[] = [
  { field: "roll_no", headerName: "Roll No.", width: 130 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "assigned_coco", headerName: "Coco", width: 180 },
  { field: "proforma_id", headerName: "Proforma_ID", width: 130 },
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
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            href={`/admin/rc/[rcid]/magicsheet/student/${params.row.id}`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => console.log("Delete", params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  },
];

interface MasterMagicSheetProps {
  data: any[]; // You can replace `any` with your student type if defined
  isLoading: boolean;
}

function MasterMagicSheet({ data, isLoading }: MasterMagicSheetProps) {
     const [openEnroll, setOpenEnroll] = useState(false);
    const handleOpenEnroll = () => {
        setOpenEnroll(true);
    };
    const handleCloseEnroll = () => {
        setOpenEnroll(false);
    };
  return (
    <div>
      <Meta title="Master MagicSheet" />
          <Stack
                 spacing={2}
                 direction="row"
                 justifyContent="space-between"
                 alignItems="center"
             >
      <h2>Master MagicSheet</h2>
      <Tooltip title="Enroll Students">
                     <IconButton onClick={handleOpenEnroll}>
                        <AddIcon />
                     </IconButton>
                </Tooltip>
                </Stack>
      <DataGrid rows={data} columns={columns} getRowId={(row) => row.id} loading={isLoading} />
             <Modal open={openEnroll} onClose={handleCloseEnroll}>
                 <EnrollMagicsheet handleClose={handleCloseEnroll} />
             </Modal>
    </div>
  );
}

MasterMagicSheet.layout = "adminPhaseDashBoard";
export default MasterMagicSheet;
