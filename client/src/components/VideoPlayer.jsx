import React, { useContext, useState } from 'react';
import { Grid, Typography, Paper, makeStyles, Button } from '@material-ui/core';

import { SocketContext } from '../Context';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    width: '600px',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, toggleAudio, toggleVideo } = useContext(SocketContext);
  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(true);
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
            <Button variant="contained" color="primary" onClick={() => { toggleAudio(isMuted); setIsMuted(!isMuted); }} className={classes.button}>
              {isMuted ? 'Mute' : 'UnMute'}
            </Button>
            <Button variant="contained" color="secondary" onClick={() => { toggleVideo(isCameraOff); setIsCameraOff(!isCameraOff); }} className={classes.button}>
              {isCameraOff ? 'Turn Camera Off' : 'Turn Camera On'}
            </Button>
          </Grid>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
            <video playsInline ref={userVideo} autoPlay className={classes.video} />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
