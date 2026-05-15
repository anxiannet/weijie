import {SeoPageLayout} from '@/components/seo-rental/SeoPageLayout';
import {buildRentalMetadata, getRelatedLinks, getRentalSeoPage} from '@/lib/seo-rental-pages';

const page = getRentalSeoPage('hdb-vs-condo-singapore');

export const metadata = buildRentalMetadata(page);

export default function HdbVsCondoSingaporePage() {
  return <SeoPageLayout page={page} relatedLinks={getRelatedLinks(page)} />;
}
