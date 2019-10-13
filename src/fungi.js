import React from 'react';
import FungiList from './fungi_list';
import FungiFilter from './fungi_filter';
import fungi from './fungi.json';

class Fungi extends React.Component {
  constructor(props) {
    super(props);
    window.crap = this;

    this.initialState = {
      visibleFungi: fungi.fungi.slice(0),
      filters: {
      }
    };

    this.filterAliases = {
      "capShape":        ["capShape2"],
      "ecologicalType":  ["ecologicalType2"],
      "howEdible":       ["howEdible2"],
      "sporePrintColor": ["sporePrintColor2"],
      "stipeCharacter":  ["stipeCharacter2"],
      "whichGills":      ["whichGills2", "whichGills3"]
    };

    this.filteredFields = Object.values(this.filterAliases).flat();
    console.log(this.filteredFields);
    this.filterTypes = Object.keys(fungi.meta.attributes);
    this.filterTypes.forEach(ft => this.initialState.filters[ft] = "");
    this.state = Object.assign({}, this.initialState);
    console.log(this.initialState);
  }

  updateFilterSettings(filter, value) {
    let newFilters = Object.assign({}, this.state.filters);
    newFilters[filter] = value
    const newVisibleFungi = fungi.fungi.filter(f => {
      for (let i = 0; i < this.filterTypes.length; i++) {
        const ft = this.filterTypes[i];
        if (newFilters[ft] !== '' && f[ft] !== newFilters[ft]) {
          return(false);
        }
      }
      return true;
    });

    this.setState({
      filters: newFilters,
      visibleFungi: newVisibleFungi
    })



  }

  resetFilters(e) {
    console.log("Reset filters");
    const newState = Object.assign({}, this.state);
    newState.filters =  Object.assign({}, this.initialState.filters);
    newState.visibleFungi = fungi.fungi.slice(0);
    this.setState(newState)
  }

  render() {
    return(
      <div className="row">
        <div className="col col-md-2">
          <button className="btn btn-sm btn-primary float-right" onClick={this.resetFilters.bind(this)}>Reset</button>
          <br className="clearfix" />
          <FungiFilter updateFilterSettings={this.updateFilterSettings.bind(this)} filters={this.state.filters} filteredFields={this.filteredFields} />
        </div>
        <div className="col col-md-10">
          <h3>Showing {this.state.visibleFungi.length}</h3>
          <div className="fungi-list-container">
            <FungiList fungi={this.state.visibleFungi} />
          </div>
        </div>
      </div>

    )
  }

}

export default Fungi;
