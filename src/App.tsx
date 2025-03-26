import React from 'react';
import { Avatar, Container, Typography } from '@mui/material';
import AddressGenerator from './components/AddressGenerator';

const App: React.FC = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        height: '100vh',
        pb: 5,
        mb: 10
      }}
    >
      <Avatar
        alt="Promotheus"
        src="flame.svg"
        sx={{ width: 180, height: 180, mb: 2, mt:2 }}
      />
      <Typography variant='h3' textAlign='center' color='primary'>
        Prometheus
      </Typography>
      <Typography variant='h6' textAlign='center'>
        Vanity Ethereum address generator
      </Typography>
      <Typography variant='body2' textAlign='center' mb={5}>
        Configure your generation. More complex patterns are very long to compute, so be patient.
      </Typography>
      <AddressGenerator address={''} publicKey={''} privateKey={''} />
      
    </Container>
  );
};

export default App;