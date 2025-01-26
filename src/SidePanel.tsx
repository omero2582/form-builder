import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './store/store'
import { addBoolean, addDate, addDropbown, addNumber, addRadioButtons, addText } from './store/slices/newFormSlice'

export default function CustomFieldPanel() {
  const dispatch = useAppDispatch();
  const fieldOptions = [
    {name: 'text input', onClick: () => (dispatch(addText()))},
    {name: 'number', onClick: () => (dispatch(addNumber()))},
    {name: 'date picker', onClick: () => (dispatch(addDate()))},
    {name: 'dropdown', onClick: () => (dispatch(addDropbown()))},
    {name: 'radio buttons', onClick: () => (dispatch(addRadioButtons()))},
  ]

  const editField = useAppSelector((state) => state.general.editField);
  const [editFieldState, setEditFieldState] = useState(editField)

  useEffect(() => {
    setEditFieldState(editField)
  }, [editField])

  console.log('ed', editField)
  console.log('state',editFieldState)

  return (
    <div className='grid'>
      <div className='grid'>
        {fieldOptions.map((f, i) => (
          <button className='p-2 rounded-md bg-gray-300' key={i} onClick={f.onClick}>{f.name}</button>
        ))}
      </div>
      <div>
        {editFieldState && 
        <>
          <label>id:</label>
          <input value={editFieldState?.id} onChange={(e) => setEditFieldState(f => ({...f, id: e.target.value}))}></input>
        </>
        }


      </div>
    </div>
  )
}
