import {
    BACKEND_PORT
} from "./config.js";

/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}


/**
 * get element by selecot
 * @param {*} selector 
 */
export const getElement = (selector) => {
    return document.querySelector(selector);
};

/**
 * add event by for element
 */
export const onEventByEl = (element, eventName, fn) => {
    if (element) {
        element.addEventListener(eventName, fn);
    }
}

/**
 * bind event
 * @param {*} selector element selector
 * @param {*} eventName event name
 * @param {*} fn callback function
 */
export const onEvent = (selector, eventName, fn) => {
    const element = document.querySelector(selector);
    if (element) {
        onEventByEl(element, eventName, fn);
    }
}

/**
 * Show the specific element
 */
export const show = (selector) => {
    const element = getElement(selector);
    element.classList.remove("d-none");
}

/**
 * Hide one element with the given selector
 * @param {*} selector 
 */
export const hideOne = (selector) => {
    const element = getElement(selector);
    if (element) {
        if (!element.classList.contains("d-none")) {
            element.classList.add("d-none");
        }
    }
}

/**
 * Hide all the element with role attributes under the main
 * label
 */
export const hideAllRoles = () => {
    const els = document.querySelectorAll("main div[role]");
    if (els && els.length > 0) {
        for (const el of els) {
            if (!el.classList.contains("d-none")) {
                el.classList.add("d-none");
            }
        }
    }
}

export const hideAll = () => {
    hideAllRoles();
    hideOne(".headerMain");
    hideOne(".text-center");
}

/**
 * Http request tool
 * @param {*} path request url
 * @param {*} method request method, it could be get/post/put/delete
 * @param {*} body request data
 * @returns 
 */
export const apiCall = (path, method, body) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: method,
            headers: {
                'Content-type': 'application/json',
            },
        };
        if (method === 'GET') {
            // Come back to this
        } else {
            options.body = JSON.stringify(body);
        }
        if (localStorage.getItem('token')) {
            options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        }

        fetch(`http://localhost:${BACKEND_PORT}${path}`, options).then((response) => resolve(response.json()));
    });

};

/**
 * Show the message box
 * @param {*} messageTitle 
 * @param {*} messageContent 
 */
export const msgBox = (messageTitle, messageContent) => {
    const msgTitle = getElement("#msg-title");
    msgTitle.textContent = messageTitle;
    const msgContent = getElement("#msg-body");
    msgContent.textContent = messageContent;
    const messageBoxD = getElement(".message-box");
    if (messageBoxD.classList.contains("d-none")) {
        messageBoxD.classList.remove("d-none");
    }
}

export const getFeedCreateDate = (dateStr) => {
    const startDate = new Date(dateStr);
    const startDay = startDate.getDate();
    const currDate = new Date();
    const currDay = currDate.getDate();
    if (startDay !== currDay) {
        return startDay + "/" + startDate.getMonth() + 1 + "/" + startDate.getFullYear();
    } else {
        return startDate.getHours() + ":" + startDate.getMinutes();
    }
}


/**
 * input validation  
 */
export const validation = (email, name, password) => {
    const reEmail = '(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}';
    const rePassword = '(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}';
    if (!email.match(reEmail)) {
        return 1;
    }
    if (name.length < 4) {
        return 2;
    }
    if (!password.match(rePassword)) {
        return 3;
    }
    return 4;
}


/**
 * create a dom 
 */
export const createDOM = (DOMOBJ, root) => {
    let d = document.createElement(DOMOBJ.el);
    for (const key in DOMOBJ) {
        d[key] = DOMOBJ[key];
    }
    for (const key in DOMOBJ.style) {
        d.style[key] = DOMOBJ.style[key];
    }
    return d;
}
