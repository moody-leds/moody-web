import React, {Component} from 'react';

import Content from './components/Content';
import Nav from './components/Nav';
import ioClient from 'socket.io-client';
import {config} from './config';

import './assets/css/style.css';

class App extends Component {
    constructor(props){
        super(props);
        
        this.initSocket();
        
        this.state = {
            page: 'color',
            container: []
        }
    }
    
    changePage = (page) => {
        this.setState({page});
    }
    
    initSocket = () => {
        this.socket = ioClient(config.uri);
        
        this.socket.on('connect', () => {
            this.socket.emit('init');

            this.socket.on('initSuccess', response => {
                this.setState(prev => ({
                    container: [].concat(prev.container, response)
                }));
            });
        });
    }
    
    handleSet = (color) => {
        this.socket.emit('set', {
            id: 0,
            color
        });
    }
    
    render() {
        const {page, container} = this.state;
        return <div>
            <Nav changePage={this.changePage} />
            <Content setColor={this.handleSet} page={page} container={container} />
        </div>;
    }
}

export default App;