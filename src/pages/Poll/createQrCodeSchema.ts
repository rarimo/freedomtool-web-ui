import { z as zod } from 'zod'

export const createQrCodeDefaultValues: CreateQrCodeSchema = {
  name: '',
  endDate: '',
  scanLimit: '',
}

export const createQrCodeSchema = zod.object({
  name: zod.string().min(1).max(30).or(zod.literal('')).optional(),
  endDate: zod.string().min(1).or(zod.literal('')).optional(),
  scanLimit: zod.coerce.number().min(2).max(100_000).int().or(zod.literal('')).optional(),
})

export type CreateQrCodeSchema = zod.infer<typeof createQrCodeSchema>
