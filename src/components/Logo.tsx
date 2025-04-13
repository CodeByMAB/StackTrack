import { Box } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import stacktrackIcon from '../assets/stacktrack-icon.svg';
import { useAuth } from '../contexts/AuthContext';

const Logo = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      as="a"
      href="/"
      onClick={handleLogoClick}
      display="inline-block"
    >
      <Box
        as="img"
        src={stacktrackIcon}
        alt="StackTrack Logo"
        h={{ base: "32px", md: "40px" }}
        w="auto"
        transition="all 0.2s"
        _hover={{ transform: 'scale(1.05)' }}
      />
    </Box>
  );
};

export default Logo;