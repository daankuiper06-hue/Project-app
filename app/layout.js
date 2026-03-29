import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: "Project App",
  description: "Projecten, calculaties en facturen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body
        style={{
          margin: 0,
          background: "#f3f4f6",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
