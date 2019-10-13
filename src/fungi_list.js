import React from 'react';

const FungiItem = (props) => {
  return (
    <div className="fungi-item">{props.fungi.name}</div>
  )
};

class FungiList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return this.props.fungi.fungi.map(x => {
      return (
        <FungiItem key={x.name} fungi={x} />
      )
    })
  }

}

export default FungiList;
