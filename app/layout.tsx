// app/layout.jsx
import './globals.css';
import Providers from './providers';

// @ts-ignore
export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
