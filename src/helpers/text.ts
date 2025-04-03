import { BN, DECIMALS } from '@distributedlab/tools'

export const trimLeadingZeroes = (value: string): string => {
  if (value === '0') {
    return value
  }
  return value.replace(/^0+(?=\d)/, '')
}

export const trimTrailingZeroes = (value: string): string => {
  if (value === '0') {
    return value
  }
  return value.replace(/0+$/, '')
}

export const sanitizeNumberString = (value: string): string => {
  if (!value.includes('.')) {
    return value
  }
  if (value.charAt(value.length - 1) === '.') {
    return value + '0'
  }
  const inputDecimals =
    value.split('.')[1].length < DECIMALS.WEI ? value.split('.')[1].length : DECIMALS.WEI
  return BN.fromRaw(value, inputDecimals).toString()
}

export const hexToAscii = (hex: string) => {
  const str = hex.replace(/^0x/, '')
  let result = ''
  for (let i = 0; i < str.length; i += 2) {
    result += String.fromCharCode(parseInt(str.slice(i, i + 2), 16))
  }
  return result
}
