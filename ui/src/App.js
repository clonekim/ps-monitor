import React, { useEffect} from 'react';
import { Grid } from '@mui/material';
import ProcessCard from './ProcessCard';
import ProcessContent from './ProcessDetail';
import axios from 'axios';

function App() {
  const [list, setList] = React.useState([]);

  useEffect(() => {
     axios.get('/getpid', {params: {name: 'emacs'}})
     .then(res => {

      console.log(res)

     })
  
    return () => {
      
    }
  }, [])
  

  return (
    <Grid container>
      <Grid item md={4} xs={12}>
        <ProcessCard />
      </Grid>

      <Grid item md={6}>
        <ProcessContent />
      </Grid>
    </Grid>
  );
}

export default App;
