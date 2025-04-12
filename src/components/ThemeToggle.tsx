import { IconButton, useColorMode, Box } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box position="fixed" bottom="4" left="4" zIndex="10">
      <IconButton
        aria-label="Toggle theme"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        size="lg"
        borderRadius="full"
        variant="outline"
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        _hover={{
          bg: colorMode === 'light' ? 'gray.50' : 'gray.700',
        }}
        boxShadow="md"
      />
    </Box>
  )
}

export default ThemeToggle 