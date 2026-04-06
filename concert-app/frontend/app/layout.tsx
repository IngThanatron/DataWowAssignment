import type { Metadata } from "next";
import "./global.css";
import LayoutWrapper from "../components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Concert App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
