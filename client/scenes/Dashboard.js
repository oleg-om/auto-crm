import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import 'react-toastify/dist/ReactToastify.css'
import autoparts from '../assets/images/Dashboard/autoparts.png'
import admin from '../assets/images/Dashboard/admin.png'
import boss from '../assets/images/Dashboard/boss.png'
import tyres from '../assets/images/Dashboard/tyrewheels.png'
import razval from '../assets/images/Dashboard/razval.png'
import customer from '../assets/images/Dashboard/customer.png'
import vendor from '../assets/images/Dashboard/vendor.png'
import shinomotazh from '../assets/images/Dashboard/tyremount.png'
import tools from '../assets/images/Dashboard/tools.png'
import sto from '../assets/images/Dashboard/sto.png'
import wash from '../assets/images/Dashboard/wash.png'
import window from '../assets/images/Dashboard/window.png'
import cond from '../assets/images/Dashboard/cond.png'
import tyresmountpreentry from '../assets/images/Dashboard/tyrepremount.png'

const Dashboard = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const auth = useSelector((s) => s.auth)

  const isStudy = process.env.MODE === 'study'

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
              {auth.roles.includes('boss') && !auth.roles.includes('admin') ? (
                <p>Вы начальник. У вас есть доступ ко всем страницам</p>
              ) : null}
              {isStudy ? null : (
                <>
                  {(auth.roles.includes('autopartfull') || auth.roles.includes('autopartsimple')) &&
                  !auth.roles.includes('boss') &&
                  !auth.roles.includes('admin') ? (
                    <p>У вас есть доступ к странице &quot;Автозапчасти&quot;</p>
                  ) : null}
                  {auth.roles.includes('bookkeeper') &&
                  !auth.roles.includes('boss') &&
                  !auth.roles.includes('admin') ? (
                    <p>У вас есть доступ к странице &quot;Бухгалтерия&quot;</p>
                  ) : null}
                  {auth.roles.includes('razval') &&
                  !auth.roles.includes('boss') &&
                  !auth.roles.includes('admin') ? (
                    <p>У вас есть доступ к странице &quot;Развал-схождение&quot;</p>
                  ) : null}
                </>
              )}

              {auth.roles.includes('shinomontazh') &&
              !auth.roles.includes('boss') &&
              !auth.roles.includes('admin') ? (
                <p>У вас есть доступ к странице &quot;Шиномонтаж&quot;</p>
              ) : null}
            </div>
          </div>
          {!isStudy ? (
            <div className="-mx-3 md:flex flex-wrap mb-6">
              {auth.roles.includes('autopartfull') ||
              auth.roles.includes('autopartsimple') ||
              auth.roles.includes('boss') ||
              auth.roles.includes('admin') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to="/autoparts/order/list"
                    className="rounded-lg shadow-lg bg-gradient-to-r from-teal-400 to-blue-500 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">Автозапчасти</h2>
                        <p className="my-2 text-white">
                          Возможность создавать, редактировать заказы по автозапчастям
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={autoparts} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}
              {auth.roles.includes('sto') ||
              auth.roles.includes('sto') ||
              auth.roles.includes('boss') ||
              auth.roles.includes('admin') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to={
                      auth.roles.includes('boss') || auth.roles.includes('admin')
                        ? '/stoboss/list'
                        : '/sto/list'
                    }
                    className="rounded-lg shadow-lg bg-gradient-to-r from-gray-700 to-gray-400 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">CТО</h2>
                        <p className="my-2 text-white">
                          Возможность проводить работы по СТО, печать талонов
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={sto} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}
              {auth.roles.includes('wash') ||
              auth.roles.includes('wash') ||
              auth.roles.includes('boss') ||
              auth.roles.includes('admin') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to={
                      auth.roles.includes('boss') || auth.roles.includes('admin')
                        ? '/washboss/list'
                        : '/wash/list'
                    }
                    className="rounded-lg shadow-lg bg-gradient-to-r from-blue-700 to-gray-400 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">Мойка</h2>
                        <p className="my-2 text-white">
                          Возможность проводить работы по автомойке, печать талонов
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={wash} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}
              {auth.roles.includes('toolfull') ||
              auth.roles.includes('toolsimple') ||
              auth.roles.includes('boss') ||
              auth.roles.includes('admin') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to="/tools/order/list"
                    className="rounded-lg shadow-lg bg-gradient-to-r from-red-400 to-yellow-500 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">Инструмент</h2>
                        <p className="my-2 text-white">
                          Возможность создавать, редактировать заказы по инструменту и оборудованию
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={tools} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}

              {auth.roles.includes('razval') ||
              auth.roles.includes('boss') ||
              auth.roles.includes('admin') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to="/razval/list"
                    className="rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-400 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">Развал</h2>
                        <p className="my-2 text-white">
                          Ведение записи по развал-схождению и замене масла
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={razval} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}

              {auth.roles.includes('tyresimple') ||
              auth.roles.includes('tyrefull') ||
              auth.roles.includes('boss') ||
              auth.roles.includes('admin') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to="/tyres/order/list"
                    className="rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-400 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">Шины и диски</h2>
                        <p className="my-2 text-white">
                          Возможность создавать, редактировать заказы по шинам
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={tyres} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}

              <DashBoardSninomontazh auth={auth} />

              {auth.roles.includes('window') ||
              auth.roles.includes('boss') ||
              auth.roles.includes('bookkeeper') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to={
                      auth.roles.includes('window') &&
                      !auth.roles.includes('boss') &&
                      !auth.roles.includes('bookkeeper')
                        ? '/window/list'
                        : '/windowboss/list'
                    }
                    className="rounded-lg shadow-lg bg-gradient-to-r from-gray-700 to-gray-400 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">Автостекла</h2>
                        <p className="my-2 text-white">
                          Возможность проводить работы по замене и ремонту автостекол
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={window} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}

              {auth.roles.includes('window') ||
              auth.roles.includes('boss') ||
              auth.roles.includes('bookkeeper') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to={
                      auth.roles.includes('cond') &&
                      !auth.roles.includes('boss') &&
                      !auth.roles.includes('bookkeeper')
                        ? '/cond/list'
                        : '/condboss/list'
                    }
                    className="rounded-lg shadow-lg bg-gradient-to-r from-gray-700 to-gray-400 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">Кондиционеры</h2>
                        <p className="my-2 text-white">
                          Возможность проводить работы по замене и ремонту кондиционеров
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={cond} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}

              <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                <Link
                  to="/customer/list"
                  className="rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-purple-900 h-full"
                >
                  <div className="m-2 p-2 flex flex-row">
                    <div className="w-1/2 px-3">
                      <h2 className="text-3xl text-white font-bold">Клиенты</h2>
                      <p className="my-2 text-white">
                        Редактируйте существующих клиентов, удаляйте клиентов с некорректными
                        данными
                      </p>
                      <button
                        type="button"
                        className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                      >
                        Перейти
                      </button>
                    </div>
                    <div className="w-1/2">
                      <img src={customer} alt="" className="object-contain h-48 w-full" />
                    </div>
                  </div>
                </Link>
              </div>

              <DashBoardAdmin auth={auth} />
              <DashBoardReport auth={auth} />
              {auth.roles.includes('hranenie') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to="/hranenie"
                    className="rounded-lg shadow-lg bg-gradient-to-r from-green-600 to-green-300 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">Хранение шин</h2>
                        <p className="my-2 text-white">
                          Хранение шин, возможность печати договоров
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                          onClick={() => notify('Данная страница в разработке')}
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={tyres} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}
              {auth.roles.includes('autopartfull') ||
              auth.roles.includes('tyrefull') ||
              auth.roles.includes('boss') ||
              auth.roles.includes('admin') ? (
                <div className="md:w-1/2 px-3 mb-6 flex flex-col">
                  <Link
                    to="/vendor/list"
                    className="rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-300 h-full"
                  >
                    <div className="m-2 p-2 flex flex-row">
                      <div className="w-1/2 px-3">
                        <h2 className="text-3xl text-white font-bold">Поставщики</h2>
                        <p className="my-2 text-white">
                          Возможность добавлять, удалять и редактировать поставщиков
                        </p>
                        <button
                          type="button"
                          className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                        >
                          Перейти
                        </button>
                      </div>
                      <div className="w-1/2">
                        <img src={vendor} alt="" className="object-contain h-48 w-full" />
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}
              <DashBoardJournal auth={auth} />
            </div>
          ) : (
            <div className="-mx-3 md:flex flex-wrap mb-6">
              <DashBoardSninomontazh auth={auth} />
              <DashBoardAdmin auth={auth} />
              <DashBoardReport auth={auth} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const DashBoardAdmin = ({ auth }) => {
  return (
    <>
      {auth.roles.includes('admin') || auth.roles.includes('boss') ? (
        <div className="md:w-1/2 px-3 mb-6 flex flex-col">
          <Link
            to="/place/list"
            className="rounded-lg shadow-lg bg-gradient-to-r from-orange-400 to-red-500 h-full"
          >
            <div className="m-2 p-2 flex flex-row">
              <div className="w-1/2 px-3">
                <h2 className="text-3xl text-white font-bold">Админ</h2>
                <p className="my-2 text-white">
                  Доступ ко всем настройкам. Добавление сотрудников, клиентов, адресов и т.д.
                </p>
                <button
                  type="button"
                  className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                >
                  Перейти
                </button>
              </div>
              <div className="w-1/2">
                <img src={admin} alt="" className="object-contain h-48 w-full" />
              </div>
            </div>
          </Link>
        </div>
      ) : null}
    </>
  )
}

const DashBoardJournal = ({ auth }) => {
  return (
    <>
      {auth.roles.includes('journal') ? (
        <div className="md:w-1/2 px-3 mb-6 flex flex-col">
          <Link
            to="/employee-journal"
            className="rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-purple-300 h-full"
          >
            <div className="m-2 p-2 flex flex-row">
              <div className="w-1/2 px-3">
                <h2 className="text-3xl text-white font-bold">Электронный журнал</h2>
                <p className="my-2 text-white">
                  Заполнение обязанностей в течение рабочего дня
                </p>
                <button
                  type="button"
                  className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                >
                  Перейти
                </button>
              </div>
              <div className="w-1/2">
                <div className="object-contain h-48 w-full flex items-center justify-center text-white text-6xl">
                  <span role="img" aria-label="Электронный журнал">
                    📋
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ) : null}
    </>
  )
}

const DashBoardReport = ({ auth }) => {
  return (
    <>
      {auth.roles.includes('kassa') ||
      auth.roles.includes('bookkeeper') ||
      auth.roles.includes('boss') ||
      auth.roles.includes('report') ? (
        <div className="md:w-1/2 px-3 mb-6 flex flex-col">
          <Link
            to="/report"
            className="rounded-lg shadow-lg bg-gradient-to-r from-red-400 to-yellow-300 h-full"
          >
            <div className="m-2 p-2 flex flex-row">
              <div className="w-1/2 px-3">
                <h2 className="text-3xl text-white font-bold">Отчет</h2>
                <p className="my-2 text-white">Доступ к статистикам и отчетам</p>
                <button
                  type="button"
                  className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                >
                  Перейти
                </button>
              </div>
              <div className="w-1/2">
                <img src={boss} alt="" className="object-contain h-48 w-full" />
              </div>
            </div>
          </Link>
        </div>
      ) : null}
    </>
  )
}

const DashBoardSninomontazh = ({ auth }) => {
  return (
    <>
      {auth.roles.includes('shinomontazh') ||
      auth.roles.includes('shinomotazh') ||
      auth.roles.includes('boss') ||
      auth.roles.includes('admin') ? (
        <div className="md:w-1/2 px-3 mb-6 flex flex-col">
          <Link
            to="/shinomontazh/list"
            className="rounded-lg shadow-lg bg-gradient-to-r from-gray-700 to-gray-400 h-full"
          >
            <div className="m-2 p-2 flex flex-row">
              <div className="w-1/2 px-3">
                <h2 className="text-3xl text-white font-bold">Шиномонтаж</h2>
                <p className="my-2 text-white">
                  Возможность проводить работы по шиномонтажу, печать талонов
                </p>
                <button
                  type="button"
                  className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                >
                  Перейти
                </button>
              </div>
              <div className="w-1/2">
                <img src={shinomotazh} alt="" className="object-contain h-48 w-full" />
              </div>
            </div>
          </Link>
        </div>
      ) : null}

      {auth.roles.includes('shinomontazh') ||
      auth.roles.includes('shinomotazh') ||
      auth.roles.includes('boss') ||
      auth.roles.includes('admin') ? (
        <div className="md:w-1/2 px-3 mb-6 flex flex-col">
          <Link
            to="/preentry/shinomontazh"
            className="rounded-lg shadow-lg bg-gradient-to-r from-gray-700 to-gray-400 h-full"
          >
            <div className="m-2 p-2 flex flex-row">
              <div className="w-1/2 px-3">
                <h2 className="text-3xl text-white font-bold">Шиномонтаж (запись)</h2>
                <p className="my-2 text-white">Возможность производить запись на шиномонтаж</p>
                <button
                  type="button"
                  className="bottom-0 py-2 px-4 bg-main-600 text-white hover:bg-main-700 hover:text-white rounded-lg lg:my-3 my-0"
                >
                  Перейти
                </button>
              </div>
              <div className="w-1/2">
                <img src={tyresmountpreentry} alt="" className="object-contain h-48 w-full" />
              </div>
            </div>
          </Link>
        </div>
      ) : null}
    </>
  )
}

export default Dashboard
