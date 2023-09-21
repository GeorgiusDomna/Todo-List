let form = document.querySelector('form');
let upcomingList = document.querySelector('#upcomingList');
let completeList = document.querySelector('#completeList');
let evenBtn = document.querySelector('#evenBtn');
let oddBtn = document.querySelector('#oddBtn');
let delFirstBtn = document.querySelector('#delFirstBtn');
let delLastBtn = document.querySelector('#delLastBtn');
let todoList = [];


// Функция для загрузки задач из localStorage
function loadTodoList() {
    const todoListJSON = localStorage.getItem('todoList');
    if (todoListJSON) {
        todoList = JSON.parse(todoListJSON);
        todoList.forEach(function(todo) {
            renderTodoItem(todo.id, todo.text, todo.complete);
        });
    }
};

// Функция для сохранения задач в localStorage
function saveTodoList() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
};

// Функция для создания задачи в localStorage
function createTodo(id, text) {
    todoList.push({
        id,
        text,
        complete: false
    });
    saveTodoList();
};

// Функция для удаления задачи
function removeTodo(id) {
    todoList = todoList.filter(function(todo) {
        return todo.id !== id;
    });
    saveTodoList();
};

// Функция для редактирования задачи или обновления статуса
function updateTodo(id, text) {
    const todoToEdit = todoList.find(obj => obj.id === id);
    if (text) {
        todoToEdit.text = text;
    } else {
        todoToEdit.complete = !todoToEdit.complete;
    }
    saveTodoList();
};




// Функция для создания кнопки в элементе списка
function addSpanBtn(name, id, parent, btnContainer, callback) {
    let spanBtn = document.createElement('span');

    spanBtn.classList.add(name);
    spanBtn.textContent = name.charAt(0).toUpperCase() + name.slice(1);

    spanBtn.addEventListener('click', () => callback(parent, id));

    btnContainer.append(spanBtn);
};


// Коллбэк для создания кнопки изменения статуса задачи
function toggleTaskStatus(parent, id) {
    updateTodo(id);
    parent.classList.toggle('done');

    let targetList = parent.classList.contains('done') ? completeList : upcomingList;
    targetList.append(parent);
};

// Коллбэк для создания кнопки редактирования текста задачи
function handleEditBtn(parent, id) {
    const textSpan = parent.querySelector('.text');
    const editInp = textSpan.querySelector('.edit-inp');
    const editValue = textSpan.textContent;

    if (!editInp) {
        createEditInput(textSpan, editValue, id);
    } else {
        updateTodo(id, editInp.value);
        textSpan.textContent = editInp.value;
    }
}
// Функция создания поля для редактирования текста задачи
function createEditInput(textSpan, editValue, id) {
    const editInp = document.createElement('textarea');
    editInp.classList.add('edit-inp');
    textSpan.textContent = "";
    editInp.value = editValue;

    editInp.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            updateTodo(id, editInp.value);
            editInp.remove();
            textSpan.textContent = editInp.value;
        }
    });

    textSpan.append(editInp);
    editInp.focus();
}

// Коллбэк для создания кнопки удаления задачи
function removeTask(parent, id) {
    removeTodo(id);
    parent.remove();
};



// Функция для отображения задачи в списке
function renderTodoItem(id, text, complete) {
    let listItem = document.createElement('li');
    let textSpan = document.createElement('span');
    let btnCont = document.createElement('div');

    listItem .dataset.id = id;
    textSpan.classList.add('text');
    listItem .classList.toggle('done', complete);
    textSpan.textContent = text;

    btnCont.classList.add('btn-container')

    listItem.append(textSpan);
    listItem.append(btnCont);

    addSpanBtn('complete', id, listItem, btnCont, toggleTaskStatus); // Создание кнопки изменения статуса задачи
    addSpanBtn('edit', id, listItem, btnCont, handleEditBtn); // Создание кнопки редактирования текста задачи
    addSpanBtn('remove', id, listItem, btnCont, removeTask); // Создание кнопки удаления задачи

    let targetList = complete ? completeList : upcomingList;
    targetList.prepend(listItem );
};


form.addEventListener('submit', function(event) {
    event.preventDefault();
    let todoText = this.taskInp.value;

    if (todoText) {
        const id = `element_${Math.floor(Math.random() * 10000)}`;

        createTodo(id, todoText);
        renderTodoItem(id, todoText, false);
        this.taskInp.value = "";
    }
})




// Функция выделяет эффектом каждый чётный или нечётный элемент списка
function addStatusToElements(isEven) {
    let lis = document.querySelectorAll('li');
    let className = isEven ? 'even' : 'odd';
    
    lis.forEach((li, index) => {

        if ((isEven && index % 2 === 1) || (!isEven && index % 2 === 0)) {
            li.classList.add(className);
            setTimeout(() => {
                li.classList.remove(className);
            }, 2000);
        }
    });
}

evenBtn.addEventListener('click', () => {
    addStatusToElements(true); // Добавляем эффект четным элементам
});

oddBtn.addEventListener('click', () => {
    addStatusToElements(false); // Добавляем эффект нечетным элементам
});


// Функция для удаления первого или последнего элемента списка
function deleteListElem(isFirst) {
    let targetList;
    
    if (isFirst) {
        targetList = upcomingList.firstElementChild
            ? upcomingList
            : completeList;
    } else {
        targetList = completeList.lastElementChild
            ? completeList
            : upcomingList;
    }

    if (targetList) {
        const targetElem = isFirst
            ? targetList.firstElementChild
            : targetList.lastElementChild;
        
        removeTodo(targetElem.dataset.id);
        targetElem.remove();
    }
}

delFirstBtn.addEventListener('click', () => {
    deleteListElem(true); // Удаляем первый элемент списка
});

delLastBtn.addEventListener('click', () => {
    deleteListElem(false); // Удаляем последний элемент списка
});


loadTodoList() // Загрузка задач из localStorage при обновлении страницы