import './globals.css';

export const metadata = {
  title: 'EthanolWatch — E20 fuel impact tracker for Indian vehicles',
  description:
    'An independent, owner-submitted record of mileage drops, engine wear, and fuel-system issues linked to ethanol-blended petrol in India.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
