import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import SettingUpdate from '../../components/settings/settings'
import Navbar from '../../components/Navbar'
import { updateSetting, deleteSetting, createSetting } from '../../redux/reducers/settings'
import Sidebar from '../../components/Sidebar'

const SettingEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.settings.list)
  const updateSettingLocal = (idOfItem, name) => {
    if (list.length === 0) {
      dispatch(createSetting(name))
    } else {
      dispatch(updateSetting(idOfItem, name))
    }
  }
  const deleteSettingLocal = (idOfItem) => {
    dispatch(deleteSetting(idOfItem))
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        {list.length === 0 ? (
          <div className="container mx-auto px-4">
            <h1 className="text-3xl py-4 border-b mb-6">Настройки</h1>
            <SettingUpdate
              key={id}
              {...list}
              deleteSetting={deleteSettingLocal}
              updateSetting={updateSettingLocal}
            />
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <h1 className="text-3xl py-4 border-b mb-6">Настройки</h1>
            {list.map((it) => (
              <SettingUpdate
                key={id}
                {...it}
                deleteSetting={deleteSettingLocal}
                updateSetting={updateSettingLocal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingEdit
