import React from 'react';
import './accept_tos.scss';
import Poison from './poison.jpg';

function AcceptTos(props) {
  return (
    <div className="accept-tos-container">
      <div className="card">
        <div className="card-header">
          Disclaimer
        </div>
        <div className="card-body">
          <img src={Poison} alt="Destroying Angel" />
          <p>Fungius.com relies on the data of Wikipedia's Mushroom Pages and may be inaccurate.</p>
          <p>Never eat any mushroom unless you are certain of its identification</p>

    
        </div>
        <div className="card-footer">
          <button className="btn-primary btn" onClick={props.onAcceptTos}>I Accept</button>
          
        </div>
      </div>
    
    </div>
  )
}

export default AcceptTos;