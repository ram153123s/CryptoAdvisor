import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import PricesCard from "../components/PricesCard";
import MemeCard from "../components/MemeCard";
import NewsCard from "../components/NewsCard";
import AiInsightCard from "../components/AiInsightCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h4">
          {user ? `Welcome, ${user.name}` : "Dashboard"}
        </Typography>
        <Button variant="outlined" color="inherit" onClick={handleLogout}>
          Log out
        </Button>
      </Box>
      <Box className="grid gap-4 md:grid-cols-2">
        <PricesCard />
        <NewsCard />
        <AiInsightCard />
        <MemeCard />
      </Box>
    </Container>
  );
}
