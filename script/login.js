
          document.getElementById('loginForm').addEventListener('submit', function(event) {
              event.preventDefault(); 

              const email = document.getElementById('login-email').value;
              const password = document.getElementById('login-password').value;

              let users = JSON.parse(localStorage.getItem('users')) || [];
              const user = users.find(user => user.email === email && user.password === password);

              if (user) {
                  alert("Вход успешен! Добро пожаловать, " + user.name);
                  
               
                  sessionStorage.setItem('currentUser', JSON.stringify(user));
                  
                  window.location.href = 'index7.html'; 
              } else {
                  alert("Неверный email или пароль.");
              }
          });
          document.addEventListener('DOMContentLoaded', function() {
            const initialUser = {
                name: "Ковалев Степан Васильевич",
                email: "aa@mail.ru",
                phone: "+7(906)-561-43-22",
                password: "321321", 
                date: "2005-03-03" 
            };
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (!users.some(existingUser => existingUser.email === initialUser.email)) {
                users.push(initialUser);
                localStorage.setItem('users', JSON.stringify(users));
                console.log("Начальный пользователь добавлен в localStorage.");
            } else {
                console.log("Пользователь с таким email уже существует.");
            }
        });
    