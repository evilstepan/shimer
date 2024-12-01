function loadProfile() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('profile-pic').src = currentUser.avatar || 'img/free-icon-boy-4537069.png';
        document.getElementById('user-name').innerText = currentUser.name;
        document.getElementById('user-email').innerText = `Email: ${currentUser.email}`;
        document.getElementById('user-phone').innerText = `Телефон: ${currentUser.phone}`;
        loadEvents(); 
    } else {
        alert('Пожалуйста, войдите в систему.');
        window.location.href = 'login.html';
    }
}

function saveProfile() {
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    const currentUser = { name, email, phone, avatar: document.getElementById('profile-pic').src };
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    loadProfile();
    toggleEditForm();
}

function closeAllForms() {
    document.getElementById('edit-form').style.display = 'none';
    document.getElementById('events-list').style.display = 'none';
    document.getElementById('order-event-form').style.display = 'none';
    document.getElementById('accepted-events-list').style.display = 'none'; 
}

function toggleEditForm() {
    closeAllForms();
    const form = document.getElementById('edit-form');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
    
    if (form.style.display === 'block') {
        document.getElementById('edit-name').value = document.getElementById('user-name').innerText;
        document.getElementById('edit-email').value = document.getElementById('user-email').innerText.replace('Email: ', '');
        document.getElementById('edit-phone').value = document.getElementById('user-phone').innerText.replace('Телефон: ', '');
    }
}

function toggleEventsList() {
    closeAllForms();
    const eventsList = document.getElementById('events-list');
    eventsList.style.display = eventsList.style.display === 'block' ? 'none' : 'block';
}

function toggleOrderEventForm() {
    closeAllForms();
    const orderForm = document.getElementById('order-event-form');
    orderForm.style.display = orderForm.style.display === 'block' ? 'none' : 'block';
}

function toggleAcceptedEventsList() {
    closeAllForms();
    const acceptedEventsList = document.getElementById('accepted-events-list');
    acceptedEventsList.style.display = acceptedEventsList.style.display === 'block' ? 'none' : 'block';

    if (acceptedEventsList.style.display === 'block') {
        loadAcceptedEvents();
    }
}

function loadAcceptedEvents() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const acceptedEvents = JSON.parse(localStorage.getItem("acceptedEvents")) || [];

    const container = document.querySelector('.accepted-events-container');
    container.innerHTML = ''; 

    acceptedEvents.forEach(event => {
        if (event.userId === currentUser.email) {
            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");
            eventCard.id = `event-${event.name}`; 
            const eventImage = event.imageDataUrl || 'img/default-image.jpg';

            eventCard.innerHTML = `
                <img src="${eventImage}" alt="${event.name} Image" />
                <h4>${event.name}</h4>
                <p>${event.description}</p>
                <p class="textP">Статус: ${event.status}</p>
                <button style="display: inline-block;
                padding: 10px 20px;
                background-color: #6a1b9a;
                color: #fff;
                text-decoration: none;
                font-size: 16px;
                border-radius: 5px;" onclick="cancelEvent('${event.name}')">Отменить мероприятие</button>
            `;
            container.appendChild(eventCard);
        }
    });
}



function cancelEvent(eventName) {
    console.log("Отменяем мероприятие с именем:", eventName);

    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    let acceptedEvents = JSON.parse(localStorage.getItem("acceptedEvents")) || [];

  
    const updatedEvents = acceptedEvents.filter(event => event.name !== eventName || event.userId !== currentUser.email);

  
    if (updatedEvents.length !== acceptedEvents.length) {
        console.log("Мероприятие удалено, обновляем localStorage");
        localStorage.setItem("acceptedEvents", JSON.stringify(updatedEvents));
    } else {
        console.warn("Мероприятие с таким именем не найдено или уже удалено.");
    }

    
    const eventCard = document.getElementById(`event-${eventName}`);
    if (eventCard) {
        eventCard.remove(); 
        console.log(`Удалён элемент с ID: event-${eventName}`);
    } else {
        console.warn(`Элемент с ID: event-${eventName} не найден в DOM`);
    }

    alert("Мероприятие успешно удалено из принятых!");
}








document.addEventListener("DOMContentLoaded", () => {
   
    document.querySelector("#order-event-form button").onclick = orderEvent;

    
    const letterOnlyFields = ['event-name', 'event-location', 'event-responsible', 'event-description'];
    letterOnlyFields.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.addEventListener('keypress', (event) => {
                if (/\d/.test(event.key)) {
                    event.preventDefault();
                }
            });
        }
    });
});

