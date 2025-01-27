import { useNavigate } from "react-router-dom";
import { useAddFormMutation, useDeleteFormMutation, useEditFormMutation, useGetFormsQuery } from "../../store/api/apiSlice"
import { defaultNewFields, defaultNewForm, typeConfig } from "../../types";
import { getDateSimple } from "../../utils/utils";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Modal } from "@mantine/core";
import { useAppDispatch } from "../../store/store";


export default function MyForms() {
  const { data, isLoading, error } = useGetFormsQuery()
  const [deleteForm, resDeleteForm] = useDeleteFormMutation();
  const [addForm, resAddForm] = useAddFormMutation();


  const navigate = useNavigate();
  
  // const user = useAppSelector((state) => state.user.user);
  // const myQuery = useGetFormsQuery(undefined, {
  //   skip: !user
  // });

  if(isLoading){
    return <>Loading...</>
  }

  if(error){
    return <>Error</>
  }

  // id, name, description, fields, createdAt, updatedAt
  
  return (
    <div className="p-2 grid max-w-[800px] mx-auto">
      <h1 className="font-bold text-[2rem] text-center">My Forms</h1>
      <button
        className="my-2 justify-self-start rounded-md hover:bg-blue-700 bg-blue-600 text-white p-2"
        onClick={() => addForm({body: defaultNewForm})}
      >
        + New Form
      </button>
      {data.forms?.length === 0 ? 
      <>Your Forms list is empty, please add a new Form.</>
      : data.forms.map(f => (
        <Form f={f} key={f.id}/>
      ))
      }
      {/* <pre>{JSON.stringify(data.forms,null,2)}</pre> */}
    </div>
  )
}

function Form({f}){
  const [deleteForm, resDeleteForm] = useDeleteFormMutation();
  

  const {name, description} = f; 
  const [opened, { open, close }] = useDisclosure(false);
  const [nameState, setNameState] = useState(name)
  const [descriptionState, setDescriptionState] = useState(description)

  const [editForm, resEditForm] = useEditFormMutation()
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    const out = {id: f.id, body: {name: nameState, description: descriptionState}}
    console.log('OUTT', out)
    dispatch(editForm(out))
    // close();
  }


  const navigate = useNavigate();
  return (
    <>
    <div
        className="py-3 px-6 bg-white rounded-md hover:bg-neutral-50 hover:outline-blue-800 hover:outline-3 cursor-pointer"
        onClick={() => navigate(`/my-forms/${f.id}/edit`)}
      >
        <div>
          <p>id: {f.id}</p>
          <p>name: {f.name}</p>
          <p>description: {f.description || '-'}</p>
          <p>Last Updated: {getDateSimple(f.updatedAt)}</p>
          <p>Created At: {getDateSimple(f.createdAt)}</p>
        </div>
        <div className="space-x-2">
          <button
            className="my-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md text-white"
          >
            Edit Fields
          </button>
          <button
            className="my-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md text-white"
            onClick={(e) =>  {e.stopPropagation(); open() }}
          >
            Edit Name/Description
          </button>
          <button
            className="my-1 bg-red-500 hover:bg-red-700 px-2 py-1 rounded-md text-white"
            onClick={(e) =>  {e.stopPropagation(); deleteForm({id: f.id})}}
          >
            Delete
          </button>
        </div>
      </div>
      <Modal opened={opened} onClose={close} title="Edit Name/Description">
        {/* Modal content */}
        <div className="grid">
          <div className="grid">
            <label className="grid">
              Name:
              <input
              className={`w-[205px] border-gray-400 border rounded-md p-[8px] leading-[16px] `}
                value={nameState}
                onChange={(e) => setNameState(e.target.value)}
              />
            </label>
            <label className="grid">
              Description:
              <textarea
                value={descriptionState}
                onChange={(e) => setDescriptionState(e.target.value)}
                className={`border-gray-400 border rounded-md resize-none peer p-[6px] `}
              />
            </label>
          </div>
          <button
            onClick={() => handleSubmit()}
            className="justify-self-center bg-blue-600 py-[6px] px-2 text-white rounded-md"
      
          >
            Submit
          </button>
        </div>
        </Modal>
    </>

  )
}