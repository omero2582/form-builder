// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import CreateForm from './pages/CreateForm/CreateForm.tsx';

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MyForms from './pages/MyForms/MyForms.tsx';


function App() {
  
  return (
    <MantineProvider>
      <BrowserRouter>
        <div className='bg-gray-200 min-h-[100vh]'>
          {/* <Navbar/> */}
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


// function TestModal() {
//   const [opened, { open, close }] = useDisclosure(false);
//   return(
//     <>
//     <Modal opened={opened} onClose={close} title="Authentication">
//       {/* Modal content */}
//       </Modal>
//       <Button variant="default" onClick={open}>
//         Open modal
//       </Button>
//     </>
//   )
// }