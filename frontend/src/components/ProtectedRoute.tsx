import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { fetchPreferences } from "../api/preferences";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const { data: prefs, isLoading: prefsLoading } = useQuery({
    queryKey: ["preferences"],
    queryFn: fetchPreferences,
    enabled: !!user,
  });

  if (isLoading || (user && prefsLoading)) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const onboarded = prefs?.onboarded ?? false;
  const onOnboardingPage = location.pathname === "/onboarding";

  // Not onboarded yet -> force them through the quiz.
  if (!onboarded && !onOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
  }

  // Already onboarded -> no need to revisit the quiz.
  if (onboarded && onOnboardingPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
