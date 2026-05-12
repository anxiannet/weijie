import { PlaceHolderImages } from './placeholder-images';

export type Housing = {
  id: string;
  title: string;
  price: number;
  location: string;
  distanceToUni: string;
  type: string;
  imageUrl: string;
};

export type School = {
  id: string;
  name: string;
  description: string;
  rank: string;
  services: string[];
  imageUrl: string;
};

export type Food = {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  location: string;
  rating: number;
  imageUrl: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  imageUrl: string;
};

export const HOUSING_MOCK: Housing[] = [
  { id: 'h1', title: 'One North 豪华公寓', price: 1800, location: '肯特岗 (Kent Ridge)', distanceToUni: '步行 5 分钟至 NUS', type: '主人房', imageUrl: PlaceHolderImages.find(p => p.id === 'h-1')?.imageUrl || 'https://picsum.photos/seed/h1/800/600' },
  { id: 'h2', title: 'NTU 旁温馨工作室', price: 1200, location: '裕廊西 (Jurong West)', distanceToUni: '校车 10 分钟至 NTU', type: '单人套间', imageUrl: PlaceHolderImages.find(p => p.id === 'h-2')?.imageUrl || 'https://picsum.photos/seed/h2/800/600' },
  { id: 'h3', title: '高品质联名空间', price: 1500, location: '欧南园 (Outram Park)', distanceToUni: '地铁 15 分钟至 SMU', type: '普通房', imageUrl: PlaceHolderImages.find(p => p.id === 'h-3')?.imageUrl || 'https://picsum.photos/seed/h3/800/600' },
  { id: 'h4', title: '宽敞 HDB 行政公寓', price: 900, location: '文礼 (Boon Lay)', distanceToUni: '步行 8 分钟至 NTU', type: '合租房', imageUrl: PlaceHolderImages.find(p => p.id === 'h-4')?.imageUrl || 'https://picsum.photos/seed/h4/800/600' },
  { id: 'h5', title: '天际线景观住宅', price: 2500, location: '滨海湾 (Marina Bay)', distanceToUni: '地铁 20 分钟至 NUS', type: '整套出租', imageUrl: PlaceHolderImages.find(p => p.id === 'h-5')?.imageUrl || 'https://picsum.photos/seed/h5/800/600' },
];

export const SCHOOLS_MOCK: School[] = [
  { id: 's1', name: '新加坡国立大学 (NUS)', description: '新加坡顶尖公立研究型大学，全球排名领先。', rank: 'QS 世界第 8', services: ['新生入营', '签证支持', '校友网络'], imageUrl: PlaceHolderImages.find(p => p.id === 's-1')?.imageUrl || 'https://picsum.photos/seed/s1/800/600' },
  { id: 's2', name: '南洋理工大学 (NTU)', description: '世界著名的工程与技术类大学，校园环境优美。', rank: 'QS 世界第 15', services: ['职业中心', '心理健康', '宿舍办公室'], imageUrl: PlaceHolderImages.find(p => p.id === 's-2')?.imageUrl || 'https://picsum.photos/seed/s2/800/600' },
  { id: 's3', name: '新加坡管理大学 (SMU)', description: '位于市中心的商科顶尖学府，注重互动式教学。', rank: 'QS 世界第 445', services: ['全球交换', '孵化实验室', '学术咨询'], imageUrl: PlaceHolderImages.find(p => p.id === 's-3')?.imageUrl || 'https://picsum.photos/seed/s3/800/600' },
];

export const FOOD_MOCK: Food[] = [
  { id: 'f1', name: '海底捞火锅', category: '火锅', priceRange: '$$$', location: '克拉码头', rating: 4.9, imageUrl: PlaceHolderImages.find(p => p.id === 'f-1')?.imageUrl || 'https://picsum.photos/seed/f1/800/600' },
  { id: 'f2', name: 'A-One 瓦煲料理', category: '中餐', priceRange: '$$', location: '裕廊点 (Jurong Point)', rating: 4.5, imageUrl: PlaceHolderImages.find(p => p.id === 'f-2')?.imageUrl || 'https://picsum.photos/seed/f2/800/600' },
  { id: 'f3', name: '翡翠香港小厨', category: '粤式点心', priceRange: '$$', location: '乌节路', rating: 4.3, imageUrl: PlaceHolderImages.find(p => p.id === 'f-3')?.imageUrl || 'https://picsum.photos/seed/f3/800/600' },
  { id: 'f4', name: '探鱼 (Tanyao)', category: '烤鱼', priceRange: '$$', location: '西城 (Westgate)', rating: 4.7, imageUrl: PlaceHolderImages.find(p => p.id === 'f-4')?.imageUrl || 'https://picsum.photos/seed/f4/800/600' },
  { id: 'f5', name: '麻辣香锅 (NTU 食堂)', category: '麻辣烫/香锅', priceRange: '$', location: 'NTU 第一食堂', rating: 4.2, imageUrl: PlaceHolderImages.find(p => p.id === 'f-5')?.imageUrl || 'https://picsum.photos/seed/f5/800/600' },
];

export const EVENTS_MOCK: Event[] = [
  { id: 'e1', title: '春晚联欢晚会', date: '2024-02-10', time: '18:00', location: '金沙宴会厅', attendees: 500, imageUrl: PlaceHolderImages.find(p => p.id === 'e-1')?.imageUrl || 'https://picsum.photos/seed/e1/800/600' },
  { id: 'e2', title: '留学生就业博览会', date: '2024-03-15', time: '10:00', location: '新达城会展中心', attendees: 1200, imageUrl: PlaceHolderImages.find(p => p.id === 'e-2')?.imageUrl || 'https://picsum.photos/seed/e2/800/600' },
  { id: 'e3', title: '滨海湾夜间摄影之旅', date: '2024-04-05', time: '19:30', location: '滨海湾金沙', attendees: 50, imageUrl: PlaceHolderImages.find(p => p.id === 'e-3')?.imageUrl || 'https://picsum.photos/seed/e3/800/600' },
];
