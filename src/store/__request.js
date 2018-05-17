import update from 'immutability-helper';

const enviroment = 'dev';

export function fetchImage(src, {success: successCallback, error: errorCallback}) {
    let path = `http://192.168.1.198:55139/${src}`;
    if(src[0] != 'u')
        path = src;

     fetch(path, {mode: 'cors'})
    .then(response => {
        console.warn("ImageResponse status: " + response.status + " " + response.statusText);
        if(response.ok) {
            return response.blob();
        }

        throw new Error('network')
    })
    .then(blob => {
        if(blob != null) {
            if(successCallback) 
                return successCallback(URL.createObjectURL(blob));
        }

        throw new Error('parse');
    })
    .catch(error => {
        if(errorCallback) errorCallback(error);
    });
}

const __connections = (path) => {
    switch(enviroment) {
        case 'dev': return `http://192.168.1.198:55139/${path}`;
        case 'prod': return path;
    }
}

const __request = (options = {}) => {
    const userToken = localStorage.getItem('user-token');
    const url = __connections(options.url);
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

export default __request;