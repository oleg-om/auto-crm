// Shared by client/components/materials/material.download-button.tsx,
// client/components/stoprices/stoprice.download-button.tsx and
// client/components/shinomontazhprices/shinomontazhprice.download-button.tsx.
export function deleteKeys(myObj, array) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-param-reassign
    delete myObj[array[index]]
  }
  return myObj
}

// Column order for XLSX.utils.json_to_sheet: keys in order of first appearance across rows, with
// `lastKey` always moved to the end (kept even when no row has a value for it).
export function headersWithLast(rows, lastKey) {
  const headers = []
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== lastKey && !headers.includes(key)) headers.push(key)
    })
  })
  return [...headers, lastKey]
}
