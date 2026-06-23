import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Container, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { fetchPreferences } from "../api/preferences";
import PricesCard from "../components/PricesCard";
import MemeCard from "../components/MemeCard";
import NewsCard from "../components/NewsCard";
import AiInsightCard from "../components/AiInsightCard";
import logo from "../assets/pics/logo.webp";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Preferences are already loaded by the route guard; this reads the cache.
  const { data: prefs } = useQuery({
    queryKey: ["preferences"],
    queryFn: fetchPreferences,
  });
  const contentTypes = prefs?.contentTypes ?? [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="relative flex flex-col items-center gap-2 mb-6">
        <Box
          component="img"
          src={logo}
          alt="CryptoAdvisor"
          className="h-24 md:h-36 object-contain"
        />
        <Typography variant="h4" className="text-center">
          {user ? `Ahoy, ${user.name}! Welcome aboard!` : "Dashboard"}
        </Typography>
        <Box className="mt-2 md:mt-0 md:absolute md:top-0 md:right-0">
          <Button variant="outlined" color="inherit" onClick={handleLogout}>
            Log out
          </Button>
        </Box>
      </Box>
      <Box className="grid gap-4 md:grid-cols-2">
        {contentTypes.includes("Charts") && <PricesCard />}
        {contentTypes.includes("Market News") && <NewsCard />}
        {contentTypes.includes("Social") && <AiInsightCard />}
        {contentTypes.includes("Fun") && <MemeCard />}
      </Box>
    </Container>
  );
}
