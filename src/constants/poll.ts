import { parseUnits } from 'ethers'

import { Nationality } from '@/types'

export const MAX_OPTIONS_PER_QUESTION = 8
export const MAX_QUESTIONS = 12

export const ZERO_PROPOSAL_SMT = '0x0000000000000000000000000000000000000000'

export const RARIME_APP_STORE_URL = 'https://apps.apple.com/us/app/rarime/id6503300598'
export const RARIME_GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.rarilabs.rarime'

export const MAX_PARTICIPANTS_PER_POLL = 10_000
export const MAX_TOKEN_AMOUNT_PER_POLL = 10_000

export const MAX_UINT32 = 4294967295

export const ZERO_DATE = '0x303030303030'

export const POLL_MIN_FUNDING_NUMBER = 0.0005
export const POLL_MIN_FUNDING_AMOUNT = parseUnits(String(POLL_MIN_FUNDING_NUMBER), 18)

export const WHITELIST_DATA_ABI_TYPE = {
  type: 'tuple',
  components: [
    { name: 'selector', type: 'uint256' },
    { name: 'nationalities', type: 'uint256[]' },
    { name: 'identityCreationTimestampUpperBound', type: 'uint256' },
    { name: 'identityCounterUpperBound', type: 'uint256' },
    { name: 'sex', type: 'uint256' },
    { name: 'birthDateLowerbound', type: 'uint256' },
    { name: 'birthDateUpperbound', type: 'uint256' },
    { name: 'expirationDateLowerBound', type: 'uint256' },
  ],
} as const

export const ALL_COUNTRIES_NATIONALITY: Nationality = {
  flag: '🌍',
  name: 'All Countries',
  codes: [],
}
