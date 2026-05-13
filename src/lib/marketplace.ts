import type {ListingType} from '@/lib/supabase/database.types';

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  room: '单间',
  whole_unit: '整套',
  student_apartment: '学生公寓',
};

export const SCHOOL_OPTIONS = [
  '新加坡国立大学',
  '南洋理工大学',
  '新加坡管理大学',
  '新加坡科技设计大学',
  '新加坡理工大学',
  '新跃社科大学',
  '南洋艺术学院',
  '新加坡管理发展学院',
  '博伟教育学院',
];

export const AMENITY_OPTIONS = [
  '可煮',
  '独立卫浴',
  '包水电',
  '近地铁',
  '健身房',
  '泳池',
  '保安',
  '可短租',
  '女生优先',
];

export function parsePositiveNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
