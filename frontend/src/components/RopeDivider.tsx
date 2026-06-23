import { Box } from "@mui/material";

// A themed replacement for MUI's <Divider />: a frayed-rope line with an
// anchor in the middle. Purely decorative.
export default function RopeDivider() {
  const rope = {
    flex: 1,
    height: 3,
    borderRadius: 2,
    background:
      "repeating-linear-gradient(90deg, #caa24a 0 7px, transparent 7px 12px)",
    opacity: 0.7,
  } as const;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "#caa24a",
        py: 0.5,
      }}
    >
      <Box sx={rope} />
    </Box>
  );
}
