import React from 'react';
import fungi from './fungi.json';

const SelectOptions = (props) => {
  return fungi.meta.attributes[props.filterName].map(x => <option key={`${x}:${props.filterName}`} value={x}>{x}</option> )

}

const FilterField = (props) => {
    return (
      <div className="form-group">
        <label>{props.label}</label>
        <select className="form-control" value={props.filters[props.field]} onChange={(e) => props.updateFilterSettings(props.field, e.target.value)}>
          <option value="">Any</option>
          <SelectOptions filterName={props.field} />
        </select>
      </div>
    )
}

const FungiFilterFields = (props) => {
  return Object.keys(fungi.meta.attributes).map(x => {
    return (
      <FilterField key={x} label={x} filters={props.filters} field={x} updateFilterSettings={props.updateFilterSettings}/>
    )
  })
}

class FungiFilter extends React.Component {
    render() {
      return (
        <FungiFilterFields {...this.props } />
      )
    }

}


export default FungiFilter;
