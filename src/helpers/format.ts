import {
  BN,
  BN_ROUNDING,
  BnConfigLike,
  BnFormatConfig,
  BnLike,
  DECIMALS,
  time,
  TimeDate,
} from '@distributedlab/tools'
import { t } from 'i18next'

import { Sex } from '@/types'
// Date
export function formatDateMY(date: TimeDate) {
  return time(date).format('MM / YYYY')
}

export function formatDateDMY(date: TimeDate) {
  return time(date).format('DD MMM, YYYY')
}

export function formatDateTime(date: TimeDate) {
  return time(date).format('MM/DD/YYYY HH:mm')
}

export function formatUtcDateTime(date: TimeDate) {
  return formatDateTime(time(date).utc())
}

export function formatDateDM(date: TimeDate) {
  return time(date).format('D MMM')
}
export function formatTimeFromNow(date: TimeDate, config: { suffix: boolean } = { suffix: false }) {
  /*
   * In our library, there is no built-in support for formatting relative time like in Day.js.
   * For reference, check Day.js documentation:
   * https://day.js.org/docs/en/plugin/relative-time
   *
   * Example usage in Day.js:
   * dayjs().from(dayjs("1990-01-01")); // "in 31 years"
   * dayjs().from(dayjs("1990-01-01"), true); // "31 years"
   */
  const dateWithSuffix = time(date).fromNow
  return config.suffix ? dateWithSuffix : dateWithSuffix.replace(/^in\s/, '')
}

export const formatDateHM = (date: TimeDate) => {
  return time(date).format('HH:mm')
}

export const formatPercentAmount = (value?: BnLike | null) => {
  const percentBn = BN.fromBigInt(value ?? '0').mul(BN.fromRaw(100))
  return `${formatAmount(percentBn, 18, { decimals: 2 })}%`
}

// number
const defaultBnFormatConfig: BnFormatConfig = {
  decimals: 2,
  groupSeparator: ',',
  decimalSeparator: '.',
  fractionGroupSeparator: '',
  fractionGroupSize: 3,
}

BN.setConfig({
  rounding: BN_ROUNDING.DOWN,
})

/**
 * Format human amount without trailing zeros
 * @param amount
 */
function removeTrailingZeros(amount: string) {
  const [integer, fraction] = amount.split('.')

  if (!fraction) return integer

  let result = integer

  for (let i = fraction.length - 1; i >= 0; i--) {
    if (fraction[i] !== '0') {
      result += `.${fraction.slice(0, i + 1)}`
      break
    }
  }

  return result
}

/**
 * Format human amount with prefix
 * @param value
 */
function convertNumberWithPrefix(value: string) {
  const M_PREFIX_AMOUNT = 1_000_000
  const B_PREFIX_AMOUNT = 1_000_000_000
  const T_PREFIX_AMOUNT = 1_000_000_000_000

  const getPrefix = (value: number): 'M' | 'B' | 'T' | '' => {
    if (value >= T_PREFIX_AMOUNT) return 'T'
    if (value >= B_PREFIX_AMOUNT) return 'B'
    if (value >= M_PREFIX_AMOUNT) return 'M'

    return ''
  }

  const prefix = getPrefix(+value)

  const divider = {
    M: M_PREFIX_AMOUNT,
    B: B_PREFIX_AMOUNT,
    T: T_PREFIX_AMOUNT,
    '': 1,
  }[prefix]

  const finalAmount = BN.fromRaw(Number(value) / divider, 3).format({
    decimals: 3,
    groupSeparator: '',
    decimalSeparator: '.',
  })

  return `${removeTrailingZeros(finalAmount)}${prefix}`
}

export function formatNumber(value: string | number, formatConfig?: BnFormatConfig) {
  try {
    const formatCfg = formatConfig || {
      ...defaultBnFormatConfig,
    }

    return removeTrailingZeros(BN.fromRaw(value).format(formatCfg))
  } catch {
    return '0'
  }
}

export function formatCroppedString(value: string, length = 6) {
  return value.slice(0, length) + '...' + value.slice(-length)
}

export function formatAmount(
  amount: BnLike,
  decimalsOrConfig?: BnConfigLike,
  formatConfig: BnFormatConfig = { decimals: 4 },
) {
  try {
    const decimals =
      typeof decimalsOrConfig === 'number' ? decimalsOrConfig : decimalsOrConfig?.decimals

    const formatCfg = {
      ...defaultBnFormatConfig,
      ...(decimals && { decimals }),
      ...formatConfig,
    }

    return removeTrailingZeros(BN.fromBigInt(amount, decimalsOrConfig).format(formatCfg))
  } catch {
    return '0'
  }
}

export function formatBalance(
  amount: BnLike,
  decimalsOrConfig?: BnConfigLike,
  formatConfig?: BnFormatConfig,
) {
  try {
    const decimals =
      typeof decimalsOrConfig === 'number' ? decimalsOrConfig : decimalsOrConfig?.decimals

    const formatCfg = formatConfig || {
      ...defaultBnFormatConfig,
      ...(decimals && { decimals }),
    }

    return convertNumberWithPrefix(formatAmount(amount, decimalsOrConfig, formatCfg))
  } catch {
    return '0'
  }
}

