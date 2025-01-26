import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './store/store'
import { addTextArea, addDate, addDropbown, addNumber, addRadioButtons, addText } from './store/slices/newFormSlice'
import { typeConfig } from './types';

export default function CustomFieldPanel() {
  const dispatch = useAppDispatch();
  const fieldOptions = [
    {name: 'text input', onClick: () => (dispatch(addText()))},
    {name: 'number', onClick: () => (dispatch(addNumber()))},
    {name: 'text area', onClick: () => (dispatch(addTextArea()))},
    {name: 'date picker', onClick: () => (dispatch(addDate()))},
    {name: 'dropdown', onClick: () => (dispatch(addDropbown()))},
    {name: 'radio buttons', onClick: () => (dispatch(addRadioButtons()))},
  ]

  const editField = useAppSelector((state) => state.general.editField);
  const [editFieldState, setEditFieldState] = useState(editField)

  useEffect(() => {
    setEditFieldState(editField)
  }, [editField])

  console.log('ed', editField, editField?.type === 'string' || editField?.type === 'email' || editField?.type === 'password')
  console.log('state',editFieldState)

  return (
    <div className='grid'>
      <div className='grid'>
        {fieldOptions.map((f, i) => (
          <button className='p-2 rounded-md bg-gray-300' key={i} onClick={f.onClick}>{f.name}</button>
        ))}
      </div>
      {editFieldState &&
      <div>
        {(editField?.type === 'string' || editField?.type === 'email' || editField?.type === 'password') &&
          <label>
            Text Type:
            <select value={editFieldState.type} onChange={(e) => setEditFieldState({...fieldOptions, type: e.target.value})}>
              <option value="string">text</option>
              <option value="email">email</option>
              <option value="password">password</option>
            </select>
          </label>
        }
        {editField?.placeholder &&
        <div>
          <label>
            placeholder:
            <input 
              value={editFieldState?.placeholder}
              onChange={(e) => setEditFieldState(f => ({...f, placeholder: e.target.value}))}
              className='border-gray-400 border rounded-md p-[4px]'
            />
              
          </label>
        </div>}
        {(editFieldState?.type === 'select' || editFieldState?.type === 'radio') && 
        editFieldState?.options &&
        <div>
          Options:
          {editFieldState?.options.map(o => 
          <label key={o.id}>
            <input value={o.label}
              className='border-gray-400 border rounded-md p-[4px]'
              onChange={(e) => setEditFieldState((f) => {
                const updatedOptions = f.options.map((option) =>
                  option.id !== o.id ?  option : { ...option, label: e.target.value }
                );
                return { ...f, options: updatedOptions };
              })}
            ></input>
          </label>)}
          <button
            onClick={(e) => setEditFieldState(f => ({ ...f, options: [...f.options, typeConfig[editFieldState.type].newOption()] }))}
            className='bg-blue-600 p-2 text-white font-[500] rounded-md'
          >
            + New Option
          </button>
        </div>}
        <div className='grid space-x-[6px] items-center justify-start grid-flow-col'>
          <label htmlFor='required'>required</label>
          <input id='required' className='w-[18px] h-[18px]' type='checkbox' checked={editFieldState?.required === true} onChange={(e) => setEditFieldState(f => ({...f, required: e.target.checked}))}></input>
        </div>
      </div>}
    </div>
  )
}
