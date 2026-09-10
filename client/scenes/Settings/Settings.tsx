import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import SettingsForm from '../../components/settings/settings.form'
import { createSetting, updateSetting } from '../../redux/reducers/settings'
import type { ISettings } from '../../../common/types/generated/Settings'

const SettingEdit = () => {
  const dispatch = useDispatch<any>()
  const list = useSelector((s: { settings: { list: ISettings[] } }) => s.settings.list)
  const settings = list[0]

  const save = (data: Partial<ISettings>) => {
    if (settings?.id) {
      dispatch(updateSetting(settings.id, data))
    } else {
      dispatch(createSetting(data))
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="container mx-auto min-w-0 px-4">
          <div className="mb-6 flex items-center justify-between border-b py-4">
            <h1 className="text-3xl">Настройки</h1>
          </div>
          <SettingsForm key={settings?.id ?? 'new'} settings={settings} onSave={save} />
        </div>
      </div>
    </div>
  )
}

export default SettingEdit
