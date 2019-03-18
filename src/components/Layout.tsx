import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Toolbar, IconButton, Typography, Button, AppBar, Hidden, withWidth, Drawer, Grid } from '@material-ui/core';
import { Dispatch } from 'redux';
import { StoreState } from '../redux/store-state';
import { IReduxAction } from '../redux/redux-action.class';

interface LayoutProps extends StoreState{
  dispatch?:<T>(action:IReduxAction<T>)=>any,
  width?:number
}

interface LayoutState {
  drawerOpen?:boolean
}

class Layout extends Component<LayoutProps, LayoutState> {
  constructor(props){
    super(props);
    this.state = {
      drawerOpen:true
    }
  }

  onDrawerClose = (e)=>{
    this.setState({...this,drawerOpen:false});
  }

  render() {
    return (
      <div className="layout-component">
        <AppBar color="primary" position="relative">
          <Toolbar>
            <IconButton>
              <i className="fas fa-bars"></i>
            </IconButton>   
            <Typography variant="h6" color="inherit">
              Photos  {this.props.width}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Hidden only={["md","lg","xl"]}>
          {/* MINI LIST OF NOTES */}
          <Drawer anchor="left"
            open={this.state.drawerOpen}
            onClose={this.onDrawerClose}
            variant="temporary" >
            <div className="minilist-wrapper">
              asdf
              asdf
              asdf
              asdf
            </div>
          </Drawer>
        </Hidden>        
        
        <div className="biglist-and-editor-wrapper">
          <Grid container spacing={8}>
            <Grid item md={5} lg={3} xl={3}>
              <Hidden only={["xs","sm"]}>
                {/* BIG LIST OF NOTES */}
                <div className="biglist-wrapper">
                  <p>ggg</p>
                  <p>asdf</p>
                  <p>asdf</p>
                  <p>asdf</p>
                  <p>asdf</p>
                  <p>asdf</p>
                  <p>asdf</p>
                  <p>asdf</p>
                  <p>asdf</p>
                  <p>asdf</p>                
                </div>
              </Hidden>
            </Grid>

            <Grid item xs={12} sm={12} md={7} lg={9} xl={9} >
              <div className="editor-wrapper">
                editor here
              </div>
            </Grid>
          </Grid>
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
