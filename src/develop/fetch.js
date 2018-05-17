import React from 'react';

// Использование Fetch
// - method
// - headers
// - body
// - mode
// - credentials
// - cache
// - redirect

const request = (options = {}, success, error) => {
    const mode = 'cors';
    const headers = update({
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${userToken}`
    }, {$merge: options.headers || {}});

    const request = fetch(url, {
        method: options.method || 'GET',
        mode,
        headers,
        body: options.body
    })

    return request;
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 200
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
    }

    getData(value = 200) {
        const apiUrl = `http://localhost:50146/api`;
        const apiMethod = `values/${value}`;
        const queryString = `${apiUrl}/${apiMethod}`;

        // Request init
        const requestInit = {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
            mode: 'no-cors',
            credentials: 'omit',
            cache: 'default',
            redirect: 'follow'
        }

        // Start fetch
        console.log(`Fetch ${queryString}, start.`);
        const request = fetch(queryString, requestInit)
            .then(response => response.json())
            .then(data => {
                console.log(`Data: ${data}`)
            })
            // .catch(reason => {
            //     console.log(`Error reason: ${reason}`);
            // })
    }

    handleClick() {
        this.getData(this.state.value);
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    render() {
        return(
            <div>
                <label>Response type:</label>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                <br />
                <button onClick={this.handleClick}>Fetch</button>
            </div>
        )
    }
}

export default Controller;