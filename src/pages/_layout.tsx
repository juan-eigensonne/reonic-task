import '../styles.css';

import type { ReactNode } from 'react';

import { Header } from '../components/header';
import { Footer } from '../components/footer';

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html>
            <body>
                <div className="font-['Nunito']">
                    <Header />
                    <main className="m-6 flex items-center *:min-h-64 *:min-w-64 lg:m-0 lg:min-h-svh lg:justify-center">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}

export const getConfig = async () => {
    return {
        render: 'static',
    };
};
