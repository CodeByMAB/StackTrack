import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react'
import App from './App.tsx'
import './index.css'

interface ColorModeProps {
  colorMode: 'light' | 'dark'
}

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  } as ThemeConfig,
  colors: {
    brand: {
      bitcoin: '#F7931A',
      navy: '#051323',
    },
  },
  styles: {
    global: (props: ColorModeProps) => ({
      body: {
        bg: props.colorMode === 'light' ? 'white' : '#051323',
      },
    }),
  },
  components: {
    Button: {
      variants: {
        ghost: {
          _hover: {
            bg: 'whiteAlpha.100',
          },
        },
        outline: (props: ColorModeProps) => ({
          borderColor: props.colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200',
          _hover: {
            bg: props.colorMode === 'light' ? 'gray.50' : 'whiteAlpha.100',
          },
        }),
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
