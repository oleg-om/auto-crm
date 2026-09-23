// Shared Excel <-> DB translation for every price list that has an import and/or an export
// (shinomontazh, sto, wash, window, diskpainting, materials).
//
// The DB keeps english keys/values (`type: 'legk'`, `R210107first`, `free: 'yes'`). In Excel we show
// Russian column headers and Russian values instead. Import also still accepts the old english
// headers/values, so previously prepared files keep working.

export interface IOption {
  value: string
  name: string
}

export interface IPriceField {
  key: string
  label: string
}

export interface IColumn {
  key: string
  header: string
  options?: IOption[]
  // Overrides `options` for rows of the given `type` (e.g. fixed fleet categories for "gruz",
  // while "legk" categories are free-form names from the dynamic categories store).
  optionsByType?: Record<string, IOption[]>
}

export interface IPriceExcelConfig {
  // Plain columns, in order, before the price columns. Must include a `type` column when
  // `priceFieldsByType` is used.
  columns: IColumn[]
  // Price columns that only apply to one `type` (shinomontazh diameters, sto categories, ...).
  priceFieldsByType?: Record<string, IPriceField[]>
  // Columns that always go last (e.g. `time`).
  trailing?: IColumn[]
}

export const YES_NO_OPTIONS: IOption[] = [
  { value: 'yes', name: 'Да' },
  { value: 'no', name: 'Нет' }
]

const norm = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')

const optionsFor = (column: IColumn, typeValue: string | undefined) =>
  (typeValue && column.optionsByType?.[typeValue]) || column.options

const toExcelValue = (column: IColumn, typeValue: string | undefined, value: unknown) => {
  const options = optionsFor(column, typeValue)
  const option = options?.find((it) => it.value === value)
  return option ? option.name : value
}

const toDbValue = (column: IColumn, typeValue: string | undefined, value: unknown) => {
  const options = optionsFor(column, typeValue)
  if (!options) return value
  const n = norm(value)
  const option = options.find((it) => norm(it.name) === n || norm(it.value) === n)
  return option ? option.value : value
}

interface IPriceColumn {
  key: string
  header: string
}

interface ISchema {
  fixed: IColumn[]
  price: IPriceColumn[]
  // normalized header/key -> db key, for every non-price column
  fixedLookup: Map<string, string>
  // type -> (normalized label/key -> db key) for the price fields of that type
  priceLookupByType: Record<string, Map<string, string>>
  // normalized joined header / label / key -> db key, for every price field
  priceLookup: Map<string, string>
}

const schemaCache = new WeakMap<IPriceExcelConfig, ISchema>()

const typeName = (config: IPriceExcelConfig, typeValue: string) =>
  config.columns.find((it) => it.key === 'type')?.options?.find((it) => it.value === typeValue)
    ?.name ?? typeValue

