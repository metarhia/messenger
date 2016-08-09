import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './App.css';

import { Card, Icon } from 'antd';

import RoomList from '../views/RoomList';

class App extends Component {
  render() {
    const imageStyle = {
      width: '24px',
      float: 'left'
    };
    let heading = <span>
      <Icon type="user" style={{
        marginRight: '10px'
      }} />
      Metarhia Messenger
    </span>;

    let { rooms } = this.props;

    return (
      <div className="app">
        <Card title={heading}>
          <RoomList rooms={rooms} />
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rooms: state.rooms
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
