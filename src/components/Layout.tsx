import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Toolbar, IconButton, Typography, Button, AppBar, Hidden, withWidth, Drawer, Grid, Tooltip } from '@material-ui/core';
import { Dispatch } from 'redux';
import { StoreState } from '../redux/store-state';
import { IReduxAction, ReduxAction } from '../redux/redux-action.class';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import authSvc from '../services/auth.service';
import { ActionTypes } from '../redux/action-types';
import NoteList from './NoteList';

interface LayoutProps extends StoreState{
  dispatch?:<T>(action:IReduxAction<T>)=>any,
  width?:Breakpoint
}

interface LayoutState {
  drawerOpen?:boolean
}

class Layout extends Component<LayoutProps, LayoutState> {
  constructor(props){
    super(props);
    this.state = {
      drawerOpen:false
    }
  }

  toggleDrawer = (isOpen:boolean = null)=>{
    if(isOpen==null){
      isOpen = !this.state.drawerOpen;
    }

    this.setState({...this.state,drawerOpen:isOpen});
  }

  isMobile(){
    return this.props.width=="xs" || this.props.width=="sm";
  }

  logout = async()=>{
    await authSvc.logOut();
    this.props.dispatch(new ReduxAction(ActionTypes.SET_USER, null).value);
  }

  render() {
    return (
      <div className={`layout-component ${(this.state.drawerOpen || !this.isMobile()) && "drawer-open"}`}>
        <nav>
          <Drawer anchor="left" variant={this.isMobile()? "temporary":"permanent"} onClose={()=>this.toggleDrawer(false)} open={this.state.drawerOpen} classes={({paper:"drawer-paper"})} >
            <NoteList></NoteList>
          </Drawer>
        </nav>      
        <AppBar color="primary" position="relative">
          <Toolbar>
            <Hidden only={["md","lg","xl"]} >
              <IconButton onClick={()=>this.toggleDrawer()} >
                <i className="fas fa-bars"></i>
              </IconButton>   
            </Hidden>
            <Typography variant="h6" color="inherit">
              {this.props.user.email}  
            </Typography>
            <Tooltip title="Sign Out" placement="left" >
              <IconButton onClick={this.logout} classes={({root:"btn-logout"})} >
                <i className="fas fa-power-off"></i>
              </IconButton>
            </Tooltip>            
          </Toolbar>
        </AppBar>
        <div className="layout-content">
          insert content here
          <br/>
          {this.props.width}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state:StoreState):StoreState => ({
    user:state.user
})

const mapDispatchToProps = (dispatch:Dispatch) => {
  return {
    dispatch:dispatch
  } as LayoutProps;
}

const connected = connect(mapStateToProps, mapDispatchToProps)(Layout);
const withWidthConnected = withWidth()(connected);
export default withWidthConnected;
