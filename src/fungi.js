import React from 'react';
import FungiList from './fungi_list';
import fungi from './fungi.json';

class Fungi extends React.Component {
  constructor(props) {
    super(props);
    this.allfungi = fungi;
    this.state = {
      visibleFungi: fungi
    }
  }

  render() {
    return(
      <FungiList fungi={this.state.visibleFungi} />
    )
  }

}

export default Fungi;
