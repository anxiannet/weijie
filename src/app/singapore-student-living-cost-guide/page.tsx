import {SeoPageLayout} from '@/components/seo-rental/SeoPageLayout';
import {buildRentalMetadata, getRelatedLinks, getRentalSeoPage} from '@/lib/seo-rental-pages';

const page = getRentalSeoPage('singapore-student-living-cost-guide');

export const metadata = buildRentalMetadata(page);

export default function SingaporeStudentLivingCostGuidePage() {
  return <SeoPageLayout page={page} relatedLinks={getRelatedLinks(page)} />;
}
