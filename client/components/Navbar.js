import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import cx from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { LogOut, Undo2, User, VenetianMask } from 'lucide-react'
// import dotenv from 'dotenv'
import { signOut, returnToSelf } from '../redux/reducers/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

import { socket } from '../redux/sockets/socketReceivers'

// dotenv.config()

const Navbar = () => {
  const dispatch = useDispatch()
  const auth = useSelector((s) => s.auth)
  // const role = useSelector((s) => s.auth.roles)
  const [toggle, setToggle] = useState(false)
  const toggleOpen = () => {
    if (toggle === false) {
      return setToggle(true)
    }
    return setToggle(false)
  }

  socket.connect()

  const isStudy = process.env.MODE === 'study'

  return (
    <nav className="flex items-center justify-between flex-wrap bg-white shadow px-6 py-3 z-20">
      <Link to="/">
        <div className="flex items-center flex-shrink-0 text-black mr-6">
          <svg
            className="fill-current h-8 w-8 mr-2"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>
          <span className="font-semibold text-xl tracking-tight">
            {isStudy ? 'Autodom Обучениe' : 'Autodom CRM'}
          </span>
        </div>
      </Link>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-gray-600 border-gray-600 hover:text-gray-800 hover:border-gray-800"
          type="button"
          onClick={toggleOpen}
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Меню</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className={cx('w-full block flex-grow lg:flex lg:items-center lg:w-auto', {
          hidden: toggle === false,
          block: toggle === true
        })}
      >
        {!isStudy ? (
          <div className="text-sm lg:flex-grow">
            {auth.roles.includes('autopartfull') ||
            auth.roles.includes('autopartsimple') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('admin') ? (
              <NavLink
                to="/autoparts/order/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Автозапчасти
              </NavLink>
            ) : null}
            {auth.roles.includes('toolfull') ||
            auth.roles.includes('toolsimple') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('admin') ? (
              <NavLink
                to="/tools/order/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Инструмент
              </NavLink>
            ) : null}
            {auth.roles.includes('razval') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('admin') ? (
              <NavLink
                to="/razval/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Развал
              </NavLink>
            ) : null}
            {auth.roles.includes('razval') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('admin') ? (
              <NavLink
                to="/preentry/oil"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Масло
              </NavLink>
            ) : null}
            {auth.roles.includes('tyrefull') ||
            auth.roles.includes('tyresimple') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('admin') ? (
              <NavLink
                to="/tyres/order/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Шины
              </NavLink>
            ) : null}
            {auth.roles.includes('tyresOrder') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('admin') ? (
              <NavLink
                to="/tyres/order-desk/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Шины (стол заказов)
              </NavLink>
            ) : null}
            {/* <NavLink
            to="/place/list"
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
            activeClassName="text-main-600 underline font-semibold"
          >
            Адреса
          </NavLink> */}
            {auth.roles.includes('shinomontazh') && !auth.roles.includes('boss') ? (
              <NavLink
                to="/shinomontazh/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Шиномонтаж
              </NavLink>
            ) : null}
            {auth.roles.includes('boss') || auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/shinomontazhboss/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Шиномонтаж (Босс)
              </NavLink>
            ) : null}
            {auth.roles.includes('kassa') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('admin') ||
            auth.roles.includes('shinomontazh') ? (
              <NavLink
                to="/preentry/shinomontazh"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Шиномонтаж (запись)
              </NavLink>
            ) : null}
            {auth.roles.includes('sto') &&
            !auth.roles.includes('boss') &&
            !auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/sto/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                СТО
              </NavLink>
            ) : null}
            {auth.roles.includes('boss') || auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/stoboss/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                СТО (Босс)
              </NavLink>
            ) : null}
            {auth.roles.includes('wash') &&
            !auth.roles.includes('boss') &&
            !auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/wash/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Мойка
              </NavLink>
            ) : null}
            {auth.roles.includes('boss') || auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/washboss/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Мойка (Босс)
              </NavLink>
            ) : null}

            {auth.roles.includes('window') &&
            !auth.roles.includes('boss') &&
            !auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/window/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Стекла
              </NavLink>
            ) : null}
            {auth.roles.includes('boss') || auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/windowboss/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Стекла (Босс)
              </NavLink>
            ) : null}

            {auth.roles.includes('cond') &&
            !auth.roles.includes('boss') &&
            !auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/cond/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Кондиционеры
              </NavLink>
            ) : null}
            {auth.roles.includes('boss') || auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/condboss/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Кондиционеры (Босс)
              </NavLink>
            ) : null}

            {auth.roles.includes('diskpainting') &&
            !auth.roles.includes('boss') &&
            !auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/diskpainting/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Покраска дисков
              </NavLink>
            ) : null}
            {auth.roles.includes('boss') || auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/diskpaintingboss/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Покраска дисков (Босс)
              </NavLink>
            ) : null}

            {auth.roles.includes('kassa') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('hranenie') ||
            auth.roles.includes('admin') ? (
              <NavLink
                to="/storages/order/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Хранение
              </NavLink>
            ) : null}
            {auth.roles.includes('autopartfull') ||
            auth.roles.includes('autopartsimple') ||
            auth.roles.includes('razval') ||
            auth.roles.includes('kassa') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('admin') ? (
              <NavLink
                to="/customer/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Клиенты
              </NavLink>
            ) : null}
            {auth.roles.includes('autopartfull') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('admin') ? (
              <NavLink
                to="/vendor/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Поставщики
              </NavLink>
            ) : null}
            {auth.roles.includes('admin') ? (
              <NavLink
                to="/employee/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Администратор
              </NavLink>
            ) : null}
            {/* <NavLink
            to="/employee/list"
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
            activeClassName="text-main-600 underline font-semibold"
          >
            Сотрудники
          </NavLink> */}

            {/* <NavLink
            to="/account/list"
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
            activeClassName="text-main-600 underline font-semibold"
          >
            Аккаунты
          </NavLink> */}
            {/* {auth.roles.includes('boss') ? (
            <NavLink
              to="/boss"
              className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
              activeClassName="text-main-600 underline font-semibold"
            >
              Босс
            </NavLink>
          ) : null} */}
            {auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/shinomontazhprice/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Цены (шиномонтаж)
              </NavLink>
            ) : null}
            {auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/stoprice/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Цены (СТО)
              </NavLink>
            ) : null}
            {auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/washprice/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Цены (Мойка)
              </NavLink>
            ) : null}
            {auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/windowprice/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Цены (Стекла)
              </NavLink>
            ) : null}
            {auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/condprice/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Цены (Кондиционеры)
              </NavLink>
            ) : null}
            {auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/material/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Цены (материалы)
              </NavLink>
            ) : null}
            {auth.roles.includes('bookkeeper') || auth.roles.includes('kassa') ? (
              <NavLink
                to="/organization/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Организации
              </NavLink>
            ) : null}
            {auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/category/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Категории
              </NavLink>
            ) : null}
            {auth.roles.includes('journal') ? (
              <NavLink
                to="/employee-journal"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Электронный журнал
              </NavLink>
            ) : null}
            {auth.roles.includes('boss') ? (
              <NavLink
                to="/boss-journal"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Электронный журнал (босс)
              </NavLink>
            ) : null}
            {auth.roles.includes('kassa') ||
            auth.roles.includes('bookkeeper') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('report') ? (
              <NavLink
                to="/report"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Отчет
              </NavLink>
            ) : null}
          </div>
        ) : (
          <div className="text-sm lg:flex-grow">
            {auth.roles.includes('shinomontazh') && !auth.roles.includes('boss') ? (
              <NavLink
                to="/shinomontazh/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Шиномонтаж
              </NavLink>
            ) : null}
            {auth.roles.includes('boss') || auth.roles.includes('bookkeeper') ? (
              <NavLink
                to="/shinomontazhboss/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Шиномонтаж (Босс)
              </NavLink>
            ) : null}
            {auth.roles.includes('admin') ? (
              <NavLink
                to="/account/list"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Администратор
              </NavLink>
            ) : null}
            {auth.roles.includes('kassa') ||
            auth.roles.includes('bookkeeper') ||
            auth.roles.includes('boss') ||
            auth.roles.includes('report') ? (
              <NavLink
                to="/report"
                className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-main-700 mr-4"
                activeClassName="text-main-600 underline font-semibold"
              >
                Отчет
              </NavLink>
            ) : null}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="mt-4 gap-2 font-normal md:mt-0">
              {auth.impersonatedBy ? (
                <VenetianMask className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              {auth.user.login}
              {auth.impersonatedBy ? (
                <Badge className="border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100">
                  Имперсонация
                </Badge>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {auth.impersonatedBy ? (
              <DropdownMenuItem onClick={() => dispatch(returnToSelf())}>
                <Undo2 className="h-4 w-4" />
                Вернуться к основному аккаунту
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => dispatch(signOut())}>
                <LogOut className="h-4 w-4" />
                Выйти
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default Navbar
