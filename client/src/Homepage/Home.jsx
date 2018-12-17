import React, { Component } from "react";

import { getCdpInfo } from '../services/cdpService';

class Home extends Component {
    constructor(props) {
        super(props);
    }

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

export default Home;