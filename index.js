const url = "https://js1-todo-api.vercel.app/api/todos?apikey=f7fd3a3c-eb82-4a22-921c-5e6c0ec86967";

//Selectors
const todoInput = document.querySelector('.todo-input');
const todoBtn = document.querySelector('.todo-btn');
const todoList = document.querySelector('.todo-list');
const form = document.querySelector('form');

const todoListArr = [];

//HTTP Requests

// GET
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

        const todoTitle = document.createElement('li');
        todoTitle.innerText = todo.title;
        todoTitle.classList.add('todo-item');
        todoTitle.setAttribute("id", todo._id);

        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        completeBtn.classList.add('complete-btn');
        completeBtn.setAttribute("id", todo._id);
        completeBtn.addEventListener('click', async (event) => {
            
            if(!todo.completed && completeBtn.classList[0] === 'complete-btn') {
                todoTitle.classList.toggle('completed');
                completeBtn.classList.toggle('completed');
                await completeTodo (todo._id, true);
                return;
            }
            else {
                todoTitle.classList.remove('completed');
                completeBtn.classList.remove('completed');
                await completeTodo (todo._id, false);
                return;   
            }
        });
        

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add('trash-btn');
        deleteBtn.setAttribute("id", todo._id);
        deleteBtn.addEventListener('click', async () => {
            if(deleteBtn.classList[0] === 'trash-btn') {
                deleteBtn.classList.add('fall');
                todoTitle.classList.add('fall');
                await deleteTodo(todo._id);
            }
        });

        todoDiv.appendChild(todoTitle);
        todoDiv.appendChild(completeBtn);
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

    validateInput(todoInput);

    const todoData = await response.json();
    console.log(todoData)
    
    createTodo();

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

//PUT
const completeTodo = async (id, complete) => {
    
    const toCompleteUrl = `https://js1-todo-api.vercel.app/api/todos/${id}?apikey=f7fd3a3c-eb82-4a22-921c-5e6c0ec86967`;
    console.log(toCompleteUrl)
    const response = await fetch(toCompleteUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            completed: complete,
        }),        
    });
    
    if(!response.ok) {
        console.log(response);
        return;
    }

    const todoData = await response.json();
    console.log("Completed: " + todoData.completed + " " + todoData._id);
    
};

//Event Listeners
todoBtn.addEventListener('click', async (event) => {
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

    validateInput(todoInput);

    const todoData = await response.json();
    console.log(todoData)
    
    createTodo();

    todoInput.value = "";
});


//Functions
function createTodo() {

    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    const newTodoTitle = document.createElement('li');
    newTodoTitle.innerText = todoInput.value;
    newTodoTitle.classList.add('todo-item');
    newTodoTitle.setAttribute("id", "list-item")
    todoDiv.appendChild(newTodoTitle);

    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.classList.add('complete-btn');
    todoDiv.appendChild(completeBtn);

    const trashBtn = document.createElement('button');
    trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
    trashBtn.classList.add('trash-btn');
    todoDiv.appendChild(trashBtn);

    todoList.appendChild(todoDiv);
}
 
function validateInput(input){
    
    if(input.value.trim() === '' && input.value.length < 2){
    
        return false;
    } else {
        return true;
    }
}




