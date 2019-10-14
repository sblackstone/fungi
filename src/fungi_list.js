import React from 'react';
import './fungi_list.scss';
import fungi from './fungi.json';

const labelMap = {
  "name": "Name",
  "whichGills": "Gill Type",
  "capShape": "Cap Shape",
  "hymeniumType": "Hymenium Type",
  "stipeCharacter": "Stipe Features",
  "ecologicalType": "Ecology",
  "sporePrintColor": "Spore Color",
  "howEdible": "Edibility"
}


const FieldLabel = (props) => {
  if (!(props.field in labelMap)) {
    return props.field;
  } else {
    return (labelMap[props.field]);

  }
}

const FungiProps = (props) => {
  return Object.keys(fungi.meta.attributes).map(field => {
    if (!(field in props.fungi)) {
      return null;
    }
    return (
      <tr key={`${props.fungi.id}:props:${field}`}><th><FieldLabel field={field} /></th><td>{props.fungi[field].join(", ")}</td></tr>
    )
  })
}


const FungiItem = (props) => {
  const fungiPropsKey = `${props.fungi.id}:props`;
  
  return (
    <div className="fungi-item">
      <h5>{props.fungi.name.join("")}</h5>     
      <table>
        <tbody>
          <FungiProps key={fungiPropsKey} fungi={props.fungi} />
        </tbody>
      </table> 
    </div>
  )
};

class FungiList extends React.Component {

  render() {
    return this.props.fungi.map(x => {
      return (
        <FungiItem key={x.id} fungi={x} />
      )
    })
  }

}

export default FungiList;