export const formatInput = (value: string) => {
  if (!value.includes('.') || value.charAt(value.length - 1) === '.') {
    return value
  }
  const inputDecimals =
    value.split('.')[1].length < DECIMALS.WEI ? value.split('.')[1].length : DECIMALS.WEI
  return BN.fromRaw(value, inputDecimals).toString()
}

export function formatAmountShort(value: BnLike): string {
  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    console.warn("The value can't be converted to a number properly")
    return '–'
  }

  const bigIntValue = BN.fromBigInt(value)

  // 1,234,000,000 => "1.23B"
  if (bigIntValue.gte(BN.fromRaw(1_000_000_000))) {
    const billions = bigIntValue.div(BN.fromRaw(1_000_000_000))
    return formatAmount(billions, 18, { decimals: 2, suffix: 'B' })
  }

  // 1,234,000 => "1.2M"
  if (bigIntValue.gte(BN.fromRaw(1_000_000))) {
    const millions = bigIntValue.div(BN.fromRaw(1_000_000))
    return formatAmount(millions, 18, { decimals: 1, suffix: 'M' })
  }

  // 1,000-9,999 => "5.4K"
  // 10,000+ => "56K"
  if (bigIntValue.gte(BN.fromRaw(1_000))) {
    const thousands = bigIntValue.div(BN.fromRaw(1_000))
    const decimals = bigIntValue.lte(BN.fromRaw(10_000)) ? 1 : 0
    return formatAmount(thousands, 18, { decimals, suffix: 'K' })
  }

  // 0-999 => "123"
  return formatAmount(bigIntValue, 18)
}

export function formatAddress(address?: string, length: number = 8) {
  return address ? `${address.slice(0, length)}...${address.slice(-length)}` : '–'
}

type Labels = {
  hours: string
  minutes: string
  seconds: string
}

type FormatTimeLeftArgs = {
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  labels?: Labels
}

export const formatTimeLeft = ({
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  labels = { hours: 'h', minutes: 'm', seconds: 's' },
}: FormatTimeLeftArgs): string => {
  const totalHours = hours + days * 24

  const timeUnits = [
    { value: totalHours, label: labels.hours, hidden: totalHours === 0 },
    {
      value: minutes,
      label: labels.minutes,
      hidden: totalHours === 0 && minutes === 0,
    },
    {
      value: seconds,
      label: labels.seconds,
      hidden: totalHours > 0,
    },
  ]

  return timeUnits
    .filter(item => !item.hidden)
    .map(({ value, label }) => `${value}${label}`)
    .join(' ')
}

export const formatTimeLeftNumeric = ({
  hours = 0,
  minutes = 0,
  seconds = 0,
}: FormatTimeLeftArgs): string => {
  const formatWithZeros = (unit: number) => String(unit).padStart(2, '0')

  return `${formatWithZeros(hours)}:${formatWithZeros(minutes)}:${formatWithZeros(seconds)}`
}

export function formatNumberShort(value: BnLike): string {
  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    console.warn("The value can't be converted to a number properly")
    return '–'
  }

  const bigIntValue = BN.fromBigInt(value)

  // 1,234,000,000 => "1.23B"
  if (bigIntValue.gte(BN.fromRaw(1_000_000_000))) {
    const billions = bigIntValue.div(BN.fromRaw(1_000_000_000))
    return formatAmount(billions, 18, { decimals: 2, suffix: 'B' })
  }

  // 1,234,000 => "1.2M"
  if (bigIntValue.gte(BN.fromRaw(1_000_000))) {
    const millions = bigIntValue.div(BN.fromRaw(1_000_000))
    return formatAmount(millions, 18, { decimals: 1, suffix: 'M' })
  }

  // 1,000-9,999 => "5.4K"
  // 10,000+ => "56K"
  if (bigIntValue.gte(BN.fromRaw(1_000))) {
    const thousands = bigIntValue.div(BN.fromRaw(1_000))
    const decimals = bigIntValue.lte(BN.fromRaw(10_000)) ? 1 : 0
    return formatAmount(thousands, 18, { decimals, suffix: 'K' })
  }

  // 0-999 => "123"
  return formatAmount(bigIntValue, 18)
}

export const formatAgeRange = ({
  minAge,
  maxAge,
}: {
  minAge?: number | null
  maxAge?: number | null
}): string | null => {
  if (minAge && !maxAge) {
    return `${minAge}+`
  }

  if (maxAge && !minAge) {
    return t('formats.age.lte', {
      maxAge,
    })
  }

  if (minAge && maxAge) {
    return t('formats.age.gte-and-lte', {
      minAge,
      maxAge,
    })
  }

  return null
}

export const formatSex = (value?: Sex | null) => {
  switch (value) {
    case Sex.Female:
      return t('format.sex.female')
    case Sex.Male:
      return t('format.sex.male')
    default:
      return null
  }
}

export const formatCountry = (countryKey: string, options?: { withFlag?: boolean }): string => {
  const withFlag = options?.withFlag ?? false

  // eslint-disable-next-line react-i18n/no-dynamic-translation-keys
  const name = t(`countries.names.${countryKey}`)
  // eslint-disable-next-line react-i18n/no-dynamic-translation-keys
  const flag = t(`countries.flags.${countryKey}`)

  return withFlag ? `${flag} ${name}` : name
}
