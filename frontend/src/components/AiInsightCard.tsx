import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { fetchDashboard } from "../api/dashboard";
import VoteButtons from "./VoteButtons";

export default function AiInsightCard() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          AI Insight of the Day
        </Typography>

        {isPending && (
          <Box className="flex justify-center py-6">
            <CircularProgress size={28} />
          </Box>
        )}

        {isError && <Alert severity="error">Couldn't load an insight.</Alert>}

        {!isPending && !isError && (
          <>
            <Typography variant="body1" color="text.secondary">
              {data.aiInsight}
            </Typography>
            <Box className="mt-2 flex justify-end">
              <VoteButtons section="ai" itemRef={data.aiInsight} />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
