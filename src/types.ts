import { z } from "zod";
import { nanoid } from 'nanoid';

// export const myFormSchema = z.object({
// });

export const typeConfig = {
  string: { zodType: () => z.string(), new: () => ({ type: "string", id: `string-${nanoid(8)}`, placeholder: 'my text', label: 'Text:' }) },
  email: { zodType: () => z.string().email(), new: () => ({ type: "email", id: `email-${nanoid(8)}`, placeholder: 'abc@example.com', label: 'Email:' }) },
  number: { zodType: () => z.coerce.number(), new: () => ({ type: "number", id: `number-${nanoid(8)}`, placeholder: '10', label: 'Number:' })  },
  password: { zodType: () => z.string(), new: () => ({ type: "password", id: `password-${nanoid(8)}`, placeholder: 'password', label: 'Password:' })  },
  
  date: { zodType: () => z.coerce.date(), new: () => ({ type: "date", id: `date-${nanoid(8)}` }) , label: 'Date:'},
  
  select: { zodType: () => z.string(), new: () => ({ type: "select", options: [{label: 'option', id: `select-option-${nanoid(8)}`}], id: `select-${nanoid(8)}`,}) , label: 'Dropdown:'},
  textarea: { zodType: () => z.string(), new: () => ({ type: "textarea", id: `textarea-${nanoid(8)}`, placeholder: 'Description', label: 'Text Area:' })  },
  checkbox: { zodType: () => z.boolean(), new: () => ({ type: "checkbox", id: `checkbox-${nanoid(8)}` , label: 'Checkbox'}) },
  radio: { zodType: () => z.string(), new: () => ({ type: "radio", id: `radio-${nanoid(8)}` }) , label: 'Radio:'},
  // file: { zodType: z.instanceof(File), supports: [] },
};

export type FieldSchema = {
  // name: string,
  id: string,
  placeholder?: string
  type: keyof typeof typeConfig,
  
  // "string" | "number" | "email"  | "password"
  // | "textarea" | "select" | "checkbox" | "radio" | "date" | "file"
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
  const shape = {};

  jsonSchema.fields.forEach((field) => {
    // let zodField;

    // switch (field.type) {
    //   case "string":
    //   case "textarea":
    //   case "password":
    //     zodField = z.string();
    //     break;
    //   case "email":
    //     zodField = z.string().email();
    //     break;
    //   case "number":
    //     zodField = z.coerce.number();
    //     if (field.min !== undefined) zodField = zodField.min(field.min);
    //     if (field.max !== undefined) zodField = zodField.max(field.max);
    //     break;
    //   default:
    //     throw new Error(`Custom from field type: ${field.type}, not supported`);
    // }

    // if (!field.required){
    //   zodField = zodField.optional();
    // }

    // shape[field.name] = zodField;

    const config = typeConfig[field.type];

    if (!config) {
      throw new Error(`Custom from field type: ${field.type}, not supported`);
    }

    let zodField = config.zodType();

    // if (config.supports.includes("min") && field.min !== undefined) {
    //   zodField = zodField().min(field.min);
    // }

    // if (config.supports.includes("max") && field.max !== undefined) {
    //   zodField = zodField().max(field.max);
    // }
      // Dynamically check for the existence of the `min` method
    if (typeof zodField.min === "function" && field.min !== undefined) {
      zodField = zodField.min(field.min);
    }

    // Dynamically check for the existence of the `max` method
    if (typeof zodField.max === "function" && field.max !== undefined) {
      zodField = zodField.max(field.max);
    }

    if (field.required) {
      shape[field.id] = zodField;
    } else {
      shape[field.id] = zodField.optional();
    }
  });

  return z.object(shape);
};

// export type TMyFormSchema = z.infer<typeof myFormSchema>;