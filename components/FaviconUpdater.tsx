'use client';

import { useEffect } from 'react';
import { useBDS } from '../app/lib/store';

export default function FaviconUpdater() {
    const { systemConfig } = useBDS();

    useEffect(() => {
        if (systemConfig?.faviconUrl) {
            const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (link) {
                link.href = systemConfig.faviconUrl;
            } else {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.href = systemConfig.faviconUrl;
                document.getElementsByTagName('head')[0].appendChild(newLink);
            }
        }
    }, [systemConfig?.faviconUrl]);

    return null;
}
