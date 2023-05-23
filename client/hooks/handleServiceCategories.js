import { useEffect, useState } from 'react'

export function useServiceCategories(actualServicePrice, chosenServices) {
  const [category, setCategory] = useState('')

  const categoryList = actualServicePrice.reduce((acc, rec) => {
    if (!acc.find((it) => it === rec.category)) {
      return [...acc, rec.category].sort((a, b) => a.localeCompare(b))
    }
    return acc
  }, [])

  useEffect(() => {
    if (categoryList && categoryList.length > 0 && !category) {
      if (chosenServices?.length) {
        setCategory('choosen')
      } else {
        setCategory(categoryList[0])
      }
    }
    return () => {}
  }, [categoryList])

  return { category, setCategory, categoryList }
}

export default useServiceCategories
