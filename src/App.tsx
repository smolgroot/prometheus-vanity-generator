import React from 'react';
import { Avatar, Container, Typography } from '@mui/material';
import AddressGenerator from './components/AddressGenerator';
import { useTheme } from '@mui/material/styles';

const App: React.FC = () => {
  const theme = useTheme();
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
    [theme.breakpoints.up('sm')]: {
      maxWidth: '650px', // Larger width for small and larger devices
      width: '450px', // Limits the width for larger screens
    },
  }}
>
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
    Vanity Ethereum address generator
  </Typography>
  <Typography variant="body2" textAlign="center" mb={5}>
    Configure your generation. More complex patterns are very long to compute, so be patient.
  </Typography>
  <AddressGenerator />
</Container>
  );
};

export default App;