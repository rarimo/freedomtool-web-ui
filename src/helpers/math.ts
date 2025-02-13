import { BigNumberish, getBigInt } from 'ethers'

export const isZero = (value: BigNumberish) => getBigInt(value) === 0n
