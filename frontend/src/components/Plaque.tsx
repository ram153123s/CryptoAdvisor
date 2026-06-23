import { Box } from "@mui/material";
import { ReactNode } from "react";

// A small brass "nameplate" used as each dashboard card's title, to sell the
// treasure-chest theme. Purely presentational.
export default function Plaque({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: string;
}) {
  const screw = {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "radial-gradient(circle at 30% 30%, #fff6d5, #8a6a1f)",
    boxShadow: "inset 0 0 1px #000",
  } as const;

  return (
    <Box
      sx={{
        position: "relative",
        mb: 2,
        px: 3,
        py: 1,
        textAlign: "center",
        fontWeight: 800,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#3b2a12",
        fontSize: "1.05rem",
        borderRadius: 1,
        border: "2px solid #6e5212",
        background:
          "linear-gradient(180deg, #f4d98b 0%, #caa24a 45%, #a87d2c 100%)",
        textShadow: "0 1px 0 rgba(255,255,255,0.45)",
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.4)",
      }}
    >
      <Box sx={{ ...screw, top: 4, left: 6 }} />
      <Box sx={{ ...screw, top: 4, right: 6 }} />
      <Box sx={{ ...screw, bottom: 4, left: 6 }} />
      <Box sx={{ ...screw, bottom: 4, right: 6 }} />
      <Box
        component="span"
        sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
      >
        {children}
        {icon && (
          <Box
            component="img"
            src={icon}
            alt=""
            sx={{ height: "1.5em", width: "auto" }}
          />
        )}
      </Box>
    </Box>
  );
}
