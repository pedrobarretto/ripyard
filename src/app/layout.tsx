import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { NavBar } from '@/components';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ripyard',
  description: 'Eternize suas frases na lápide!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={inter.className}
        style={{ margin: 0, backgroundColor: '#EBEBEB' }}
      >
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
