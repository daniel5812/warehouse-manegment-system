import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'


// Chakra UI
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

// Optional: Custom theme
const theme = extendTheme({})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </BrowserRouter>
)
