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


  generateVisibleFungi(filters) {
    const activeFilters = Object.keys(filters).filter(x => x !== '' && filters[x] !== '');
    console.log(activeFilters);
    let re = null;
    if (filters["nameSearch"] !== '') {
      re = new RegExp(`.*${filters["nameSearch"]}`,"i");
      console.log(re);
    }

    return fungi.fungi.filter(f => {
      for (let i = 0; i < activeFilters.length; i++) {
        const ft = activeFilters[i];
        const fv = filters[ft];

        if (ft === "nameSearch") {

          if (!(re.test(f.name[0]))) {
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

  }

  updateFilterSettings(filter, value) {
    console.log("updateFilterSettings");
    let newFilters = Object.assign({}, this.state.filters);
    newFilters[filter] = value

    const newState = {
      filters: newFilters
    };

    newState["visibleFungi"] = this.generateVisibleFungi(newFilters);

    this.setState(newState)

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
        <div className="left-col">
          <div className="card">
            <div className="card-body">
              <FungiFilter updateFilterSettings={this.updateFilterSettings.bind(this)} filters={this.state.filters} />
              <button className="btn btn-sm btn-primary float-right" onClick={this.resetFilters.bind(this)}>Reset</button>
              <div>
              <h6>{this.state.visibleFungi.length} Matches</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="right-col">
          <div className="fungi-list-container">
            <FungiList fungi={this.state.visibleFungi} />
          </div>
        </div>
      </div>

    )
  }

}

export default Fungi;
