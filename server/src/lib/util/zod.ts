import * as z from 'zod'

export function toSchema<T extends z.ZodType>(schema: T, value: z.infer<T> | any) {
  return schema.parse(value)
}

export const ISODateTime = z.codec(z.date(), z.iso.datetime(), {
  decode: date => date.toISOString(),
  encode: str => new Date(str),
})
