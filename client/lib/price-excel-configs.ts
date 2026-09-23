import { IColumn, IOption, IPriceExcelConfig, IPriceField, YES_NO_OPTIONS } from './price-excel'
import stoTypeList from '../lists/sto-type-list'
import stoPriceFieldList from '../lists/sto-price-field-list'
import shinomontazhTypeList from '../lists/shinomontazhtype-list'
import shinomontazhPriceList from '../lists/shinomontazhprice-list'
import shinomontazhFleetCategoryList from '../lists/shinomontazh-fleet-category-list'
import shinomontazhPriceFieldList from '../lists/shinomontazh-price-field-list'
import washTypeList from '../lists/wash-type-list'
import washFleetCategoryList from '../lists/wash-fleet-category-list'
import washPriceFieldList from '../lists/wash-price-field-list'
import windowTypeList from '../lists/window-type-list'
import windowFleetCategoryList from '../lists/window-fleet-category-list'
import diskpaintingTypeList from '../lists/diskpaintingtype-list'
import diskpaintingPriceFieldList from '../lists/diskpainting-price-field-list'
import materialList from '../lists/material-list'

const asOptions = (list: { name: string; value: string }[]): IOption[] => list

const NAME: IColumn = { key: 'name', header: 'Название' }
const NUMBER: IColumn = { key: 'number', header: 'Порядковый номер' }
const FREE: IColumn = { key: 'free', header: 'Акция', options: YES_NO_OPTIONS }
const CATEGORY: IColumn = { key: 'category', header: 'Категория' }
const typeColumn = (list: { name: string; value: string }[]): IColumn => ({
  key: 'type',
  header: 'Направление',
  options: asOptions(list)
})

// Service duration in minutes (see client/utils/workCompletionFreeze.js); always the last column.
const TIME: IColumn = { key: 'time', header: 'Время, мин' }

const dedupeByValue = (list: IOption[]) =>
  list.filter((it, index) => list.findIndex((other) => other.value === it.value) === index)

// Wash prices used to have separate "rus"/"foreign" directions (see git history of
// wash-type-list.js); the create/edit form has since dropped them in favor of legk/gruz, but old
// price rows in the DB still carry these values. Kept only for the Excel translation, not
// re-exposed as a pickable option in the form.
const WASH_LEGACY_TYPE_OPTIONS: IOption[] = [
  { value: 'rus', name: 'Отечественные' },
  { value: 'foreign', name: 'Иномарки' }
]

export const stoExcelConfig: IPriceExcelConfig = {
  // `category` is a free-form name from the dynamic categories store, already readable.
  columns: [NAME, typeColumn(stoTypeList), CATEGORY, NUMBER, FREE],
  priceFieldsByType: stoPriceFieldList as Record<string, IPriceField[]>,
  trailing: [TIME]
}

export const shinomontazhExcelConfig: IPriceExcelConfig = {
  columns: [
    NAME,
    typeColumn(shinomontazhTypeList),
    {
      ...CATEGORY,
      options: dedupeByValue([
        ...asOptions(shinomontazhPriceList),
        ...asOptions(shinomontazhFleetCategoryList)
      ])
    },
    NUMBER,
    FREE
  ],
  priceFieldsByType: shinomontazhPriceFieldList as Record<string, IPriceField[]>,
  trailing: [TIME]
}

export const washExcelConfig: IPriceExcelConfig = {
  columns: [
    NAME,
    typeColumn(dedupeByValue([...asOptions(washTypeList), ...WASH_LEGACY_TYPE_OPTIONS])),
    // "legk" categories are names from the dynamic categories store; "gruz" ones are fixed.
    { ...CATEGORY, optionsByType: { gruz: asOptions(washFleetCategoryList) } },
    NUMBER,
    FREE
  ],
  priceFieldsByType: washPriceFieldList as Record<string, IPriceField[]>
}

export const windowExcelConfig: IPriceExcelConfig = {
  columns: [
    NAME,
    typeColumn(windowTypeList),
    {
      ...CATEGORY,
      optionsByType: {
        gruz: asOptions(windowFleetCategoryList),
        selhoz: asOptions(windowFleetCategoryList)
      }
    },
    NUMBER,
    FREE,
    { key: 'price', header: 'Цена' }
  ]
}

// Export only (there is no diskpainting price import).
export const diskpaintingExcelConfig: IPriceExcelConfig = {
  columns: [NAME, typeColumn(diskpaintingTypeList), CATEGORY, NUMBER, FREE],
  priceFieldsByType: {
    legk: diskpaintingPriceFieldList as IPriceField[],
    gruz: diskpaintingPriceFieldList as IPriceField[]
  }
}

export const materialExcelConfig: IPriceExcelConfig = {
  columns: [
    NAME,
    { key: 'artikul', header: 'Артикул' },
    { key: 'price', header: 'Цена' },
    { key: 'quantity', header: 'Количество' },
    typeColumn(materialList),
    CATEGORY,
    FREE,
    { key: 'plus', header: 'Цифра 8', options: YES_NO_OPTIONS }
  ]
}
