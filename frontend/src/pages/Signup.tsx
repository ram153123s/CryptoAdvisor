import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import {
  Box,
  Button,
  Card,
  Link,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { signup } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof schema>;

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: SignupForm) =>
      signup(values.email, values.name, values.password),
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate("/onboarding");
    },
  });

  const errorMessage =
    mutation.error instanceof AxiosError
      ? (mutation.error.response?.data?.error ?? "Something went wrong.")
      : "Something went wrong.";

  return (
    <Box className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8">
        <Stack
          component="form"
          spacing={3}
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
        >
          <Typography variant="h4">Create account</Typography>

          {mutation.isError && <Alert severity="error">{errorMessage}</Alert>}

          <TextField
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Sign up"}
          </Button>

          <Typography variant="body2">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Log in
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
