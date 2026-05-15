import {SeoPageLayout} from '@/components/seo-rental/SeoPageLayout';
import {buildRentalMetadata, getRelatedLinks, getRentalSeoPage} from '@/lib/seo-rental-pages';

const page = getRentalSeoPage('common-room-vs-master-room-singapore');

export const metadata = buildRentalMetadata(page);

export default function CommonRoomVsMasterRoomSingaporePage() {
  return <SeoPageLayout page={page} relatedLinks={getRelatedLinks(page)} />;
}
