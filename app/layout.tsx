import Navbar from "@/components/Navbar";
import Player from "@/components/Player";
import { Container, Stack, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import StoreProvider from "@/app/StoreProvider";
import { Roboto } from "next/font/google";

import theme from "@/theme/theme";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <StoreProvider>
              <>
                <Navbar />
                <Stack alignItems="center" gap={5} overflow="auto">
                  <Container maxWidth="xl">{children}</Container>
                  <Player />
                </Stack>
              </>
            </StoreProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
