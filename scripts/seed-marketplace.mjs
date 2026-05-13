import {config} from 'dotenv';
import {createClient} from '@supabase/supabase-js';

config({path: '.env.local'});

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error('缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SECRET_KEY');
}

const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const profileSeeds = [
  {
    email: 'demo-owner-1@weijie.sg',
    display_name: '维界房源审核',
    phone: '微信：weijie_demo',
    avatar_url: null,
  },
  {
    email: 'demo-owner-2@weijie.sg',
    display_name: '新加坡学生公寓顾问',
    phone: 'WhatsApp：+65 8123 4567',
    avatar_url: null,
  },
  {
    email: 'demo-owner-3@weijie.sg',
    display_name: '本地合租发布者',
    phone: '电话：+65 9000 1122',
    avatar_url: null,
  },
];

async function findUserByEmail(email) {
  let page = 1;
  while (page < 20) {
    const {data, error} = await supabase.auth.admin.listUsers({page, perPage: 100});
    if (error) throw error;
    const found = data.users.find((user) => user.email === email);
    if (found) return found;
    if (data.users.length < 100) return null;
    page += 1;
  }
  return null;
}

async function ensureUser(profile) {
  const existing = await findUserByEmail(profile.email);
  if (existing) return existing;

  const {data, error} = await supabase.auth.admin.createUser({
    email: profile.email,
    password: 'WeijieDemo123!',
    email_confirm: true,
    user_metadata: {
      display_name: profile.display_name,
    },
  });

  if (error) throw error;
  return data.user;
}

const users = [];
for (const profile of profileSeeds) {
  users.push(await ensureUser(profile));
}

const profiles = profileSeeds.map((profile, index) => ({
  id: users[index].id,
  display_name: profile.display_name,
  phone: profile.phone,
  avatar_url: profile.avatar_url,
}));

const listings = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    owner_id: profiles[0].id,
    title: '近新加坡国立大学 One North 主人房',
    description:
      '位于纬壹科技城核心区域，步行可达地铁站和多个食阁。房间带独立卫浴，适合新加坡国立大学、INSEAD 或附近实习学生。租金包含网络，水电按月分摊，可预约线上看房。',
    location: '纬壹科技城 / 肯特岗',
    nearest_school: '新加坡国立大学',
    mrt_station: 'one-north 地铁站',
    price_sgd: 1800,
    bedrooms: 1,
    bathrooms: 1,
    listing_type: 'room',
    available_from: '2026-06-01',
    image_urls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop'],
    amenities: ['独立卫浴', '近地铁', '保安', '健身房'],
    status: 'published',
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    owner_id: profiles[1].id,
    title: '南洋理工大学校车线旁学生公寓',
    description:
      '适合南洋理工大学学生的整洁单间，楼下有巴士直达校园。公寓配套泳池、健身房和自习区，支持半年起租。房间配书桌、衣柜、空调和高速网络。',
    location: '裕廊西',
    nearest_school: '南洋理工大学',
    mrt_station: '文礼地铁站',
    price_sgd: 1250,
    bedrooms: 1,
    bathrooms: 1,
    listing_type: 'student_apartment',
    available_from: '2026-05-25',
    image_urls: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop'],
    amenities: ['包水电', '泳池', '健身房', '可短租'],
    status: 'published',
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    owner_id: profiles[2].id,
    title: '市中心近新加坡管理大学两房整套',
    description:
      '步行可到多美歌和武吉士生活圈，适合新加坡管理大学、南洋艺术学院学生合租。两房一卫，客厅采光好，可煮，楼下生活设施完整。适合希望兼顾校园、实习和城市生活的学生。',
    location: '多美歌 / 武吉士',
    nearest_school: '新加坡管理大学',
    mrt_station: '多美歌地铁站',
    price_sgd: 3600,
    bedrooms: 2,
    bathrooms: 1,
    listing_type: 'whole_unit',
    available_from: '2026-07-01',
    image_urls: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop'],
    amenities: ['可煮', '近地铁', '保安'],
    status: 'published',
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    owner_id: profiles[0].id,
    title: '女皇镇近新加坡管理发展学院双人间',
    description:
      '距离新加坡管理发展学院步行约十分钟，适合预算友好的新生过渡。周边有超市、食阁和公交站，房东接受学生准证申请中的学生入住。',
    location: '女皇镇',
    nearest_school: '新加坡管理发展学院',
    mrt_station: '女皇镇地铁站',
    price_sgd: 980,
    bedrooms: 1,
    bathrooms: 1,
    listing_type: 'room',
    available_from: '2026-05-20',
    image_urls: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop'],
    amenities: ['可煮', '近地铁', '女生优先'],
    status: 'published',
  },
  {
    id: '10000000-0000-4000-8000-000000000005',
    owner_id: profiles[1].id,
    title: '近新加坡科技设计大学安静单间',
    description:
      '位于东部安静住宅区，公交可达新加坡科技设计大学。适合需要稳定学习环境的学生，房间家具齐全，可使用厨房和洗衣机。',
    location: '淡滨尼',
    nearest_school: '新加坡科技设计大学',
    mrt_station: '淡滨尼地铁站',
    price_sgd: 1100,
    bedrooms: 1,
    bathrooms: 1,
    listing_type: 'room',
    available_from: '2026-06-15',
    image_urls: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop'],
    amenities: ['可煮', '包水电', '保安'],
    status: 'published',
  },
  {
    id: '10000000-0000-4000-8000-000000000006',
    owner_id: profiles[2].id,
    title: '金文泰近新加坡理工学院合租普通房',
    description:
      '金文泰成熟社区普通房，适合新加坡理工学院或新加坡国立大学学生。楼下有食阁、超市和巴士站，通勤稳定，房间可立即入住。',
    location: '金文泰',
    nearest_school: '新加坡国立大学',
    mrt_station: '金文泰地铁站',
    price_sgd: 1050,
    bedrooms: 1,
    bathrooms: 1,
    listing_type: 'room',
    available_from: '2026-05-18',
    image_urls: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop'],
    amenities: ['近地铁', '可煮', '可短租'],
    status: 'published',
  },
];

const comments = [
  {
    id: '20000000-0000-4000-8000-000000000001',
    listing_id: listings[0].id,
    user_id: profiles[1].id,
    body: '请问可以接受 8 月开学前入住吗？如果需要线上看房，可以提前安排。',
  },
  {
    id: '20000000-0000-4000-8000-000000000002',
    listing_id: listings[1].id,
    user_id: profiles[0].id,
    body: '这个位置适合南洋理工大学新生，建议确认校车和晚间公交时间。',
  },
  {
    id: '20000000-0000-4000-8000-000000000003',
    listing_id: listings[2].id,
    user_id: profiles[2].id,
    body: '整套适合两位同学合租，合同和押金条款可以在看房后确认。',
  },
];

async function upsert(table, rows) {
  const {error} = await supabase.from(table).upsert(rows, {onConflict: 'id'});
  if (error) throw new Error(`${table}: ${error.message}`);
}

const {error: schemaError} = await supabase.from('listings').select('id').limit(1);
if (schemaError) {
  throw new Error(`无法读取 listings 表：${schemaError.message}`);
}

await upsert('profiles', profiles);
await upsert('listings', listings);
await upsert('comments', comments);

console.log(`Seeded ${profiles.length} profiles, ${listings.length} listings, ${comments.length} comments.`);
