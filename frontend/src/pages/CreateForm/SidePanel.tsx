import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { addTextArea, addDate, addDropbown, addNumber, addRadioButtons, addText, updateFieldById, deleteFieldById } from '../../store/slices/formToSubmitSlice'
import { typeConfig } from '../../types';

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
  const [fieldChanging, setFieldChanging] = useState(fieldToEdit)

  useEffect(() => {
    setFieldChanging(fieldToEdit)
  }, [fieldToEdit])

  console.log('ed', fieldToEdit, fieldToEdit?.type === 'string' || fieldToEdit?.type === 'email' || fieldToEdit?.type === 'password')
  console.log('state',fieldChanging)

  return (
    <div className='grid'>
      <div className='grid'>
        {fieldOptions.map((f, i) => (
          <button className='p-2 rounded-md bg-gray-300' key={i} onClick={f.onClick}>{f.name}</button>
        ))}
      </div>
      {fieldChanging &&
      <div>
        {(fieldToEdit?.type === 'string' || fieldToEdit?.type === 'email' || fieldToEdit?.type === 'password') &&
          <label>
            Text Type:
            <select value={fieldChanging.type} onChange={(e) => setFieldChanging({...fieldOptions, type: e.target.value})}>
              <option value="string">text</option>
              <option value="email">email</option>
              <option value="password">password</option>
            </select>
          </label>
        }
        {fieldToEdit?.placeholder &&
        <div>
          <label>
            placeholder:
            <input 
              value={fieldChanging?.placeholder}
              onChange={(e) => setFieldChanging(f => ({...f, placeholder: e.target.value}))}
              className='border-gray-400 border rounded-md p-[4px]'
            />
              
          </label>
        </div>}
        {(fieldChanging?.type === 'select' || fieldChanging?.type === 'radio') && 
        fieldChanging?.options &&
        <div>
          Options:
          {fieldChanging?.options.map(o => 
          <label key={o.id}>
            <input value={o.label}
              className='border-gray-400 border rounded-md p-[4px]'
              onChange={(e) => setFieldChanging((f) => {
                const updatedOptions = f.options.map((option) =>
                  option.id !== o.id ?  option : { ...option, label: e.target.value }
                );
                return { ...f, options: updatedOptions };
              })}
            ></input>
          </label>)}
          <button
            onClick={(e) => setFieldChanging(f => ({ ...f, options: [...f.options, typeConfig[fieldChanging.type].newOption()] }))}
            className='bg-blue-600 py-[6px] px-[6px] text-white font-[500] rounded-md'
          >
            + New Option
          </button>
        </div>}
        <div className='grid space-x-[6px] items-center justify-start grid-flow-col'>
          <label htmlFor='required'>required</label>
          <input id='required' className='w-[18px] h-[18px]' type='checkbox' checked={fieldChanging?.required === true} onChange={(e) => setFieldChanging(f => ({...f, required: e.target.checked}))}></input>
        </div>
        <div className='grid'>
          <button 
            className='bg-green-700 hover:bg-green-600 text-white py-[6px] px-3 rounded-md'
            onClick={() => dispatch(updateFieldById({id: fieldToEdit.id, updatedField: fieldChanging} ))}
          >
            Apply
          </button>
          <button 
            className='bg-red-600 hover:bg-red-500 text-white py-[6px] px-3 rounded-md'
            onClick={() => {dispatch(deleteFieldById({id: fieldToEdit.id})); setFieldChanging(null)} }
          >
            Remove Input
          </button>
        </div>
      </div>}
    </div>
  )
}
