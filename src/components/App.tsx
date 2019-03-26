import React, { Component } from 'react';
import logo from './logo.svg';
import '../stylesheets/App.scss';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import 'react-dragula/dist/dragula.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@material-ui/core'
import firebase from 'firebase';
import { Button, CssBaseline } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import AuthProtector from './AuthProtector';

const theme = createMuiTheme({
  palette:{
    type: 'dark',
    primary:{
      main:'#673ab7'
    },
    secondary: {
      main: '#00e5ff',
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
