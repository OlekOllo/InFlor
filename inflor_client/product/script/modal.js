const modal = document.querySelector("#modal");
const openBtn = document.querySelector("#add-button");
const cancelBtn = modal.querySelector("#cancel");
const saveBtn = modal.querySelector("#saveBtn");

openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

saveBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});
