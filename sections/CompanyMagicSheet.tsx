import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Meta from "@components/Meta";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MagicSheetRequest, { MagicSheet } from "@callbacks/admin/magicsheet/magicsheetAdmin";
import { CompanyRc } from "@callbacks/admin/rc/company";
import AssignCoco from "@components/Modals/AssignCoco";
import DataGrid from "@components/DataGrid";

import useStore from "@store/store";
import { getDeptProgram } from "@components/Parser/parser";
import AddStudent from "@components/Modals/AddStudent";
import requestProforma, { ProformaType } from "@callbacks/admin/rc/proforma";

function CompanyMagicSheet({ company }: { company: CompanyRc }) {
  const { token } = useStore();
  const router = useRouter();
  const rcidRaw = router.query.rcid;
  const rcidNumber = typeof rcidRaw === "string" ? parseInt(rcidRaw, 10) : NaN;

  const [masterRows, setMasterRows] = useState<MagicSheet[]>([]);
  const [roleRows, setRoleRows] = useState<Record<number, MagicSheet[]>>({});
  const [loading, setLoading] = useState(false);
type Proforma = { ID: number; Role: string ; };
const [proformas, setProformas] = useState<ProformaType[]>([]);

  const [openAssignCoco, setOpenAssignCoco] = useState(false);
  const [selectedPids, setSelectedPids] = useState<number[]>([]);

  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [activeProformaId, setActiveProformaId] = useState<number | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; proforma_id: number } | null>(null);


  const fetchMagicSheets = async (proformaIds: number[]) => {
    const data = await MagicSheetRequest.getAllCompany(
      token,
      company.recruitment_cycle_id,
      proformaIds
    );
    const grouped: Record<number, MagicSheet[]> = {};
    if(data != null ){
    data.forEach((sheet) => {
      grouped[sheet.proforma_id] = grouped[sheet.proforma_id] || [];
      grouped[sheet.proforma_id].push(sheet);
    });
    setMasterRows(data);
    setRoleRows(grouped);}
  };

const [proformaIdToRole, setProformaIdToRole] = useState<Record<number, string>>({});

const fetchProformas = async () => {
  if (!company?.recruitment_cycle_id || !company?.company_id) return;
  const list = await requestProforma.getall(
    token,
    String(company.recruitment_cycle_id),
    String(company.company_id)
  );
  setProformas(list);

  const roleMap: Record<number, string> = {};
  list.forEach((p) => {
    roleMap[p.ID] = p.role; // or p.Role depending on actual casing
  });
  setProformaIdToRole(roleMap);

  const ids = list.map((p) => p.ID);
  await fetchMagicSheets(ids);
};


  useEffect(() => {
    fetchProformas();
  }, [company]);


  const handleOpenAddStudent = (pid: number) => {
    setActiveProformaId(pid);
    setOpenAddStudent(true);
  };
  const handleSubmitStudent = async (rollNos: string[]) => {
    if (!activeProformaId || isNaN(rcidNumber)) return;
    await MagicSheetRequest.create(token, rollNos, rcidNumber, activeProformaId);
await fetchMagicSheets(proformas.map((p) => p.ID));

    setOpenAddStudent(false);
  };


  const handleDeleteClick = (id: number, pid: number) => {
    setDeleteTarget({ id, proforma_id: pid });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isNaN(rcidNumber)) return;
    await MagicSheetRequest.delete(token, deleteTarget.id, rcidNumber);
  
    setMasterRows((prev) => prev.filter((r) => r.ID !== deleteTarget.id));
  
    setRoleRows((prev) => {
      const copy = { ...prev };
      copy[deleteTarget.proforma_id] = (copy[deleteTarget.proforma_id] || []).filter(
        (r) => r.ID !== deleteTarget.id
      );
      return copy;
    });
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

 
  const columns: GridColDef[] = [
    { field: "roll_no", headerName: "Roll No.", width: 130 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "coco_id", headerName: "Coco", width: 180 },
   {
  field: "proforma_id",
  headerName: "Role",
  width: 180,
  valueGetter: (params) => proformaIdToRole[params.row.proforma_id] || `#${params.row.proforma_id}`,
},
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
                  pathname: `/admin/rc/${rcidRaw}/magicsheet/student/${params.row.id}`,
                  query: { data: JSON.stringify(params.row) },
                })
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row.id,params.row.proforma_id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
  return (
    <div>
        <Box mb={4}>
      <Meta title={`${company.company_name} MagicSheet`} />
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h2>{company.company_name} Master MagicSheet</h2>
          <Tooltip title="Assign COCO">
            <IconButton
              onClick={() => {
              setSelectedPids(proformas.map((p) => p.ID));

                setOpenAssignCoco(true);
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <DataGrid
          rows={masterRows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          
        /></Stack>
      </Box>
        <Box mb={4}>
{proformas.map(({ ID: pid, role }) => (
  <Stack key={pid} mt={4} spacing={2}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <h3>{role} MagicSheet</h3>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Add Students">
          <IconButton onClick={() => handleOpenAddStudent(pid)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Assign COCO">
          <IconButton
            onClick={() => {
              setSelectedPids([pid]);
              setOpenAssignCoco(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
    <DataGrid
      rows={roleRows[pid] || []}
      columns={columns}
      getRowId={(row) => row.id}
      loading={loading}
    />
  </Stack>
))}
</Box>


      <Modal open={openAssignCoco} onClose={() => setOpenAssignCoco(false)}>
        <AssignCoco
          handleClose={() => setOpenAssignCoco(false)}
          pids={selectedPids}
          rid={company.recruitment_cycle_id.toString()}
                   onAssignSuccess={() => {
            fetchMagicSheets(selectedPids);
            setSelectedPids([]);
    setOpenAssignCoco(false);
  }}

        />
      </Modal>

      <Modal open={openAddStudent} onClose={() => setOpenAddStudent(false)}>
        <AddStudent
          handleClose={() => setOpenAddStudent(false)}
          handleSubmitStudent={handleSubmitStudent}
        />
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this entry?
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

export default CompanyMagicSheet;
 