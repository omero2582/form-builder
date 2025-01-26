import { useState } from 'react'
import MyForm from './CreateForm'

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import SidePanel from './SidePanel';
import { useAppDispatch, useAppSelector } from './store/store';
import { toggleSidePanel } from './store/slices/general';


function App() {
  const showSidePanel = useAppSelector((state) => state.general.showSidePanel);
  return (
    <MantineProvider>
      <div className='bg-gray-200 min-h-[100vh] flex'>
        <Main/>
        <div className={`flex-shrink-0 transition-[width]  ${showSidePanel ? 'w-[200px] px-3 border-r-[1.5px] border-neutral-300' : 'w-0'}`}>
          {showSidePanel && 
          <SidePanel/>}
        </div>
      </div>
    </MantineProvider>
  )
}

export default App


export function Main() {
  const dispatch = useAppDispatch();
  const showSidePanel = useAppSelector((state) => state.general.showSidePanel);
  return (
    <div className='flex-1 grid justify-center content-center'>
      <MyForm/>
      <button onClick={() => dispatch(toggleSidePanel())}>
        {showSidePanel ? 'Hide Side Panel' : 'Show Side Panel'}
      </button>
    </div>
  )
}


function TestModal() {
  const [opened, { open, close }] = useDisclosure(false);
  return(
    <>
    <Modal opened={opened} onClose={close} title="Authentication">
      {/* Modal content */}
      </Modal>
      <Button variant="default" onClick={open}>
        Open modal
      </Button>
    </>
  )
}