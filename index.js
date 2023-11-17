const url = "https://js1-todo-api.vercel.app/api/todos?apikey=f7fd3a3c-eb82-4a22-921c-5e6c0ec86967";

//Selectors
const todoInput = document.querySelector('.todo-input');
const todoBtn = document.querySelector('.todo-btn');
const todoList = document.querySelector('.todo-list');
const form = document.querySelector('form');
const popup = document.querySelector('#popup');
const closeBtn = document.querySelector('.close');

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
    
    todoList.innerHTML = "";

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
        completeBtn.addEventListener('click', async () => {
            
            if(todo.completed === true) { 
                todoTitle.classList.toggle('completed');
                completeBtn.classList.toggle('completed');
                todo.completed = false;
                await completeTodo (todo._id, false);
                return;
            }
            else if(todo.completed === false) {
                todoTitle.classList.toggle('completed');
                completeBtn.classList.toggle('completed');
                todo.completed = true;
                await completeTodo (todo._id, true);
                return;
            }
        });
        

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add('trash-btn');
        deleteBtn.setAttribute("id", todo._id);
        deleteBtn.addEventListener('click', async () => {
            if(todo.completed === false) {
                popup.classList.add("open-popup");
                closeBtn.addEventListener('click', () => {
                    popup.classList.remove("open-popup");
                })
                
                return;
            }
            else if(todo.completed === true){
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

//Post
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(!validateInput(todoInput)) return;

    try{
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
        
        const todoData = await response.json();
        console.log(todoData)
    
        createTodo();
    
    } catch (error) {
        console.log("Error: " + error.errorMessage);
    }
    finally {
        todoInput.value = "";
    }

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

function validateInput(input) {
    const parent = input.parentElement;
    const errorMessage = parent.querySelector(".error-message");

    if (input.value.trim() === "") {
        parent.classList.add("invalid");
        errorMessage.innerHTML = "This field can not be empty";
        return false;
    } 
    else if(input.value.trim().length < 3) {
        parent.classList.add("invalid");
        errorMessage.innerHTML = "The todo must be at least 3 characters long";
        return false;
    }   
    else {
        parent.classList.remove("invalid");
        errorMessage.innerHTML = "";
        return true;
    }
}


