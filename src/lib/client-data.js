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

function setClientData(key, value, {useCookies} = false, {useLocalStorage} = false) {
    if(useCookies) {
        cookies.set(`${key}`, `${value}`);
    }

    if(useLocalStorage && isLocalStorageAvaliable) {
        localStorage.setItem(`${key}`, `${value}`);
    }
}

function getClientData(value, {useCookies} = false, {useLocalStorage} = false) {
    if(useCookies) {
        return cookies.get(value);
    }

    if(useLocalStorage && isLocalStorageAvaliable) {
        return localStorage.getItem(value);
        // hello
    }
}

function removeClientData(value, {useCookies} = false, {useLocalStorage} = false) {
    if(useCookies) {
        cookies.remove(value);
    }

    if(useLocalStorage && isLocalStorageAvaliable) {
        localStorage.removeItem(value);
    }
}

export var cookieSetData = (key, value) => setClientData(key, value, { useCookies: true });
export var cookieGetData = (value) => getClientData(value, { useCookies: true });
export var cookieRemoveData = (value) => removeClientData(value, { useCookies: true });
export var localStorageSetData = (key, value) => setClientData(key, value, { useLocalStorage: true });
export var localStorageGetData = (value) => getClientData(value, { useLocalStorage: true });
export var localStorageRemoveData = (value) => removeClientData(value, { useLocalStorage: true });