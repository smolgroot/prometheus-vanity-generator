import React, { useRef, useState } from 'react';
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
  Slider,
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
  const [numWorkers, setNumWorkers] = useState(1); // Default to 1 worker


  const isValidHex = (value: string) => /^[0-9a-fA-F]*$/.test(value);

  const workerOptions = [2, 4, 8, 16]; // Slider options

  const handleSliderChange = (event: Event, value: number | number[]) => {
    setNumWorkers(value as number);
    console.log(event.cancelable)
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
    // const totalLength = prefix.length + suffix.length;
  
    // Split prefix and suffix into individual characters
    const combined = (prefix + suffix).split('');
  
    // Calculate the total probability based on each character
    const probability = combined.reduce((acc, char) => {
      if (/[0-9]/.test(char)) {
        // Numeric characters are always case-insensitive
        return acc * 16;
      } else if (/[a-fA-F]/.test(char)) {
        // Alphabetic characters depend on case sensitivity
        return acc * (caseSensitive ? 32 : 16);
      } else {
        // Invalid characters should not occur, but return acc for safety
        return acc;
      }
    }, 1); // Start with a base probability of 1
  
    return probability;
  };

  const workersRef = useRef<Worker[]>([]);

  const generateAddress = () => {
    setIsGenerating(true);
  
    // Create an array to hold the workers
    const workers: Worker[] = [];

    workersRef.current = workers;
  
    // Function to handle worker messages
    const handleWorkerMessage = (event: MessageEvent) => {
      const { address, publicKey, privateKey, error } = event.data;
  
      if (error) {
        console.error(error);
        setIsGenerating(false);
        workers.forEach((w) => w.terminate());
        return;
      }
  
      // Update state with the generated wallet details
      setAddress(address);
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      setIsGenerating(false);
  
      // Terminate all workers
      workers.forEach((w) => w.terminate());
    };
  
    // Create the specified number of workers
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(new URL('./addressWorker.ts', import.meta.url), { type: 'module' });
      workers.push(worker);
  
      // Send data to the worker
      worker.postMessage({ prefix, suffix, caseSensitive });
  
      // Listen for messages from the worker
      worker.onmessage = (event) => handleWorkerMessage(event);
  
      // Handle errors for the worker
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
          direction="column" spacing={2} sx={{
            marginBottom: 2,
            p: 4,
            textAlign: "left",
            alignItems: "left", // Centers items horizontally
            justifyContent: "left", // Centers items vertically
          }}
        >

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
            {/* Slider for selecting the number of workers */}
            <Typography variant="body2" gutterBottom>
              Number of Workers: <span style={{fontWeight: "bolder"}}>{numWorkers}</span>
            </Typography>
            <Typography variant="caption" gutterBottom>
              Please select a value based on your CPU's core count for optimal performance.
            </Typography>
            <Slider
              value={numWorkers}
              onChange={handleSliderChange}
              // step={null} // Disable intermediate steps
              marks={workerOptions.map((value) => ({ value, label: value.toString() }))}
              min={1}
              max={16}
              valueLabelDisplay="auto"
            />
          </CardContent>
        </Card>

        {/* LinearProgress Widget */}
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
          onClick={generateAddress}
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
                prefix={prefix} // Pass the prefix
                suffix={suffix} // Pass the suffix
              />
            </CardContent>
          </Card>
        )}
      </Stack>

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
          <CircularProgress />
          <Typography variant='body1' align="center" mt={2}>
            Cooking thousands of wallets...
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 3 }}
            onClick={() => {
              // Stop all workers and close the modal
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