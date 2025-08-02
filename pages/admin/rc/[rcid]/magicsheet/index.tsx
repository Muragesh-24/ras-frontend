
import React, { useEffect, useState, useMemo } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useRouter } from "next/router";

import MagicSheetRequest from "@callbacks/admin/magicsheet/magicsheetAdmin";
import requestCompany, { CompanyRc } from "@callbacks/admin/rc/company";
import { MagicSheet } from "@callbacks/admin/magicsheet/magicsheetAdmin";

import MasterMagicSheet from "sections/MasterMagicsheet";
import CompanyMagicSheet from "sections/CompanyMagicSheet";
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

function Index() {
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [masterData, setMasterData] = useState<MagicSheet[]>([]);
  const [companyList, setCompanyList] = useState<CompanyRc[]>([]);

  const router = useRouter();
  const { token } = useStore();
  const { rcid } = router.query;

  const rcidNumber = useMemo(() => {
    if (typeof rcid === "string") return parseInt(rcid);
    return undefined;
  }, [rcid]);

  useEffect(() => {
    const getMasterData = async () => {
      if (!rcidNumber) return;
      setIsLoading(true);
      try {
        const res = await MagicSheetRequest.getAll(token, rcidNumber);
        setMasterData(res);
      } catch (err) {
        console.error("Error fetching master data:", err);
      }
      setIsLoading(false);
    };

    const getAllCompanies = async () => {
      if (!rcidNumber) return;
      setIsLoading(true);
      try {
        const res = await requestCompany.getall(token, rcidNumber.toString());
       const sortedRes = res.sort((a, b) =>
  a.company_name.localeCompare(b.company_name)
);

setCompanyList(sortedRes);

      } catch (err) {
        console.error("Error fetching companies:", err);
      }
      setIsLoading(false);
    };

    if (router.isReady) {
      getMasterData();
      getAllCompanies();
    }
  }, [router.isReady, token, rcidNumber]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      
      <h2>Magic Sheet</h2>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="tabs">
            <Tab label="MASTER" />
            {companyList.map((company, index) => (
              <Tab label={company.company_name} key={company.ID} />
            ))}
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <MasterMagicSheet data={masterData} isLoading={isLoading} />
        </TabPanel>

        {companyList.map((company, index) => (
          <TabPanel value={value} index={index + 1} key={company.ID}>
            <CompanyMagicSheet company={company} />
          </TabPanel>
        ))}
      </Box>
    </div>
  );
}

Index.layout = "adminPhaseDashBoard";
export default Index;
