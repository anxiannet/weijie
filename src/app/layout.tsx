
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://weijie.sg'),
  title: {
    default: '维界 | 新加坡留学生生活平台',
    template: '%s | 维界',
  },
  description: '维界是面向新加坡中国留学生的一站式生活平台，提供租房、学校、美食、活动、社交与本地生活信息。',
  keywords: [
    '新加坡留学',
    '新加坡租房',
    '新加坡留学指南',
    '新加坡留学生',
    '新加坡留学生租房',
    '新加坡学生公寓',
    '新加坡国立大学租房',
    '南洋理工大学租房',
    '新加坡管理大学租房',
    '新加坡大学申请',
    '新加坡生活',
    '新加坡留学生活',
    '新加坡中国留学生',
    '新加坡美食',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/weijie-logo-icon.png?v=202605130107',
    apple: '/weijie-logo-icon.png?v=202605130107',
  },
  openGraph: {
    title: '维界 | 新加坡留学生生活平台',
    description: '新加坡留学生活，一站到位。租房、学校、美食、活动与本地生活信息都在维界。',
    url: 'https://weijie.sg',
    siteName: 'weijie.sg',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '维界 | 新加坡留学生生活平台',
    description: '新加坡留学生活，一站到位。',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '维界',
  url: 'https://weijie.sg',
  inLanguage: 'zh-CN',
  slogan: '新加坡留学生活，一站到位。',
  description: '面向新加坡中国留学生的一站式生活平台，提供租房、学校、美食、活动、社交与本地生活信息。',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://weijie.sg/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: '维界',
    url: 'https://weijie.sg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased selection:bg-accent/30">
        {children}
      </body>
    </html>
  );
}
