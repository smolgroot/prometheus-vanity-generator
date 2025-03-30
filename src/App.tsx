import React, { useState } from 'react';
import { Avatar, Container, Typography, IconButton, Modal, Box } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddressGenerator from './components/AddressGenerator';
import { useTheme } from '@mui/material/styles';

const App: React.FC = () => {
  const theme = useTheme();
  const [faqOpen, setFaqOpen] = useState(false);

  const handleFaqOpen = () => setFaqOpen(true);
  const handleFaqClose = () => setFaqOpen(false);

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: 'auto',
        minHeight: '90vh', // Ensures it takes the full viewport height
        maxWidth: '90%', // Ensures it fits mobile screens
        width: '100%', // Full width for small screens
        margin: '0 auto', // Centers horizontally
        border: '2px solid #FE6B8B',
        borderRadius: '5px', // Rounded corners
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Adds a subtle shadow
        padding: '20px', // Adds padding inside the card
        marginTop: '40px',
        marginBottom: '40px',
        backgroundColor: 'background.paper', // Ensures proper theme support
        position: 'relative', // Enables positioning for the floating button
        [theme.breakpoints.up('sm')]: {
          maxWidth: '650px', // Larger width for small and larger devices
          width: '450px', // Limits the width for larger screens
        },
      }}
    >
      {/* Floating IconButton */}
      <IconButton
        onClick={handleFaqOpen}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: '#FE6B8B',
          color: 'white',
          '&:hover': {
            backgroundColor: '#ff5777',
          },
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      {/* Modal for FAQ */}
            <Modal open={faqOpen} onClose={handleFaqClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh', // Limit the height to 80% of the viewport
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflowY: 'auto', // Enable vertical scrolling
          }}
        >
          <Typography variant="h5" gutterBottom>
            Frequently Asked Questions (FAQ)
          </Typography>
          <Typography variant="h6" gutterBottom>
            What is a Vanity Ethereum Address?
          </Typography>
          <Typography variant="body2" gutterBottom>
            A vanity Ethereum address is a personalized Ethereum wallet address that contains a specific prefix or suffix chosen by the user. For example, an address like <code>0x1234abcd...</code> where "1234" is the desired prefix.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Is this tool secure?
          </Typography>
          <Typography variant="body2" gutterBottom>
            Yes, this tool is secure. All wallet generation happens locally in your browser. The private key is never sent to any server, ensuring your security and privacy.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Why do we use entropy for seed generation?
          </Typography>
          <Typography variant="body2" gutterBottom>
            Entropy is used to ensure that the seed for generating Ethereum addresses is highly secure and unpredictable. By collecting entropy from your mouse movements, we add randomness to the seed, making it resistant to attacks and ensuring that the generated addresses are unique and secure.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Why does generating a vanity address take so long?
          </Typography>
          <Typography variant="body2" gutterBottom>
            Generating a vanity address involves searching through millions or even billions of possible Ethereum addresses to find one that matches your desired pattern. The more complex the pattern, the longer it takes to compute.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Can I use this tool offline?
          </Typography>
          <Typography variant="body2" gutterBottom>
            Yes, since all computations happen locally in your browser, you can use this tool offline after loading it once.
          </Typography>
          <Typography variant="h6" gutterBottom>
            What should I do with my private key?
          </Typography>
          <Typography variant="body2" gutterBottom>
            Your private key is the most important part of your wallet. Store it securely and never share it with anyone. Losing your private key means losing access to your funds.
          </Typography>
        </Box>
      </Modal>

      <Avatar
        alt="Promotheus"
        src="flame.svg"
        sx={{
          width: 120,
          height: 120,
          mb: 2,
          mt: 2,
          [theme.breakpoints.up('sm')]: {
            width: 180,
            height: 180,
          },
        }}
      />
      <Typography variant="h3" textAlign="center">
        <span style={{ color: '#ff9900' }}>Prom</span>
        <span style={{ color: '#FE6B8B', fontWeight: 'bold' }}>eth</span>
        <span style={{ color: '#ff9900' }}>eus</span>
      </Typography>
      <Typography variant="h6" textAlign="center">
        EVM Vanity address generator
      </Typography>
      <Typography variant="body2" textAlign="center" mb={5}>
        Configure your generation. More complex patterns are very long to compute, so be patient.
      </Typography>
      <AddressGenerator />
    </Container>
  );
};

export default App;