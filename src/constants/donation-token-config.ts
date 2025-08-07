import { Icons } from '@/enums'

export interface DonationToken {
  iconName: Icons
  name: string
  symbol: string
  address: string
}

export const donationTokens: DonationToken[] = [
  {
    name: 'BTC (Bitcoin)',
    symbol: 'BTC',
    address: 'bc1q4u7ecz9hlk6exc22v5hz62l54w7g0fvl0d2yh6',
    iconName: Icons.Bitcoin,
  },
  {
    name: 'ETH (Ethereum)',
    symbol: 'ETH',
    address: '0x97Aff1180f0A307e7456e65b29a3A6D7D71f5140',
    iconName: Icons.Ethereum,
  },
  {
    name: 'USDC (ERC-20)',
    symbol: 'USDC',
    address: '0x97Aff1180f0A307e7456e65b29a3A6D7D71f5140',
    iconName: Icons.Usdc,
  },
]
