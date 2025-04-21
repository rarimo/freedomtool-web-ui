import { Icons } from '@/enums'

export interface DonateTokenConfig {
  iconName: Icons
  name: string
  symbol: string
  address: string
  type?: string
}

export const donateTokenConfig: DonateTokenConfig[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: '0x00',
    iconName: Icons.Bitcoin,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x01',
    iconName: Icons.Ethereum,
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    address: '0x02',
    type: 'ERC-20',
    iconName: Icons.Usdc,
  },
]