function orderEvent() {
    const codeElem = document.getElementById('event-code');
    const nameElem = document.getElementById('event-name');
    const dateTimeElem = document.getElementById('event-date-time');
    const locationElem = document.getElementById('event-location');
    const responsibleElem = document.getElementById('event-responsible');
    const participantsElem = document.getElementById('event-participants');
    const imageElem = document.getElementById('event-image');
    const descriptionElem = document.getElementById('event-description');

    if (!codeElem || !nameElem || !dateTimeElem || !locationElem || !responsibleElem || 
        !participantsElem || !imageElem || !descriptionElem) {
        alert("Ошибка: один или несколько элементов формы не найдены.");
        return;
    }

    const code = codeElem.value.trim();
    const name = nameElem.value.trim();
    const dateTime = dateTimeElem.value;
    const location = locationElem.value.trim();
    const responsible = responsibleElem.value.trim();
    const participants = participantsElem.value.trim();
    const eventImageFile = imageElem.files[0];
    const eventDescription = descriptionElem.value.trim();

    const lettersOnlyRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
    const nonEmptyRegex = /.+/;

    function showError(elem, message) {
        elem.classList.add('input-error');
        alert(message);
    }

    clearValidationErrors();

    let isValid = true;

    if (code.length < 3 || code.length > 10) {
        showError(codeElem, 'Код мероприятия должен содержать от 3 до 10 символов.');
        isValid = false;
    }

    if (!name || !lettersOnlyRegex.test(name)) {
        showError(nameElem, 'Название мероприятия должно содержать только буквы.');
        isValid = false;
    }

    if (!dateTime) {
        showError(dateTimeElem, 'Пожалуйста, выберите дату и время мероприятия.');
        isValid = false;
    } else {
        const eventDate = new Date(dateTime);
        const currentDate = new Date();

        if (eventDate < currentDate) {
            showError(dateTimeElem, 'Неверная форма даты времени.');
            isValid = false;
        } else if (isNaN(eventDate.getTime())) {
            showError(dateTimeElem, 'Некорректная дата и время мероприятия.');
            isValid = false;
        }
    }

    if (!location || !lettersOnlyRegex.test(location)) {
        showError(locationElem, 'Место проведения должно содержать только буквы.');
        isValid = false;
    }

    if (!responsible || !lettersOnlyRegex.test(responsible)) {
        showError(responsibleElem, 'Ответственное лицо должно содержать только буквы.');
        isValid = false;
    }

    if (!participants) {
        showError(participantsElem, 'Пожалуйста, укажите хотя бы одного участника.');
        isValid = false;
    }

    if (!eventDescription || eventDescription.length < 10) {
        showError(descriptionElem, 'Описание должно содержать не менее 10 символов.');
        isValid = false;
    }

    if (!isValid) return;

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const userEmail = currentUser ? currentUser.email : '';

    const order = {
        userId: userEmail,
        code,
        name,
        dateTime,
        location,
        responsible,
        participants,
        description: eventDescription,
        status: "в процессе"
    };

    if (eventImageFile) {
        const reader = new FileReader();
        reader.onloadend = function () {
            order.imageDataUrl = reader.result;
            saveOrder(order);
        };
        reader.readAsDataURL(eventImageFile);
    } else {
        saveOrder(order);
    }
}

function clearValidationErrors() {
    document.querySelectorAll('.input-error').forEach(elem => {
        elem.classList.remove('input-error');
    });
}

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('eventOrders')) || [];
    orders.push(order);
    localStorage.setItem('eventOrders', JSON.stringify(orders));

    alert(`Мероприятие "${order.name}" заказано!`);
    clearOrderEventForm();
    toggleOrderEventForm();
}


function clearOrderEventForm() {
    document.getElementById('event-code').value = '';
    document.getElementById('event-name').value = '';
    document.getElementById('event-date-time').value = '';
    document.getElementById('event-location').value = '';
    document.getElementById('event-responsible').value = '';
    document.getElementById('event-participants').value = '';
    document.getElementById('event-image').value = '';
    document.getElementById('event-description').value = '';
}

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('eventOrders')) || [];
    orders.push(order);
    localStorage.setItem('eventOrders', JSON.stringify(orders));

    alert(`Мероприятие "${order.name}" заказано!`);
    clearOrderEventForm();
    toggleOrderEventForm();
}

function clearOrderEventForm() {
    document.getElementById('event-code').value = '';
    document.getElementById('event-name').value = '';
    document.getElementById('event-date-time').value = '';
    document.getElementById('event-location').value = '';
    document.getElementById('event-responsible').value = '';
    document.getElementById('event-participants').value = '';
    document.getElementById('event-image').value = '';
    document.getElementById('event-description').value = '';
}

function saveOrder(order) {
   const orders = JSON.parse(localStorage.getItem('eventOrders')) || [];
   const publicEvents = JSON.parse(localStorage.getItem('publicEvents')) || [];

   orders.push(order);
   publicEvents.push({
       name: order.name,
       description: order.description,
       imageDataUrl: order.imageDataUrl 
   });

   localStorage.setItem('eventOrders', JSON.stringify(orders));
   localStorage.setItem('publicEvents', JSON.stringify(publicEvents)); 

   alert(`Мероприятие "${order.name}" заказано!`);

   clearOrderEventForm();

   toggleOrderEventForm();
}

function clearOrderEventForm() {
   document.getElementById('event-code').value = '';
   document.getElementById('event-name').value = '';
   document.getElementById('event-date-time').value = '';
   document.getElementById('event-location').value = '';
   document.getElementById('event-responsible').value = '';
   document.getElementById('event-participants').value = '';
   document.getElementById('event-image').value = ''; 
   document.getElementById('event-description').value = ''; 
}

function logout() {
   sessionStorage.removeItem('currentUser');
   window.location.href = 'login.html';
}

function loadEvents() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    const orders = JSON.parse(localStorage.getItem("eventOrders")) || [];

    const userOrders = orders.filter(order => order.userId === currentUser.email);

    const tbody = document.querySelector('#events-list tbody');

    tbody.innerHTML = '';

    userOrders.forEach(order => {
        const row = document.createElement("tr");

        
        const imageSrc = order.imageDataUrl || 'img/edinstvo.WEBP';

        row.innerHTML =
            `<td>${order.code}</td>` +
            `<td>${order.name}</td>` +
            `<td>${order.dateTime}</td>` +
            `<td>${order.location}</td>` +
            `<td>${order.responsible}</td>` +
            `<td>${order.participants}</td>` +
            `<td>${order.description}</td>` + 
            `<td><img src="${imageSrc}" alt="${order.name} Image" style="width: 50px; height: auto;" /></td>` + 
            `<td>${order.status}</td>`;

        tbody.appendChild(row);
    });
}


loadProfile();