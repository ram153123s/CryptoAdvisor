import { useState } from "react";
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
import fallbackMeme from "../assets/fallbackmeme.webp";

export default function MemeCard() {
  const [imgError, setImgError] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Meme of the Moment
        </Typography>

        {isPending && (
          <Box className="flex justify-center py-6">
            <CircularProgress size={28} />
          </Box>
        )}

        {isError && <Alert severity="error">Couldn't load a meme.</Alert>}

        {!isPending && !isError && !data.meme && (
          <Box
            component="img"
            src={fallbackMeme}
            alt="Crypto trader life"
            className="w-full rounded-lg"
          />
        )}

        {!isPending && !isError && data.meme && (
          <Box>
            <Typography
              variant="h6"
              color="text.secondary"
              className="mt-2 block"
            >
              {data.meme.title}
            </Typography>
            <Box
              component="img"
              src={imgError ? fallbackMeme : data.meme.url}
              alt={data.meme.title}
              onError={() => setImgError(true)}
              className="w-full rounded-lg"
            />
            <Box className="mt-2 flex justify-end">
              <VoteButtons section="meme" itemRef={data.meme.url} />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
