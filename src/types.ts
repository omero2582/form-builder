import { z } from "zod";

export const myFormSchema = z.object({
});

type FieldSchema = {
  name: string;
  type: "string" | "number" | "email" | "boolean";
  required: boolean;
  min?: number;
  max?: number;
};

type FormSchema = {
  fields: FieldSchema[];
};

const parseJsonToZodSchema = (jsonSchema: FormSchema) => {
  const shape: Record<string, any> = {};

  jsonSchema.fields.forEach((field) => {
    let zodField;

    switch (field.type) {
      case "string":
        zodField = z.string();
        break;
      case "email":
        zodField = z.string().email();
        break;
      case "number":
        zodField = z.number();
        if (field.min !== undefined) zodField = zodField.min(field.min);
        if (field.max !== undefined) zodField = zodField.max(field.max);
        break;
      case "boolean":
        zodField = z.boolean();
        break;
      default:
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    if (field.required) {
      shape[field.name] = zodField;
    } else {
      shape[field.name] = zodField.optional();
    }
  });

  return z.object(shape);
};

export type TMyFormSchema = z.infer<typeof myFormSchema>;