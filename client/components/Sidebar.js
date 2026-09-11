import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  AppWindow,
  BookOpen,
  Disc,
  Droplets,
  MapPin,
  Menu,
  Package,
  Palette,
  Receipt,
  Settings,
  Tags,
  Truck,
  UserCircle,
  Users,
  Wind,
  Wrench,
  X
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { cn } from '../lib/utils'

const SidebarLink = ({ to, icon: Icon, label, expanded, onNavigate }) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={cn(
      'mx-2 flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white',
      expanded ? 'justify-start' : 'justify-center md:justify-start'
    )}
    activeClassName="border-primary bg-slate-800 text-white"
  >
    <Icon className="h-5 w-5 shrink-0" />
    <span className={expanded ? 'inline' : 'hidden md:inline'}>{label}</span>
  </NavLink>
)

const PRICE_LINKS = [
  { to: '/shinomontazhprice/list', icon: Disc, label: 'Шиномонтаж - цены' },
  { to: '/stoprice/list', icon: Wrench, label: 'СТО - цены' },
  { to: '/washprice/list', icon: Droplets, label: 'Мойка - цены' },
  { to: '/windowprice/list', icon: AppWindow, label: 'Лобовые стекла - цены' },
  { to: '/condprice/list', icon: Wind, label: 'Кондиционеры - цены' },
  { to: '/diskpaintingprice/list', icon: Palette, label: 'Покраска дисков - цены' }
]

const SidebarPricesGroup = ({ expanded, onNavigate }) => {
  const { pathname } = useLocation()
  const isActive = PRICE_LINKS.some((link) => pathname.startsWith(`/${link.to.split('/')[1]}`))

  return (
    <Accordion type="single" collapsible defaultValue={isActive ? 'prices' : undefined}>
      <AccordionItem value="prices" className="border-none">
        <AccordionTrigger
          className={cn(
            'mx-2 gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-slate-400 no-underline transition-colors hover:bg-slate-800 hover:text-white hover:no-underline [&>svg]:hidden',
            expanded
              ? 'justify-between [&>svg]:block'
              : 'justify-center md:justify-between md:[&>svg]:block',
            isActive && 'text-white'
          )}
        >
          <span className="flex items-center gap-3">
            <Receipt className="h-5 w-5 shrink-0" />
            <span className={expanded ? 'inline' : 'hidden md:inline'}>Цены</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1 p-0">
          {PRICE_LINKS.map((link) => (
            <SidebarLink key={link.to} {...link} expanded={expanded} onNavigate={onNavigate} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const Sidebar = () => {
  const isStudy = process.env.MODE === 'study'
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const renderLinks = (expanded, onNavigate) => (
    <>
      <SidebarLink
        to="/account/list"
        icon={UserCircle}
        label="Аккаунты"
        expanded={expanded}
        onNavigate={onNavigate}
      />
      <SidebarLink
        to="/employee/list"
        icon={Users}
        label="Сотрудники"
        expanded={expanded}
        onNavigate={onNavigate}
      />
      {isStudy ? null : (
        <>
          <SidebarLink
            to="/place/list"
            icon={MapPin}
            label="Адреса"
            expanded={expanded}
            onNavigate={onNavigate}
          />
          <SidebarLink
            to="/settings"
            icon={Settings}
            label="Настройки"
            expanded={expanded}
            onNavigate={onNavigate}
          />
          <SidebarLink
            to="/material/list"
            icon={Package}
            label="Материалы"
            expanded={expanded}
            onNavigate={onNavigate}
          />
          <SidebarPricesGroup expanded={expanded} onNavigate={onNavigate} />
          <SidebarLink
            to="/vendor/list"
            icon={Truck}
            label="Поставщики"
            expanded={expanded}
            onNavigate={onNavigate}
          />
          <SidebarLink
            to="/category/list"
            icon={Tags}
            label="Категории"
            expanded={expanded}
            onNavigate={onNavigate}
          />
          <SidebarLink
            to="/electronic-journal"
            icon={BookOpen}
            label="Электронный журнал"
            expanded={expanded}
            onNavigate={onNavigate}
          />
        </>
      )}
    </>
  )

  return (
    <>
      <nav className="sidebar sticky top-0 flex h-screen w-16 shrink-0 flex-col gap-1 overflow-y-auto bg-slate-900 py-3 font-semibold md:w-56">
        <button
          type="button"
          className="mx-2 mb-1 flex h-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Развернуть меню"
        >
          <Menu className="h-5 w-5" />
        </button>
        {renderLinks(false)}
      </nav>
      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-black/50"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Закрыть меню"
          />
          <nav className="absolute left-0 top-0 flex h-full w-64 flex-col gap-1 overflow-y-auto bg-slate-900 py-3 font-semibold shadow-xl">
            <button
              type="button"
              className="mx-2 mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5 shrink-0" />
              <span>Свернуть</span>
            </button>
            {renderLinks(true, () => setIsMobileOpen(false))}
          </nav>
        </div>
      ) : null}
    </>
  )
}

export default Sidebar
