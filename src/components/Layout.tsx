import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Toolbar, IconButton, Typography, Button, AppBar, Hidden, withWidth, Drawer, Grid } from '@material-ui/core';
import { Dispatch } from 'redux';
import { StoreState } from '../redux/store-state';
import { IReduxAction } from '../redux/redux-action.class';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

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

  render() {
    return (
      <div className={`layout-component ${(this.state.drawerOpen || !this.isMobile()) && "drawer-open"}`}>
        <nav>
          <Drawer anchor="left" variant={this.isMobile()? "temporary":"permanent"} onClose={()=>this.toggleDrawer(false)} open={this.state.drawerOpen} classes={({paper:"drawer-paper"})} >
            aw aw aw aw aw aw 
            <br/>
            aw aw aw aw aw aw 
            <br/>
            aw aw aw aw aw aw 
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
              Photos  {this.props.width}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="layout-content">
          insert content here
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = (dispatch:Dispatch) => {
  return {
    dispatch:dispatch
  } as LayoutProps;
}

const connected = connect(mapStateToProps, mapDispatchToProps)(Layout);
const withWidthConnected = withWidth()(connected);
export default withWidthConnected;
