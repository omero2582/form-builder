import { z } from "zod";

// export const myFormSchema = z.object({
// });

export type FieldSchema = {
  name: string,
  placeholder?: string
  type: "string" | "number" | "email" | "boolean"  | "password"
  | "textarea" | "select" | "checkbox" | "radio" | "date" | "file"
  required?: boolean,
  min?: number,
  max?: number,
};

export type FormSchema = {
  name: string,
  description?: string,
  fields: FieldSchema[],
};

export const parseJsonToZodSchema = (jsonSchema: FormSchema) => {
  const shape: Record<string, any> = {};

  jsonSchema.fields.forEach((field) => {
    let zodField;

    switch (field.type) {
      case "string":
      case "textarea":
      case "password":
        zodField = z.string();
        break;
      case "email":
        zodField = z.string().email();
        break;
      case "number":
        zodField = z.coerce.number();
        if (field.min !== undefined) zodField = zodField.min(field.min);
        if (field.max !== undefined) zodField = zodField.max(field.max);
        break;
      case "boolean":
        zodField = z.boolean();
        break;
      default:
        throw new Error(`Custom from field type: ${field.type}, not supported`);
    }

    if (field.required) {
      shape[field.name] = zodField;
    } else {
      shape[field.name] = zodField.optional();
    }
  });

  return z.object(shape);
};

// export type TMyFormSchema = z.infer<typeof myFormSchema>;