import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: "#111827",
        color: "white",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1F2937",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#FFFFFF"
        >
          DIS
        </Typography>

        <Typography
          variant="body2"
          color="#CBD5E1"
        >
          Enterprise AI Workspace
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#334155" }} />

      {/* Navigation */}
      <List sx={{ mt: 2, px: 1 }}>

        <ListItemButton
          component={Link}
          to="/"
          selected={location.pathname === "/"}
          sx={{
            borderRadius: 2,
            mb: 1,
            "&.Mui-selected": {
              bgcolor: "#1E3A8A",
            },
            "&.Mui-selected:hover": {
              bgcolor: "#1D4ED8",
            },
            "&:hover": {
              bgcolor: "#1F2937",
            },
          }}
        >
          <ListItemIcon>
            <DashboardRoundedIcon
              sx={{
                color:
                  location.pathname === "/"
                    ? "#60A5FA"
                    : "#94A3B8",
              }}
            />
          </ListItemIcon>

          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{
              fontWeight:
                location.pathname === "/"
                  ? 700
                  : 500,
            }}
          />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/documents"
          selected={location.pathname === "/documents"}
          sx={{
            borderRadius: 2,
            "&.Mui-selected": {
              bgcolor: "#1E3A8A",
            },
            "&.Mui-selected:hover": {
              bgcolor: "#1D4ED8",
            },
            "&:hover": {
              bgcolor: "#1F2937",
            },
          }}
        >
          <ListItemIcon>
            <DescriptionRoundedIcon
              sx={{
                color:
                  location.pathname === "/documents"
                    ? "#60A5FA"
                    : "#94A3B8",
              }}
            />
          </ListItemIcon>

          <ListItemText
            primary="Documents"
            primaryTypographyProps={{
              fontWeight:
                location.pathname === "/documents"
                  ? 700
                  : 500,
            }}
          />
        </ListItemButton>

      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: "#334155" }} />

      <Box sx={{ p: 3 }}>
        <Typography
          variant="body2"
          color="#64748B"
          textAlign="center"
        >
          Enterprise Document Intelligence
        </Typography>

        <Typography
          variant="caption"
          color="#475569"
          display="block"
          textAlign="center"
          mt={0.5}
        >
          Version 1.0
        </Typography>
      </Box>
    </Box>
  );
}

export default Sidebar;