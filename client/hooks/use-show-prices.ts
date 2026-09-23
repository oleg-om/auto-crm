import { useStoredToggle } from './use-stored-toggle'

// Shared across every price list screen (STO, Wash, Window, Cond, Shinomontazh) so toggling
// "Показывать цены" on one page carries over to the others via localStorage.
// eslint-disable-next-line import/prefer-default-export
export const useShowPrices = () => useStoredToggle('priceTables.showPrices')
