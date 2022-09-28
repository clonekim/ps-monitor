import { createTheme } from '@mui/material';

export default function (mode) {
  return createTheme({
    status: {
      danger: '#e53e3e',
    },
    palette: {
      mode,
    },

    typography: {
      subtitle1: {
        fontSize: '0.77rem',
      },
      body1: {
        fontSize: '0.9rem',
      },
    },

    spacing: 4,

    components: {
      MuiAutocomplete: {
        styleOverrides: {
          inputRoot: {
            padding: 4,
          },
        },
      },

      MuiToolbar: {
        styleOverrides: {
          root: {
            height: 32,
            minHeight: 'unset',
          },
        },
      },

      MuiTypography: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },

      MuiButtonBase: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },

      MuiNativeSelect: {
        styleOverrides: {
          root: {
            padding: 'unset',
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            padding: '4px',
          },
          input: {
            padding: '8px 8px',
          },
        },
      },
    },
  });
}
