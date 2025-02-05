import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { addTextArea, addDate, addDropbown, addNumber, addRadioButtons, addText, updateFieldById, deleteFieldById } from '../../store/slices/formToSubmitSlice'
import { typeConfig } from '../../types';
import { useDraggable } from '@dnd-kit/core';

function FieldOption({f}){
  const {attributes, listeners, setNodeRef, transform } = useDraggable({data: f, id: f.name});

  const style = transform
  ? {
      transform: `translate(${transform.x}px, ${transform.y}px)`
    }
  : undefined

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className='p-2 rounded-md bg-gray-300'
      onClick={f.onClick}
      style={style}
    >
      {f.name}
    </button>
  )
}

export default function SidePanel() {
  const dispatch = useAppDispatch();
  const fieldOptions = [
    {name: 'text input', onClick: () => (dispatch(addText()))},
    {name: 'number', onClick: () => (dispatch(addNumber()))},
    {name: 'text area', onClick: () => (dispatch(addTextArea()))},
    {name: 'date picker', onClick: () => (dispatch(addDate()))},
    {name: 'dropdown', onClick: () => (dispatch(addDropbown()))},
    {name: 'radio buttons', onClick: () => (dispatch(addRadioButtons()))},
  ]

  const fieldToEdit = useAppSelector((state) => state.general.editField);
  const [fieldEditingChangesToApply, setFieldEditingChangesToApply] = useState(fieldToEdit)

  useEffect(() => {
    setFieldEditingChangesToApply(fieldToEdit)
  }, [fieldToEdit])

  console.log('ed', fieldToEdit, fieldToEdit?.type === 'string' || fieldToEdit?.type === 'email' || fieldToEdit?.type === 'password')
  console.log('state',fieldEditingChangesToApply)

  return (
    <div className='grid'>
      <h2 className='text-[1.1rem] text-center my-2'>Drag and Drop</h2>
      <div className='grid'>
        {fieldOptions.map((f, i) => (
          <FieldOption f={f} key={i}/>
        ))}
      </div>
      <h3 className='mt-2 font-medium text-[1.1rem]'>Input Settings:</h3>
      {!fieldEditingChangesToApply ?
      <p>Focus an input in the builder, to view its settings</p>
      :
      <div>
        {(fieldToEdit?.type === 'string' || fieldToEdit?.type === 'email' || fieldToEdit?.type === 'password') &&
          <label>
            Text Type:
            <select className='bg-white ml-1 text-center border-gray-500 border rounded-sm' value={fieldEditingChangesToApply.type} onChange={(e) => setFieldEditingChangesToApply({...fieldOptions, type: e.target.value})}>
              <option value="string">text</option>
              <option value="email">email</option>
              <option value="password">password</option>
            </select>
          </label>
        }
        {fieldToEdit?.label &&
        <div>
          <label>
            label:
            <input 
              value={fieldEditingChangesToApply?.label}
              onChange={(e) => setFieldEditingChangesToApply(f => ({...f, label: e.target.value}))}
              className='bg-white border-gray-500 border rounded-md p-[4px]'
            />
              
          </label>
        </div>}
        {fieldToEdit?.placeholder &&
        <div>
          <label>
            placeholder:
            <input 
              value={fieldEditingChangesToApply?.placeholder}
              onChange={(e) => setFieldEditingChangesToApply(f => ({...f, placeholder: e.target.value}))}
              className='bg-white border-gray-500 border rounded-md p-[4px]'
            />
              
          </label>
        </div>}
        {typeConfig[fieldEditingChangesToApply?.type]?.supports?.includes('minmax')
        && <div>
            <label>
              Min:
              <input 
                type='number'
                value={fieldEditingChangesToApply?.min || ''}
                onChange={(e) => {
                  if(e.target.value.length > 0){
                    setFieldEditingChangesToApply(f => ({...f, required: true, min: Number(e.target.value) || undefined}))
                  }else{
                    setFieldEditingChangesToApply(f => ({...f, required: !!f.max, min: undefined}))
                  }
                }}
                className='bg-white border-gray-500 border rounded-md p-[4px]'
              />
                
            </label>
            <label>
              Max:
              <input 
                type='number'
                value={fieldEditingChangesToApply?.max || ''}
                onChange={(e) => {
                  if(e.target.value.length > 0){
                    setFieldEditingChangesToApply(f => ({...f, required: true, max: Number(e.target.value) || undefined}))
                  }else{
                    setFieldEditingChangesToApply(f => ({...f, required: !!f.min, max: undefined}))
                  }
                }}
                className='bg-white border-gray-500 border rounded-md p-[4px]'
              />
                
            </label>

        </div>
        }
        {(fieldEditingChangesToApply?.type === 'select' || fieldEditingChangesToApply?.type === 'radio') && 
        fieldEditingChangesToApply?.options &&
        <div>
          Options:
          {fieldEditingChangesToApply?.options.map(o => 
          <label key={o.id}>
            <input value={o.label}
              className='border-gray-400 border rounded-md p-[4px]'
              onChange={(e) => setFieldEditingChangesToApply((f) => {
                const updatedOptions = f.options.map((option) =>
                  option.id !== o.id ?  option : { ...option, label: e.target.value }
                );
                return { ...f, options: updatedOptions };
              })}
            ></input>
          </label>)}
          <button
            onClick={(e) => setFieldEditingChangesToApply(f => ({ ...f, options: [...f.options, typeConfig[fieldEditingChangesToApply.type].newOption()] }))}
            className='bg-blue-600 py-[6px] px-[6px] text-white font-[500] rounded-md'
          >
            + New Option
          </button>
        </div>}
        <div className='grid space-x-[6px] items-center justify-start grid-flow-col'>
          <label htmlFor='required'>required</label>
          <input id='required' className='accent-blue-600 w-[18px] h-[18px]' type='checkbox' checked={fieldEditingChangesToApply?.required === true} onChange={(e) => setFieldEditingChangesToApply(f => ({...f, required: e.target.checked}))}></input>
        </div>
        <div className='grid'>
          <button 
            className='bg-green-700 hover:bg-green-600 text-white py-[6px] px-3 rounded-md'
            onClick={() => dispatch(updateFieldById({id: fieldToEdit.id, updatedField: fieldEditingChangesToApply} ))}
          >
            Apply
          </button>
          <button 
            className='bg-red-600 hover:bg-red-500 text-white py-[6px] px-3 rounded-md'
            onClick={() => {dispatch(deleteFieldById({id: fieldToEdit.id})); setFieldEditingChangesToApply(null)} }
          >
            Remove Input
          </button>
        </div>
      </div>}
    </div>
  )
}
