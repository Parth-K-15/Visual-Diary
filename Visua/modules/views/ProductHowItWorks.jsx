import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/GridLegacy';
import Container from '@mui/material/Container';
import Button from '../components/Button';
import Typography from '../components/Typography';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AppBar from "../../src/components/AppBar";

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
  color: 'white', // Text color for better contrast
};

const iconStyle = {
  fontSize: 55,
  my: 4,
  color: '#5bc0be', // A contrasting accent color
};

function ProductHowItWorks() {
  return (

    <Box
      component="section"
      sx={{ display: 'flex', bgcolor: '#1c2541', overflow: 'hidden' }} // Updated background color
    >
      {/* <AppBar> */}
      <Container
        sx={{
          mt: 10,
          mb: 15,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          marked="center"
          component="h2"
          sx={{
            mb: 14, color: 'white',
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.5rem',
            
          }} // White text for contrast
        >
          VISUAL DIARY
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <AutoStoriesIcon sx={iconStyle} /> {/* Book icon */}
                <Typography variant="h5" align="center">
                  Write freely - Your thoughts are safe here. Document daily entries with ease.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <LightbulbIcon sx={iconStyle} /> {/* Lightbulb/rays icon */}
                <Typography variant="h5" align="center">
                  Gain insights - Reflect on patterns and grow through self-discovery.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <VisibilityIcon sx={iconStyle} /> {/* Visibility icon */}
                <Typography variant="h5" align="center">
                  Visualize memories - Attach photos or sketches to bring entries to life.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          component="a"
          href="/Home"
          sx={{ mt: 8 }}
        >
          Start Journaling
        </Button>
      </Container>
      {/* </AppBar> */}
    </Box>
  );
}

export default ProductHowItWorks;