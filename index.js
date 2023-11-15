const url = "https://js1-todo-api.vercel.app/api/todos?apikey=f7fd3a3c-eb82-4a22-921c-5e6c0ec86967";

//Selectors
const todoInput = document.querySelector('.todo-input');
const todoBtn = document.querySelector('.todo-btn');
const todoList = document.querySelector('.todo-list');

const todoListArr = [];


//HTTP Requests

//GET
const getTodoList = async () => {
    const response = await fetch(url);

    if (!response.ok) {
        console.log('Error', response.status);
        return;
    }

    const todoData = await response.json();

    todoListArr.push(todoData);

    //Clear the todo list
    todoList.innerHTML = '';

    //Loop through the todo items and create a new DOM element for each item
    todoData.forEach(todo => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

        const newTodo = document.createElement('li');
        newTodo.innerText = todo.title;
        newTodo.classList.add('todo-item');
        newTodo.setAttribute("id", todo._id);

        const completedBtn = document.createElement('button');
        completedBtn.innerHTML = '<i class="fas fa-check"></i>';
        completedBtn.classList.add('complete-btn');
        todoDiv.appendChild(completedBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add('trash-btn');
        deleteBtn.setAttribute("id", todo._id);
        deleteBtn.addEventListener('click', async () => {
            await deleteTodo(todo._id);
        });

        todoDiv.appendChild(newTodo);
        todoDiv.appendChild(completedBtn);
        todoDiv.appendChild(deleteBtn);
        todoList.appendChild(todoDiv);        
    });
};

getTodoList();


//POST
const addTodo = async (event) => {
    event.preventDefault();

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: todoInput.value,
        }),
    });   
    
    if(!response.ok) {
        console.log('Error', response.status);
        return;
    }

    let todoData = await response.json();
    todoData = createTodo();

    todoInput.value = "";
};

//DELETE
const deleteTodo = async (id) => {
    const toDeleteUrl = `https://js1-todo-api.vercel.app/api/todos/${id}?apikey=f7fd3a3c-eb82-4a22-921c-5e6c0ec86967`;
    const response = await fetch(toDeleteUrl, {
        method: 'DELETE',
    });
    
    if(!response.ok) {
        console.log(response);
        return;
    }

    const todoData = await response.json();
    console.log("Deleted: " + todoData)
    
    getTodoList();
}


//Event Listeners
todoBtn.addEventListener('click', addTodo);
// todoList.addEventListener('click', deleteTodo);

// Functions
function createTodo() {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    newTodo.setAttribute("id", "list-item")
    todoDiv.appendChild(newTodo);
    
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
}




