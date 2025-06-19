let contextMenu = document.createElement("div");
contextMenu.id = "contextMenu";
contextMenu.style.position = "absolute";
contextMenu.style.display = "none";
contextMenu.style.background = "#fff";
contextMenu.style.border = "1px solid #ccc";
contextMenu.style.zIndex = 1000;
contextMenu.innerHTML = "<div>Действие 1</div><div>Действие 2</div>";
document.body.appendChild(contextMenu);

// Скрывать меню при клике вне его
document.addEventListener("click", () => {
  contextMenu.style.display = "none";
});

