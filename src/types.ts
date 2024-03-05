export type Config = {
  personId: string
  token: string
}

/**
 * https://docs.humaans.io/api/#me
 * The response obviously contains much more data, but we only care about `id`
 */
export type HumaansMeResponse = {
  id: string
}
