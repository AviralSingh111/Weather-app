import './globals.css';
import { Providers } from '../components/Providers';

export const metadata = {
  title: 'Weather App',
  description: 'Search for weather information by locality',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}