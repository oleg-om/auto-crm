import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  AppWindow,
  BookOpen,
  Disc,
  Droplets,
  MapPin,
  Package,
  Palette,
  Settings,
  Tags,
  Truck,
  UserCircle,
  Users,
  Wind,
  Wrench
} from 'lucide-react'

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
          <SidebarLink to="/shinomontazhprice/list/legk" icon={Disc} label="Шиномонтаж - цены" />
          <SidebarLink to="/stoprice/list" icon={Wrench} label="СТО - цены" />
          <SidebarLink to="/washprice/list/" icon={Droplets} label="Мойка - цены" />
          <SidebarLink to="/windowprice/list/" icon={AppWindow} label="Лобовые стекла - цены" />
          <SidebarLink to="/condprice/list/" icon={Wind} label="Кондиционеры - цены" />
          <SidebarLink
            to="/diskpaintingprice/list/legk"
            icon={Palette}
            label="Покраска дисков - цены"
          />
          <SidebarLink to="/vendor/list" icon={Truck} label="Поставщики" />
          <SidebarLink to="/category/list" icon={Tags} label="Категории" />
          <SidebarLink to="/electronic-journal" icon={BookOpen} label="Электронный журнал" />
        </>
      )}
    </nav>
  )
}

export default Sidebar
