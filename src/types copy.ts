import { z } from "zod";

export const myFormSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1, "Name is required").max(200),
  // imageId: z.string({ required_error: "imageId is required" }).min(1, "imageId is required"),
  images: z.array(
    z.object({
      publicId: z.string({ required_error: "publicId is required" }).min(1, "publicId is required"),
      order: z.number().int().nonnegative(),
    })
  ).nonempty()
    .max(10)
    .transform((arr => {
      const sorted = [...arr].sort((a, b) => a?.order - b?.order);
      const ordered = sorted.map((img, index) => ({...img, order: index + 1}))
      return ordered;
    }
  )),
  description: z.string().max(2000).optional(),
  visibility: z.enum(['public', 'private']).default('public').optional(),
  // price: z.coerce.number().int().optional(),
  price: z.coerce
  .number({ invalid_type_error: 'Price must be a number' })
  // .positive('Price must be a positive number')
  .nonnegative('Price must be a positive number')
  .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
    message: 'Price must have up to 2 decimal places',
  })
  .optional(),
  categories: z.array(z.string()).max(10)
  .default([])
  // price: z.union([z.number().positive(), z.nan()]).optional()
});

export const myFormSchemaNoImage = myFormSchema.omit({images: true});
export type TMyFormSchema = z.infer<typeof myFormSchema>;
export type TMyFormSchemaNoImage = z.infer<typeof myFormSchemaNoImage>;