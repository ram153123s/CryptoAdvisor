import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { login as loginRequest } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/pics/logo.webp";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: LoginForm) =>
      loginRequest(values.email, values.password),
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate("/dashboard");
    },
  });

  return (
    <Box className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <Stack
          component="form"
          spacing={3}
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
        >
          <Box
            component="img"
            src={logo}
            alt="CryptoAdvisor"
            className="w-full mx-auto object-contain -mb-16"
          />
          <Typography variant="h4" className="text-center">
            Log in
          </Typography>

          {mutation.isError && (
            <Alert severity="error">Invalid email or password.</Alert>
          )}

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
            {mutation.isPending ? "Logging in..." : "Log in"}
          </Button>

          <Typography variant="body2">
            No account?{" "}
            <Link component={RouterLink} to="/signup">
              Sign up
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
