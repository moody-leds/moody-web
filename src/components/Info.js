import React, { Component } from 'react';

class Info extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {container} = this.props;
        return <div>
            <p><u>Available units</u></p>
            {container.map((item, index) => {
                return <div key={index}>{index + 1}. {item.name}</div>
            })}
        </div>
    }
}


export default Info;