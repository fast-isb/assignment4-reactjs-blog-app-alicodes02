import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Navbar from './Navbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignIn() {

    const navigate = useNavigate();
    const [successAlert, setSuccessAlert] = useState(false);
    const [failAlert, setFailAlert] = useState(false);

  const handleSubmit = async (event) => {

    event.preventDefault();

    const data = new FormData(event.currentTarget);
    
    const userData = {

        email: data.get('email'),
        password: data.get('password'),

      };

      try {

        const response = await axios.post('http://localhost:3000/login', userData);
        
        const data = response.data;
    
        console.log(response.data);

        setSuccessAlert(true);

        const token = data.token;
        const userId = data.user._id;
        const username = data.user.username;
        const email = data.user.email;

        console.log('Before navigate:', { userId, username, email });

        setTimeout(() => {
          navigate('/userhomepage', { state: { id: userId, name: username, mail: email, usertoken:token } });
        }, 1000);
        
      } catch (error) {
        setFailAlert(true);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error:', error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error: No response received');
        } else {
          console.error('Error:', error.message);
        }
      }

  };

  return (

    <div> 

        <Navbar/>

        {successAlert && (
        <Alert severity="success" onClose={() => setSuccessAlert(false)}>
          Sign In Successful. Now redirecting to home page.
        </Alert>
      )}

        {failAlert && (
        <Alert severity="error" onClose={() => setFailAlert(false)}>
            Invalid Email or Password.
        </Alert>
      )}

    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
    </div>
  );
}