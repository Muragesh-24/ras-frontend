import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { getDeptProgram } from "@components/Parser/parser";
import MagicSheetRequest from "@callbacks/admin/magicsheet/magicsheetAdmin";
import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Meta from "@components/Meta";
import DataGrid from "@components/DataGrid";
import { useRouter } from "next/router";
import useStore from "@store/store";

import EnrollMagicsheet from "@components/Modals/EnrollMagisheet";

interface MasterMagicSheetProps {
  data: any[];
  isLoading: boolean;
}

function MasterMagicSheet({ data, isLoading }: MasterMagicSheetProps) {
  const router = useRouter();
  const { token } = useStore();
const rcidParam = router.query.rcid;
const rcid = typeof rcidParam === "string" ? parseInt(rcidParam, 10) : undefined;

const [rows, setRows] = useState(data);

useEffect(() => {
  setRows(data);
}, [data]);


  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    console.log("Deleting ID:", selectedDeleteId, "for rcid:", rcid);

    setConfirmDialogOpen(true);
  };
const handleConfirmDelete = async () => {
  if (selectedDeleteId !== null && rcid !== undefined) {
    try {
      await MagicSheetRequest.delete(token, selectedDeleteId, rcid);

 
      setRows((prevRows) => prevRows.filter((row) => row.id !== selectedDeleteId));

      setSelectedDeleteId(null);
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }
};


  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setSelectedDeleteId(null);
  };

  const [openEnroll, setOpenEnroll] = useState(false);
  const handleOpenEnroll = () => setOpenEnroll(true);
  const handleCloseEnroll = () => setOpenEnroll(false);

  const columns: GridColDef[] = [
    { field: "roll_no", headerName: "Roll No.", width: 130 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "coco_id", headerName: "Coco", width: 180 },

    { field: "phone", headerName: "Mobile", width: 150, hide: true },
    { field: "alternate_phone", headerName: "Alternate Contact", width: 180, hide: true },
    { field: "friend_name", headerName: "Friend's Name", width: 180, hide: true },
    { field: "friend_phone", headerName: "Friend's Contact", width: 180, hide: true },
    { field: "iitk_email", headerName: "IITK Email ID", width: 200, hide: true },
    {
      field: "program_department_id",
      headerName: "Primary Program",
      width: 160,
      valueGetter: (params) => getDeptProgram(params.value),
    },
    {
      field: "secondary_program_department_id",
      headerName: "Secondary Program",
      width: 180,
      hide: true,
      valueGetter: (params) => getDeptProgram(params.value),
    },
    { field: "current_cpi", headerName: "CPI", width: 100 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "r1_in_time", headerName: "R1 In Time", width: 150 },
    { field: "r1_out_time", headerName: "R1 Out Time", width: 150 },
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
              onClick={() =>
                router.push({
                  pathname: `/admin/rc/${rcid}/magicsheet/student/${params.row.id}`,
                  query: { data: JSON.stringify(params.row) },
                })
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <div>
      <Meta title="Master MagicSheet" />
      <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
        <h2>Master MagicSheet</h2>
        {/* <Tooltip title="Enroll Students">
          <IconButton onClick={handleOpenEnroll}>
            <AddIcon />
          </IconButton>
        </Tooltip> */}
      </Stack>

    <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} loading={isLoading} />


      <Modal open={openEnroll} onClose={handleCloseEnroll}>
        <EnrollMagicsheet handleClose={handleCloseEnroll} />
      </Modal>

      <Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Magic Sheet entry?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

MasterMagicSheet.layout = "adminPhaseDashBoard";
export default MasterMagicSheet;




