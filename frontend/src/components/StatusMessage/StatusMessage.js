import React from 'react';
import Typography from '@mui/joy/Typography';

const StatusMessage = ({ message }) => {
  return (
    <Typography
      color={'warning'}
      sx={{ whiteSpace: 'nowrap', mb: 2 }}
      level='h4'
      variant='plain'
    >
      {message}
    </Typography>
  );
};

export default StatusMessage;
