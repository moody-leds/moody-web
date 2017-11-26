import React, {Component} from 'react';

import Content from './components/Content';
import Nav from './components/Nav';
import Loader from './components/Loader';
import ioClient from 'socket.io-client';
import {config} from './config';

import './assets/css/style.css';

class App extends Component {
    constructor(props){
        super(props);
        
        this.initSocket();
        
        this.state = {
            page: 'color',
            container: [],
            connected: false
        }
    }
    
    changePage = (page) => {
        this.setState({page});
    }
    
    initSocket = () => {
        this.socket = ioClient(config.uri);
        
        this.socket.on('connect', () => {
            this.setState({
                connected: true
            })
            
            this.socket.emit('init');

            this.socket.on('initSuccess', response => {
                this.setState(prev => ({
                    container: [].concat(prev.container, response)
                }));
            });
        });
    }
    
    handleSet = (units, color) => {
        units.map(unit => {
            this.socket.emit('set', {
                id: unit,
                color
            });
        });
    }
    
    render() {
        const {page, container, connected} = this.state;
        
        if(!connected){
            return <div className="connection-error">
                <Loader />
                <div>Brak połączenia</div>
            </div>
        }
        
        return <div>
            <Nav changePage={this.changePage} />
            <Content setColor={this.handleSet} page={page} container={container} />
        </div>;
    }
}

export default App;