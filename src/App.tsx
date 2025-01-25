import { useState } from 'react'
import MyForm from './MyForm'

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';


function App() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <MantineProvider>
      <div className='bg-gray-200 min-h-[100vh] grid justify-center content-center'>
        <MyForm/>
        <div>
          <Modal opened={opened} onClose={close} title="Authentication">
            {/* Modal content */}
          </Modal>

          <Button variant="default" onClick={open}>
            Open modal
          </Button>
        </div>
      </div>
    </MantineProvider>
  )
}

export default App
