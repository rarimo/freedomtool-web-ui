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
    address: '0x00',
    iconName: Icons.Bitcoin,
  },
  {
    name: 'ETH (Ethereum)',
    symbol: 'ETH',
    address: '0x01',
    iconName: Icons.Ethereum,
  },
  {
    name: 'USDC (ERC-20)',
    symbol: 'USDC',
    address: '0x02',
    iconName: Icons.Usdc,
  },
]
