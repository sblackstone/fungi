import React from 'react';
import fungi from './fungi.json';

const FungiItem = (props) => {
  return (
    <div class="fungi-item">{props.fungi.name}</div>
  )
};

class FungiList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return fungi.map(x => {
      return (
        <FungiItem fungi={x} />
      )
    })
  }

}

export default FungiList;
