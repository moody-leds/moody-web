import React, { Component } from 'react';

class Loader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="loader">
                <div className="loader__spinner">.</div>
            </div>
        );
    }
}

export default Loader;