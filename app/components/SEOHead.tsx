'use client';

import { useEffect } from 'react';
import { useBDS } from '../lib/store';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export default function SEOHead({ title, description, keywords, image, url }: SEOProps) {
    const { systemConfig } = useBDS();

    useEffect(() => {
        // Fallback to system defaults
        const finalTitle = title || systemConfig?.siteTitle || 'Bất Động Sản Demo';
        const finalDescription = description || systemConfig?.siteDescription || 'Trang thông tin bất động sản';
        const finalKeywords = keywords || systemConfig?.siteKeywords || 'bds, nha dat';
        const finalImage = image || systemConfig?.ogImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
        const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

        // Update Title
        document.title = finalTitle;
        const titleTag = document.querySelector('title');
        if (titleTag) {
            titleTag.textContent = finalTitle;
        }

        // Helper to update meta tag
        const updateMeta = (name: string, content: string) => {
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Helper to update Open Graph and Twitter tag (using property or name)
        const updateProperty = (property: string, content: string) => {
            let element = document.querySelector(`meta[property="${property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const updateTwitter = (name: string, content: string) => {
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        }

        // --- Standard Meta ---
        updateMeta('description', finalDescription);
        updateMeta('keywords', finalKeywords);
        updateMeta('author', 'Bất Động Sản Demo');

        // --- Open Graph (Facebook, Zalo) ---
        updateProperty('og:type', 'website');
        updateProperty('og:site_name', systemConfig?.siteTitle || 'Bất Động Sản Demo');
        updateProperty('og:url', currentUrl);
        updateProperty('og:title', finalTitle);
        updateProperty('og:description', finalDescription);
        updateProperty('og:image', finalImage);
        updateProperty('og:image:alt', finalTitle);
        updateProperty('og:locale', 'vi_VN');

        // --- Twitter Card ---
        updateTwitter('twitter:card', 'summary_large_image');
        updateTwitter('twitter:title', finalTitle);
        updateTwitter('twitter:description', finalDescription);
        updateTwitter('twitter:image', finalImage);

        // --- JSON-LD Schema ---
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": finalTitle,
            "url": currentUrl,
            "description": finalDescription,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${window.location.origin}/listings?searchTerm={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        };

        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.setAttribute('type', 'application/ld+json');
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schemaData);

    }, [title, description, keywords, image, url, systemConfig]);

    return null; // This component doesn't render anything UI-wise
}

