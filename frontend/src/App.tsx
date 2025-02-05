// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import CreateForm from './pages/CreateForm/CreateForm.tsx';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MyForms from './pages/MyForms/MyForms.tsx';
import Navbar from './layout/Navbar.tsx';


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