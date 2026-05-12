
import { PlaceHolderImages } from './placeholder-images';

export type Housing = {
  id: string;
  title: string;
  price: number;
  location: string;
  distanceToUni: string;
  type: string;
  imageUrl: string;
  description: string;
  facilities: string[];
  contact: string;
};

export type School = {
  id: string;
  name: string;
  description: string;
  rank: string;
  services: string[];
  imageUrl: string;
  website: string;
  courses: string[];
  type: 'University' | 'Polytechnic' | 'Private' | 'Arts';
};

export type Food = {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  location: string;
  rating: number;
  imageUrl: string;
  specialties: string[];
  openingHours: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  imageUrl: string;
  organizer: string;
  schedule: string[];
};

export const HOUSING_MOCK: Housing[] = [
  { 
    id: 'h1', 
    title: 'One North 豪华公寓', 
    price: 1800, 
    location: '肯特岗 (Kent Ridge)', 
    distanceToUni: '步行 5 分钟至 NUS', 
    type: '主人房', 
    imageUrl: PlaceHolderImages.find(p => p.id === 'h-1')?.imageUrl || 'https://picsum.photos/seed/h1/800/600',
    description: '位于纬壹科技城核心地带，专为追求生活品质的留学生设计。公寓配备无边泳池、全功能健身房。',
    facilities: ['高速WiFi', '独立卫浴', '每周保洁', '24小时安保', '健身房'],
    contact: '微信: SG_Housing_Pro'
  },
  { 
    id: 'h2', 
    title: 'NTU 旁温馨工作室', 
    price: 1200, 
    location: '裕廊西 (Jurong West)', 
    distanceToUni: '校车 10 分钟至 NTU', 
    type: '单人套间', 
    imageUrl: PlaceHolderImages.find(p => p.id === 'h-2')?.imageUrl || 'https://picsum.photos/seed/h2/800/600',
    description: '高性价比选择，独立出入，环境安静，非常适合需要专注学习的研究生。',
    facilities: ['独立洗衣机', '简易厨房', '书桌椅', '空调'],
    contact: 'WhatsApp: +65 9123 4567'
  },
  { 
    id: 'h3', 
    title: '高品质联名空间', 
    price: 1500, 
    location: '欧南园 (Outram Park)', 
    distanceToUni: '地铁 15 分钟至 SMU/NAFA/PSB', 
    type: '普通房', 
    imageUrl: PlaceHolderImages.find(p => p.id === 'h-3')?.imageUrl || 'https://picsum.photos/seed/h3/800/600',
    description: '与志同道合的小伙伴共同生活，共享超大客厅和多功能休息室，定期举办社交活动。',
    facilities: ['共享影音室', '开放式厨房', '定期聚餐', '冷热水供应'],
    contact: '微信: Coliving_SG'
  },
  { 
    id: 'h4', 
    title: '宽敞 HDB 行政公寓', 
    price: 900, 
    location: '文礼 (Boon Lay)', 
    distanceToUni: '步行 8 分钟至 NTU', 
    type: '合租房', 
    imageUrl: PlaceHolderImages.find(p => p.id === 'h-4')?.imageUrl || 'https://picsum.photos/seed/h4/800/600',
    description: '体验最接地气的新加坡生活，周边设施完善，靠近美食中心。',
    facilities: ['风扇', '光纤网络', '可煮', '冰箱'],
    contact: '电话: +65 8888 7777'
  },
  { 
    id: 'h5', 
    title: '天际线景观住宅', 
    price: 2500, 
    location: '滨海湾 (Marina Bay)', 
    distanceToUni: '地铁 10 分钟至 PSB/SMU', 
    type: '整套出租', 
    imageUrl: PlaceHolderImages.find(p => p.id === 'h-5')?.imageUrl || 'https://picsum.photos/seed/h5/800/600',
    description: '顶级景观，落地窗直面金沙酒店，适合预算充裕的高端商务学生。',
    facilities: ['中央空调', '智能家居', '桑拿房', '网球场'],
    contact: 'Email: luxury@weijie.sg'
  },
  { 
    id: 'h-mdis', 
    title: '女皇镇学生公寓', 
    price: 1100, 
    location: '女皇镇 (Queenstown)', 
    distanceToUni: '步行 10 分钟至 MDIS', 
    type: '双人间', 
    imageUrl: 'https://picsum.photos/seed/h6/800/600',
    description: '靠近 MDIS 校园，环境清幽，周边有大型食阁和超市，生活极其便利。',
    facilities: ['空调', '书桌', '大衣柜', '洗衣房'],
    contact: '微信: MDIS_Stay'
  },
];

