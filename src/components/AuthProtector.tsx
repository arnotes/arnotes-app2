import React, { Component, Dispatch } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StoreState } from '../redux/store-state';
import { ReduxAction, IReduxAction } from '../redux/redux-action.class';
import firebase from 'firebase';
import { ActionTypes } from '../redux/action-types';
import firebaseSvc from '../services/firebase.service';
import CircularProgress from '@material-ui/core/CircularProgress';
import Login from './Login';
import Layout from './Layout';
import { databaseSvc } from '../services/database.service';
import { INote } from '../models/note.interface';

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
      this.props.dispatch(new ReduxAction(ActionTypes.SET_USER, user).value);
      this.setState({...this.state,loading:false});
      if(user){
        this.loadNotes();
      }      
    });
  }

  async loadNotes(){
    const notes = await databaseSvc.getCollection<INote>("notes", (qry)=>qry.where("UID","==",this.props.user.uid));
    this.props.dispatch(new ReduxAction(ActionTypes.SET_NOTE_LIST, notes).value);
  }  

  render() {
    if (this.state.loading) {
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
        <div className="flex-hbox login-wrapper">
          <Login></Login>
				</div>
      );
    } else {
      return (
        <Layout></Layout>
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
