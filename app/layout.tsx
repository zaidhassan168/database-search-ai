import { Inter } from "next/font/google";
import "./globals.css";
import Warnings from "./components/warnings";
import { assistantId } from "./assistant-config";
const inter = Inter({ subsets: ["latin"] });
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

export const metadata = {
  title: "Database Search AI",
  description: "A quickstart template using the Assistants API with OpenAI",
  icons: {
    icon: "/openai.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AppRouterCacheProvider>
        {assistantId ? children : <Warnings />}
        {/* <img className="logo" src="/openai.svg" alt="OpenAI Logo" /> */}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