export const SCHOOLS_MOCK: School[] = [
  { 
    id: 's1', 
    name: '新加坡国立大学 (NUS)', 
    description: '新加坡顶尖公立研究型大学，全球排名领先。其工程、商科、医学等专业均处于世界领先地位。', 
    rank: 'QS 世界第 8', 
    services: ['新生入营', '签证支持', '校友网络'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-1')?.imageUrl || 'https://picsum.photos/seed/s1/800/600',
    website: 'https://www.nus.edu.sg',
    courses: ['计算机科学', '工商管理', '土木工程', '法学', '医学'],
    type: 'University'
  },
  { 
    id: 's2', 
    name: '南洋理工大学 (NTU)', 
    description: '世界著名的工程与技术类大学，校园环境优美，被称为“云南园”。在人工智能和材料科学领域世界领先。', 
    rank: 'QS 世界第 15', 
    services: ['职业中心', '心理健康', '宿舍办公室'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-2')?.imageUrl || 'https://picsum.photos/seed/s2/800/600',
    website: 'https://www.ntu.edu.sg',
    courses: ['工程学', '传媒学', '会计学', '环境科学'],
    type: 'University'
  },
  { 
    id: 's3', 
    name: '新加坡管理大学 (SMU)', 
    description: '位于市中心的商科顶尖学府，注重互动式教学，培养了大批商界精英。', 
    rank: 'QS 世界第 445', 
    services: ['全球交换', '孵化实验室', '学术咨询'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-3')?.imageUrl || 'https://picsum.photos/seed/s3/800/600',
    website: 'https://www.smu.edu.sg',
    courses: ['金融学', '经济学', '信息系统', '社会科学'],
    type: 'University'
  },
  { 
    id: 's4', 
    name: '新加坡科技设计大学 (SUTD)', 
    description: '与MIT合作建立，注重多学科设计和工程教育，是新加坡最年轻的公立大学之一。', 
    rank: '世界级新兴大学', 
    services: ['创新创业计划', '跨学科研究', '设计中心'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-4')?.imageUrl || 'https://picsum.photos/seed/s4/800/600',
    website: 'https://www.sutd.edu.sg',
    courses: ['建筑与可持续设计', '工程产品开发', '信息系统技术与设计'],
    type: 'University'
  },
  { 
    id: 's5', 
    name: '新加坡理工大学 (SIT)', 
    description: '注重应用学习的公立大学，与行业紧密结合，为学生提供独特的一体化工作学习计划。', 
    rank: '领先的应用大学', 
    services: ['行业实习', '职业技能提升', '产学研合作'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-5')?.imageUrl || 'https://picsum.photos/seed/s5/800/600',
    website: 'https://www.singaporetech.edu.sg',
    courses: ['护理学', '物理治疗', '食品技术', '网络安全'],
    type: 'University'
  },
  { 
    id: 's6', 
    name: '新加坡新跃社科大学 (SUSS)', 
    description: '专注于社会科学的公立大学，致力于终身学习，为成人学习者和学生提供灵活的课程。', 
    rank: '社会科学先锋', 
    services: ['终身学习支持', '社区服务', '灵活学习方案'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-6')?.imageUrl || 'https://picsum.photos/seed/s6/800/600',
    website: 'https://www.suss.edu.sg',
    courses: ['社会工作', '心理学', '幼儿教育', '人力资源管理'],
    type: 'University'
  },
  { 
    id: 's-nafa', 
    name: '南洋艺术学院 (NAFA)', 
    description: '新加坡首屈一指的艺术学府，培养了无数杰出的艺术家和设计师，与伦敦艺术大学有深厚合作。', 
    rank: '东南亚顶尖艺术学院', 
    services: ['艺术展览', '行业实习', '设计实验室'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-nafa')?.imageUrl || 'https://picsum.photos/seed/nafa/800/600',
    website: 'https://www.nafa.edu.sg',
    courses: ['视觉艺术', '表演艺术', '时尚设计', '音乐'],
    type: 'Arts'
  },
  { 
    id: 's-mdis', 
    name: '新加坡管理发展学院 (MDIS)', 
    description: '新加坡历史最悠久的非营利性终身学习专业机构，拥有完善的校园设施和宿舍。', 
    rank: '资深私立院校', 
    services: ['校园住宿', '职业发展中心', '全球合作办学'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-mdis')?.imageUrl || 'https://picsum.photos/seed/mdis/800/600',
    website: 'https://www.mdis.edu.sg',
    courses: ['工商管理', '传媒学', '生命科学', '时尚设计'],
    type: 'Private'
  },
  { 
    id: 's-psb', 
    name: 'PSB Academy (PSB)', 
    description: '被誉为“未来学院”，是新加坡最大的私立教育机构之一，注重实操技能和行业关联。', 
    rank: '领先私立教育机构', 
    services: ['行业链接', '就业指导', '现代化校区'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-psb')?.imageUrl || 'https://picsum.photos/seed/psb/800/600',
    website: 'https://www.psb-academy.edu.sg',
    courses: ['工商管理', '工程学', '生命科学', '信息技术'],
    type: 'Private'
  },
  { 
    id: 's-sim', 
    name: 'SIM 全球教育', 
    description: '新加坡领先的私立教育学院，与伦敦大学、伯明翰大学等全球顶尖名校合作办学。', 
    rank: '新加坡顶级私校', 
    services: ['全球名校对接', '海外交流', '学生社团'], 
    imageUrl: PlaceHolderImages.find(p => p.id === 's-sim')?.imageUrl || 'https://picsum.photos/seed/ssim/800/600',
    website: 'https://www.simge.edu.sg',
    courses: ['金融与会计', '管理研究', '计算机信息系统'],
    type: 'Private'
  },
  { 
    id: 's-sp', 
    name: '新加坡理工学院 (SP)', 
    description: '新加坡第一所理工学院，拥有悠久的历史和极高的行业认可度。',
    rank: '五所政府理工学院之一',
    services: ['行业实习', '技术中心', '学生福利'],
    imageUrl: PlaceHolderImages.find(p => p.id === 's-poly')?.imageUrl || 'https://picsum.photos/seed/spoly/800/600',
    website: 'https://www.sp.edu.sg',
    courses: ['海事工程', '航空航天技术', '多媒体设计'],
    type: 'Polytechnic'
  },
  {
    id: 's-np',
    name: '义安理工学院 (NP)',
    description: '以实践导向和创新创业氛围著称，校园位于金文泰一带，商科、传媒与信息技术课程深受学生欢迎。',
    rank: '五所政府理工学院之一',
    services: ['学生发展', '海外浸濡', '就业辅导'],
    imageUrl: PlaceHolderImages.find(p => p.id === 's-np')?.imageUrl || 'https://picsum.photos/seed/np-poly/800/600',
    website: 'https://www.np.edu.sg',
    courses: ['商业研究', '大众传播', '数据科学', '生命科学'],
    type: 'Polytechnic'
  },
  {
    id: 's-nyp',
    name: '南洋理工学院 (NYP)',
    description: '位于宏茂桥，强调科技、设计与健康科学等应用型教育，拥有完善的实验室和行业项目资源。',
    rank: '五所政府理工学院之一',
    services: ['应用项目', '职业准备', '学生关怀'],
    imageUrl: PlaceHolderImages.find(p => p.id === 's-nyp')?.imageUrl || 'https://picsum.photos/seed/nyp-poly/800/600',
    website: 'https://www.nyp.edu.sg',
    courses: ['信息技术', '工程学', '护理学', '动画与游戏设计'],
    type: 'Polytechnic'
  },
  {
    id: 's-tp',
    name: '淡马锡理工学院 (TP)',
    description: '坐落在淡滨尼，课程覆盖商科、设计、工程、应用科学与信息技术，重视真实项目和行业链接。',
    rank: '五所政府理工学院之一',
    services: ['行业导师', '校园社团', '实习支持'],
    imageUrl: PlaceHolderImages.find(p => p.id === 's-tp')?.imageUrl || 'https://picsum.photos/seed/tp-poly/800/600',
    website: 'https://www.tp.edu.sg',
    courses: ['航空管理', '设计', '网络安全', '心理学研究'],
    type: 'Polytechnic'
  },
  {
    id: 's-rp',
    name: '共和理工学院 (RP)',
    description: '位于兀兰，以问题导向学习模式闻名，适合希望通过团队讨论与真实案例提升实践能力的学生。',
    rank: '五所政府理工学院之一',
    services: ['问题导向学习', '体育设施', '继续教育'],
    imageUrl: PlaceHolderImages.find(p => p.id === 's-rp')?.imageUrl || 'https://picsum.photos/seed/rp-poly/800/600',
    website: 'https://www.rp.edu.sg',
    courses: ['体育与健康', '酒店管理', '媒体制作', '供应链管理'],
    type: 'Polytechnic'
  },
];

export const FOOD_MOCK: Food[] = [
  { 
    id: 'f1', 
    name: '海底捞火锅', 
    category: '火锅', 
    priceRange: '$$$', 
    location: '克拉码头', 
    rating: 4.9, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'f-1')?.imageUrl || 'https://picsum.photos/seed/f1/800/600',
    specialties: ['拉面表演', '番茄锅底', '自制滑牛肉'],
    openingHours: '10:30 AM - 06:00 AM'
  },
  { 
    id: 'f2', 
    name: 'A-One 瓦煲料理', 
    category: '中餐', 
    priceRange: '$$', 
    location: '裕廊点 (Jurong Point)', 
    rating: 4.5, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'f-2')?.imageUrl || 'https://picsum.photos/seed/f2/800/600',
    specialties: ['招牌瓦煲田鸡粥', '干贝鱼片粥'],
    openingHours: '10:30 AM - 09:30 PM'
  },
  { 
    id: 'f3', 
    name: '翡翠香港小厨', 
    category: '粤式点心', 
    priceRange: '$$', 
    location: '乌节路', 
    rating: 4.3, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'f-3')?.imageUrl || 'https://picsum.photos/seed/f3/800/600',
    specialties: ['蜜汁叉烧', '水晶虾饺'],
    openingHours: '11:00 AM - 10:00 PM'
  },
  { 
    id: 'f4', 
    name: '探鱼 (Tanyao)', 
    category: '烤鱼', 
    priceRange: '$$', 
    location: '西城 (Westgate)', 
    rating: 4.7, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'f-4')?.imageUrl || 'https://picsum.photos/seed/f4/800/600',
    specialties: ['鲜青椒烤鱼', '酱香烤鱼'],
    openingHours: '11:30 AM - 10:00 PM'
  },
  { 
    id: 'f5', 
    name: '麻辣香锅 (NTU 食堂)', 
    category: '中式简餐', 
    priceRange: '$', 
    location: 'NTU 第一食堂', 
    rating: 4.2, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'f-5')?.imageUrl || 'https://picsum.photos/seed/f5/800/600',
    specialties: ['麻辣香锅', '麻辣烫'],
    openingHours: '09:00 AM - 08:30 PM'
  },
];

export const EVENTS_MOCK: Event[] = [
  { 
    id: 'e1', 
    title: '春晚联欢晚会', 
    date: '2024-02-10', 
    time: '18:00', 
    location: '金沙宴会厅', 
    attendees: 500, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'e-1')?.imageUrl || 'https://picsum.photos/seed/e1/800/600',
    organizer: '新加坡中国留学生联合会',
    schedule: ['开幕致辞', '传统舞蹈表演', '抽奖环会', '晚宴']
  },
  { 
    id: 'e2', 
    title: '留学生就业博览会', 
    date: '2024-03-15', 
    time: '10:00', 
    location: '新达城会展中心', 
    attendees: 1200, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'e-2')?.imageUrl || 'https://picsum.photos/seed/e2/800/600',
    organizer: '新加坡人力部 (MOM)',
    schedule: ['企业展位咨询', '职业发展讲座', '简历现场指导']
  },
  { 
    id: 'e3', 
    title: '滨海湾夜间摄影之旅', 
    date: '2024-04-05', 
    time: '19:30', 
    location: '滨海湾金沙', 
    attendees: 50, 
    imageUrl: PlaceHolderImages.find(p => p.id === 'e-3')?.imageUrl || 'https://picsum.photos/seed/e3/800/600',
    organizer: '维界摄影社团',
    schedule: ['集合与路线介绍', '实操拍摄指导', '后期分享交流']
  },
];
