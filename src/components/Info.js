import React, { Component } from 'react';

class Info extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {container} = this.props;
        return <div>
            {container.map(item => {
                return <div>{item.id} {item.title}</div>
            })}
        </div>
    }
}


export default Info;