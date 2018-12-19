import React, { Component } from 'react';
import { getCdpInfo } from '../../services/cdpService';

class Homepage extends Component {
  async componentDidMount() {
    const cdp = await getCdpInfo(3613);

    console.log(cdp);
  }

  render() {
    return (
      <div>
          Home component
      </div>
    );
  }
}

export default Homepage;
