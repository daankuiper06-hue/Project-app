import "./globals.css";

export const metadata = {
  title: "D Kuiper Techniek",
  description: "Projecten, calculaties en facturen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
