import React from 'react';
import FungiList from './fungi_list';
import FungiFilter from './fungi_filter';
import { forceCheck } from 'react-lazyload';
import { getFungi } from './get_fungi';


function PageHeader(props) {
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#">Fungius</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
{/*
    <ul class="navbar-nav mr-auto">

      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>

      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>

      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
*/}
    <form class="form-inline my-2 my-lg-0">
      <FungiFilter fungiMeta={props.fungiMeta} updateFilterSettings={props.updateFilterSettings} filters={props.filters} />
    </form>
    <ul class="navbar-nav mr-auto">
    <li class="nav-item">
    <button className="btn btn-sm btn-primary " onClick={props.resetFilters}>Reset</button>
    </li>

    </ul>
  </div>
</nav>
  )
  return (
    <div className="page-header">
      <h1>Fungius</h1>
      <div className="fb-share-button" data-href="https://fungius.com/" data-layout="button_count" data-size="small"><a target="_blank" rel="noreferrer noopener" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffungius.com%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore">Share</a></div>
      <h6>{props.visibleFungiCount} Matches</h6>
    </div>
  )
}

class Fungi extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      ready: false,
      visibleFungi: [],
      visibleFungiCount: 0,
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
    this.initialState.ready = true;
    this.initialState.fungi        = fungi.fungi.slice(0);
    this.initialState.fungiMeta    = Object.assign({}, fungi.meta);
    this.initialState.visibleFungi = fungi.fungi.slice(0);
    this.setState(this.initialState);


  }

  generateVisibleFungi(filters) {
    const activeFilters = Object.keys(filters).filter(x => x !== '' && filters[x] !== '');
    let re = null;
    if (filters["nameSearch"] !== '') {
      re = new RegExp(`.*${filters["nameSearch"]}`,"i");
    }

    return this.state.fungi.filter(f => {
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
          //console.log("ft not in f");
          return false;
        }

        if (f[ft].indexOf(fv) === -1) {
          //console.log("indexOf(fv) === -1");
          return false;
        }

      }
      return true;
    });

  }

  updateFilterSettings(filter, value) {
    //console.log("updateFilterSettings");
    //console.log(`${filter} ${value}`);
    let newFilters = Object.assign({}, this.state.filters);
    newFilters[filter] = value

    const newState = {
      filters: newFilters
    };

    newState["visibleFungi"] = this.generateVisibleFungi(newFilters);

    newState.visibleFungiCount = newState.visibleFungi.length

    this.setState(newState)

    setTimeout(forceCheck, 25);

  }

  resetFilters(e) {
    this.setState(Object.assign({}, this.initialState));
  }

  render() {
    if (!(this.state.ready)) {
      return null;
    }
    return(
      <React.Fragment>
        <PageHeader resetFilters={this.resetFilters.bind(this)} visibleFungiCount={this.state.visibleFungiCount} fungiMeta={this.state.fungiMeta} fungi={this.state.fungi} filters={this.state} updateFilterSettings={this.updateFilterSettings.bind(this)} />
        <div className="fungi-list-container">
          <FungiList fungiMeta={this.state.fungiMeta} fungi={this.state.visibleFungi} />
        </div>
      </React.Fragment>
    )
  }

}

export default Fungi;
