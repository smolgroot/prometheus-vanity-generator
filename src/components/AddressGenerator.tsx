import React, { useRef, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Modal,
  Typography,
  Stack,
  Card,
  LinearProgress,
  CardContent,
  Slider,
} from '@mui/material';
import AddressDisplay from './AddressDisplay';
import MouseEntropyCollector from './MouseEntropyCollector';

const AddressGenerator: React.FC = () => {
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [address, setAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [numWorkers, setNumWorkers] = useState(1); // Default to 1 worker
  const [showEntropyCollector, setShowEntropyCollector] = useState(false); // Show entropy collector modal
  const [, setEntropy] = useState<number[]>([]);
  const [randomMessage, setRandomMessage] = useState(''); // State for random message

  const messages = [
    'Cooking thousands of wallets...',
    'You have time for a coffee...',
    'Searching for the perfect vanity address...',
    'Crunching numbers for your wallet...',
    'Almost there, hang tight...',
  ];

  const isValidHex = (value: string) => /^[0-9a-fA-F]*$/.test(value);

  const workerOptions = [2, 4, 8, 16]; // Slider options

  const handleSliderChange = (_event: Event, value: number | number[]) => {
    setNumWorkers(value as number);
  };

  // Calculate progress based on the total length of prefix and suffix
  const totalChars = prefix.length + suffix.length;
  const getProgress = () => {
    if (totalChars == 0) return 0; // Easy
    if (totalChars == 1) return 5; // Easy
    if (totalChars <= 2) return 10; // Easy
    if (totalChars <= 3) return 20; // Medium
    if (totalChars <= 4) return 35; // Medium
    if (totalChars <= 7) return 55; // Medium
    if (totalChars <= 8) return 75; // Hard
    return 90; // Hard
  };

  const getProgressColor = () => {
    if (totalChars <= 2) return 'success'; // Green
    if (totalChars <= 5) return 'warning'; // Orange
    return 'error'; // Red
  };

  const calculateProbability = () => {
    const combined = (prefix + suffix).split('');
    const probability = combined.reduce((acc, char) => {
      if (/[0-9]/.test(char)) {
        return acc * 16;
      } else if (/[a-fA-F]/.test(char)) {
        return acc * (caseSensitive ? 32 : 16);
      } else {
        return acc;
      }
    }, 1);
    return probability;
  };

  const workersRef = useRef<Worker[]>([]);

  const startEntropyCollection = () => {
    // Reset entropy state and show the entropy collector
    setEntropy([]);
    setShowEntropyCollector(true);
  };

  const handleEntropyCollected = (collectedEntropy: number[]) => {
    setEntropy(collectedEntropy);
    setShowEntropyCollector(false); // Hide the entropy collector
    generateAddress(collectedEntropy); // Proceed with address generation
  };

  const generateAddress = (collectedEntropy: number[]) => {
    setIsGenerating(true);
  
    // Pick a random message
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);
  
    const workers: Worker[] = [];
    workersRef.current = workers;
  
    const handleWorkerMessage = (event: MessageEvent) => {
      const { address, publicKey, privateKey, error } = event.data;
  
      if (error) {
        console.error(error);
        setIsGenerating(false);
        workers.forEach((w) => w.terminate());
        return;
      }
  
      setAddress(address);
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      setIsGenerating(false);
  
      workers.forEach((w) => w.terminate());
    };
  
    for (let i = 0; i < numWorkers; i++) {
      // Add a delta to the entropy for each worker
      const workerEntropy = [...collectedEntropy, i]; // Append the worker index to the entropy array
  
      const worker = new Worker(new URL('./addressWorker.ts', import.meta.url), { type: 'module' });
      workers.push(worker);
  
      worker.postMessage({ prefix, suffix, caseSensitive, entropy: workerEntropy });
  
      worker.onmessage = (event) => handleWorkerMessage(event);
  
      worker.onerror = (error) => {
        console.error(`Worker ${i + 1} error:`, error);
        setIsGenerating(false);
        workers.forEach((w) => w.terminate());
      };
    }
  };

  return (
    <Box>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          marginBottom: 2,
          p: 4,
          textAlign: 'left',
          alignItems: 'left',
          justifyContent: 'left',
        }}
      >
        <Stack direction={'row'}>
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

        <Card>
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                />
              }
              label="Case Sensitive"
            />
            <br />
            <Typography variant="caption" gutterBottom>
              Enable this option to make the prefix and suffix case-sensitive. The generated EVM address will match the exact case of the input.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="body2" gutterBottom>
              Number of Workers: <span style={{ fontWeight: 'bolder' }}>{numWorkers}</span>
            </Typography>
            <Typography variant="caption" gutterBottom>
              Please select a value based on your CPU's core count for optimal performance.
            </Typography>
            <Slider
              value={numWorkers}
              onChange={handleSliderChange}
              marks={workerOptions.map((value) => ({ value, label: value.toString() }))}
              min={1}
              max={16}
              valueLabelDisplay="auto"
            />
          </CardContent>
        </Card>

        <Box sx={{ mb: 5 }}>
          <Typography variant="body2" gutterBottom>
            Total Characters: {totalChars}
          </Typography>
          <Typography variant="caption" gutterBottom>
            Probability: 1 wallet over {calculateProbability().toLocaleString()}
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
          onClick={startEntropyCollection}
          disabled={!isValidHex(prefix) || !isValidHex(suffix)} // Disable button if prefix or suffix is invalid
        >
          Generate ETH Wallet
        </Button>
        {address && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Generated Address
              </Typography>
              <AddressDisplay
                address={address}
                publicKey={publicKey}
                privateKey={privateKey}
                prefix={prefix}
                suffix={suffix}
              />
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* Modal for entropy collection */}
      <Modal
        open={showEntropyCollector}
        aria-labelledby="entropy-modal"
        aria-describedby="entropy-description"
      >
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
            minHeight: "60%",
            width: '80%', // Increase the width to 80% of the viewport
            maxWidth: '800px', // Set a maximum width for larger screens
          }}
        >
          <MouseEntropyCollector onEntropyCollected={handleEntropyCollected} />
        </Box>
      </Modal>

      {/* Modal for infinite loader */}
      <Modal
        open={isGenerating}
        aria-labelledby="loading-modal"
        aria-describedby="loading-description"
      >
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
          <LinearProgress
            variant="indeterminate"
            sx={{
              width: '100%',
              mb: 2,
            }}
          />
          <Typography variant="body1" align="center" mt={2}>
            {randomMessage}
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 3 }}
            onClick={() => {
              setIsGenerating(false);
              workersRef.current.forEach((worker) => worker.terminate());
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AddressGenerator;