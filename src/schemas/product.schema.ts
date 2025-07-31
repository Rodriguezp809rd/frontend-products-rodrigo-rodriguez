import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(3, { message: 'El ID debe tener al menos 3 caracteres.' }).max(10, { message: 'El ID no puede tener más de 10 caracteres.' }),
  name: z.string().min(5, { message: 'El nombre debe tener al menos 5 caracteres.' }).max(100, { message: 'El nombre no puede tener más de 100 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }).max(200, { message: 'La descripción no puede tener más de 200 caracteres.' }),
  logo: z.string().url({ message: 'La URL del logo no es válida.' }),
  date_release: z.string().refine((val) => new Date(val).getTime() >= new Date().setHours(0, 0, 0, 0), {
    message: 'La fecha de lanzamiento debe ser hoy o posterior.',
  }),
  date_revision: z.string(),
}).superRefine((data, ctx) => {
  const release = new Date(data.date_release);
  const revision = new Date(data.date_revision);

  const isExactlyOneYearLater =
    revision.getFullYear() === release.getFullYear() + 1 &&
    revision.getMonth() === release.getMonth() &&
    revision.getDate() === release.getDate();

  if (!isExactlyOneYearLater) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['date_revision'],
      message: 'La fecha de revisión debe ser exactamente un año después de la fecha de lanzamiento.',
    });
  }
});


export type ProductFormData = z.infer<typeof productSchema>;
