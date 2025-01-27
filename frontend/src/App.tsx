// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import CreateForm from './pages/CreateForm/CreateForm.tsx';

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MyForms from './pages/MyForms/MyForms.tsx';
import Navbar from './layout/Navbar.tsx';
import { useState } from 'react';


function App() {
  
  return (
    <MantineProvider>
      <BrowserRouter>
        <div className='bg-gray-100 min-h-[100vh]'>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Navigate to="/my-forms"/> }/>
          <Route path="/my-forms" element={<MyForms/>} />
          {/* <Route path="/my-forms/:id" element={<CreateForm />} /> */}
          <Route path="/my-forms/:id/edit" element={<CreateForm />} />
        </Routes>
        {/* <Footer/>
        <Toaster /> */}
        </div>
      </BrowserRouter>
    </MantineProvider>
    
  )
}

export default App


function EditFormNameDescriptionModal({form}) {
  const {name, description} = form; 
  const [opened, { open, close }] = useDisclosure(false);
  const [nameState, setNameState] = useState(name)
  const [descriptionState, setDescriptionState] = useState(description)

  const handleSubmit = () => {
    // dispatch(editForm({id: form.id, body: {...form, name: nameState, description: descriptionState}}))
    close();
  }
  return(
    <>
      <Modal opened={opened} onClose={close} title="Edit Name/Description">
      {/* Modal content */}
      <div>
        <label>
          Name:
          <input
            value={nameState}
            onChange={(e) => setNameState(e.target.value)}
          />
        </label>
        <label>
          Description:
          <input
            value={descriptionState}
            onChange={(e) => setDescriptionState(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSubmit}>
        Submit
      </button>
      </Modal>
      <Button variant="default" onClick={open}>
        Open modal
      </Button>
    </>
  )
}