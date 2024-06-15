const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let oldInputValue;

const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

//Funções
const savetodo = (text, done = 0, save = 1) =>{
    //criando a todoList pelo javaScript
    //puxar a div do html
    const todo = document.createElement("div")
    todo.classList.add("todo");

    //puxar o h3 do html
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text
    todo.appendChild(todoTitle);
    console.log(todo)

    //botoes
    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    //colocar ao icone dentro do botao
    doneBtn.innerHTML = '<i class="fa-solid fa-check"><i>'
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    //colocar ao icone dentro do botao
    editBtn.innerHTML = ' <i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    //colocar ao icone dentro do botao
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn);


    //Utilizando dados da localStorage
    if(done){
        todo.classList.add("done");
    };
    if(save){
        saveTodoLocalStorage({text, done: 0});
    };



    todoList.appendChild(todo);
    //limpar text ao terminar de digitar
    todoInput.value = ""
    todoInput.focus();
}

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updatetodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text;
            updateTodoStatusLocalStorage(oldInputValue,text);
        }
    });
};
const getSearchTodos = (search) => {
     const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase()

        todo.style.display = "flex";

        if(!todoTitle.includes(normalizedSearch)){
            todo.style.display = "none";
        };

      
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch(filterValue) {
        case "all":
          todos.forEach((todo) => (todo.style.display = "flex"));
             break;

        case "done":
          todos.forEach((todo) => todo.classList.contains("done") ? todo.style.display = "flex" : todo.style.display = "none");
             break;

        case "todo":
          todos.forEach((todo) => !todo.classList.contains("done") ? todo.style.display = "flex" : todo.style.display = "none");
             break;

        default:
            break;
    }
};
//Eventos
todoForm.addEventListener("submit",(e) =>{
    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue){
        savetodo(inputValue)
    }
});

//configurando botoes das listas feitas
//modo mais facíl e pegar todo o documento.

document.addEventListener(
"click", (e) => {
 const targetEl = e.target;
 const parentEl = targetEl.closest("div");
 let todoTitle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if(targetEl.classList.contains("finish-todo")){
        //para ativa e destiva o feito da lista coloque toggle.
        parentEl.classList.toggle("done");

        updateTodoStatusLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("remove-todo")){
        //para ativa e destiva o feito da lista coloque toggle.
        parentEl.remove();
    }

    if(targetEl.classList.contains("edit-todo")){
        toggleForms();

        editInput.value = todoTitle
        oldInputValue = todoTitle 
    }

});

cancelEditBtn.addEventListener("click", (e) =>{
    e.preventDefault()

    toggleForms();
});

editForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue){
        updatetodo(editInputValue)

    }

    toggleForms()
});

searchInput.addEventListener("keyup", (e) =>{
    const search = e.target.value;

    getSearchTodos(search);
});

eraseBtn.addEventListener("click", (e) =>{
    e.preventDefault();

    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));//simula o apertar da tecla enter
});

filterBtn.addEventListener("change", (e) =>{
    e.preventDefault()

    const filterValue = e.target.value;
    filterTodos(filterValue);
});

//local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem(".todo")) || [];

    return todos;

};

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        savetodo(todo.text, todo.done, 0)
    });
};
const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage()

    todos.push(todo)

    localStorage.setItem("todos", JSON.stringify(todos));

//add o novo to do no arr

//salvar tudo na ls
};
const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText);
    localStorage.setItem("todos,", JSON.stringify(filteredTodos));
}

const updateTodoStatusLocalStorage = (todoOldtext, todoNewText) => {
    const todos = getTodosLocalStorage();

     todos.map((todo) => todo.text === todoOldtext ? (todo.text = todoNewText) : null);

     localStorage.setItem("todos", JSON.stringify(todos));
};
loadTodos();
