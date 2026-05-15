import Image from 'next/image';
import Link from 'next/link';
import {BookOpen, Calendar, GraduationCap, Home, LayoutDashboard, Utensils} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

type StaticPageShellProps = {
  active: 'home' | 'guides' | 'schools' | 'food' | 'events';
  breadcrumb: string;
  children: React.ReactNode;
};

export function StaticPageShell({active, breadcrumb, children}: StaticPageShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar variant="sidebar" className="border-r bg-sidebar">
          <SidebarHeader className="border-b p-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative h-10 w-10 overflow-hidden rounded-lg border bg-background shadow-sm">
                <Image src="/weijie-logo-icon.png?v=202605141037" alt="维界图标" fill className="object-cover" sizes="40px" />
              </span>
              <span className="flex flex-col">
                <span className="font-headline font-bold leading-none tracking-tight text-foreground">维界</span>
                <span className="text-[10px] tracking-widest text-muted-foreground">新加坡留学生活系统</span>
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider">主要功能</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={active === 'home'} tooltip="控制台">
                    <a href="/">
                      <LayoutDashboard /> <span>主控制台</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="房源">
                    <a href="/#listings">
                      <Home /> <span>房源中心</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={active === 'guides'} tooltip="指南">
                    <a href="/guides">
                      <BookOpen /> <span>生活指南</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider">生活模块</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={active === 'schools'} tooltip="学校">
                    <a href="/schools">
                      <GraduationCap /> <span>院校信息</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={active === 'food'} tooltip="美食">
                    <a href="/food">
                      <Utensils /> <span>美食地图</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={active === 'events'} tooltip="活动">
                    <a href="/events">
                      <Calendar /> <span>活动中心</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4 text-center">
            <p className="text-[11px] font-medium text-foreground">维界 · 新加坡留学生活系统</p>
            <p className="mt-1 text-[10px] text-muted-foreground">新加坡留学生活，一站到位。</p>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-8">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border" />
            <div className="text-sm font-medium text-muted-foreground">
              维界 / <span className="text-foreground">{breadcrumb}</span>
            </div>
          </header>
          <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
