import { routes } from "@/constants";
import { Typography, Button, Container } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" gutterBottom>
        Welcome
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Your music journey starts here.
      </Typography>

      <Link href={routes.tracks} passHref>
        <Button variant="contained">Go to Track List</Button>
      </Link>
    </Container>
  );
}
