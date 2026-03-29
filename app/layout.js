export const metadata = {
  title: "Project App",
  description: "Mijn project systeem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
