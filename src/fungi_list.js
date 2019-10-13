import React from 'react';
import './fungi_list.scss';

const FungiItem = (props) => {
  return (
    <div className="fungi-item">{props.fungi.name}</div>
  )
};

class FungiList extends React.Component {

  render() {
    return this.props.fungi.map(x => {
      return (
        <FungiItem key={x.name} fungi={x} />
      )
    })
  }

}

export default FungiList;
