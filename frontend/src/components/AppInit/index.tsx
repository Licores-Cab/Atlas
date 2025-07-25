import { Box, Typography } from '@mui/material';

import Logo from 'src/components/LogoSign';
import { isWhiteLabeled } from '../../config';

function AppInit() {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%'
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box>
        <Logo />
        {!isWhiteLabeled && (
          <Typography
            style={{ cursor: 'pointer' }}
            fontSize={13}
            onClick={() => {
              window.open('', '_blank');
            }}
          >
            Powered by cabalgata
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default AppInit;
