import React, { Component, Dispatch } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StoreState } from './redux/store-state';
import { ReduxAction, IReduxAction } from './redux/redux-action.class';
import firebase from 'firebase';
import { ActionTypes } from './redux/action-types';
import firebaseSvc from './services/firebase.service';
import CircularProgress from '@material-ui/core/CircularProgress';

interface AuthProtectorProps extends StoreState {
  dispatch?:(action:IReduxAction<any>)=>any
}

interface AuthProtectorState {
  loading?: boolean;
}

class AuthProtector extends Component<AuthProtectorProps, AuthProtectorState> {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount(){
    this.checkAuth();
  }

  async checkAuth(){
    this.setState({...this.state,loading:true});
    firebaseSvc.auth().onAuthStateChanged(user => {
      this.props.dispatch(new ReduxAction(ActionTypes.SET_USER, user).get());
      this.setState({...this.state,loading:false});
    });
  }

  render() {
    if (this.state.loading || true) {
      return (
        <div className="giant-progress-container-wrapper">
          <div className="giant-progress-container">
            <CircularProgress
              variant="indeterminate"
              size={200}
              value={50}
              color="primary"
            />
          </div>
        </div>
      );
    } else if (this.props.user == null) {
      return (
        <div>
          not logged in
				</div>
      );
    } else {
      return (
        <div>
          {JSON.stringify(this.props.user)}
        </div>
      );
    }
  }
}

const mapStateToProps = (state: StoreState): AuthProtectorProps => ({
  user: state.user
})

const mapDispatchToProps = (dispatch:Dispatch<any>):AuthProtectorProps => {
  return {
    dispatch:dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthProtector)
