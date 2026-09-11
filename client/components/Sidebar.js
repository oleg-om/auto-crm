import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  AppWindow,
  BookOpen,
  Disc,
  Droplets,
  MapPin,
  Package,
  Palette,
  Receipt,
  Settings,
  Tags,
  Truck,
  UserCircle,
  Users,
  Wind,
  Wrench
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { cn } from '../lib/utils'

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className="mx-2 flex items-center justify-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:justify-start"
    activeClassName="border-primary bg-slate-800 text-white"
  >
    <Icon className="h-5 w-5 shrink-0" />
    <span className="hidden md:inline">{label}</span>
  </NavLink>
)

const PRICE_LINKS = [
  { to: '/shinomontazhprice/list', icon: Disc, label: 'Шиномонтаж - цены' },
  { to: '/stoprice/list', icon: Wrench, label: 'СТО - цены' },
  { to: '/washprice/list', icon: Droplets, label: 'Мойка - цены' },
  { to: '/windowprice/list', icon: AppWindow, label: 'Лобовые стекла - цены' },
  { to: '/condprice/list', icon: Wind, label: 'Кондиционеры - цены' },
  { to: '/diskpaintingprice/list/legk', icon: Palette, label: 'Покраска дисков - цены' }
]

const SidebarPricesGroup = () => {
  const { pathname } = useLocation()
  const isActive = PRICE_LINKS.some((link) => pathname.startsWith(`/${link.to.split('/')[1]}`))

  return (
    <Accordion type="single" collapsible defaultValue={isActive ? 'prices' : undefined}>
      <AccordionItem value="prices" className="border-none">
        <AccordionTrigger
          className={cn(
            'mx-2 justify-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-slate-400 no-underline transition-colors hover:bg-slate-800 hover:text-white hover:no-underline md:justify-between [&>svg]:hidden md:[&>svg]:block',
            isActive && 'text-white'
          )}
        >
          <span className="flex items-center gap-3">
            <Receipt className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">Цены</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1 p-0">
          {PRICE_LINKS.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const Sidebar = () => {
  const isStudy = process.env.MODE === 'study'

  return (
    <nav className="sidebar sticky top-0 flex h-screen w-16 shrink-0 flex-col gap-1 overflow-y-auto bg-slate-900 py-3 font-semibold md:w-56">
      <SidebarLink to="/account/list" icon={UserCircle} label="Аккаунты" />
      <SidebarLink to="/employee/list" icon={Users} label="Сотрудники" />
      {isStudy ? null : (
        <>
          <SidebarLink to="/place/list" icon={MapPin} label="Адреса" />
          <SidebarLink to="/settings" icon={Settings} label="Настройки" />
          <SidebarLink to="/material/list" icon={Package} label="Материалы" />
          <SidebarPricesGroup />
          <SidebarLink to="/vendor/list" icon={Truck} label="Поставщики" />
          <SidebarLink to="/category/list" icon={Tags} label="Категории" />
          <SidebarLink to="/electronic-journal" icon={BookOpen} label="Электронный журнал" />
        </>
      )}
    </nav>
  )
}

export default Sidebar
