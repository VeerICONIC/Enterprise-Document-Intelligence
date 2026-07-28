import { Grid } from "@mui/material";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import StatCard from "../components/StatCard";
import DocumentTable from "../components/DocumentTable";
import ChatWindow from "../components/ChatWindow";
import BackendHealth from "../components/BackendHealth";
import Pipeline from "../components/Pipeline";
function Dashboard() {
  return (
    <>
      <StatCard />
      <AnalyticsDashboard/>
      <Grid
        container
        spacing={3}
        sx={{
          mt: 1,
        }}
      >
        <Grid size={{ xs: 12, lg: 6 }}>
          <DocumentTable />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChatWindow />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <BackendHealth />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Pipeline />
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;