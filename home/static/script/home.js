/*
    Cambiar el display del pop-up form para que se vea en pantalla cuando el user 
    presione el boton 'Create', o para que se oculte cuando envia el formulario.

    @param visible: bool, Indica si se debe mostrar u ocultar el pop-up form
*/
const changeDisplayForm = (visible) => {
    if(visible) {
        document.getElementById("CreateUser").style.display = "flex";
    }
    else {
        document.getElementById("CreateUser").style.display = "none";
    }
}

const clearForm = () => {
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("contactPhone").value = "";
}

function injectContactInDom({username, email, phone}) {
    let divContact     = document.getElementById("ContactsUser");
    let customElement =
    createCustomElement("section", {},
        createCustomElement("div", { className:"headerSection" }, 
            createCustomElement("input", 
                                { 
                                    type:"checkbox", 
                                    id:"checkboxDelete",
                                    onclick:function(event) {
                                        changeDeleteOptions(event.target.checked);
                                    },
                                }),
            createCustomElement("img", { src:"/static/anonymous.png" }),
        ),
        createCustomElement("address", { className:"table" },
            divRow("Usuario: ", username),
            divRow("Correo: ", email),
            divRow("Teléfono: ", phone)
        )
    );
    divContact.appendChild(customElement);
}

const validateDataNewContact = (username, email, phone) => {
    let goodUsername = username.match(/([a-z0-9]{1,15})/ig);
    let goodEmail    = email.match(/([a-z0-9]{1,15})@((gmail)|(hotmail)|(yahoo)|(outlook))\.com/ig)
    let goodPhone    = phone.match(/([0-9]{10})/g);

    return (goodUsername && goodEmail && goodPhone)? true: false;
}

const errorHandler = (errorMsg) => {
    let error = document.getElementById("error");
    error.childNodes[1].innerText = errorMsg;
    error.style.display = "flex"; 
    setTimeout(() => error.style.display = "none", 3000);
}

const getUserData = () => {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("contactPhone").value;
    clearForm();

    if(validateDataNewContact(username, email, phone)) {
        return JSON.stringify ({
            "username" : username,
            "email"    : email,
            "phone"    : phone
        })
    }
    else {
        errorHandler("Error, datos invalidos");
        return false;
    }
}

const getCookie = (nameCsrfCookie) => {
    let index_csrfCookie = document.cookie.search(nameCsrfCookie);
    let allCookies = document.cookie.split(";");
    let csrfCookie = allCookies[index_csrfCookie];
    let csrfToken = csrfCookie.split("=")[1];

    return csrfToken;
}

const sendNewContactToServer = (newContact) => {
    return fetch("http://127.0.0.1:8000/new/", {
        method:"POST",
        body:newContact,
        credentials:"same-origin",
        headers:{
            "Content-Type":"application/json; charset=UTF-8",
            "X-CSRFToken": getCookie("csrftoken"),
        },
    })
    .then(response => {
        switch(response.status) {
            case 201:
                return 201;
            case 403:
                return 403;
            case 500:
                return 500;
        }
    })
}

