import { SERVER } from "./server.js";
//
import { formActionCustomer, searchInput, saveBtn, tBody, customerInput, sortCustomer } from "./UI.js";
// 
const searchCancel = document.querySelector("#searchCancel");

let productInput = document.querySelector("#productInput");
let quantityInput = document.querySelector("#quantityInput");
let noteInput = document.querySelector("#noteInput");

// 
let listSales = [];

// Показать всех заказчиков
function sales() {
  fetch(SERVER + "/sales/show").then(function (response) {
    response.json().then((resp) => {
      listSales = resp.reverse();
      render(listSales);
    });
  });
}
function render(sales) {
  tBody.innerHTML = "";
  for (let i = 0; i < sales.length; i++) {
    let customer = document.createElement("td");
    customer.innerHTML = sales[i].customer;

    let product = document.createElement("td");
    product.innerHTML = sales[i].product;

    let quantity = document.createElement("td");
    quantity.innerHTML = sales[i].quantity;

    let note = document.createElement("td");
    note.innerHTML = sales[i].note;


    // let menuBtn = document.createElement("button");
    // menuBtn.type = "button";
    // menuBtn.className = "menu-btn";
    // menuBtn.id = "menuBtn";
    // menuBtn.innerHTML = '<img src="../images/icon-menu.png" alt="меню" />';
    // menu.appendChild(menuBtn);

    let tr = document.createElement("tr");
    tr.appendChild(customer);
    tr.appendChild(product);
    tr.appendChild(quantity);
    // tr.appendChild(note);



    if (note === "") {
      tr.appendChild("");
    } else {
      tr.appendChild(note);
    }
    // ... (контекстное меню и прочее)
    tBody.appendChild(tr);
  }
}

// Получаем список заказчиков с сервера
fetch(SERVER + "/customer/show")
  .then(res => res.json())
  .then(customers => {
    const datalist = document.getElementById("customersList");
    datalist.innerHTML = ""; // очищаем старые опции
    customers.forEach(c => {
      const option = document.createElement("option");
      option.value = c.customer; // имя заказчика
      datalist.appendChild(option);
    });
  });

// Получаем список товаров с сервера
fetch(SERVER + "/product/show")
  .then(res => res.json())
  .then(products => {
    const datalist = document.getElementById("productsList");
    datalist.innerHTML = ""; // очищаем старые опции
    products.forEach(p => {
      const option = document.createElement("option");
      option.value = p.product; // название товара
      datalist.appendChild(option);
    });
  });

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
      product: productInput.value[0].toUpperCase() + productInput.value.slice(1),
      quantity: quantityInput.value[0].toUpperCase() + quantityInput.value.slice(1),
      note: noteInput.value[0].toUpperCase() + noteInput.value.slice(1),
    }),
  });

  customerInput.value = "";
  productInput.value = "";
  quantityInput.value = "";
  noteInput.value = "";
});

// Живой поиск
searchInput.addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  const filtered = listSales.filter(c =>
    c.customer.toLowerCase().includes(query) ||
    c.product.toLowerCase().includes(query) ||
    c.quantity.toLowerCase().includes(query) ||
    c.note.toLowerCase().includes(query)
  );
  render(filtered);
});

// сбросить поиск
searchCancel.addEventListener("click", function () {
  searchInput.value = "";
  render(listSales);
});

// Сортировка по названию товара
let sortCustomerAsc = true;
sortCustomer.addEventListener("click", function () {
  sortCustomerAsc = !sortCustomerAsc;
  this.querySelector('.arrow-customer').textContent = sortCustomerAsc ? "▲" : "▼";
  const sorted = [...listSales].sort((a, b) => {
    if (a.customer.toLowerCase() < b.customer.toLowerCase()) return sortCustomerAsc ? -1 : 1;
    if (a.customer.toLowerCase() > b.customer.toLowerCase()) return sortCustomerAsc ? 1 : -1;
    return 0;
  });
  render(sorted);
});



sales();