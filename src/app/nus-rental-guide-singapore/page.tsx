import {SeoPageLayout} from '@/components/seo-rental/SeoPageLayout';
import {buildRentalMetadata, getRelatedLinks, getRentalSeoPage} from '@/lib/seo-rental-pages';

const page = getRentalSeoPage('nus-rental-guide-singapore');

export const metadata = buildRentalMetadata(page);

export default function NusRentalGuideSingaporePage() {
  return <SeoPageLayout page={page} relatedLinks={getRelatedLinks(page)} />;
}
