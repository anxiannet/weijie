export type ViralTemplateSeed = {
  id: string;
  category: 'gaming' | 'group' | 'meme';
  title: string;
  subtitle: string;
  hook: string;
  cta: string;
  defaultLines: string[];
  tags: string[];
};

export const VIRAL_TEMPLATE_SEEDS: ViralTemplateSeed[] = [
  {
    id: 'yx-recruit-001',
    category: 'gaming',
    title: '夕妖战队招募',
    subtitle: '会整活的来 · 不压力队友',
    hook: '现在缺的不是技术，是能一起玩的人。',
    cta: '生成你的战队招募图',
    defaultLines: ['有麦', '心态好', '能开团', '典韦也收'],
    tags: ['王者荣耀', '战队', '微信群'],
  },
  {
    id: 'yx-meme-001',
    category: 'meme',
    title: '对抗路典韦申请出战',
    subtitle: '你们懂什么',
    hook: '人家玩的是信仰。',
    cta: '生成群聊梗图',
    defaultLines: ['来个辅助', '别压力我', '我后期无敌'],
    tags: ['梗图', '典韦', '群聊'],
  },
  {
    id: 'yx-group-001',
    category: 'group',
    title: '群公告生成器',
    subtitle: '请修改群名片为游戏ID',
    hook: '比纯文字更容易被看到。',
    cta: '生成群公告图',
    defaultLines: ['周五晚8点战队赛', '认真比赛', '服从指挥'],
    tags: ['公告', '微信群', '战队赛'],
  },
  {
    id: 'yx-meme-002',
    category: 'meme',
    title: '牌没有问题',
    subtitle: '问题在队友',
    hook: '每个群都需要一个背锅位。',
    cta: '生成表情图',
    defaultLines: ['我没问题', '你们先上', '这把能翻'],
    tags: ['表情包', '开黑', '搞笑'],
  },
];
