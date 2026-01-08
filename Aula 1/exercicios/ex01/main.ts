const input = document.querySelector("#taskInput") as HTMLInputElement;
const button = document.querySelector("#addBtn") as HTMLButtonElement;
const list = document.querySelector("#taskList") as HTMLUListElement;
const output = document.querySelector("#output") as HTMLDivElement;

button.addEventListener("click", () => {
  const taskText: string = input.value;

  if (taskText === "") {
    return;
  }

  const li = document.createElement("li");
  li.textContent = taskText;

  list.appendChild(li);
  input.value = "";



});


