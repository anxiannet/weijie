
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  GraduationCap, 
  Utensils, 
  Calendar, 
  LayoutDashboard, 
  Sparkles, 
  Search,
  ChevronRight,
  Pin,
  MapPin,
  Clock,
  Star,
  Users,
  ArrowLeft,
  ExternalLink,
  Phone,
  Info,
  Globe,
  Building,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { NotionCard } from '@/components/NotionCard';
import { SettleAdvisor } from '@/components/SettleAdvisor';
import { HOUSING_MOCK, SCHOOLS_MOCK, FOOD_MOCK, EVENTS_MOCK, Housing } from '@/app/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type Module = 'dashboard' | 'housing' | 'schools' | 'food' | 'events' | 'advisor' | 'guides' | 'guideDetail' | 'detail';

type Guide = {
  id: string;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  audience: string;
  bullets: string[];
  keywords: string;
  sections: {
    title: string;
    body: string;
    points: string[];
  }[];
  checklist: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

const MODULE_NAMES: Record<Module, string> = {
  dashboard: '主控制台',
  housing: '房源中心',
  schools: '院校指南',
  food: '美食地图',
  events: '活动日程',
  advisor: '智能助手',
  guides: '留学指南',
  guideDetail: '指南详情',
  detail: '详情查看'
};

const QUICK_SCHOOLS = ['NUS', 'NTU', 'SMU', 'SUTD', 'SIT', 'SUSS', 'NAFA', 'MDIS', 'PSB'];

const BRAND_KEYWORDS = [
  '新加坡留学',
  '新加坡租房',
  '新加坡留学生',
  '新加坡国立大学租房',
  '南洋理工大学租房',
  '新加坡管理大学租房',
  '新加坡生活',
  '新加坡学生公寓',
  '新加坡美食',
];

const BRAND_FEATURES = [
  {
    title: '租房',
    description: '查看真实房源、学生公寓与合租信息，快速找到适合自己的住所。',
    icon: HomeIcon,
    module: 'housing' as Module,
  },
  {
    title: '学校',
    description: '了解新加坡高校、课程强度、生活体验与学生评价。',
    icon: GraduationCap,
    module: 'schools' as Module,
  },
  {
    title: '美食',
    description: '发现适合中国留学生口味的新加坡餐厅、食阁与平价美食。',
    icon: Utensils,
    module: 'food' as Module,
  },
  {
    title: '活动',
    description: '获取校园活动、聚会、兼职与本地社交信息。',
    icon: Calendar,
    module: 'events' as Module,
  },
];

const SETTLE_GUIDES = [
  {
    id: 'renting',
    category: '租房指南',
    title: '新加坡留学生租房怎么选：预算、通勤与合同避坑',
    summary: '从 NUS、NTU、SMU、SUTD 周边通勤圈出发，快速判断公寓、学生宿舍与合租房是否适合自己。',
    readTime: '8 分钟阅读',
    audience: '适合正在比较宿舍、公寓和合租房的学生与家长',
    bullets: ['按学校筛选 20-45 分钟通勤圈', '看清押金、维修、提前退租条款', '确认水电网、空调清洗与访客规则'],
    keywords: '新加坡留学租房, NUS租房, NTU租房, 新加坡学生公寓',
    sections: [
      {
        title: '先用通勤圈缩小范围',
        body: '新加坡面积不大，但不同学校周边的房源价格和通勤体验差异明显。建议先把目标学校、常去校区和晚课频率列出来，再用 MRT、公交和步行时间筛选。',
        points: ['NUS 常见选择包括 Clementi、Kent Ridge、Dover 一带', 'NTU 更需要关注校车、公交换乘和晚间回家路线', 'SMU、LASALLE、NAFA 周边更适合看市中心合租或地铁直达区域']
      },
      {
        title: '预算不要只看租金',
        body: '很多新生会低估水电网、空调清洗、押金和搬家成本。看房时要把固定费用、可变费用和一次性费用拆开，避免入住后预算失控。',
        points: ['确认租金是否包含水电、网络和维修', '问清押金金额、退租周期和扣款标准', '把空调清洗、家具损坏和访客规则写入合同或聊天记录']
      },
      {
        title: '签约前做三次确认',
        body: '看房时的承诺如果没有记录，很容易在入住后变成争议。签约前建议确认房东身份、房屋状态和合同条款，并保留付款凭证。',
        points: ['拍摄房间、厨卫、家具和现有瑕疵', '核对租期、提前解约和转租限制', '避免在没有合同或收据的情况下支付大额订金']
      }
    ],
    checklist: ['确定学校和常用校区', '列出月租预算上限', '比较 3 个通勤区域', '看房时拍照留档', '签约前核对押金和退租条款'],
    faqs: [
      { question: '新加坡留学生租房一般提前多久开始看？', answer: '建议入学前 6-8 周开始比较区域和预算，入境前 2-4 周锁定具体房源。热门开学季会更紧张。' },
      { question: '学生宿舍和校外公寓怎么选？', answer: '宿舍适合想快速融入校园的新生，校外公寓更适合重视隐私、设施和通勤灵活度的学生。核心是预算、通勤和生活习惯。' }
    ]
  },
  {
    id: 'school-application',
    category: '申请准备',
    title: '新加坡大学申请时间线：材料、专业与录取后事项',
    summary: '整理公立大学、私立院校与理工学院常见申请节点，帮助学生把选校、材料和落地安排串起来。',
    readTime: '7 分钟阅读',
    audience: '适合准备申请新加坡本科、硕士或私立院校课程的学生',
    bullets: ['提前准备成绩单、语言成绩与推荐材料', '对比专业方向、学费与就业资源', '录取后同步规划住宿与签证'],
    keywords: '新加坡大学申请, 新加坡留学申请, 新加坡院校指南',
    sections: [
      {
        title: '把选校拆成三个维度',
        body: '不要只看综合排名。新加坡不同院校在专业资源、就业网络、学费和课程节奏上差异很大，适合度比名气更重要。',
        points: ['先确定专业方向和未来就业地区', '比较课程长度、实习机会和毕业要求', '把学费、住宿和生活费放在同一张预算表里']
      },
      {
        title: '材料准备要前置',
        body: '成绩单、语言成绩、推荐信和作品集往往需要跨部门配合。越早准备，越能给文书修改和补件留出余地。',
        points: ['成绩单和在读证明建议准备中英文版本', '语言成绩有效期和送分时间要提前确认', '设计、建筑、艺术类专业要预留作品集打磨时间']
      },
      {
        title: '拿到 offer 后同步处理落地事项',
        body: '录取只是开始。签证、住宿、机票、电话卡和银行卡会互相影响，建议按照抵达时间倒排。',
        points: ['确认学生准证或相关准证流程', '尽早排查学校宿舍和校外房源', '准备入境文件、保险和紧急联系人']
      }
    ],
    checklist: ['确定目标专业和院校梯队', '准备中英文成绩单', '确认语言成绩有效期', '整理申请截止日期', '录取后同步规划住宿'],
    faqs: [
      { question: '申请新加坡大学一定要雅思或托福吗？', answer: '多数英文授课项目需要语言成绩，但不同学校和课程要求不同，部分项目可能接受其他英语能力证明。' },
      { question: '私立院校值得考虑吗？', answer: '可以考虑，但要重点核对合作大学、课程认证、毕业路径、学费和就业支持，避免只看招生宣传。' }
    ]
  },
  {
    id: 'arrival',
    category: '落地清单',
    title: '抵达新加坡第一周：电话卡、银行卡、交通卡与生活采购',
    summary: '面向刚到新加坡的学生，把必须办理的事项拆成可执行清单，减少落地后的信息差。',
    readTime: '6 分钟阅读',
    audience: '适合即将抵达或刚到新加坡的新生',
    bullets: ['办理本地 SIM 卡并绑定常用 App', '比较银行卡开户材料与校园网点', '熟悉 MRT、公交和学生优惠'],
    keywords: '新加坡留学生生活, 新加坡电话卡, 新加坡银行卡开户',
    sections: [
      {
        title: '第一天先解决通信和交通',
        body: '本地手机号会影响打车、外卖、银行开户和学校系统验证。交通卡则决定你能不能顺畅完成看房、报道和采购。',
        points: ['抵达后先办理 SIM 卡或 eSIM', '下载常用地图、打车和学校 App', '准备 EZ-Link、SimplyGo 或银行卡交通支付']
      },
      {
        title: '银行卡开户要带齐材料',
        body: '不同银行和网点对学生开户材料要求会有差异。建议提前准备护照、学生准证相关文件、录取通知书和住址证明。',
        points: ['优先查看学校合作银行或校园附近网点', '确认是否需要预约', '开户后尽快绑定常用支付方式']
      },
      {
        title: '生活采购先买必需品',
        body: '刚到新加坡不需要一次性买全。先解决床品、插头转换器、清洁用品和基础药品，再根据宿舍或房间情况补充。',
        points: ['先确认房间已有家具和电器', '采购床品、洗护和简单餐具', '保存附近超市、诊所和药房位置']
      }
    ],
    checklist: ['办理本地手机号', '开通交通支付', '预约或准备银行开户', '完成学校报道', '采购床品和日用品'],
    faqs: [
      { question: '刚到新加坡没有银行卡怎么办？', answer: '可以先用现金、国际信用卡或移动支付过渡，但长期生活建议尽快开本地账户，方便转账、收款和订阅服务。' },
      { question: '电话卡在机场买还是到市区买？', answer: '机场方便但选择可能有限，市区和线上方案更多。短期可先用旅游卡，稳定后再换长期套餐。' }
    ]
  },
  {
    id: 'daily-life',
    category: '生活攻略',
    title: '中国留学生在新加坡吃住行：预算、社群与安全建议',
    summary: '覆盖餐饮选择、生活成本、校外活动与紧急联系，让学生和家长更快建立确定感。',
    readTime: '7 分钟阅读',
    audience: '适合想提前了解新加坡日常成本和社群资源的学生',
    bullets: ['估算月度餐饮、交通与日用品预算', '找到校园社群、活动和同乡资源', '保存紧急电话、诊所与保险信息'],
    keywords: '新加坡留学生活费, 新加坡中国留学生, 新加坡留学生攻略',
    sections: [
      {
        title: '生活费从三类支出估算',
        body: '新加坡生活费主要由住宿、餐饮和交通组成。住宿通常是最大支出，餐饮和日用品则取决于你是否常做饭、是否住在市中心。',
        points: ['把房租和水电网作为固定成本', '食阁、学校餐厅和外卖价格差异明显', '交通预算要结合通勤距离和活动频率']
      },
      {
        title: '社群能显著降低信息差',
        body: '找到可靠社群后，租房转租、二手家具、课程经验和活动信息都会更容易获取。建议优先加入学校官方和学院相关渠道。',
        points: ['关注学生会、学院群和新生群', '参加迎新、行业分享和兴趣活动', '遇到转账或租房信息时保持核验意识']
      },
      {
        title: '安全感来自提前准备',
        body: '新加坡整体安全，但新生仍然需要保存紧急电话、保险信息、附近诊所和学校支持部门联系方式。',
        points: ['保存紧急电话和学校安保联系方式', '了解保险报销和诊所就诊流程', '夜间出行优先选择熟悉路线']
      }
    ],
    checklist: ['估算月度生活费', '加入学校官方社群', '保存紧急联系方式', '了解附近诊所药房', '规划每周采购和通勤路线'],
    faqs: [
      { question: '新加坡留学生一个月生活费大概怎么估？', answer: '要把住宿单独估算，再加餐饮、交通、通讯和日用品。住校、合租和市中心公寓的差距会很大。' },
      { question: '在哪里找靠谱活动和朋友？', answer: '优先看学校官方活动、学院社群、学生会和认证社团，再结合兴趣类活动平台筛选。' }
    ]
  }
] satisfies Guide[];

export default function AppHome() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [schoolFilter, setSchoolFilter] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('weijie_bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      localStorage.setItem('weijie_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const handleItemClick = (item: any, module: string) => {
    setSelectedItem({ ...item, module });
    setActiveModule('detail');
  };

  const handleGuideClick = (guide: Guide) => {
    setSelectedGuide(guide);
    setSelectedItem(null);
    setActiveModule('guideDetail');
  };

  const goBack = () => {
    if (activeModule === 'guideDetail') {
      setActiveModule('guides');
      setSelectedGuide(null);
      return;
    }

    if (selectedItem?.module) {
      setActiveModule(selectedItem.module as Module);
    } else {
      setActiveModule('dashboard');
    }
    setSelectedItem(null);
  };

  const resetFilters = (module: Module) => {
    setActiveModule(module);
    setSelectedItem(null);
    setSelectedGuide(null);
    setSearchQuery('');
    setSchoolFilter(null);
  };

  const allItems = [
    ...HOUSING_MOCK.map(h => ({ ...h, module: 'housing' })),
    ...SCHOOLS_MOCK.map(s => ({ ...s, module: 'schools' })),
    ...FOOD_MOCK.map(f => ({ ...f, module: 'food' })),
    ...EVENTS_MOCK.map(e => ({ ...e, module: 'events' })),
  ];

  const bookmarkedItems = allItems.filter(item => bookmarks.includes(item.id));

  const filteredHousing = HOUSING_MOCK.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         h.distanceToUni.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !schoolFilter || h.distanceToUni.includes(schoolFilter);
    return matchesSearch && matchesFilter;
  });
  
  const filteredSchools = SCHOOLS_MOCK.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFood = FOOD_MOCK.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredEvents = EVENTS_MOCK.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const getNearbyHousing = (schoolName: string) => {
    const schoolAbbr = schoolName.match(/\((.*?)\)/)?.[1] || schoolName;
    return HOUSING_MOCK.filter(h => h.distanceToUni.includes(schoolAbbr));
  };

  const renderDashboard = () => (
    <div className="flex flex-col gap-10 animate-fade-in-up">
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="p-8 md:p-10">
            <div className="relative h-28 w-full max-w-md">
              <Image
                src="/weijie-logo-wordmark.png"
                alt="维界标志"
                fill
                priority
                className="object-contain object-left"
                sizes="(max-width: 768px) 90vw, 420px"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-md bg-primary text-primary-foreground">维界</Badge>
              <span className="text-sm font-medium text-muted-foreground">新加坡留学生活，一站到位。</span>
            </div>
            <h1 className="mt-6 font-headline text-4xl font-bold leading-tight text-foreground md:text-5xl">
              新加坡留学生生活平台
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              租房、学校、美食、活动与本地生活信息，帮助中国留学生快速适应新加坡。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => resetFilters('housing')}>
                开始找房 <HomeIcon className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => resetFilters('guides')}>
                阅读留学指南 <BookOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="border-t bg-muted/50 p-8 md:p-10 lg:border-l lg:border-t-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">品牌定位</p>
            <p className="mt-4 text-lg leading-8 text-foreground">
              维界，是面向新加坡中国留学生的一站式生活平台。
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              提供租房、学校、美食、活动、社交与本地生活信息，帮助留学生更快融入新加坡。
            </p>
            <div className="mt-6 rounded-2xl border bg-background p-5">
              <p className="text-sm font-semibold text-foreground">新加坡留学生活，一站到位。</p>
              <p className="mt-2 text-sm text-muted-foreground">连接留学生活的每一步，从落地新加坡开始。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <Badge variant="outline" className="rounded-md">关于维界</Badge>
          <h2 className="mt-4 font-headline text-2xl font-bold tracking-tight text-foreground">清晰、可信、本地化的留学生活系统</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            维界诞生于留学生真实的生活需求。我们相信，留学不只是学习，更是一种全新的生活方式。维界希望通过结构化的信息与真实的社区内容，让每一位来到新加坡的中国学生，都能更快找到归属感。
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            我们希望用清晰、可信、持续更新的本地信息，帮助学生更顺利地开始在新加坡的日常生活。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BRAND_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.title}
                onClick={() => resetFilters(feature.module)}
                className="group rounded-2xl border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-headline text-xl font-bold text-foreground group-hover:text-primary">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground">我的工作区</h2>
          <Badge variant="secondary" className="rounded-lg">{bookmarkedItems.length} 个已收藏</Badge>
        </div>
        {bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarkedItems.map((item: any) => (
              <NotionCard
                key={item.id}
                title={item.title || item.name}
                imageUrl={item.imageUrl}
                description={item.location || item.description}
                isBookmarked={true}
                onBookmark={(e) => toggleBookmark(item.id, e)}
                badge={MODULE_NAMES[item.module as Module]}
                onClick={() => handleItemClick(item, item.module)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
              <Pin className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground">尚未固定任何卡片。浏览各板块并将喜欢的房源或活动“钉”在这里。</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-6 font-headline text-2xl font-bold tracking-tight text-foreground">探索中心</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div 
            onClick={() => resetFilters('advisor')}
            className="group relative flex h-48 cursor-pointer items-center overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground transition-all hover:scale-[1.02]"
          >
            <div className="relative z-10 flex flex-col gap-2">
              <span className="flex items-center gap-2 font-headline text-2xl font-bold">
                <Sparkles className="h-6 w-6" /> 智能落户助手
              </span>
              <p className="max-w-xs text-primary-foreground/80">围绕学校、预算、抵达时间与生活偏好，整理清晰可执行的新加坡落地建议。</p>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-20 transition-transform group-hover:scale-110">
              <Sparkles className="h-48 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => resetFilters('housing')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <HomeIcon className="h-6 w-6" />
              <span className="font-bold">租房</span>
              <span className="text-left text-xs leading-5 text-muted-foreground">学生公寓与合租信息</span>
            </button>
            <button onClick={() => resetFilters('schools')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">学校</span>
              <span className="text-left text-xs leading-5 text-muted-foreground">高校、课程与学生体验</span>
            </button>
            <button onClick={() => resetFilters('food')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <Utensils className="h-6 w-6" />
              <span className="font-bold">美食</span>
              <span className="text-left text-xs leading-5 text-muted-foreground">餐厅、食阁与平价选择</span>
            </button>
            <button onClick={() => resetFilters('events')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <Calendar className="h-6 w-6" />
              <span className="font-bold">活动</span>
              <span className="text-left text-xs leading-5 text-muted-foreground">校园、本地与社交信息</span>
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground">从落地新加坡开始</h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
              初到新加坡，信息往往是分散的。维界希望把留学生真正需要的内容整理成一个清晰、可信、可持续使用的平台。从租房，到学校，再到生活与社交，帮助你更轻松地开始在新加坡的每一天。
            </p>
          </div>
          <Button variant="outline" onClick={() => resetFilters('guides')} className="w-fit">
            查看生活指南 <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground">常用检索主题</h2>
          <p className="mt-2 text-muted-foreground">围绕新加坡留学生活的长期内容索引，方便学生持续查找。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {BRAND_KEYWORDS.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="rounded-md px-3 py-1">
              {keyword}
            </Badge>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground">新加坡留学生活指南</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              面向准备来新加坡读书的学生和家长，整理租房、申请、落地与日常生活的高频问题。
            </p>
          </div>
          <Button variant="outline" onClick={() => resetFilters('guides')} className="w-fit">
            查看全部指南 <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SETTLE_GUIDES.slice(0, 2).map((guide) => (
            <button
              key={guide.id}
              onClick={() => handleGuideClick(guide)}
              className="group rounded-2xl border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <Badge variant="secondary" className="mb-4 rounded-md">{guide.category}</Badge>
              <h3 className="font-headline text-xl font-bold text-foreground group-hover:text-primary">{guide.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{guide.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{guide.readTime}</span>
                <span>{guide.audience}</span>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
                阅读指南 <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const renderGuides = () => (
    <div className="animate-fade-in-up space-y-8 pb-12">
      <div className="rounded-3xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-4 rounded-md bg-accent text-accent-foreground">新加坡留学指南</Badge>
            <h1 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
              新加坡留学指南：租房、院校申请与落地生活清单
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              维界为中国留学生和家长整理新加坡留学前后的关键决策：如何找靠近校园的房源、如何比较院校和专业、抵达后如何办理电话卡、银行卡、交通卡，以及如何找到可靠社群活动。
            </p>
          </div>
          <Button onClick={() => resetFilters('advisor')} size="lg" className="w-fit">
            咨询落户助手 <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {SETTLE_GUIDES.map((guide) => (
          <article key={guide.id} className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-4">
              <Badge variant="outline" className="rounded-md">{guide.category}</Badge>
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-headline text-2xl font-bold leading-tight text-foreground">{guide.title}</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{guide.summary}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>{guide.readTime}</span>
              <span>{guide.audience}</span>
            </div>
            <div className="mt-6 space-y-3">
              {guide.bullets.map((bullet) => (
                <div key={bullet} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm leading-6 text-foreground">{bullet}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-muted/70 p-4 text-sm leading-6 text-muted-foreground">
              相关搜索：{guide.keywords}
            </div>
            <Button onClick={() => handleGuideClick(guide)} className="mt-6 w-full">
              阅读完整指南 <ChevronRight className="h-4 w-4" />
            </Button>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border bg-primary p-8 text-primary-foreground">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="font-headline text-2xl font-bold">需要把指南变成个人方案？</h2>
            <p className="mt-3 leading-7 text-primary-foreground/80">
              输入学校、预算、到达时间和偏好，维界可以帮你把房源、院校信息、美食和活动整理成一份可执行的来新加坡清单。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Button variant="secondary" onClick={() => resetFilters('housing')}>查找校园房源</Button>
            <Button variant="outline" onClick={() => resetFilters('schools')} className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              对比院校信息
            </Button>
          </div>
        </div>
      </section>
    </div>
  );

  const renderGuideDetail = () => {
    if (!selectedGuide) return null;

    return (
      <article className="animate-fade-in-up pb-12">
        <Button variant="ghost" onClick={goBack} className="-ml-2 mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> 返回指南列表
        </Button>

        <header className="rounded-3xl border bg-card p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-md bg-accent text-accent-foreground">{selectedGuide.category}</Badge>
            <span className="text-sm text-muted-foreground">{selectedGuide.readTime}</span>
          </div>
          <h1 className="mt-5 max-w-4xl font-headline text-3xl font-bold leading-tight text-foreground md:text-5xl">
            {selectedGuide.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{selectedGuide.summary}</p>
          <div className="mt-6 rounded-2xl bg-muted/70 p-5">
            <p className="text-sm font-semibold text-foreground">适合人群</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedGuide.audience}</p>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            {selectedGuide.sections.map((section, index) => (
              <section key={section.title} className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-headline font-bold text-primary">
                  {index + 1}
                </div>
                <h2 className="font-headline text-2xl font-bold text-foreground">{section.title}</h2>
                <p className="mt-4 leading-8 text-muted-foreground">{section.body}</p>
                <div className="mt-6 grid grid-cols-1 gap-3">
                  {section.points.map((point) => (
                    <div key={point} className="flex gap-3 rounded-xl bg-muted/60 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span className="text-sm leading-6 text-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="font-headline text-2xl font-bold text-foreground">常见问题</h2>
              <div className="mt-6 space-y-4">
                {selectedGuide.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-xl border p-5">
                    <h3 className="font-semibold text-foreground">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="font-headline text-xl font-bold text-foreground">行动清单</h2>
              <div className="mt-5 space-y-3">
                {selectedGuide.checklist.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm leading-6 text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-primary p-6 text-primary-foreground shadow-sm">
              <h2 className="font-headline text-xl font-bold">需要个性化建议？</h2>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
                把学校、预算和抵达时间告诉维界，快速生成适合你的新加坡留学落地方案。
              </p>
              <Button variant="secondary" onClick={() => resetFilters('advisor')} className="mt-5 w-full">
                咨询落户助手
              </Button>
            </div>

            <div className="rounded-2xl border bg-card p-5 text-sm leading-6 text-muted-foreground">
              相关搜索：{selectedGuide.keywords}
            </div>
          </aside>
        </div>
      </article>
    );
  };

  const renderDetail = () => {
    if (!selectedItem) return null;
    const item = selectedItem;
    const module = item.module;

    const nearbyHousing = module === 'schools' ? getNearbyHousing(item.name) : [];

    return (
      <div className="animate-fade-in-up space-y-8 pb-12">
        <Button variant="ghost" onClick={goBack} className="flex items-center gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> 返回上一级
        </Button>

        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border shadow-xl">
          <Image 
            src={item.imageUrl} 
            alt={item.title || item.name} 
            fill 
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <Badge className="mb-4 bg-accent/90">{MODULE_NAMES[module as Module]}</Badge>
            <h1 className="font-headline text-4xl font-bold">{item.title || item.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 font-headline text-2xl font-bold text-foreground">
                <Info className="h-5 w-5 text-primary" /> 项目介绍
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {item.description || "暂无详细描述。"}
              </p>
            </section>

            {module === 'housing' && (
              <section className="space-y-4">
                <h2 className="font-headline text-2xl font-bold text-foreground">配套设施</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {item.facilities?.map((f: string) => (
                    <div key={f} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <span className="text-sm font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {module === 'schools' && (
              <>
                <section className="space-y-4">
                  <h2 className="font-headline text-2xl font-bold text-foreground">优势专业</h2>
                  <div className="flex flex-wrap gap-3">
                    {item.courses?.map((c: string) => (
                      <Badge key={c} variant="secondary" className="px-4 py-2 text-sm">{c}</Badge>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-headline text-2xl font-bold text-foreground">
                      <Building className="h-5 w-5 text-primary" /> 周边房源推荐
                    </h2>
                    <Button variant="link" onClick={() => {
                      const schoolAbbr = item.name.match(/\((.*?)\)/)?.[1] || item.name;
                      setSchoolFilter(schoolAbbr);
                      setActiveModule('housing');
                      setSelectedItem(null);
                    }}>
                      查看更多房源
                    </Button>
                  </div>
                  {nearbyHousing.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {nearbyHousing.map((h: Housing) => (
                        <NotionCard
                          key={h.id}
                          title={h.title}
                          imageUrl={h.imageUrl}
                          description={`${h.type} | ${h.distanceToUni}`}
                          isBookmarked={bookmarks.includes(h.id)}
                          onBookmark={(e) => toggleBookmark(h.id, e)}
                          onClick={() => handleItemClick(h, 'housing')}
                          className="h-full"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                      该院校周边暂无推荐房源，请稍后再试。
                    </div>
                  )}
                </section>
              </>
            )}

            {module === 'food' && (
              <section className="space-y-4">
                <h2 className="font-headline text-2xl font-bold text-foreground">特色推荐</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {item.specialties?.map((s: string) => (
                    <div key={s} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                      <Utensils className="h-4 w-4 text-orange-500" />
                      <span className="font-bold">{s}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {module === 'events' && (
              <section className="space-y-4">
                <h2 className="font-headline text-2xl font-bold text-foreground">活动流程</h2>
                <div className="space-y-4">
                  {item.schedule?.map((s: string, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">{idx + 1}</div>
                        {idx !== item.schedule.length - 1 && <div className="w-[2px] flex-1 bg-border" />}
                      </div>
                      <div className="pb-6">
                        <p className="font-medium">{s}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
              <h3 className="font-headline text-xl font-bold text-foreground">关键信息</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> 地点</span>
                  <span className="text-sm font-bold">{item.location}</span>
                </div>
                
                {module === 'housing' && (
                  <>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> 距离</span>
                      <span className="text-sm font-bold">{item.distanceToUni}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" /> 联系</span>
                      <span className="text-sm font-bold text-primary underline">{item.contact}</span>
                    </div>
                  </>
                )}

                {module === 'schools' && (
                  <>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Star className="h-4 w-4" /> 排名</span>
                      <span className="text-sm font-bold">{item.rank}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Globe className="h-4 w-4" /> 官网</span>
                      <a href={item.website} target="_blank" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                        访问网站 <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </>
                )}

                {module === 'food' && (
                  <>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Star className="h-4 w-4" /> 评分</span>
                      <span className="text-sm font-bold flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {item.rating}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> 营业时间</span>
                      <span className="text-sm font-bold">{item.openingHours}</span>
                    </div>
                  </>
                )}

                {module === 'events' && (
                  <>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> 日期</span>
                      <span className="text-sm font-bold">{item.date} {item.time}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> 主办方</span>
                      <span className="text-sm font-bold">{item.organizer}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                  {module === 'events' ? '立即报名' : module === 'housing' ? '预约看房' : '了解更多'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={(e) => toggleBookmark(item.id, e)}
                >
                  {bookmarks.includes(item.id) ? '从收藏中移除' : '加入收藏清单'}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar variant="sidebar" className="border-r bg-sidebar">
          <SidebarHeader className="border-b p-6">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border bg-background shadow-sm">
                <Image
                src="/weijie-logo-icon.png?v=202605130107"
                  alt="维界图标"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold leading-none tracking-tight text-foreground">维界</span>
                <span className="text-[10px] text-muted-foreground tracking-widest">留学生活系统</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 pb-2 text-[10px] uppercase tracking-wider font-bold">主要功能</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'dashboard'} onClick={() => resetFilters('dashboard')} tooltip="控制台">
                    <LayoutDashboard /> <span>主控制台</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'advisor'} onClick={() => resetFilters('advisor')} tooltip="AI助手">
                    <Sparkles /> <span>落户助手</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'guides' || activeModule === 'guideDetail'} onClick={() => resetFilters('guides')} tooltip="指南">
                    <BookOpen /> <span>留学指南</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-2 pb-2 text-[10px] uppercase tracking-wider font-bold">生活模块</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'housing'} onClick={() => resetFilters('housing')} tooltip="房源">
                    <HomeIcon /> <span>房源中心</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'schools'} onClick={() => resetFilters('schools')} tooltip="学校">
                    <GraduationCap /> <span>院校指南</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'food'} onClick={() => resetFilters('food')} tooltip="美食">
                    <Utensils /> <span>美食地图</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'events'} onClick={() => resetFilters('events')} tooltip="活动">
                    <Calendar /> <span>活动中心</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4 text-center">
            <p className="text-[11px] font-medium text-foreground">维界 · 新加坡中国留学生生活平台</p>
            <p className="mt-1 text-[10px] text-muted-foreground">新加坡留学生活，一站到位。</p>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-[1px] bg-border" />
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="relative h-6 w-6 overflow-hidden rounded-md border bg-background">
                  <Image
                    src="/weijie-logo-icon.png?v=202605130107"
                    alt="维界图标"
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </span>
                <span>维界</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{MODULE_NAMES[activeModule]}</span>
                {selectedItem && (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground truncate max-w-[150px]">{selectedItem.title || selectedItem.name}</span>
                  </>
                )}
              </div>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索租房、学校、美食或指南..."
                className="h-9 rounded-full bg-muted/50 pl-10 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-8">
            {activeModule === 'dashboard' && renderDashboard()}

            {activeModule === 'advisor' && (
              <div className="animate-fade-in-up">
                <SettleAdvisor />
              </div>
            )}

            {activeModule === 'guides' && renderGuides()}

            {activeModule === 'guideDetail' && renderGuideDetail()}

            {activeModule === 'detail' && renderDetail()}

            {activeModule === 'housing' && (
              <div className="animate-fade-in-up space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="flex flex-col gap-2">
                    <h1 className="font-headline text-3xl font-bold text-foreground">新加坡房源库</h1>
                    <p className="text-muted-foreground">
                      {schoolFilter ? `正在展示 ${schoolFilter} 附近的房源信息` : "查看真实房源、学生公寓与合租信息，快速找到适合自己的住所。"}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-2 pb-4">
                      <Button 
                        variant={schoolFilter === null ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSchoolFilter(null)}
                        className="rounded-full px-6"
                      >
                        全部院校
                      </Button>
                      {QUICK_SCHOOLS.map(school => (
                        <Button
                          key={school}
                          variant={schoolFilter === school ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSchoolFilter(school)}
                          className="rounded-full px-6"
                        >
                          {school}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="hidden" />
                  </ScrollArea>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredHousing.map(h => (
                    <NotionCard
                      key={h.id}
                      title={h.title}
                      imageUrl={h.imageUrl}
                      description={`${h.type} | ${h.location}`}
                      isBookmarked={bookmarks.includes(h.id)}
                      onBookmark={(e) => toggleBookmark(h.id, e)}
                      badge={h.distanceToUni}
                      onClick={() => handleItemClick(h, 'housing')}
                      footer={
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">S${h.price} /月</span>
                          <span className="text-xs text-muted-foreground">最近更新 2h前</span>
                        </div>
                      }
                    />
                  ))}
                  {filteredHousing.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-muted-foreground">没有找到匹配的房源，尝试搜索其他学校名称？</p>
                      <Button variant="link" onClick={() => { setSchoolFilter(null); setSearchQuery(''); }}>清除所有过滤</Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeModule === 'schools' && (
              <div className="animate-fade-in-up space-y-8">
                <div className="flex flex-col gap-2">
                  <h1 className="font-headline text-3xl font-bold text-foreground">院校信息中心</h1>
                  <p className="text-muted-foreground">了解新加坡高校、课程强度、生活体验与学生评价。</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filteredSchools.map(s => (
                    <NotionCard
                      key={s.id}
                      title={s.name}
                      imageUrl={s.imageUrl}
                      description={s.description}
                      isBookmarked={bookmarks.includes(s.id)}
                      onBookmark={(e) => toggleBookmark(s.id, e)}
                      badge={s.rank}
                      onClick={() => handleItemClick(s, 'schools')}
                      footer={
                        <div className="flex flex-wrap gap-2">
                          {s.services.map(svc => (
                            <Badge key={svc} variant="outline" className="text-[10px]">{svc}</Badge>
                          ))}
                        </div>
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {activeModule === 'food' && (
              <div className="animate-fade-in-up space-y-8">
                <div className="flex flex-col gap-2">
                  <h1 className="font-headline text-3xl font-bold text-foreground">新加坡美食地图</h1>
                  <p className="text-muted-foreground">发现适合中国留学生口味的新加坡餐厅、食阁与平价美食。</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFood.map(f => (
                    <NotionCard
                      key={f.id}
                      title={f.name}
                      imageUrl={f.imageUrl}
                      description={f.category}
                      isBookmarked={bookmarks.includes(f.id)}
                      onBookmark={(e) => toggleBookmark(f.id, e)}
                      badge={f.priceRange}
                      onClick={() => handleItemClick(f, 'food')}
                      footer={
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {f.location}
                          </div>
                          <div className="flex items-center gap-1 font-bold text-yellow-600">
                            <Star className="h-3 w-3 fill-current" /> {f.rating}
                          </div>
                        </div>
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {activeModule === 'events' && (
              <div className="animate-fade-in-up space-y-8">
                <div className="flex flex-col gap-2">
                  <h1 className="font-headline text-3xl font-bold text-foreground">社群活动日程</h1>
                  <p className="text-muted-foreground">获取校园活动、聚会、兼职与本地社交信息。</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map(eventItem => (
                    <NotionCard
                      key={eventItem.id}
                      title={eventItem.title}
                      imageUrl={eventItem.imageUrl}
                      description={`${eventItem.date} ${eventItem.time}`}
                      isBookmarked={bookmarks.includes(eventItem.id)}
                      onBookmark={(e) => toggleBookmark(eventItem.id, e)}
                      onClick={() => handleItemClick(eventItem, 'events')}
                      footer={
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {eventItem.location}</div>
                            <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {eventItem.attendees}人报名</div>
                          </div>
                          <button className="w-full rounded-lg bg-accent py-2 text-xs font-bold text-accent-foreground transition-all hover:bg-accent/90">
                            立即报名
                          </button>
                        </div>
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
