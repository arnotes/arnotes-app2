import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StoreState } from '../redux/store-state';
import { Dispatch } from 'redux';
import { Card, CardHeader, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, List, ListItem, ListItemText, ListItemIcon, Icon, Tooltip } from '@material-ui/core';
import { IReduxAction } from '../redux/redux-action.class';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import authSvc from '../services/auth.service';

interface LoginProps extends StoreState{
    dispatch?:<T>(action:IReduxAction<T>)=>void,
    fullScreen?:boolean
}

class Login extends Component<LoginProps> {
  
  constructor(props){
    super(props);
  }

  loginWith(loginType:"google"|"facebook"){
    switch (loginType) {
      case "google":
        authSvc.loginWithGoogle();
        break;
    
      default:
        break;
    }
  }

  render() {
    return (
      <Dialog open={true} fullScreen={false} >
        <DialogTitle >
          Login
            </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <List component="nav">
              <ListItem button onClick={e => this.loginWith("google")}>
                <ListItemIcon><i className="fab fa-google"></i></ListItemIcon>
                <ListItemText>Sign in with Google</ListItemText>
              </ListItem>
              <Tooltip title="Not supported">
                <ListItem button >
                  <ListItemIcon><i className="fab fa-facebook"></i></ListItemIcon>
                  <ListItemText><del>Login with Facebook</del></ListItemText>
                </ListItem>
              </Tooltip>
            </List>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    )
  }
}

const mapStateToProps = (state:StoreState):LoginProps => ({
  user:state.user
})

const mapDispatchToProps = (dispatch:Dispatch<any>):LoginProps => {
  return {
    dispatch:dispatch
  }
}

const connected = connect(mapStateToProps, mapDispatchToProps)(Login);
export default connected;
