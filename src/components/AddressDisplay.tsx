import React, { useState } from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


interface AddressDisplayProps {
  address: string;
  publicKey: string;
  privateKey: string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ address, publicKey, privateKey }) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey((prev) => !prev);
  };

  return (
    <Box mt={2}>
      <Typography variant="subtitle2">Public Address:</Typography>
      <Typography variant="caption">{address}</Typography>
      <Typography variant="subtitle2" mt={3}>Public Key:</Typography>
      <Typography variant="caption">{publicKey}</Typography>
      <Typography variant="subtitle2" mt={3}>Private Key:</Typography>
      <Stack direction="row">
        <IconButton
          size="small"
          onClick={togglePrivateKeyVisibility}
        >
          {showPrivateKey ? (
            <VisibilityIcon />
          ) : (
            <VisibilityOffIcon />
          )}
        </IconButton>
        <Box
          mt={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            gap: 1,
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
            width: 'fit-content',
            cursor: 'pointer',
            // backgroundColor: showPrivateKey
            //   ? 'transparent'
            //   : '#f5f5f5',
            filter: showPrivateKey
              ? 'none'
              : 'blur(5px)',
          }}
          onClick={togglePrivateKeyVisibility}
        >
          {showPrivateKey ? (
            <Typography variant="h6">{privateKey}</Typography>
          ) : (
            <>0xhiddenhiddenhiddenhiddenhiddenhidden</>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default AddressDisplay;