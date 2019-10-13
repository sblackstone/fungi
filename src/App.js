import React from 'react';
import Fungi from './fungi';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="container-fluid">
      <h3>Todo: aliased fields need their looks to work and scraper needs to make sure it knows about all values even if they are in altnerates</h3>
      <Fungi />
    </div>
  );
}

export default App;
