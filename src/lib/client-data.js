import Cookies from 'universal-cookie';

var cookies = new Cookies();
var isLocalStorageAvaliable = (() => {
    try{
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch(e) {
        return false;
    }
})();

function setClientData(values, options = ({ cookies: false, localStorage: false })) {
    _.forin(values, (value, key) => {
        if(cookies)
            cookies.set(`${key}`, `${value}`);

        if(isLocalStorageAvaliable && localStorage)
            localStorage.setItem(`${key}`, `${value}`);
    })
}

function getClientData(value, options = ({ cookies: false, localStorage: false })) {
    if(cookies) {
        return cookies.get(value);
    }

    if(localStorage && isLocalStorageAvaliable) {
        return localStorage.getItem(value);
    }
}

function removeClientData(value, options = ({ cookies: false, localStorage: false })) {
    if(cookies) {
        cookies.remove(value);
    }

    if(localStorage && isLocalStorageAvaliable) {
        localStorage.removeItem(value);
    }
}

export var cookieSetData = (values) => setClientData(values, { cookies: true });
export var cookieGetData = (value) => getClientData(value, { cookies: true });
export var cookieRemoveData = (value) => removeClientData(value, { cookies: true });
export var localStorageSetData = (values) => setClientData(values, { localStorage: true });
export var localStorageGetData = (value) => getClientData(value, { localStorage: true });
export var localStorageRemoveData = (value) => removeClientData(value, { localStorage: true });