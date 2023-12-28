import React from 'react';
import LinearProgress from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';

const ProgressIndicator = ({ value, message, type }) => {
  const color = type === 'validating' ? 'success' : 'primary';
  return (
    <div>
      <Typography
        color={color}
        sx={{ whiteSpace: 'nowrap', mb: 2 }}
        level='h4'
        variant='plain'
      >
        {message}
      </Typography>
      <LinearProgress
        color={color}
        determinate
        size='lg'
        variant='soft'
        value={value}
        sx={{ maxWidth: '25rem', mx: 'auto' }}
      />{' '}
    </div>
  );
};

export default ProgressIndicator;
