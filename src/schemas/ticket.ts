import { z } from 'zod'

export const ticketSchema = z.object({
  ticket: z.string().min(1, 'El ticket es requerido'),
  date: z.string().min(1, 'La fecha es requerido'),
  total: z.number().min(1, 'El total es requerido'),
})
