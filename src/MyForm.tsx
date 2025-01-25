import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { myFormSchemaNoImage, TMyFormSchema, TMyFormSchemaNoImage } from './types';

export default function MyForm() {
  const formHookReturn = useForm<TMyFormSchema>({
    // resolver: zodResolver(productSchemaNoImage)
    resolver: zodResolver(z.preprocess((data) => {
      // removes empty input fields, which default to '' (empty string) on html
      const out = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );
      console.log('Values', out);
      return out;
    }, myFormSchemaNoImage)),
    defaultValues: {
      categories:  [],
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
      MY FORM
      <div className="grid">
        <div className="grid relative">
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
      </div>
      <button className='p-2 bg-slate-700 text-white' type='submit'>Submit</button>
    </form>
  )
}
