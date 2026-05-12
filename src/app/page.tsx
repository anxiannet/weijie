
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
  Users
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { NotionCard } from '@/components/NotionCard';
import { SettleAdvisor } from '@/components/SettleAdvisor';
import { HOUSING_MOCK, SCHOOLS_MOCK, FOOD_MOCK, EVENTS_MOCK } from '@/app/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

type Module = 'dashboard' | 'housing' | 'schools' | 'food' | 'events' | 'advisor';

export default function AppHome() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Hydration handling for bookmarks
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

  const allItems = [
    ...HOUSING_MOCK.map(h => ({ ...h, module: 'housing' })),
    ...SCHOOLS_MOCK.map(s => ({ ...s, module: 'schools' })),
    ...FOOD_MOCK.map(f => ({ ...f, module: 'food' })),
    ...EVENTS_MOCK.map(e => ({ ...e, module: 'events' })),
  ];

  const bookmarkedItems = allItems.filter(item => bookmarks.includes(item.id));

  const filteredHousing = HOUSING_MOCK.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSchools = SCHOOLS_MOCK.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFood = FOOD_MOCK.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredEvents = EVENTS_MOCK.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderDashboard = () => (
    <div className="flex flex-col gap-10 animate-fade-in-up">
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline text-2xl font-bold tracking-tight">我的工作区 / Workspace</h2>
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
                badge={item.module.toUpperCase()}
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
        <h2 className="mb-6 font-headline text-2xl font-bold tracking-tight">探索中心 / Explore Hub</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div 
            onClick={() => setActiveModule('advisor')}
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
            <button onClick={() => setActiveModule('housing')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <HomeIcon className="h-6 w-6" />
              <span className="font-bold">优质房源</span>
            </button>
            <button onClick={() => setActiveModule('schools')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">院校指南</span>
            </button>
            <button onClick={() => setActiveModule('food')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <Utensils className="h-6 w-6" />
              <span className="font-bold">美食地图</span>
            </button>
            <button onClick={() => setActiveModule('events')} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground">
              <Calendar className="h-6 w-6" />
              <span className="font-bold">社群活动</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );

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
                <span className="font-headline font-bold leading-none tracking-tight">weijie.sg</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Life OS</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 pb-2 text-[10px] uppercase tracking-wider font-bold">Main Console</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'dashboard'} onClick={() => setActiveModule('dashboard')} tooltip="控制台">
                    <LayoutDashboard /> <span>主控制台 Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'advisor'} onClick={() => setActiveModule('advisor')} tooltip="AI助手">
                    <Sparkles /> <span>落户助手 Advisor</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-2 pb-2 text-[10px] uppercase tracking-wider font-bold">Life Modules</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'housing'} onClick={() => setActiveModule('housing')} tooltip="房源">
                    <HomeIcon /> <span>我的房源 Housing</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'schools'} onClick={() => setActiveModule('schools')} tooltip="学校">
                    <GraduationCap /> <span>目标院校 Schools</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'food'} onClick={() => setActiveModule('food')} tooltip="美食">
                    <Utensils /> <span>美食地图 Gourmet</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeModule === 'events'} onClick={() => setActiveModule('events')} tooltip="活动">
                    <Calendar /> <span>活动中心 Events</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4 text-[10px] text-muted-foreground text-center">
            &copy; 2024 weijie.sg. All rights reserved.
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-[1px] bg-border" />
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span>WeiJie</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground capitalize">{activeModule}</span>
              </div>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索资源..."
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

            {activeModule === 'housing' && (
              <div className="animate-fade-in-up space-y-8">
                <div className="flex flex-col gap-2">
                  <h1 className="font-headline text-3xl font-bold">新加坡房源库 / Housing Directory</h1>
                  <p className="text-muted-foreground">精选靠近校园、环境优美的留学生友好公寓。</p>
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
                      footer={
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">S${h.price} /月</span>
                          <span className="text-xs text-muted-foreground">最近浏览 2h前</span>
                        </div>
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {activeModule === 'schools' && (
              <div className="animate-fade-in-up space-y-8">
                <div className="flex flex-col gap-2">
                  <h1 className="font-headline text-3xl font-bold">院校信息中心 / Education Hub</h1>
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
                  <h1 className="font-headline text-3xl font-bold">美食侦查员 / Gourmet Scout</h1>
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
                  <h1 className="font-headline text-3xl font-bold">社群活动日程 / Event Horizon</h1>
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
                      footer={
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</div>
                            <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {e.attendees}人报名</div>
                          </div>
                          <button className="w-full rounded-lg bg-accent py-2 text-xs font-bold text-accent-foreground transition-all hover:bg-accent/90">
                            立即 RSVP
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
