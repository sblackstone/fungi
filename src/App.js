import React from 'react';
import Fungi from './fungi';
import './bootstrap.min.css';
import './App.css';
import { default as storage } from 'local-storage';
import AcceptTos from './accept_tos';

// debug tos
// storage.set('tos-accepted', false);

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      tosAccepted: storage.get('tos-accepted') || false
    }
  }

  onAcceptTos(e) {
    storage.set('tos-accepted', true);
    this.setState({
      tosAccepted: true
    });
  }

  render() {

    if (this.state.tosAccepted) {
      return ( <Fungi /> );
    } else {
      return <AcceptTos onAcceptTos={this.onAcceptTos.bind(this)} />;
    }
    
  }  
}

export default App;
