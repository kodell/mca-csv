import React, { Component } from 'react';
import './App.css';

import Downloader from './Downloader';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Magic Club Academy CSV Format Tool
        </header>
        <section>
          <Downloader />
        </section>
      </div>
    );
  }
}

export default App;
