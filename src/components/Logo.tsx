import stacktrackIcon from '../assets/stacktrack-icon.svg'
import { Box } from '@chakra-ui/react'

const Logo = () => {
  return (
    <Box as="img" src={stacktrackIcon} alt="StackTrack Logo" width="48px" height="48px" />
  )
}

export default Logo
