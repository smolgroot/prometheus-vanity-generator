import React, { useState } from 'react';
import { ethers } from 'ethers';
import { TextField, Button, Box, FormControlLabel, Switch, Modal, CircularProgress, Typography, Stack, CardContent, Card } from '@mui/material';
import AddressDisplay from './AddressDisplay';

const AddressGenerator: React.FC = () => {
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [address, setAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isValidHex = (value: string) => /^[0-9a-fA-F]*$/.test(value);

  const generateAddress = async () => {
    setIsGenerating(true); // Show the modal

    // Wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 300));

    let wallet;
    let matchesPrefix = false;
    let matchesSuffix = false;

    try {
      do {
        wallet = ethers.Wallet.createRandom();
        const address = wallet.address;

        matchesPrefix = caseSensitive
          ? address.startsWith(`0x${prefix}`)
          : address.toLowerCase().startsWith(`0x${prefix.toLowerCase()}`);

        matchesSuffix = caseSensitive
          ? address.endsWith(suffix)
          : address.toLowerCase().endsWith(suffix.toLowerCase());
      } while (
        (prefix && !matchesPrefix) ||
        (suffix && !matchesSuffix)
      );

      setAddress(wallet.address);
      setPublicKey(wallet.publicKey);
      setPrivateKey(wallet.privateKey);
    } finally {
      setIsGenerating(false); // Hide the modal
    }
  };

  return (
    <Box>
      <Stack direction="column" spacing={2} sx={{ marginBottom: 2 }}>
        <Box>
          <TextField
            label="Prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            error={!isValidHex(prefix)}
            helperText={!isValidHex(prefix) ? 'Invalid hex' : ''}
          />
          <TextField
            label="Suffix"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            error={!isValidHex(suffix)}
            helperText={!isValidHex(suffix) ? 'Invalid hex' : ''}
          />
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
          }
          label="Case Sensitive"
        />
        <Button variant="contained" onClick={generateAddress}>
          Generate ETH Wallet
        </Button>
      </Stack>


      {address && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card sx={{ maxWidth: 650, padding: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generated Address
              </Typography>
              <AddressDisplay address={address} publicKey={publicKey} privateKey={privateKey} />
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Modal for infinite loader */}
      <Modal open={isGenerating} aria-labelledby="loading-modal" aria-describedby="loading-description">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <CircularProgress />
          <Typography id="loading-description" mt={2}>
            Computation is in progress...
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default AddressGenerator;