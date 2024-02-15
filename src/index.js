import "./style.css";
const addBtn = document.querySelector(".addBtn");
const addProjectModal = document.querySelector(".addProjectModal");
addBtn.addEventListener("click", () => {
  addProjectModal.showModal();
});
