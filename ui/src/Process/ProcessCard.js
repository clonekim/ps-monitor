import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CardActions,
  CardActionArea,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useCallback } from 'react';
import { useProcess } from '../store';

function ProcessCard(props) {
  const { setContent } = useProcess();
  const onClick = useCallback(() => {
    setContent(props);
  }, []);

  return (
    <Card>
      <CardActionArea onClick={() => onClick(props)}>
        <CardContent>
          <Typography variant='h5' component='div'>
            {props.Name}
          </Typography>
          <Typography
            variant='subtitle1'
            color='text.secondary'
            component='div'>
            {props.Id}
          </Typography>
          <Typography
            variant='body2'
            component='div'
            display='flex'
            justifyContent='flex-end'>
            {props.CreateTime}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ProcessCard;
