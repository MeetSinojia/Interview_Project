import React from 'react';
import { Typography, AppBar, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import ChatPage from './components/ChatPage'; // Import the ChatPage component
import './styles.css';

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '600px',
    border: '2px solid black',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px', // Adjust the margin values as needed
    marginLeft: '1500px', // Add margin-left to the paper style
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography variant="h2" align="center">Video Chat</Typography>
      </AppBar>
      <VideoPlayer />
      <Paper className={classes.paper}>
        <ChatPage /> {/* Display ChatPage when showChat is true */}
      </Paper>
      <Sidebar>
        <Notifications />
      </Sidebar>
    </div>
  );
};

export default App;
