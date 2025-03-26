import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Modal,
  CircularProgress,
  Typography,
  Stack,
  Card,
  LinearProgress,
  CardContent,
} from '@mui/material';
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

  // Calculate progress based on the total length of prefix and suffix
  const totalChars = prefix.length + suffix.length;
  const getProgress = () => {
    if (totalChars == 0) return 0; // Easy
    if (totalChars == 1) return 10; // Easy
    if (totalChars <= 2) return 20; // Easy
    if (totalChars <= 5) return 50; // Medium
    if (totalChars <= 7) return 70; // Medium
    return 90; // Hard
  };

  const getProgressColor = () => {
    if (totalChars <= 2) return 'success'; // Green
    if (totalChars <= 5) return 'warning'; // Orange
    return 'error'; // Red
  };

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
      <Stack direction="column" spacing={2} sx={{ marginBottom: 2, p: 4, textAlign: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
          }
          label="Case Sensitive"
        />
        <Stack direction={"row"}>
          <TextField
            label="Prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            error={!isValidHex(prefix)}
            helperText={!isValidHex(prefix) ? 'Invalid hexadecimal character' : ''}
          />
          <TextField
            label="Suffix"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            error={!isValidHex(suffix)}
            helperText={!isValidHex(suffix) ? 'Invalid hexadecimal character' : ''}
          />
        </Stack>


        {/* LinearProgress Widget */}
        <Box sx={{mb: 5}}>
          <Typography variant="body2" gutterBottom>
            Total Characters: {totalChars}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            color={getProgressColor()}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={generateAddress}
        >
          Generate ETH Wallet
        </Button>
        <br />
        {address && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Generated Address
              </Typography>
              <AddressDisplay address={address} publicKey={publicKey} privateKey={privateKey} />
            </CardContent>
          </Card>
        )}
      </Stack>

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