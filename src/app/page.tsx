
"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  Filter
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

type Module = 'dashboard' | 'housing' | 'schools' | 'food' | 'events' | 'advisor' | 'detail';

const MODULE_NAMES: Record<Module, string> = {
  dashboard: '主控制台',
  housing: '房源中心',
  schools: '院校指南',
  food: '美食地图',
  events: '活动日程',
  advisor: '智能助手',
  detail: '详情查看'
};

const QUICK_SCHOOLS = ['NUS', 'NTU', 'SMU', 'SUTD', 'SIT', 'SUSS', 'NAFA', 'MDIS', 'PSB'];

export default function AppHome() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
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

  const goBack = () => {
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
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground">我的工作区 / Workspace</h2>
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
        <h2 className="mb-6 font-headline text-2xl font-bold tracking-tight text-foreground">探索中心 / Explore Hub</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div 
            onClick={() => resetFilters('advisor')}
            className="group relative flex h-48 cursor-pointer items-center overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground transition-all hover:scale-[1.02]"
          >
            <div className="relative z-10 flex flex-col gap-2">
              <span className="flex items-center gap-2 font-headline text-2xl font-bold">
                <Sparkles className="h-6 w-6" /> 智能落户助手
              </span>
              <p className="max-w-xs text-primary-foreground/80">AI 驱动的一站式新加坡生活咨询。银行、交通、签证，有问必答。</p>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-20 transition-transform group-hover:scale-110">
              <Sparkles className="h-48 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => resetFilters('housing')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <HomeIcon className="h-6 w-6" />
              <span className="font-bold">优质房源</span>
            </button>
            <button onClick={() => resetFilters('schools')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">院校指南</span>
            </button>
            <button onClick={() => resetFilters('food')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <Utensils className="h-6 w-6" />
              <span className="font-bold">美食地图</span>
            </button>
            <button onClick={() => resetFilters('events')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <Calendar className="h-6 w-6" />
              <span className="font-bold">社群活动</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );

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
                  {module === 'events' ? '立即报名 RSVP' : module === 'housing' ? '预约看房' : '了解更多'}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-headline font-bold text-xl">
                维
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold leading-none tracking-tight text-foreground">weijie.sg</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">生活操作系统</span>
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
          <SidebarFooter className="border-t p-4 text-[10px] text-muted-foreground text-center">
            &copy; 2024 weijie.sg. 版权所有
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-[1px] bg-border" />
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
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
                placeholder="搜索标题、学校或地点..."
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

            {activeModule === 'detail' && renderDetail()}

            {activeModule === 'housing' && (
              <div className="animate-fade-in-up space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="flex flex-col gap-2">
                    <h1 className="font-headline text-3xl font-bold text-foreground">新加坡房源库</h1>
                    <p className="text-muted-foreground">
                      {schoolFilter ? `正在展示 ${schoolFilter} 附近的优质房源` : "精选靠近校园、环境优美的留学生友好公寓。"}
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
                  <p className="text-muted-foreground">新加坡顶尖大学的申请指南、排名及国际学生服务。</p>
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
                  <h1 className="font-headline text-3xl font-bold text-foreground">美食侦查员</h1>
                  <p className="text-muted-foreground">最懂中国胃的新加坡美食地图。</p>
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
                  <p className="text-muted-foreground">实时更新的留学生线上线下社群活动。</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map(e => (
                    <NotionCard
                      key={e.id}
                      title={e.title}
                      imageUrl={e.imageUrl}
                      description={`${e.date} ${e.time}`}
                      isBookmarked={bookmarks.includes(e.id)}
                      onBookmark={(e) => toggleBookmark(e.id, e)}
                      onClick={() => handleItemClick(e, 'events')}
                      footer={
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</div>
                            <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {e.attendees}人报名</div>
                          </div>
                          <button className="w-full rounded-lg bg-accent py-2 text-xs font-bold text-accent-foreground transition-all hover:bg-accent/90">
                            立即报名 RSVP
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
