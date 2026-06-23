import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { fetchDashboard } from "../api/dashboard";
import VoteButtons from "./VoteButtons";

export default function NewsCard() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Market News
        </Typography>

        {isPending && (
          <Box className="flex justify-center py-6">
            <CircularProgress size={28} />
          </Box>
        )}

        {isError && <Alert severity="error">Couldn't load news.</Alert>}

        {!isPending && !isError && data.news.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No news available right now.
          </Typography>
        )}

        {!isPending && !isError && data.news.length > 0 && (
          <Stack divider={<Divider flexItem />} spacing={1.5}>
            {data.news.map((item) => (
              <Box
                key={item.url}
                className="flex items-start justify-between gap-2"
              >
                <Box>
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="inherit"
                  >
                    <Typography variant="subtitle2">{item.title}</Typography>
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    {item.source} ·{" "}
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <VoteButtons section="news" itemRef={item.url} />
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
