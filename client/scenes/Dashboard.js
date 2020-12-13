import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import 'react-toastify/dist/ReactToastify.css'
import autoparts from '../assets/images/Dashboard/autoparts.png'
import admin from '../assets/images/Dashboard/admin.png'
import boss from '../assets/images/Dashboard/boss.png'
import tyres from '../assets/images/Dashboard/tyres.png'
import razval from '../assets/images/Dashboard/razval.png'

const Dashboard = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const auth = useSelector((s) => s.auth)

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Домашняя страница</h1>
        <div>
          <div className="w full md:flex flex-wrap rounded-lg shadow bg-white mb-5">
            <div className="w full px-4 py-2">
              <p>
                Вы вошли как: <b>{auth.user.login}</b>
              </p>
              {auth.roles.includes('admin') ? (
                <p>Вы администратор. У вас есть доступ ко всем страницам</p>
              ) : null}
              {auth.roles.includes('autopartfull') || auth.roles.includes('autopartsimple') ? (
                <p>У вас есть доступ к странице &quot;Автозапчасти&quot;</p>
              ) : null}
              {auth.roles.includes('bookkeeper') ? (
                <p>У вас есть доступ к странице &quot;Бухгалтерия&quot;</p>
              ) : null}
            </div>
          </div>
          <div className="-mx-3 md:flex flex-wrap">
            <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
              <div className="rounded-lg shadow-lg bg-gradient-to-r from-teal-400 to-blue-500 h-full">
                <div className="m-2 p-2 flex flex-row">
                  <div className="w-1/2 px-3">
                    <h2 className="text-3xl text-white font-bold">Автозапчасти</h2>
                    <p className="my-2 text-white">
                      Возможность создавать, редактировать заказы по автозпчастям
                    </p>
                    <Link to="/autoparts/order/list">
                      <button
                        type="button"
                        className="bottom-0 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0"
                      >
                        Перейти
                      </button>
                    </Link>
                  </div>
                  <div className="w-1/2">
                    <img src={autoparts} alt="" className="object-contain h-48 w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
              <div className="rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-200 h-full">
                <div className="m-2 p-2 flex flex-row">
                  <div className="w-1/2 px-3">
                    <h2 className="text-3xl text-white font-bold">Развал</h2>
                    <p className="my-2 text-white">
                      Ведение записи по развал-схождению и замене масла
                    </p>
                    <Link to="/razval/list">
                      <button
                        type="button"
                        className="bottom-0 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0"
                      >
                        Перейти
                      </button>
                    </Link>
                  </div>
                  <div className="w-1/2">
                    <img src={razval} alt="" className="object-contain h-48 w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 px-3 mb-6 mt-6 md:mb-0 flex flex-col">
              <div className="rounded-lg shadow-lg bg-gradient-to-r from-orange-400 to-red-500 h-full">
                <div className="m-2 p-2 flex flex-row">
                  <div className="w-1/2 px-3">
                    <h2 className="text-3xl text-white font-bold">Админ</h2>
                    <p className="my-2 text-white">
                      Доступ ко всем настройкам. Добавление сотрудников, клиентов, адресов и т.д.
                    </p>
                    {auth.roles.includes('admin') ? (
                      <Link to="/place/list">
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="bottom-0 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0"
                        onClick={() => notify('У вас нет доступа')}
                      >
                        Перейти
                      </button>
                    )}
                  </div>
                  <div className="w-1/2">
                    <img src={admin} alt="" className="object-contain h-48 w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 px-3 mb-6 mt-6 md:mb-0 flex flex-col">
              <div className="rounded-lg shadow-lg bg-gradient-to-r from-red-400 to-yellow-300 h-full">
                <div className="m-2 p-2 flex flex-row">
                  <div className="w-1/2 px-3">
                    <h2 className="text-3xl text-white font-bold">Босс</h2>
                    <p className="my-2 text-white">Доступ к статистикам и отчетам</p>
                    {auth.roles.includes('admin') ? (
                      <Link to="/boss">
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="bottom-0 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0"
                        onClick={() => notify('У вас нет доступа')}
                      >
                        Перейти
                      </button>
                    )}
                  </div>
                  <div className="w-1/2">
                    <img src={boss} alt="" className="object-contain h-48 w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 px-3 mb-6 mt-6 md:mb-0 flex flex-col">
              <div className="rounded-lg shadow-lg bg-gradient-to-r from-green-600 to-green-300 h-full">
                <div className="m-2 p-2 flex flex-row">
                  <div className="w-1/2 px-3">
                    <h2 className="text-3xl text-white font-bold">Хранение шин</h2>
                    <p className="my-2 text-white">Хранение шин, возможность печати договоров</p>
                    {auth.roles.includes('admin') ? (
                      <Link to="/hranenie">
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="bottom-0 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg lg:my-3 my-0"
                        onClick={() => notify('У вас нет доступа')}
                      >
                        Перейти
                      </button>
                    )}
                  </div>
                  <div className="w-1/2">
                    <img src={tyres} alt="" className="object-contain h-48 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
