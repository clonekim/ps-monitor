import { createTheme } from '@mui/material';

export default function (mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        light: '#757ce8',
        main: '#3f51b5',
        dark: '#3f51b5',
        contrastText: '#fff',
      },

      secondary: {
        light: '#ff7961',
        main: '#ffffff',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });
}
