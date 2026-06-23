import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  FormHelperText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { savePreferences } from "../api/preferences";

const ASSET_OPTIONS = [
  "BTC",
  "ETH",
  "SOL",
  "XRP",
  "ADA",
  "DOGE",
  "BNB",
  "AVAX",
];
const INVESTOR_OPTIONS = ["HODLer", "Day Trader", "NFT Collector"];
const CONTENT_OPTIONS = ["Market News", "Charts", "Social", "Fun"];

const schema = z.object({
  assets: z.array(z.string()).min(1, "Pick at least one asset"),
  investorType: z.string().min(1, "Select an investor type"),
  contentTypes: z.array(z.string()).min(1, "Pick at least one content type"),
});

type OnboardingForm = z.infer<typeof schema>;

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(schema),
    defaultValues: { assets: [], investorType: "", contentTypes: [] },
  });

  const mutation = useMutation({
    mutationFn: (values: OnboardingForm) => savePreferences(values),
    onSuccess: (prefs) => {
      queryClient.setQueryData(["preferences"], prefs);
      navigate("/dashboard");
    },
  });

  return (
    <Box className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <Stack
          component="form"
          spacing={4}
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
        >
          <Box className="text-center">
            <Typography variant="h4">Welcome aboard</Typography>
            <Typography variant="body2" color="text.secondary">
              Tell us what you care about so we can tailor your dashboard.
            </Typography>
          </Box>

          {mutation.isError && (
            <Alert severity="error">
              Couldn't save your preferences. Please try again.
            </Alert>
          )}

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Which assets are you interested in?
            </Typography>
            <Controller
              control={control}
              name="assets"
              render={({ field }) => (
                <Box className="flex flex-wrap gap-2">
                  {ASSET_OPTIONS.map((asset) => {
                    const selected = field.value.includes(asset);
                    return (
                      <Chip
                        key={asset}
                        label={asset}
                        color={selected ? "primary" : "default"}
                        variant={selected ? "filled" : "outlined"}
                        onClick={() =>
                          field.onChange(toggle(field.value, asset))
                        }
                      />
                    );
                  })}
                </Box>
              )}
            />
            {errors.assets && (
              <FormHelperText error>{errors.assets.message}</FormHelperText>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              What kind of investor are you?
            </Typography>
            <Controller
              control={control}
              name="investorType"
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(_e, value) => field.onChange(value ?? "")}
                  className="flex-wrap"
                >
                  {INVESTOR_OPTIONS.map((type) => (
                    <ToggleButton key={type} value={type}>
                      {type}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              )}
            />
            {errors.investorType && (
              <FormHelperText error>
                {errors.investorType.message}
              </FormHelperText>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              What content would you like to see?
            </Typography>
            <Controller
              control={control}
              name="contentTypes"
              render={({ field }) => (
                <Box className="flex flex-wrap gap-2">
                  {CONTENT_OPTIONS.map((content) => {
                    const selected = field.value.includes(content);
                    return (
                      <Chip
                        key={content}
                        label={content}
                        color={selected ? "primary" : "default"}
                        variant={selected ? "filled" : "outlined"}
                        onClick={() =>
                          field.onChange(toggle(field.value, content))
                        }
                      />
                    );
                  })}
                </Box>
              )}
            />
            {errors.contentTypes && (
              <FormHelperText error>
                {errors.contentTypes.message}
              </FormHelperText>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Continue to dashboard"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
