import React from 'react';
import fungi from './fungi.json';
import { labelMap } from './constants.js';
import { forceCheck } from 'react-lazyload';

const SelectOptions = (props) => {


  const opts = fungi.meta.attributes[props.filterName];
  opts.sort();
  return opts.map(x => <option key={`${x}:${props.filterName}`} value={x}>{x}</option> )

}

const FilterField = (props) => {
    let label = props.label;
    if (label in labelMap) {
      label = labelMap[label];
    }
    return (
      <div className="form-group">
        <label>{label}</label>
        <select className="form-control form-control-sm" value={props.filters[props.field]} onChange={(e) => props.updateFilterSettings(props.field, e.target.value)}>
          <option value="">Any</option>
          <SelectOptions filterName={props.field} />
        </select>
      </div>
    )
}

const FungiFilterFields = (props) => {
  let fields =  Object.keys(fungi.meta.attributes);
  fields.sort();
  return fields.map(x => {
    return (
      <FilterField key={x} label={x} filters={props.filters} field={x} updateFilterSettings={props.updateFilterSettings}/>
    )
  })
}

class FungiFilter extends React.Component {
    render() {
      console.log(this.props.filters);
      return (
        <div>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control form-control-sm" type="text" value={this.props.filters.nameSearch} onChange={(e) => this.props.updateFilterSettings("nameSearch", e.target.value)} />
            <FungiFilterFields {...this.props } />
          </div>
        </div>
      )
    }

}


export default FungiFilter;
