const adminPassword = 'ewqewq'; 

if (!localStorage.getItem("admin")) {  
    localStorage.setItem("admin", JSON.stringify({ password: adminPassword }));  
}

if (sessionStorage.getItem("isAdminLoggedIn")) {  
    document.querySelector("#loginContainer").style.display = "none";  
    document.querySelector("#sidebar").style.display = "block";  
    document.querySelector("#adminContent").style.display = "block";  

    loadOrders();  
} else {  
    document.querySelector("#loginContainer").style.display = "flex";  
}

document.querySelector("#adminLoginForm").addEventListener("submit", function(event) {  
    event.preventDefault();  
    const passwordInputValue = document.querySelector("#admin-password").value;

    if (passwordInputValue === adminPassword) {  
        sessionStorage.setItem("isAdminLoggedIn", "true");  
        loadOrders();  
        showAdminPanel();
    } else {  
        alert("Неверный пароль!");  
    }  
});

function showAdminPanel() {  
    document.querySelector("#loginContainer").style.display = "none";  
    document.querySelector("#sidebar").style.display = "block";  
    document.querySelector("#adminContent").style.display = "block";  
}

document.addEventListener("DOMContentLoaded", function() {
    loadOrders(); 

    document.querySelector("#orderTable").addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-button")) {
            const index = event.target.getAttribute("data-index");
            deleteOrder(index);
        }
    });
});

function loadOrders() {  
    const orders = JSON.parse(localStorage.getItem("eventOrders")) || [];  
    const tbody = document.querySelector("#orderTable tbody");  
    tbody.innerHTML = ""; 

    orders.forEach((order, index) => {  
        const row = document.createElement("tr");  

        row.innerHTML = `
            <td>${order.code}</td>
            <td>${order.name}</td>
            <td>${order.dateTime}</td>
            <td>${order.location}</td>
            <td>${order.responsible}</td>
            <td>${order.participants}</td>
            <td>
                <select onchange='updateOrderStatus(${index}, this.value)'>
                    <option value='в процессе' ${order.status === 'в процессе' ? 'selected' : ''}>В процессе</option>
                    <option value='принято' ${order.status === 'принято' ? 'selected' : ''}>Принято</option>
                    <option value='отказано' ${order.status === 'отказано' ? 'selected' : ''}>Отказано</option>
                </select>
            </td>
            <td><button class="delete-button" data-index="${index}">Удалить</button></td>`;
        
        tbody.appendChild(row);
    });
}

function deleteOrder(index) {  
    const orders = JSON.parse(localStorage.getItem("eventOrders")) || [];  

 
    const eventNameToDelete = orders[index].name;

 
    orders.splice(index, 1);  
    localStorage.setItem("eventOrders", JSON.stringify(orders));  

  
    removeEventFromPublicStorage(eventNameToDelete);

   
    loadOrders();  
}

function removeEventFromPublicStorage(eventName) {
    const publicEvents = JSON.parse(localStorage.getItem("publicEvents")) || [];
    
    // Удаляем мероприятие из публичного хранилища
    const updatedPublicEvents = publicEvents.filter(event => event.name !== eventName);
    
    localStorage.setItem("publicEvents", JSON.stringify(updatedPublicEvents));
}

function updateOrderStatus(index, status) {  
    const orders = JSON.parse(localStorage.getItem("eventOrders")) || [];  

  
    const orderToUpdate = orders[index];


    orderToUpdate.status = status;  

    localStorage.setItem("eventOrders", JSON.stringify(orders));  


    if (status === 'принято') {
        addEventToPublicStorage(orderToUpdate); 
    } else {
        removeEventFromPublicStorage(orderToUpdate.name);
    }
}

function addEventToPublicStorage(order) {
    const publicEvents = JSON.parse(localStorage.getItem("publicEvents")) || [];
    
   
    if (!publicEvents.some(event => event.name === order.name)) {
        publicEvents.push({
            name: order.name,
            description: order.description || "Описание отсутствует", 
            image: order.imageDataUrl || "img/default-image.jpg" 
        });
        localStorage.setItem("publicEvents", JSON.stringify(publicEvents));
    }
}

document.querySelector("#logoutBtn").addEventListener("click", function() {  
    sessionStorage.removeItem("isAdminLoggedIn");  
    window.location.reload();  
});