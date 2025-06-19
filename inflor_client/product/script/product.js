import { SERVER } from "./server.js";
// import { contextMenu } from "./contextMenu.js";
// 
const searchInput = document.querySelector("#search");
const searchCancel = document.querySelector("#searchCancel");

const formCustomer = document.querySelector("#form");
const formActionCustomer = formCustomer.getAttribute("action");

let productInput = document.querySelector("#productInput");
let priceInput = document.querySelector("#priceInput");
let quantityInput = document.querySelector("#quantityInput");
let noteInput = document.querySelector("#noteInput");

const saveBtn = document.querySelector("#saveBtn");
const sort = document.querySelector("#sort");

let tBody = document.querySelector("#tBody");
// 
let allProducts = [];

// Показать всех заказчиков
function productShow() {
  fetch(SERVER + "/product/show").then(function (response) {
    response.json().then((resp) => {
      allProducts = resp.reverse();
      render(allProducts);
    });
  });
}
function render(products) {
  tBody.innerHTML = "";
  for (let i = 0; i < products.length; i++) {
    let product = document.createElement("td");
    product.innerHTML = products[i].product;

    let price = document.createElement("td");
    price.innerHTML = products[i].price;

    let quantity = document.createElement("td");
    quantity.innerHTML = products[i].quantity;

    let note = document.createElement("td");
    note.innerHTML = products[i].note;


    // let menu = document.createElement("td");
    let menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "menu-btn";
    menuBtn.id = "menuBtn";
    menuBtn.innerHTML = '<img src="../images/icon-menu.png" alt="меню" />';
    // menu.appendChild(menuBtn);

    let tr = document.createElement("tr");
    tr.appendChild(product);
    tr.appendChild(price);
    tr.appendChild(quantity);
    tr.appendChild(note);

    tr.appendChild(menuBtn);
    // ... (контекстное меню и прочее)
    tBody.appendChild(tr);
  }
}

// Получаем список товаров с сервера
fetch(SERVER + "/product/show")
  .then(res => res.json())
  .then(products => {
    const datalist = document.getElementById("instockProductsList");
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
      product: productInput.value[0].toUpperCase() + productInput.value.slice(1),
      price: priceInput.value[0].toUpperCase() + priceInput.value.slice(1),
      quantity: quantityInput.value[0].toUpperCase() + quantityInput.value.slice(1),
      note: noteInput.value[0].toUpperCase() + noteInput.value.slice(1),
    }),
  });

  productInput.value = "";
  priceInput.value = "";
  quantityInput.value = "";
  noteInput.value = "";
});

// Живой поиск
searchInput.addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  const filtered = allProducts.filter(c =>
    c.product.toLowerCase().includes(query) ||
    c.price.toLowerCase().includes(query) ||
    c.quantity.toLowerCase().includes(query) ||
    c.note.toLowerCase().includes(query)
  );
  render(filtered);
});

// сбросить поиск
searchCancel.addEventListener("click", function () {
  searchInput.value = "";
  render(allProducts);
});

// Сортировка по названию товара
let sortAsc = true;
sort.addEventListener("click", function () {
  sortAsc = !sortAsc;
  this.querySelector('.sort-arrow').textContent = sortAsc ? "▲" : "▼";
  const sorted = [...allProducts].sort((a, b) => {
    if (a.product.toLowerCase() < b.product.toLowerCase()) return sortAsc ? -1 : 1;
    if (a.product.toLowerCase() > b.product.toLowerCase()) return sortAsc ? 1 : -1;
    return 0;
  });
  render(sorted);
});


productShow();

