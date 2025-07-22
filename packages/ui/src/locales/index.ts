import cockpitEN from './cockpit/en'
import cockpitZH from './cockpit/zh'
import commonEN from './common/en'
import commonZH from './common/zh'
import mdfEN from './mdf/en'
import mdfZH from './mdf/zh'
import { EApp } from '../components/i18next/type'

export const en = {
  [EApp.cockpit]: cockpitEN,
  [EApp.mdf]: mdfEN,
  [EApp.common]: commonEN,
}

export const zh = {
  [EApp.cockpit]: cockpitZH,
  [EApp.mdf]: mdfZH,
  [EApp.common]: commonZH,
}
