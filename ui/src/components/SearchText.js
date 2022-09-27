import React from 'react';
import { ButtonBase, InputBase, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default React.forwardRef(({ clickHandler }, ref) => {
  const [text, setText] = React.useState('');
  const length = React.useMemo(() => text.length, [text]);
  return (
    <InputBase
      sx={{
        border: '1px solid',
        borderRadius: 1,
        padding: '4px 4px',
        width: 1,
      }}
      inputRef={ref}
      value={text}
      onChange={e => {
        setText(e.target.value);
      }}
      placeholder="search"
      endAdornment={
        length > 0 && (
          <InputAdornment position="end" sx={{ pr: 1 }}>
            <ButtonBase
              onClick={() => {
                clickHandler(text);
              }}>
              <SearchIcon />
            </ButtonBase>
          </InputAdornment>
        )
      }
    />
  );
});
