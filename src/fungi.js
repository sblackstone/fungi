import React from 'react';
import FungiList from './fungi_list';
import FungiFilter from './fungi_filter';
import fungi from './fungi.json';
import { forceCheck } from 'react-lazyload';
class Fungi extends React.Component {
  constructor(props) {
    super(props);
    window.crap = this;

    this.initialState = {
      visibleFungi: fungi.fungi.slice(0),
      filters: {
      }
    };



    this.filterTypes = Object.keys(fungi.meta.attributes);
    this.filterTypes.push("nameSearch");
    this.filterTypes.forEach(ft => this.initialState.filters[ft] = "");
    this.state = Object.assign({}, this.initialState);
    console.log(this.initialState);
  }

  updateFilterSettings(filter, value) {
    console.log("updateFilterSettings");
    let newFilters = Object.assign({}, this.state.filters);
    newFilters[filter] = value
    
    const newVisibleFungi = fungi.fungi.filter(f => {
      for (let i = 0; i < this.filterTypes.length; i++) {
        const ft = this.filterTypes[i];
        const fv = newFilters[ft];

        if (ft === '') {
          continue;
        }

        if (fv === '') {
          continue;
        }
        
        
        if (ft === "nameSearch") {
          if (!(f.name[0].match(fv))) {
            return false;
          } else {
            continue;
          }
        };

        if (!(ft in f)) {
          return false;
        }


        
        if (f[ft].indexOf(fv) === -1) {
          return false;
        }            
        
      }
      return true;
    });

    this.setState({
      filters: newFilters,
      visibleFungi: newVisibleFungi
    })

    setTimeout(forceCheck, 25);

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
          <FungiFilter updateFilterSettings={this.updateFilterSettings.bind(this)} filters={this.state.filters} />
          <button className="btn btn-sm btn-primary float-right" onClick={this.resetFilters.bind(this)}>Reset</button>
        </div>
        <div className="col col-md-10">
          <h5>Showing {this.state.visibleFungi.length} Matches</h5>
          <div className="fungi-list-container">
            <FungiList fungi={this.state.visibleFungi} />
          </div>
        </div>
      </div>

    )
  }

}

export default Fungi;
