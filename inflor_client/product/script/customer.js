import { SERVER } from "./server.js";
// 
import { formActionCustomer, searchInput, saveBtn, tBody, sortCustomer, sortCity } from "./UI.js";
// 
let customerInput = document.querySelector("#customerInput");
let instaInput = document.querySelector("#instaInput");
let phoneInput = document.querySelector("#phoneInput");
let cityInput = document.querySelector("#cityInput");
let postInput = document.querySelector("#postInput");
// 

let listCustomers = [];

// Показать всех заказчиков
function customers() {
  fetch(SERVER + "/customer/show").then(function (response) {
    response.json().then((resp) => {
      listCustomers = resp.reverse();
      render(listCustomers);
    });
  });
}
function render(customers) {
  tBody.innerHTML = "";
  for (let i = 0; i < customers.length; i++) {
    let customer = document.createElement("td");
    customer.innerHTML = customers[i].customer;

    let insta = document.createElement("td");
    insta.innerHTML = customers[i].insta;

    let phone = document.createElement("td");
    phone.innerHTML = customers[i].phone;

    let city = document.createElement("td");
    city.innerHTML = customers[i].city;

    let post = document.createElement("td");
    post.innerHTML = customers[i].post;

    // Ячейка для меню
    let menuTd = document.createElement("td");
    menuTd.className = "menu";

    // Кнопка меню
    let menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "menu-btn";
    menuBtn.innerHTML = '<img src="../images/icon-menu.png" alt="меню" />';
    menuTd.appendChild(menuBtn);

    // Дропбар
    let dropdown = document.createElement("div");
    dropdown.className = "dropdown-menu hidden";
    dropdown.innerHTML = `
      <button class="dropdown-item info">Инфо</button>
      <button id=dropdownEdit class="dropdown-item edit">Редактировать</button>
      <button class="dropdown-item delete">Удалить</button>
    `;
    menuTd.appendChild(dropdown);

    // Показать/скрыть дропбар по клику
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
      // Закрыть другие открытые меню
      document.querySelectorAll(".dropdown-menu").forEach(el => {
        if (el !== dropdown) el.classList.add("hidden");
      });
    });

    // Закрыть дропбар при клике вне
    document.addEventListener("click", function () {
      dropdown.classList.add("hidden");
    });

    let tr = document.createElement("tr");
    tr.appendChild(customer);
    tr.appendChild(insta);
    tr.appendChild(phone);
    tr.appendChild(city);
    tr.appendChild(post);
    tr.appendChild(menuTd); // добавляем ячейку меню в строку
    tBody.appendChild(tr);

    // Обработчики для пунктов меню
    dropdown.querySelector(".info").onclick = () => alert("Инфо: " + customers[i].customer);
    dropdown.querySelector(".edit").onclick = () => alert("Редактировать: " + customers[i].customer);
    dropdown.querySelector(".delete").onclick = () => alert("Удалить: " + customers[i].customer);
  }
}

// Добавление нового заказчика
saveBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  await fetch(SERVER + formActionCustomer, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: customerInput.value[0].toUpperCase() + customerInput.value.slice(1),
      insta: instaInput.value[0].toUpperCase() + instaInput.value.slice(1),
      phone: phoneInput.value[0].toUpperCase() + phoneInput.value.slice(1),
      city: cityInput.value[0].toUpperCase() + cityInput.value.slice(1),
      post: postInput.value[0].toUpperCase() + postInput.value.slice(1),
    }),
  });

  customerInput.value = "";
  instaInput.value = "";
  phoneInput.value = "";
  cityInput.value = "";
  postInput.value = "";
});

// Живой поиск
searchInput.addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  const filtered = listCustomers.filter(c =>
    c.customer.toLowerCase().includes(query) ||
    c.insta.toLowerCase().includes(query) ||
    c.phone.toLowerCase().includes(query) ||
    c.city.toLowerCase().includes(query) ||
    c.post.toLowerCase().includes(query)
  );
  render(filtered);
});
// сбросить поиск
searchCancel.addEventListener("click", function () {
  searchInput.value = "";
  render(listCustomers);
});

// Сортировка по имени заказчика
let sortCustomerAsc = true;
sortCustomer.addEventListener("click", function () {
  sortCustomerAsc = !sortCustomerAsc;
  // Меняем стрелку
  this.querySelector('.arrow-customer').textContent = sortCustomerAsc ? "▲" : "▼";
  const sorted = [...listCustomers].sort((a, b) => {
    if (a.customer.toLowerCase() < b.customer.toLowerCase()) return sortCustomerAsc ? -1 : 1;
    if (a.customer.toLowerCase() > b.customer.toLowerCase()) return sortCustomerAsc ? 1 : -1;
    return 0;
  });
  render(sorted);
});
// сортировака по городу
let sortCityAsc = true;
sortCity.addEventListener("click", function () {
  sortCityAsc = !sortCityAsc;
  // Меняем стрелку
  this.querySelector('.arrow-city').textContent = sortCityAsc ? "▲" : "▼";
  const sorted = [...listCustomers].sort((a, b) => {
    if (a.city.toLowerCase() < b.city.toLowerCase()) return sortCityAsc ? -1 : 1;
    if (a.city.toLowerCase() > b.city.toLowerCase()) return sortCityAsc ? 1 : -1;
    return 0;
  });
  render(sorted);
});

// Получаем список заказчиков с сервера
fetch(SERVER + "/customer/show")
  .then(res => res.json())
  .then(customers => {
    const datalist = document.getElementById("instockCustomersList");
    datalist.innerHTML = ""; // очищаем старые опции
    customers.forEach(c => {
      const option = document.createElement("option");
      option.value = c.customer; // имя заказчика
      datalist.appendChild(option);
    });
  });


tBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("dropdown-item")) {
    e.stopPropagation();
  }
});



customers();

