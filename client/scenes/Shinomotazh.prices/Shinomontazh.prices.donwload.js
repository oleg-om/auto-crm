// Shared by client/components/materials/material.download-button.tsx,
// client/components/stoprices/stoprice.download-button.tsx and
// client/components/shinomontazhprices/shinomontazhprice.download-button.tsx.
// eslint-disable-next-line import/prefer-default-export
export function deleteKeys(myObj, array) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-param-reassign
    delete myObj[array[index]]
  }
  return myObj
}
