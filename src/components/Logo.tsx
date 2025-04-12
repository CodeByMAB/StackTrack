import { Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import stacktrackIcon from '../assets/stacktrack-icon.svg';

const Logo = () => {
  return (
    <Link to="/">
      <Box
        as="img"
        src={stacktrackIcon}
        alt="StackTrack Logo"
        h={{ base: "32px", md: "40px" }}
        w="auto"
        transition="all 0.2s"
        _hover={{ transform: 'scale(1.05)' }}
      />
    </Link>
  );
};

export default Logo;