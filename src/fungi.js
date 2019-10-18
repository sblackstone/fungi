import React from 'react';
import FungiList from './fungi_list';
import FungiFilter from './fungi_filter';
import { forceCheck } from 'react-lazyload';
import { getFungi } from './get_fungi';

class Fungi extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      visibleFungi: [],
      fungi: [],
      fungiMeta: {
        attributes: {}
      },
      filters: {
      }
    };

    this.state = Object.assign({}, this.initialState);
  }

  async componentDidMount() {
    const fungi = await getFungi();
    window.fungi = fungi;
    Object.keys(fungi.meta.attributes).forEach(ft => this.initialState.filters[ft] = "");
    this.initialState.filters["nameSearch"] = "";

    this.initialState.fungi        = fungi.fungi.slice(0);
    this.initialState.fungiMeta    = Object.assign({}, fungi.meta);
    this.initialState.visibleFungi = fungi.fungi.slice(0);
    this.setState(this.initialState);


  }

  generateVisibleFungi(filters) {
    const activeFilters = Object.keys(filters).filter(x => x !== '' && filters[x] !== '');
    console.log(`activeFilters`);
    console.log(activeFilters);
    let re = null;
    if (filters["nameSearch"] !== '') {
      re = new RegExp(`.*${filters["nameSearch"]}`,"i");
    }

    return this.state.fungi.filter(f => {
      console.log(f);
      for (let i = 0; i < activeFilters.length; i++) {
        const ft = activeFilters[i];
        const fv = filters[ft];
        console.log(`${i} ${ft} ${fv}`);

        if (ft === "nameSearch") {

          if (!(re.test(f.name[0]))) {
            return false;
          } else {
            continue;
          }
        };

        if (!(ft in f)) {
          console.log("ft not in f");
          return false;
        }

        if (f[ft].indexOf(fv) === -1) {
          console.log("indexOf(fv) === -1");
          return false;
        }

      }
      return true;
    });

  }

  updateFilterSettings(filter, value) {
    console.log("updateFilterSettings");
    console.log(`${filter} ${value}`);
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
    this.setState(Object.assign({}, this.initialState));
  }

  render() {
    return(
      <div className="row">
        <div className="left-col">
          <div className="card">
            <div className="card-body">
              <FungiFilter fungiMeta={this.state.fungiMeta} updateFilterSettings={this.updateFilterSettings.bind(this)} filters={this.state.filters} />
              <button className="btn btn-sm btn-primary float-right" onClick={this.resetFilters.bind(this)}>Reset</button>
              <div>
              <h6>{this.state.visibleFungi.length} Matches</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="right-col">
          <div className="fungi-list-container">
            <FungiList fungiMeta={this.state.fungiMeta} fungi={this.state.visibleFungi} />
          </div>
        </div>
      </div>

    )
  }

}

export default Fungi;
