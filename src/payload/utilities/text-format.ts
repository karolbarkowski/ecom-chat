const dateToFormattedString = (dateString: string | null | undefined) =>
  dateString ? new Date(dateString).toLocaleDateString('en-GB').replace(/\//g, '.') : ''

const numberToFormattedString = (value: number | null | undefined) =>
  value ? `$${value.toFixed(2)}` : '$0.00'

export { dateToFormattedString, numberToFormattedString }
