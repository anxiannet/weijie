import {SeoPageLayout} from '@/components/seo-rental/SeoPageLayout';
import {buildRentalMetadata, getRelatedLinks, getRentalSeoPage} from '@/lib/seo-rental-pages';

const page = getRentalSeoPage('ntu-rental-guide-singapore');

export const metadata = buildRentalMetadata(page);

export default function NtuRentalGuideSingaporePage() {
  return <SeoPageLayout page={page} relatedLinks={getRelatedLinks(page)} />;
}
