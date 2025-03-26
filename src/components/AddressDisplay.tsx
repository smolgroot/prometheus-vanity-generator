import React, { useState } from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { QRCodeCanvas } from 'qrcode.react';


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
    <Box sx={{p:2, m:2}}>
      <Typography variant="subtitle2">Public Address:</Typography>
      <Typography variant="caption" sx={{wordBreak: 'break-word'}}>{address}</Typography>
      <Typography variant="subtitle2" mt={3}>Public Key:</Typography>
      <Typography variant="caption" sx={{wordBreak: 'break-word'}}>{publicKey}</Typography>
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
            <Stack direction={'column'}>
              <Typography variant="subtitle2" sx={{wordBreak: 'break-word'}}>
                {privateKey}
              </Typography>
              {/* QR Code for the private key */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <QRCodeCanvas
                  value={privateKey}
                  size={200} // Size of the QR code
                  bgColor="#ffffff" // Background color
                  fgColor="#FE6B8B" // Foreground color
                  level="L" // Error correction level (L, M, Q, H)
                />
              </Box>            
            </Stack>
          ) : (
            <Typography variant="subtitle2" sx={{wordBreak: 'break-word'}}>
              0xhiddenhiddenhiddenhiddenhiddenhiddenhiddenhiddenhiddenhiddenhide
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default AddressDisplay;