const buildSchema = (config: IPriceExcelConfig): ISchema => {
  const cached = schemaCache.get(config)
  if (cached) return cached

  const fixed = [...config.columns, ...(config.trailing ?? [])]
  const fixedLookup = new Map<string, string>()
  fixed.forEach((it) => {
    fixedLookup.set(norm(it.header), it.key)
    fixedLookup.set(norm(it.key), it.key)
  })

  // key -> the distinct labels it has across types, and the first type that uses it
  const byKey = new Map<string, { labels: string[]; firstType: string }>()
  Object.entries(config.priceFieldsByType ?? {}).forEach(([typeValue, fields]) => {
    fields.forEach((field) => {
      const entry = byKey.get(field.key)
      if (!entry) byKey.set(field.key, { labels: [field.label], firstType: typeValue })
      else if (!entry.labels.includes(field.label)) entry.labels.push(field.label)
    })
  })

  // One header per key. The same key can carry different labels in different types (e.g. `R23`
  // is "R23" for passenger cars and "R22,5 (спец шина)" for trucks): show them joined. Two
  // different keys with the same header (wash "Коммерция") get the type appended.
  const joined = new Map<string, string>()
  byKey.forEach((entry, key) => joined.set(key, entry.labels.join(' / ')))
  const headerCount = new Map<string, number>()
  joined.forEach((header) => headerCount.set(header, (headerCount.get(header) ?? 0) + 1))

  const price: IPriceColumn[] = []
  byKey.forEach((entry, key) => {
    const header = joined.get(key) as string
    price.push({
      key,
      header:
        (headerCount.get(header) ?? 0) > 1
          ? `${entry.labels[0]} (${typeName(config, entry.firstType)})`
          : header
    })
  })

  const priceLookup = new Map<string, string>()
  price.forEach(({ key, header }) => {
    priceLookup.set(norm(key), key)
    priceLookup.set(norm(header), key)
  })
  // individual labels too, but only where they point to a single key
  const labelKeys = new Map<string, Set<string>>()
  byKey.forEach((entry, key) =>
    entry.labels.forEach((label) => {
      const n = norm(label)
      labelKeys.set(n, (labelKeys.get(n) ?? new Set()).add(key))
    })
  )
  labelKeys.forEach((keys, label) => {
    if (keys.size === 1 && !priceLookup.has(label)) priceLookup.set(label, [...keys][0])
  })

  const priceLookupByType: Record<string, Map<string, string>> = {}
  Object.entries(config.priceFieldsByType ?? {}).forEach(([typeValue, fields]) => {
    const map = new Map<string, string>()
    fields.forEach((field) => {
      map.set(norm(field.key), field.key)
      map.set(norm(field.label), field.key)
      const header = price.find((it) => it.key === field.key)?.header
      if (header) map.set(norm(header), field.key)
    })
    priceLookupByType[typeValue] = map
  })

  const schema = { fixed, price, fixedLookup, priceLookupByType, priceLookup }
  schemaCache.set(config, schema)
  return schema
}

/** Column headers of the exported sheet, in order (used as `header` for `json_to_sheet`). */
export const excelHeaders = (config: IPriceExcelConfig): string[] => {
  const { price } = buildSchema(config)
  return [
    ...config.columns.map((it) => it.header),
    ...price.map((it) => it.header),
    ...(config.trailing ?? []).map((it) => it.header)
  ]
}

/** DB records -> rows keyed by Russian headers, with Russian values. Unknown fields are dropped. */
export const toExcelRows = (
  items: Record<string, unknown>[],
  config: IPriceExcelConfig
): Record<string, unknown>[] => {
  const { price } = buildSchema(config)
  return items.map((item) => {
    const typeValue = typeof item.type === 'string' ? item.type : undefined
    const row: Record<string, unknown> = {}
    const put = (header: string, value: unknown) => {
      if (value !== undefined && value !== null && value !== '') row[header] = value
    }
    config.columns.forEach((column) =>
      put(column.header, toExcelValue(column, typeValue, item[column.key]))
    )
    price.forEach((column) => put(column.header, item[column.key]))
    ;(config.trailing ?? []).forEach((column) =>
      put(column.header, toExcelValue(column, typeValue, item[column.key]))
    )
    return row
  })
}

/**
 * Rows read from Excel -> records for the import API. Understands Russian headers/values as well
 * as the old english keys/values; anything it doesn't recognise is passed through unchanged.
 */
export const fromExcelRows = (
  rows: Record<string, unknown>[],
  config: IPriceExcelConfig
): Record<string, unknown>[] => {
  const { fixed, fixedLookup, priceLookup, priceLookupByType } = buildSchema(config)
  const columnByKey = new Map(fixed.map((it) => [it.key, it]))
  const typeColumn = columnByKey.get('type')

  return rows.map((row) => {
    const entries = Object.entries(row)
    let typeValue: string | undefined
    if (typeColumn) {
      const raw = entries.find(([header]) => fixedLookup.get(norm(header)) === 'type')?.[1]
      if (raw !== undefined) typeValue = String(toDbValue(typeColumn, undefined, raw))
    }
    const priceForType = typeValue ? priceLookupByType[typeValue] : undefined

    const result: Record<string, unknown> = {}
    entries.forEach(([header, value]) => {
      const n = norm(header)
      const fixedKey = fixedLookup.get(n)
      if (fixedKey) {
        const column = columnByKey.get(fixedKey) as IColumn
        result[fixedKey] = toDbValue(column, typeValue, value)
        return
      }
      const priceKey = priceForType?.get(n) ?? priceLookup.get(n)
      result[priceKey ?? header] = value
    })
    return result
  })
}
