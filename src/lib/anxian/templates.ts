export type AnxianTemplate = {
  slug: string;
  name: string;
  category: 'game' | 'rental' | 'meme' | 'social' | 'utility';
  description: string;
  priceCents: number;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    required?: boolean;
    options?: string[];
    placeholder?: string;
  }>;
  examples: string[];
};

export const ANXIAN_TEMPLATES: AnxianTemplate[] = [
  {
    slug: 'wangzhe-team-poster',
    name: '王者荣耀战队招募图',
    category: 'game',
    description: '生成适合微信群传播的战队招募海报，免费预览带水印，付费生成高清无水印版本。',
    priceCents: 199,
    fields: [
      {name: 'team_name', label: '战队名', type: 'text', required: true, placeholder: '夕妖战队'},
      {name: 'requirements', label: '招募要求', type: 'textarea', required: true, placeholder: '有麦、能听指挥、心态好、有梗会整活'},
      {name: 'contact', label: '联系方式', type: 'text', required: true, placeholder: '群号 / 微信 / 游戏ID'},
    ],
    examples: ['战队赛招募', '五排固定队', '内战活动宣传'],
  },
  {
    slug: 'wechat-meme-card',
    name: '微信群表情包卡片',
    category: 'meme',
    description: '上传图片，加一句话，生成群聊可直接发送的梗图卡片。',
    priceCents: 99,
    fields: [
      {name: 'caption', label: '梗图文案', type: 'text', required: true, placeholder: '来个打野，不要典韦'},
      {name: 'tone', label: '语气', type: 'select', required: true, options: ['阴阳怪气', '破防', '队友离谱', '老板大气']},
    ],
    examples: ['战队群梗图', '阴阳怪气表情', '低质量高清图'],
  },
  {
    slug: 'sg-room-xhs-cover',
    name: '新加坡租房小红书封面',
    category: 'rental',
    description: '把普通房源图整理成更适合小红书和微信群传播的封面。',
    priceCents: 199,
    fields: [
      {name: 'location', label: '地点 / MRT', type: 'text', required: true, placeholder: 'NTU附近 / Boon Lay / Khatib'},
      {name: 'price', label: '价格', type: 'text', required: true, placeholder: '$1200/月'},
      {name: 'room_type', label: '房型', type: 'text', required: true, placeholder: '普通房 / 主人房 / 床位'},
      {name: 'contact', label: '联系方式', type: 'text', placeholder: 'WhatsApp / 微信'},
    ],
    examples: ['小红书封面', '微信群房源图', '转租宣传图'],
  },
];

export function getAnxianTemplate(slug: string) {
  return ANXIAN_TEMPLATES.find((template) => template.slug === slug);
}

export function formatSgd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
