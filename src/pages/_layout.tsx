import '../styles.css';

import type { ReactNode } from 'react';

import { Header } from '../components/header';
import { Footer } from '../components/footer';

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html>
            <body>
                <div className="">
                    <main className="m-6 flex items-center *:min-h-100 h-100 lg:my-10 lg:mx-auto lg:justify-center flex-1 lg:max-w-[1000px] font-['Nunito']">
                        {children}
                    </main>
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
