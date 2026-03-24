"use client";

import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import AssetsAndInventory from "./AssetsAndInventory";
import { AuditLogAndDashboard } from "./AuditLogAndDashboard";
import { PurchaseAndFinance } from "./PurchaseAndFinance";
import TicketAndWorkflow from "./TicketAndWorkflow";
import { UserAndEmployee } from "./UserAndEmployee";

const REPORT_TABS = [
  "Asset & Inventory",
  "Ticket & Workflow",
  "Users",
  "Purchase & Finance",
  "Audit Log & Dashboard",
] as const;

function a11yProps(index: number) {
  return {
    id: `reports-tab-${index}`,
    "aria-controls": `reports-tabpanel-${index}`,
  };
}

function TabPanel(props: {
  value: number;
  index: number;
  render: () => React.ReactNode;
}) {
  const { value, index, render } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      sx={{ pt: 3 }}
    >
      {value === index ? render() : null}
    </Box>
  );
}

export default function ReportsPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [tab, setTab] = React.useState(0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        display: "flex",
        gap: 2,
        flexDirection: isDesktop ? "row" : "column",
      }}
    >
      <Tabs
        orientation={isDesktop ? "vertical" : "horizontal"}
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(_, next) => setTab(next)}
        sx={{
          minWidth: isDesktop ? 220 : "auto",
          borderRight: isDesktop
            ? `1px solid ${theme.palette.divider}`
            : "none",
          borderBottom: isDesktop
            ? "none"
            : `1px solid ${theme.palette.divider}`,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            alignItems: "flex-start",
          },
        }}
      >
        {REPORT_TABS.map((label, idx) => (
          <Tab key={label} label={label} {...a11yProps(idx)} />
        ))}
      </Tabs>

      <Box
        sx={{
          // ────────────────────────────────────────
          // Most important lines
          flex: "1 1 auto", // grow + shrink + start from auto basis
          minWidth: 0, // ← THIS is the key fix – allows shrinking below content min-width
          width: "100%", // helps in some edge cases
          maxWidth: "100%", // safety belt
          // ────────────────────────────────────────

          // Optional but recommended – prevents any bleed from children
          overflow: "hidden",

          // If you want internal scroll on very narrow screens (rarely needed)
          // overflowX: "auto",
        }}
      >
        <TabPanel value={tab} index={0} render={() => <AssetsAndInventory />} />
        <TabPanel value={tab} index={1} render={() => <TicketAndWorkflow />} />
        <TabPanel value={tab} index={2} render={() => <UserAndEmployee />} />
        <TabPanel value={tab} index={3} render={() => <PurchaseAndFinance />} />
        <TabPanel
          value={tab}
          index={4}
          render={() => <AuditLogAndDashboard />}
        />
      </Box>
    </Paper>
  );
}
