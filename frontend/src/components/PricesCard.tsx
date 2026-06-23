import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { fetchDashboard } from "../api/dashboard";
import VoteButtons from "./VoteButtons";

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 6 : 2,
  });
}

export default function PricesCard() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Coin Prices
        </Typography>

        {isPending && (
          <Box className="flex justify-center py-6">
            <CircularProgress size={28} />
          </Box>
        )}

        {isError && (
          <Alert severity="error">Couldn't load prices right now.</Alert>
        )}

        {!isPending && !isError && data.prices.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No coins selected. Update your preferences to see prices.
          </Typography>
        )}

        {!isPending && !isError && data.prices.length > 0 && (
          <Stack divider={<Divider flexItem />} spacing={1}>
            {data.prices.map((coin) => {
              const up = (coin.change24h ?? 0) >= 0;
              return (
                <Box
                  key={coin.id}
                  className="flex items-center justify-between gap-3"
                >
                  <Box className="flex items-center gap-3">
                    <Avatar
                      src={coin.image}
                      alt={coin.symbol}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography variant="subtitle2">{coin.symbol}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {coin.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="text-right">
                    <Typography variant="subtitle2">
                      {formatPrice(coin.price)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: up ? "#16c784" : "#ea3943" }}
                    >
                      {coin.change24h === null
                        ? "—"
                        : `${up ? "+" : ""}${coin.change24h.toFixed(2)}%`}
                    </Typography>
                  </Box>

                  <VoteButtons section="prices" itemRef={coin.id} />
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
