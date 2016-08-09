import React, { Component, PropTypes } from 'react';
import { Tree } from 'antd';

export default class RoomList extends Component {
  render() {
    let nodes = this.props.rooms.map((room, index) => (
      <Tree.TreeNode key={index} title={room.title} />
    ));
    return (
      <Tree defaultExpandAll>
        {nodes}
      </Tree>
    );
  }
}

RoomList.propTypes = {
  rooms: PropTypes.array.isRequired
};
