import { z } from 'zod'

export const receiptSchema = z.object({
  person: z.string().min(1, 'Selecione tipo de persona'),
  rfc: z.string().min(3, 'El RFC debe tener minimo 3 caracteres'),
  name: z.string().min(1, 'Es requerido'),
  regimen: z.string().min(1, 'El regimen es requerido'),
  cfdi: z.string().min(1, 'El uso de CFDI es requerido'),
  cp: z.string().min(1, 'El código postal es requerido'),
  email: z.email('Correo no valido'),
})
