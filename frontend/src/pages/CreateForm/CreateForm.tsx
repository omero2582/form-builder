import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { parseJsonToZodSchema} from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {selectEditField, setSidePanel, toggleSidePanel } from '../../store/slices/general';
import SidePanel from './SidePanel';
import { useEditFormMutation, useGetFormByIdQuery } from '../../store/api/apiSlice';
import { useParams } from 'react-router-dom';
import { getDateSimple, getDateSocials } from '../../utils/utils';
import { useEffect } from 'react';
import { updateForm } from '../../store/slices/formToSubmitSlice';
import { useDispatch } from 'react-redux';

export default function CreateForm() {
  const dispatch = useAppDispatch();
  const showSidePanel = useAppSelector((state) => state.general.showSidePanel);
  
  const { id } = useParams();
  console.log(id)
  const {data, isLoading, error} = useGetFormByIdQuery({id});

  const formToSubmit = useAppSelector((state) => state.formToSubmit);
  
  // console.log('formTOSubmit', formToSubmit)

  useEffect(() => {
    if(data){
      // console.log('Udpate', data)
      dispatch(updateForm(data?.form))
    }
  }, [data])


  if(isLoading){
    return <p>Loading...</p>
  }

  if(error){
    return <p>Error</p>
  }

  if(!formToSubmit){
    return null
  }



  return (
    <div className='flex min-h-[100vh]'>
      <div className='flex-1 grid justify-center content-center'>
        {/* <MyForm formSchema={data.form}/> */}
        <MyForm formSchema={formToSubmit}/>
        <button 
          onClick={() => dispatch(toggleSidePanel())}
          className='p-2 bg-slate-700 hover:bg-slate-800 text-gray-50'
        >
          {showSidePanel ? 'Hide Side Panel' : 'Show Side Panel'}
        </button>
      </div>
      <div className={`flex-shrink-0 transition-[width]  ${showSidePanel ? 'w-[200px] px-3 border-r-[1.5px] border-neutral-300' : 'w-0'}`}>
        {showSidePanel && 
        <SidePanel/>}
      </div>
    </div>
  )
}


export function MyForm({formSchema}) {
  // Example JSON schema
  // const formSchema = useAppSelector((state) => state.newForm);
  console.log('FORM SCHEMA', formSchema)
  const zodSchema = parseJsonToZodSchema(formSchema);

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
      // starter vals here ??
    }, 
    // mode: 'onChange'
    mode: 'onSubmit'
  });

  const {
    watch, reset, register, getValues, handleSubmit, setFocus,
    setError, control,setValue, trigger,
    formState: {errors, isSubmitting, isDirty},
} = formHookReturn;
  
const dispatch = useAppDispatch();
const [editForm, resEditForm] = useEditFormMutation()
const formToSubmit = useAppSelector((state) => state.formToSubmit);

  const onSubmit = async (body: TMyFormSchema) => {
    // console.log('SUBMIT', body);
    // body contains the name/value pairs from the actual form. It does not contain
    // the form we have been building
  }
  
  // This is what we actually want though. formToSubmit is the form we have been
  // building using redux state. We send this to our backend to save our custom form
  const onSaveChanges = async () => {
    // console.log('SUBMIT', formToSubmit)
    dispatch(editForm({id: formSchema.id, body: formToSubmit}))
    reset();
  }


  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className='grid'>
      <h1 className='text-[2rem] font-medium tracking-wide'>Form Builder</h1>
      {formSchema.fields.map((f, i) => (
        <FieldRender f={f} key={i} errors={errors} register={register}/>
      ))}
      <p className='mt-1 mb-[10px]'>Last Updated: {getDateSocials(formSchema.updatedAt)}</p>
      <div className='grid grid-flow-col gap-x-3'>
        <button
          className='p-2 bg-blue-600 hover:bg-blue-700 text-white'
          type='button'
          onClick={() => onSaveChanges()}
        >
          Save Changes
        </button>
        <button
          className='p-2 bg-blue-600 hover:bg-blue-700 text-white'
          type='submit'
        >
          Test Validation
        </button>
      </div>
    </form>
  )
}

function FieldRender({f, errors, register}) {
  const dispatch = useAppDispatch();

  const onEditField = (f) => {
    console.log(`Editing ${f.id}`, f)
    dispatch(selectEditField(f))
    dispatch(setSidePanel(true))
  }

  // TODO
  // if f.type === checkbox

  if(f.type === 'textarea'){
    return (
      <div className="grid">
        <div className="grid">
          <label htmlFor={f.id} className="sr-only">
            {f.id}:
          </label>
          <textarea
            spellCheck={false}
            className={`border-gray-400 border rounded-md resize-none peer p-[6px] `}
            id={f.id}
            placeholder={f.placeholder}
            cols={50} rows={4} 
            {...register(f.id)}
            onFocus={() => onEditField(f)}
          />    
        </div>
        {errors && errors[f.id] && <p className="text-red-600">{`${errors[f.id].message}`}</p>}
      </div>
    )
  }

  if(f.type ===  'select'){
    return (
      <div className="grid">
        <div className="grid">
          <label htmlFor={f.id} className="sr-only">
            {f.id}:
          </label>
          <select name={f.id} id={f.id} onFocus={() => onEditField(f)}
            {...register(f.id)}
            className={`peer border-gray-400 border rounded-md p-[8px] leading-[16px] `}
          >
            {f.options.map(o => (
              <option key={o.id} value={o.label}>{o.label}</option>
            ))}
          </select>
        </div>
      {errors && errors[f.id] && <p className="text-red-600">{`${errors[f.id].message}`}</p>}
    </div>
    )
  }

  if(f.type ===  'radio'){
    return (
      <div className="grid">
      <div className="grid">
        <label htmlFor={f.id} className="sr-only">
          {f.id}:
        </label>
        {f.options.map(o => (
          <label key={o.id}>
            {o.label}
            <input type='radio' name={f.id} id={o.id} value={o.label} onFocus={() => onEditField(f)}
            {...register(f.id)}
            // className={`peer border-gray-400 border rounded-md p-[8px] leading-[16px] `}
            />
          </label>
        ))}
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
          className={`border-gray-400 border rounded-md p-[8px] leading-[16px] `}
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