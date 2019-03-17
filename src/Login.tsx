import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StoreState } from './redux/store-state';
import { Dispatch } from 'redux';

interface LoginProps extends StoreState{
    dispatch?:(action:any)=>void
}

export class Login extends Component<LoginProps> {
  
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
