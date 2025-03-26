import { createTheme } from '@mui/material/styles';
// import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
        main: '#ff9900',
      },
      secondary: {
        main: '#FE6B8B',
      },
      background: {
        default: '#fff2d8',
        paper: '#f5f5f5',
      },
  },
  typography: {
    h1: {
      fontFamily: 'Oxanium',
    },
    h2: {
      fontFamily: 'Oxanium',
    },
    h3: {
      fontFamily: 'Oxanium',
    },
    h4: {
      fontFamily: 'Oxanium',
    },
    h5: {
      fontFamily: 'Oxanium',
      fontSize: '2rem',
    },
    h6: {
      fontFamily: 'Oxanium',
    },
    button: {
      fontFamily: 'Oxanium',
    },
    overline: {
      fontFamily: 'Oxanium',
    },
    fontFamily: 'Roboto',
    fontSize: 15,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FE6B8B 30%, #ff9900 90%)',
          border: 0,
          borderRadius: 3,
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          color: 'white',
          height: 48,
          padding: '0 30px',
        },
      },
    },
  },
});

export default theme;
