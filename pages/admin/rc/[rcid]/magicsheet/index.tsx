
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box } from '@mui/material';
import MagicSheetRequest from "@callbacks/admin/magicsheet/magicsheetAdmin";
import { MagicSheet } from "@callbacks/admin/magicsheet/magicsheetAdmin";
import MasterMagicSheet from "sections/MasterMagicsheet";
import CompanyMagicSheet from "sections/CompanyMagicSheet";
import { useRouter } from "next/router";
import useStore from "@store/store";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

//company sort ye eka sort karke forloop


//coco assignment it will e done in section


function Index() {


  const [value, setValue] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [masterData, setMasterData] = useState<MagicSheet[]>([]);

  const { token } = useStore();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getMasterdata = async () => {
      setIsLoading(true);
      const res = await MagicSheetRequest.getAll(token);
      setMasterData(res)
      setIsLoading(false);

    }
    if (router.isReady) getMasterdata();
  }, [router.isReady, token]
  )



  return (
    <div>

      <h2>Magic Sheet</h2>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="MASTER" />
            <Tab label="Company" />
            {/* hard coded for now , badme ek forloop */}
            <Tab label="Company 2" />
          </Tabs>
        </Box>

      </Box>

      <TabPanel value={value} index={0}>

        <MasterMagicSheet data={masterData} isLoading={false} />

      </TabPanel>
      <TabPanel value={value} index={1}>
        <CompanyMagicSheet />
      </TabPanel>
      {/* hard coded for now , badme ek forloop */}
      <TabPanel value={value} index={2}>
        <CompanyMagicSheet />
      </TabPanel>

    </div>
  );
}

Index.layout = "adminPhaseDashBoard";
export default Index;