/* Creamos un nuevo contacto, lo renderizamos en la pagina y lo guardamos en la base de datos. */
const createNewContact = () => {
    changeDisplayForm(false);
    let newContact = getUserData();
    
    if(newContact) {
        sendNewContactToServer(newContact).then(statusCode => {
            if(statusCode === 201) injectContactInDom(JSON.parse(newContact))
            else if (statusCode === 403) errorHandler("Error, el usuario ya esta registrado en tu agenda de contactos");
            else errorHandler("Error, datos invalidos");
        })
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Verificamos si todas las tarjetas de contacto estan clickeadas */
const hasClicksPressed = () => {
    let contactsUser = document.getElementById("ContactsUser").childNodes;

    for(let i=0; i<contactsUser.length; i++) {
        if(contactsUser[i].childNodes[0].childNodes[0].checked === false) {
            return false;
        }
    }
    return true;
}

/* Verificamos que ninguna tarjeta de contacto este clickeada */

const hasClicksUnPressed = () => {
    let contactsUser = document.getElementById("ContactsUser").childNodes;

    for(let i=0; i<contactsUser.length; i++) {
        if(contactsUser[i].childNodes[0].childNodes[0].checked === true) {
            return true;
        }
    }
    return false;
}

/* Este metodo oculta las opciones para borrar las tarjetas de contactos. Estas solo se habilitaran 
   cuando el usuario haga click por lo menos en una tarjeta. */
const hideDeleteOptions = (enable) => {
    if(enable) {
        document.getElementById("DeleteButton").style.display = "inline-block";
        document.getElementById("selectAll").style.display = "inline-block";
        document.getElementById("checkboxDeleteAll").style.display = "inline-block";
    }
    else {
        document.getElementById("DeleteButton").style.display = "none";
        document.getElementById("selectAll").style.display = "none";
        document.getElementById("checkboxDeleteAll").style.display = "none";
    }
}

/* Este metodo cumple dos tareas:
   
   1. Marcar la casilla "checkboxDeleteAll" si todas las tarjetas fueron clickeadas
   2. Ademas, segun indique el parametro "visible", se ocultaran las opciones de borrado

   @param visible, es un booleano que indica si debemos ocultar o no las opciones de borrado.
*/

const changeDeleteOptions = (visible) => {
    document.getElementById("checkboxDeleteAll").checked = (hasClicksPressed())? true: false

    if(visible) {
        hideDeleteOptions(true);
    }
    else {
        if(hasClicksUnPressed() === false) {
            hideDeleteOptions(false);
        }
    }
}

/* 
    Esta función clickea o desclickea todos los checks, segun lo determinado por el parametro option.
    Ademas si option == false, ocultamos las opciones de borrado.

    @param option, option es un booleano que indica si se deben clickear o desclickear todos los check
*/
const clickedAllChecked = (option) => {
    let contactsUser = document.getElementById("ContactsUser").childNodes;

    for(let i=0; i<contactsUser.length; i++) {
        contactsUser[i].childNodes[0].childNodes[0].checked = option;
    }
    if(option === false) {
        hideDeleteOptions(false);
    }
}

/*  */

const deleteContactToServer = (email) => {
    fetch("http://127.0.0.1:8000/delete/", {
        method:"POST",
        body:JSON.stringify({"users": email}),
        credentials:"same-origin",
        headers:{
            "Content-Type":"application/json; charset=UTF-8",
            "X-CSRFToken": getCookie("csrftoken"),
        },
    })
}

/* Este metodo sirve para borrar aquellas tarjetas de contacto que esten clickeadas y que el usuario haya 
   decidido eliminar. Luego se ocultaran las opciones de borrado */
const deleteItems = () => {
    let contactsUser = document.getElementById("ContactsUser").childNodes;
    let users = [];
    let index = 0;

    while(index < contactsUser.length) {
        if(contactsUser[index].childNodes[0].childNodes[0].checked) {
            user = contactsUser[index].childNodes[1].childNodes[0].childNodes[1].innerText;
            users.push(user);
            document.getElementById("ContactsUser").removeChild(contactsUser[index]);
        }
        else {
            index++;
        }
    }
    hideDeleteOptions(false);
    deleteContactToServer(users);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Solicitamos los contactos almacenados para el usuario actual, luego se renderizan en la pagina. */
const getStoredContacts = () => {
    fetch("http://127.0.0.1:8000/contacts/", {
        method:"GET",
        credentials:"same-origin",
        headers:{
            "X-CSRFToken": getCookie("csrftoken"),
        },
    })
    .then(response => response.json())
    .then(contacts  => {
        for(let contact of contacts) {
            injectContactInDom(contact);
        }
    })
}
getStoredContacts();