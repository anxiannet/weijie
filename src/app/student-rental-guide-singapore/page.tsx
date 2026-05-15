import {SeoPageLayout} from '@/components/seo-rental/SeoPageLayout';
import {buildRentalMetadata, getRelatedLinks, getRentalSeoPage} from '@/lib/seo-rental-pages';

const page = getRentalSeoPage('student-rental-guide-singapore');

export const metadata = buildRentalMetadata(page);

export default function StudentRentalGuideSingaporePage() {
  return <SeoPageLayout page={page} relatedLinks={getRelatedLinks(page)} />;
}
