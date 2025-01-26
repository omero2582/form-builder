import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { parseJsonToZodSchema, TMyFormSchema,} from './types';
import { useAppDispatch, useAppSelector } from './store/store';
import {selectEditField } from './store/slices/general';

export default function MyForm() {
  // Example JSON schema
  const jsonSchema = useAppSelector((state) => state.newForm);

  const zodSchema = parseJsonToZodSchema(jsonSchema);

  const formHookReturn = useForm({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (empty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      console.log('Values', out);
      return out;
    }, zodSchema)),
    defaultValues: {
      // categories:  [],
      // TODO starter vals here ??
    }, mode: 'onChange' // TODO, this is new
  });

  const {
    watch, reset, register, getValues, handleSubmit, setFocus,
    setError, control,setValue, trigger,
    formState: {errors, isSubmitting, isDirty},
} = formHookReturn;
  
  const onSubmit = async (body: TMyFormSchema) => {
    console.log('SUBMIT', body);
    reset();
  }



  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      Form Builder
      {jsonSchema.fields.map((f, i) => (
        <FieldRender f={f} key={i} errors={errors} register={register}/>
      ))}
      <button className='p-2 bg-slate-700 text-white' type='submit'>Submit</button>
    </form>
  )
}

function FieldRender({f, errors, register}) {
  const dispatch = useAppDispatch();

  const onEditField = (f) => {
    console.log(`Editing ${f.id}`, f)
    dispatch(selectEditField(f))
  }

  // TODO
  // if f.type === select, radio, checkbox, textarea

  if(f.type ===  'select'){
    return (
      <div className="grid">
      <div className="grid">
        <label htmlFor={f.id} className="sr-only">
          {f.id}:
        </label>
        {/* <input
          type={f.type} 
          placeholder={f.placeholder || f.id}
          id={f.id}
          className={`peer border-gray-400 border rounded-md p-[8px] leading-[16px] `}
          {...register(f.id)}
          onFocus={() => onEditField(f)}
        /> */}
        <select name={f.id} id={f.id} onFocus={() => onEditField(f)}>
          {f.options.map(o => (
            <option key={o.id} value={o.label}>{o.label}</option>
          ))}
        </select>
      </div>
      {errors && errors[f.id] && <p className="text-red-600">{`${errors[f.id].message}`}</p>}
    </div>
    )
  }

  return (
    <div className="grid">
      <div className="grid">
        <label htmlFor={f.id} className="sr-only">
          {f.id}:
        </label>
        <input
          type={f.type} 
          placeholder={f.placeholder || f.id}
          id={f.id}
          className={`peer border-gray-400 border rounded-md p-[8px] leading-[16px] `}
          {...register(f.id)}
          onFocus={() => onEditField(f)}
        />
      </div>
      {errors && errors[f.id] && <p className="text-red-600">{`${errors[f.id].message}`}</p>}
    </div>
  )
}

{/* <div className="grid">
  <div className="grid">
    <label htmlFor={'name'} className="sr-only">
      {'name'}:
    </label>
    <input
      type='text' 
      placeholder='name'
      id='name'
      className={`peer border-gray-400 border rounded-md p-[8px] leading-[16px] `}
      {...register("name")}
    />
  </div>
  {errors && errors['name'] && <p className="text-red-600">{`${errors['name'].message}`}</p>}
</div> */}