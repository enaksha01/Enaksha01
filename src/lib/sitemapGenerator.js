/**
 * Dynamic Sitemap Generator for e-Naksha Studio
 * Adheres to Sitemaps XML protocol (https://www.sitemaps.org/schemas/sitemap/0.9)
 * Calculates priorities and security directives safely.
 */

export const generateSitemapXml = (baseUrl = window.location.origin, extraRoutes = []) => {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const currentDate = new Date().toISOString().split('T')[0];

  // Core public routes with SEO priority & change frequency
  const staticRoutes = [
    {
      url: `${cleanBase}/`,
      changefreq: 'daily',
      priority: '1.0',
      lastmod: currentDate,
      title: 'Home Studio & CAD Blueprint Engine'
    },
    {
      url: `${cleanBase}/#service-2d`,
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: currentDate,
      title: '2D Vaastu Floor Layout Plans'
    },
    {
      url: `${cleanBase}/#service-3d`,
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: currentDate,
      title: '3D Elevation & Photorealistic Facades'
    },
    {
      url: `${cleanBase}/#projects`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate,
      title: 'Architectural Portfolio & Blueprints'
    },
    {
      url: `${cleanBase}/#terms`,
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: currentDate,
      title: 'Terms of Architectural Service'
    },
    {
      url: `${cleanBase}/#privacy`,
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: currentDate,
      title: 'Client Privacy Policy'
    },
    {
      url: `${cleanBase}/#refund`,
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: currentDate,
      title: 'Refund & Cancellation Policy'
    },
    {
      url: `${cleanBase}/#shipping`,
      changefreq: 'monthly',
      priority: '0.3',
      lastmod: currentDate,
      title: 'Digital CAD Delivery Policy'
    }
  ];

  // Merge extra routes safely, filtering out sensitive admin paths
  const allRoutes = [...staticRoutes, ...extraRoutes].filter(r => {
    const urlStr = r.url.toLowerCase();
    // Security barrier: Never expose internal administration routes to search crawlers
    return !urlStr.includes('admin') && !urlStr.includes('master');
  });

  const xmlEntries = allRoutes.map(route => `  <url>
    <loc>${escapeXml(route.url)}</loc>
    <lastmod>${route.lastmod || currentDate}</lastmod>
    <changefreq>${route.changefreq || 'weekly'}</changefreq>
    <priority>${route.priority || '0.7'}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>`;
};

const escapeXml = (unsafe) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

export const downloadSitemap = (xmlString, filename = 'sitemap.xml') => {
  const blob = new Blob([xmlString], { type: 'application/xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
