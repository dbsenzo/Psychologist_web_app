import { Box, Image, Text, useStyleConfig } from '@chakra-ui/react';
import PropTypes from "prop-types";
import { useLocation, useNavigate } from 'react-router-dom';

export function Li({ text, image, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const nav = useNavigate();
  
  // Utiliser useStyleConfig pour accéder aux styles définis dans le thème
  const styles = useStyleConfig("Li", { variant: isActive ? "active" : undefined });

  return (
    <Box __css={styles} onClick={() => nav(to)}>
      <Image src={image} sx={styles.image}/>
      <Text sx={styles.text}>{text}</Text>
    </Box>
  );
}

Li.propTypes = {
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  to: PropTypes.string,
};
