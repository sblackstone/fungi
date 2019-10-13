import React from 'react';
import fungi from './fungi.json';

const SelectOptions = (props) => {


  const opts = fungi.meta.attributes[props.filterName];
  opts.sort();
  return opts.map(x => <option key={`${x}:${props.filterName}`} value={x}>{x}</option> )

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
  let fields =  Object.keys(fungi.meta.attributes);
  fields = fields.filter(x => props.filteredFields.indexOf(x) === -1);
  fields.sort();
  return fields.map(x => {
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
