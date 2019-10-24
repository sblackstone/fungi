import React from 'react';
import './fungi_list.scss';
import { labelMap } from './constants.js';
import LazyLoad from 'react-lazyload';


const FieldLabel = (props) => {
  if (props.field in labelMap) {
    return (labelMap[props.field]);
  } else {
    return props.field;
  }
}

const FungiProps = (props) => {
  return Object.keys(props.fungiMeta.attributes).map(field => {
    if (!(field in props.fungi)) {
      return null;
    }
    return (
      <tr key={`${props.fungi.id}:props:${field}`}>
        <th className='field-label'><FieldLabel field={field} /></th>
        <td>{props.fungi[field].join(", ")}</td>
      </tr>
    )
  })
}

const FungiImage = (props) => {
  if ("image" in props.fungi) {
    return (
      <LazyLoad>
        <img alt={props.fungi.name} src={"https://cdkstack-fungibucket822f5406-156dgl69y3n56.s3.amazonaws.com/" + props.fungi.image} />
      </LazyLoad>
    )
  } else {
    return null;
  }

}

const FungiItem = (props) => {
  const fungiPropsKey = `${props.fungi.id}:props`;

  return (
    <div className="fungi-item card">
      <div className="card-header">
      <a href={props.fungi.wikiUrl} rel="noopener noreferrer">
        <h5>{props.fungi.name.join("")}</h5>
      </a>
      </div>
      <div className="card-body">
        <FungiImage fungi={props.fungi} />
        <table>
          <tbody className='card-text'>
            <FungiProps fungiMeta={props.fungiMeta} key={fungiPropsKey} fungi={props.fungi} />
          </tbody>
        </table>
      </div>
      <div className="card-footer">
        <div className="btn-group">
        <a className='btn btn-primary btn-sm' rel="noopener noreferrer" target="_blank" href={`https://www.google.com/search?q=${props.fungi.name.join("")}&tbm=isch`}>Search Images</a>
        <a className='btn btn-primary btn-sm' rel="noopener noreferrer" target="_blank" href={`https://mushroomobserver.org/observer/observation_search?pattern=${props.fungi.name.join("")}`}>Search MO</a>
        </div>
  
    
      </div>
    </div>
  )
};

class FungiList extends React.Component {

  render() {

    if (this.props.fungi.length === 0) {
      return(
          <h6>No Matches</h6>

      )
    }

    return this.props.fungi.map(x => {
      return (
        <FungiItem fungiMeta={this.props.fungiMeta} key={x.id} fungi={x} />
      )
    })
  }

}

export default FungiList;
