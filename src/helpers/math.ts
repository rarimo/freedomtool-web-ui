import { BigNumberish, formatUnits, getBigInt } from 'ethers'

export const isZero = (value: BigNumberish) => getBigInt(value) === 0n

export const parseBigIntToInteger = (value: BigNumberish) =>
  Math.floor(Number(formatUnits(value, 18)))
