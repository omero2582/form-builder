import { useNavigate } from "react-router-dom";
import { useAddFormMutation, useDeleteFormMutation, useGetFormsQuery } from "../../store/api/apiSlice"
import { defaultNewFields, defaultNewForm, typeConfig } from "../../types";


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
      <div
        className="py-3 px-6 bg-white rounded-md hover:bg-neutral-50 hover:outline-blue-800 hover:outline-3 cursor-pointer"
        onClick={() => navigate(`/my-forms/${f.id}/edit`)}
      >
        <div>
          <p>id: {f.id}</p>
          <p>name: {f.name}</p>
          <p>description: {f.description || '-'}</p>
          <p>Last Updated: {f.updatedAt}</p>
          <p>Created At: {f.createdAt}</p>
        </div>
        <button
          className="my-1 bg-red-500 hover:bg-red-700 px-2 py-1 rounded-md text-white"
          onClick={(e) =>  {e.stopPropagation(); deleteForm({id: f.id})}}
        >
          Delete
        </button>
      </div>))
      }
      {/* <pre>{JSON.stringify(data.forms,null,2)}</pre> */}
    </div>
  )
}
