import resources from '@/locales/resources'

export type ColorString = string

export type I18nKey<S extends string> = DeepKeys<typeof resources.en.translation, S>

type DeepKeys<T, S extends string> = T extends object
  ? S extends `${infer I1}.${infer I2}`
    ? I1 extends keyof T
      ? `${I1}.${DeepKeys<T[I1], I2>}`
      : keyof T & string
    : S extends keyof T
      ? `${S}`
      : keyof T & string
  : ''
