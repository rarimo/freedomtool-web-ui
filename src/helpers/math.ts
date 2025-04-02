import { BigNumberish, formatUnits, getBigInt } from 'ethers'

export const isZero = (value: BigNumberish) => getBigInt(value) === 0n

export const parseBigIntToInteger = (value: BigNumberish) => formatUnits(value, 18).split('.')[0]
