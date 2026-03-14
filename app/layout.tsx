import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexus — Everything Connected",
  description: "Tasks, docs, and real-time chat in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}