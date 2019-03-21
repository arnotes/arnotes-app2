import React, { Component } from 'react';
import logo from './logo.svg';
import '../App.scss';
import '@material-ui/core'
import firebase from 'firebase';
import { Button, CssBaseline } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import AuthProtector from './AuthProtector';

const theme = createMuiTheme({
  palette:{
    type: "dark",
    secondary: {
      dark: '#b22a00',
      main: '#ff3d00',
      light: '#ff6333'
    }
  }
});

interface AppProps{

}

class App extends Component<AppProps> {
  constructor(props){
    super(props);

  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
          <CssBaseline/>
          <AuthProtector></AuthProtector>
      </MuiThemeProvider>
    );
  }
}

export default App;
