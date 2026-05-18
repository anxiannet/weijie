import type {
  ExpertService,
  PeopleBudgetType,
  PeopleRequest,
  PeopleRequestMode,
  PeopleRequestWithCreator,
  UserProfile,
} from '@/lib/supabase/database.types';

export const PEOPLE_MODE_LABELS: Record<PeopleRequestMode, string> = {
  buddy: '找搭子',
  service: '找达人',
};

export const PEOPLE_BUDDY_CATEGORIES = ['逛街', '吃饭', '看电影', '打球', 'K歌', '夜店', '拼消费'];

export const PEOPLE_SERVICE_CATEGORIES = ['教练', '陪玩', '跑腿', '陪诊', '接送', '租房带看', '留学咨询'];

export const PEOPLE_AREAS = [
  'NUS / Kent Ridge',
  'NTU / Jurong West',
  'SMU / Dhoby Ghaut',
  'Clementi',
  'Queenstown',
  'Bugis',
  'Orchard',
  'Tampines',
  'Woodlands',
  '全岛',
];

export const PEOPLE_BUDGET_LABELS: Record<PeopleBudgetType, string> = {
  aa: 'AA',
  treat: '我请客',
  fixed: '固定预算',
  negotiable: '可商量',
};

export const PEOPLE_SAFETY_CATEGORIES = new Set(['夜店', '陪玩', '陪诊', '接送', '租房带看']);

export function parsePeopleAmount(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function toArrayFromText(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatPeopleDate(value: string | null) {
  if (!value) {
    return '时间待定';
  }

  return new Date(value).toLocaleString('zh-SG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalize(value: string | null | undefined) {
  return (value || '').trim().toLowerCase();
}

function hasTimeOverlap(request: Pick<PeopleRequest, 'start_time' | 'end_time'>, service?: Pick<ExpertService, 'available_times'> | null) {
  if (!request.start_time) {
    return true;
  }

  if (!service?.available_times?.length) {
    return true;
  }

  const requestDay = new Date(request.start_time).toLocaleDateString('zh-SG', {weekday: 'short'});
  return service.available_times.some((time) => normalize(time).includes(normalize(requestDay)) || normalize(time).includes('可商量'));
}

function budgetMatches(request: Pick<PeopleRequest, 'budget_type' | 'budget_amount'>, service?: Pick<ExpertService, 'price_type' | 'price_amount'> | null) {
  if (request.budget_type === 'negotiable' || !request.budget_amount || !service?.price_amount) {
    return true;
  }

  return request.budget_amount >= service.price_amount;
}

export function matchScore({
  request,
  profile,
  service,
}: {
  request: PeopleRequest;
  profile?: UserProfile | null;
  service?: ExpertService | null;
}) {
  let score = 0;

  if (service ? normalize(service.category) === normalize(request.category) : true) {
    score += 30;
  }

  const profileArea = normalize(profile?.location_area);
  const serviceArea = normalize(service?.service_area);
  const requestArea = normalize(request.location_area);
  if (requestArea && (profileArea.includes(requestArea) || requestArea.includes(profileArea) || serviceArea.includes(requestArea) || requestArea.includes(serviceArea))) {
    score += 20;
  }

  if (hasTimeOverlap(request, service)) {
    score += 20;
  }

  if (budgetMatches(request, service)) {
    score += 10;
  }

  score += Math.min(10, Math.round(Number(profile?.rating_avg || 0) * 2));

  const createdAt = profile?.updated_at || profile?.created_at;
  if (createdAt && Date.now() - new Date(createdAt).getTime() < 1000 * 60 * 60 * 24 * 30) {
    score += 10;
  }

  return Math.min(100, score);
}

export function getPeopleRequestSubtitle(request: PeopleRequestWithCreator) {
  const budget = PEOPLE_BUDGET_LABELS[request.budget_type];
  const amount = request.budget_amount ? ` · S$${request.budget_amount}` : '';
  return `${request.location_area || '地点待定'} · ${formatPeopleDate(request.start_time)} · ${budget}${amount}`;
}
