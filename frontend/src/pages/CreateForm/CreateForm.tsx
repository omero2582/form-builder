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
import {DndContext, DragEndEvent, useDroppable} from '@dnd-kit/core';

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

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event
    // active is the data we are dragging. Over is the data we are dragging over

    if (!over) return;

    // console.log('DROP', active, over)

    active.data?.current?.onClick()

    // TODO maybe instead pass into active an acive.dropFunction(), and have the
    // compeoinet apsss in a function

    // Why? Because otherwise how do I kow which distpacth(addInput()) to call ??
    // I can maybe create a new dispatch(addAnyInput(myInputType))
    // and maybe this redux action usese the parameter you pass in to determine
    // which redux reducer to run, but dont know...
    // if I can just pass a function from the active (in sidebar component),
    // then I think that is easier

  }

  return (
    <div className='flex min-h-[100vh]'>
      <DndContext onDragEnd={handleDragEnd}>
      <div className='flex-1 grid justify-center content-center'>
        {/* <MyForm formSchema={data.form}/> */}
        <MyForm formSchema={formToSubmit}/>
      </div>
      <div className={`flex-shrink-0 transition-[width]  ${showSidePanel ? 'w-[200px] pr-3 border-r-[1.5px] border-neutral-300' : 'w-0'}`}>
        {showSidePanel && 
        <SidePanel/>}
      </div>
      </DndContext>
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
    setError, control,setValue, trigger, clearErrors,
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

 

  const {setNodeRef} = useDroppable({id: 'droppable'})
  // what you pass in here, will be the 'over' in handleDragEnd
  const showSidePanel = useAppSelector((state) => state.general.showSidePanel);

  return (
    
      <form ref={setNodeRef} noValidate onSubmit={handleSubmit(onSubmit)} className='grid'>
          <h1 className='my-2 text-[2rem] font-medium tracking-wide text-center'>
            Form Builder
          </h1>
        <div className='grid gap-y-1'>
          {formSchema.fields.map((f, i) => (
              <FieldRender f={f} key={i} errors={errors} register={register}/>
            ))}
        </div>
        <p className='mt-1 mb-[10px]'>Last Updated: {getDateSocials(formSchema.updatedAt)}</p>
        <button 
          onClick={() => dispatch(toggleSidePanel())}
          className='p-2 bg-slate-700 hover:bg-slate-800 text-gray-50'
          type='button'
        >
          {showSidePanel ? 'Hide Side Panel' : 'Edit'}
        </button>
        <div className='grid grid-flow-col gap-x-3'>
          <button
            className='p-2 text-white bg-blue-600 hover:bg-blue-700 '
            type='button'
            onClick={() => onSaveChanges()}
          >
            Save Changes
          </button>
        </div>
        <p className='text-center text-[1.05rem] mt-1 mb-3'>
          {`Click 'Apply' before 'Save Changes' =>`}
        </p>
        
        <div className=' space-x-[10px] grid grid-flow-col'>
          <button
            className='p-2 bg-blue-600 hover:bg-blue-700 text-white'
            type='submit'
          >
            Test Validation
          </button>
        <button 
          onClick={() => clearErrors()}
          className='p-2 bg-slate-700 hover:bg-slate-800 text-gray-50'
          type='button'
        >
          Clear Errors
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
        <div className="grid gap-x-2 grid-flow-col items-center justify-start">
          <label htmlFor={f.id} className=" overflow-ellipsis overflow-hidden">
            {f.label}
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
        <label htmlFor={f.id} className="overflow-ellipsis overflow-hidden">
          {f.label}
        </label>
        {f.options.map(o => (
          <label key={o.id} className=''>
            <input type='radio' name={f.id} id={o.id} value={o.label} onFocus={() => onEditField(f)}
            {...register(f.id)}
            // className={`peer border-gray-400 border rounded-md p-[8px] leading-[16px] `}
            />
            {o.label}
          </label>
        ))}
      </div>
      {errors && errors[f.id] && <p className="text-red-600">{`${errors[f.id].message}`}</p>}
    </div>
    )
  }

  return (
    <div className="grid">
      <div className="grid grid-flow-col items-center gap-x-2">
        <label htmlFor={f.id} className="text-end w-[100px] overflow-ellipsis overflow-hidden">
          {f.label}
        </label>
        <input
          type={f.type} 
          placeholder={f.placeholder || f.id}
          id={f.id}
          className={`w-[205px] border-gray-400 border rounded-md p-[8px] leading-[16px] `}
          {...register(f.id)}
          onFocus={() => onEditField(f)}
        />
      </div>
      {errors && errors[f.id] && <p className="text-red-600 text-end">{`${errors[f.id].message}`}</p>}
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