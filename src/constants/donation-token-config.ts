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
    address: 'bc1qzqwnvcmxd7n3fpa7mqcvlnprrtcp5hrt649ut7',
    iconName: Icons.Bitcoin,
  },
  {
    name: 'ETH (Ethereum)',
    symbol: 'ETH',
    address: '0x9Dc54bB3Ea2EBdACA4c6f86647FBE09FFaE3BCee',
    iconName: Icons.Ethereum,
  },
  {
    name: 'USDC (ERC-20)',
    symbol: 'USDC',
    address: '0x9Dc54bB3Ea2EBdACA4c6f86647FBE09FFaE3BCee',
    iconName: Icons.Usdc,
  },
]
