import {SeoPageLayout} from '@/components/seo-rental/SeoPageLayout';
import {buildRentalMetadata, getRelatedLinks, getRentalSeoPage} from '@/lib/seo-rental-pages';

const page = getRentalSeoPage('singapore-agent-fee-rental-guide');

export const metadata = buildRentalMetadata(page);

export default function SingaporeAgentFeeRentalGuidePage() {
  return <SeoPageLayout page={page} relatedLinks={getRelatedLinks(page)} />;
}
