const createCustomElement = (type, props, ...children) => {
    if(typeof type !== "string") throw new Error("Not a valid DOMElement type");

    let element = document.createElement(type);
    Object.assign(element, props);
    if(children.length) element.append(...children);
    
    return element;
}

const divRow = (key, value) => 
    createCustomElement("div", { className:"row" },
        createCustomElement("h3", { className:"col" }, key),
        createCustomElement("p",  { className:"col" }, value,
        )
    )