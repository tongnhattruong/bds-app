import { BDSProvider } from './lib/store';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './lib/auth';
import BDSNavbar from './components/BDSNavbar';
import './bds-global.css';
import FaviconUpdater from '../components/FaviconUpdater';
import ScrollToTop from '../components/ScrollToTop';

export const metadata = {
    title: 'Bất Động Sản - Mua bán nhà đất uy tín',
    description: 'Website bất động sản hàng đầu',
};

import BDSFooter from './components/BDSFooter';

// ...

export default function BDSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body className="antialiased">
                <BDSProvider>
                    <FaviconUpdater />
                    <ScrollToTop />
                    <AuthProvider>
                        <ToastProvider>
                            <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
                                <BDSNavbar />
                                <main className="flex-grow">
                                    {children}
                                </main>
                                <BDSFooter />
                            </div>
                        </ToastProvider>
                    </AuthProvider>
                </BDSProvider>
            </body>
        </html>
    );
}

