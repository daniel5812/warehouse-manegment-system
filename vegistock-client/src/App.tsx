import { ChakraProvider, Container } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Actions from './pages/Actions'
import VoiceCommands from './pages/VoiceCommands'
import Inventory from './pages/Inventory'

function App() {
  return (
    <ChakraProvider>
        <Navbar />
        <Container maxW="container.lg" py={6}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Actions" element={<Actions />} />
            <Route path="/voice" element={<VoiceCommands />} />
            <Route path="/Inventory" element={<Inventory />} />
          </Routes>
        </Container>
    </ChakraProvider>
  )
}

export default App
