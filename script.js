const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const emptyListMsg = document.getElementById('empty-list');
const filterSelect = document.getElementById('filter-select');
const sortSelect = document.getElementById('sort-select');
const totalTasksSpan = document.getElementById('total-tasks');
const completedTasksSpan = document.getElementById('completed-tasks');
const highPriorityTasksSpan = document.getElementById('high-priority-tasks');
const alertElement = document.getElementById('alert');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateStats();
}

function updateStats() {
    totalTasksSpan.textContent = `Total: ${tasks.length}`;
    completedTasksSpan.textContent = `Completed: ${tasks.filter(task => task.completed).length}`;
    highPriorityTasksSpan.textContent = `High Priority: ${tasks.filter(task => task.highPriority).length}`;
}

function renderTasks() {
    const filteredTasks = filterTasks(tasks);
    const sortedTasks = sortTasks(filteredTasks);

    taskList.innerHTML = '';
    sortedTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} ${task.highPriority ? 'high-priority' : ''}`;
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleComplete(${index})">
                    <i class="bi bi-check-circle"></i>
                </button>
                <button class="edit-btn" onclick="editTask(${index})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="priority-btn" onclick="togglePriority(${index})">
                    <i class="bi bi-star${task.highPriority ? '-fill' : ''}"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });

    emptyListMsg.style.display = tasks.length ? 'none' : 'block';
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false, highPriority: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
        taskInput.focus();
        showAlert('Task added successfully!', 'success');
    } else {
        shakeElement(taskInput);
    }
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    if (tasks[index].completed) {
        celebrateCompletion();
        showAlert('Task completed!', 'success');
    }
}

function togglePriority(index) {
    tasks[index].highPriority = !tasks[index].highPriority;
    saveTasks();
    renderTasks();
    showAlert(`Task priority ${tasks[index].highPriority ? 'increased' : 'decreased'}!`, 'warning');
}

function showModal(title, message, inputPlaceholder = null) {
  return new Promise((resolve, reject) => {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalInput = document.getElementById('modal-input');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    if (inputPlaceholder) {
      modalInput.placeholder = inputPlaceholder;
      modalInput.value = inputPlaceholder;
      modalInput.classList.remove('hidden');
    } else {
      modalInput.classList.add('hidden');
    }

    modal.style.display = 'block';

    modalConfirm.onclick = () => {
      modal.style.display = 'none';
      resolve(inputPlaceholder ? modalInput.value : true);
    };

    modalCancel.onclick = () => {
      modal.style.display = 'none';
      reject();
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
        reject();
      }
    };
  });
}

function deleteTask(index) {
  showModal('Delete Task', 'Are you sure you want to delete this task?')
    .then(() => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      showAlert('Task deleted!', 'danger');
    })
    .catch(() => {
    });
}

function editTask(index) {
  showModal('Edit Task', 'Enter the new task text:', tasks[index].text)
    .then((newText) => {
      if (newText.trim()) {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
        showAlert('Task updated successfully!', 'success');
      }
    })
    .catch(() => {
    });
}

function showAlert(message, type) {
  const alertElement = document.getElementById('alert');
  alertElement.textContent = message;
  alertElement.className = `alert alert-${type}`;
  alertElement.classList.add('show');
  setTimeout(() => {
    alertElement.classList.remove('show');
  }, 3000);
}

function filterTasks(tasksToFilter) {
    const filterValue = filterSelect.value;
    switch (filterValue) {
        case 'active':
            return tasksToFilter.filter(task => !task.completed);
        case 'completed':
            return tasksToFilter.filter(task => task.completed);
        case 'high-priority':
            return tasksToFilter.filter(task => task.highPriority);
        default:
            return tasksToFilter;
    }
}

function sortTasks(tasksToSort) {
    const sortValue = sortSelect.value;
    switch (sortValue) {
        case 'alphabetical':
            return [...tasksToSort].sort((a, b) => a.text.localeCompare(b.text));
        case 'reverse-alphabetical':
            return [...tasksToSort].sort((a, b) => b.text.localeCompare(a.text));
        default:
            return tasksToSort;
    }
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 820);
}

function celebrateCompletion() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function showAlert(message, type) {
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type} show`;
    setTimeout(() => {
        alertElement.classList.remove('show');
    }, 3000);
}

function initCustomSelects() {
    const customSelects = document.getElementsByClassName("custom-select");
    for (const select of customSelects) {
        const selectElement = select.getElementsByTagName("select")[0];
        const selectedDiv = document.createElement("DIV");
        selectedDiv.setAttribute("class", "select-selected");
        selectedDiv.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;
        select.appendChild(selectedDiv);

        const optionsList = document.createElement("DIV");
        optionsList.setAttribute("class", "select-items select-hide");
        for (let i = 0; i < selectElement.length; i++) {
            const optionDiv = document.createElement("DIV");
            optionDiv.innerHTML = selectElement.options[i].innerHTML;
            optionDiv.addEventListener("click", function(e) {
                for (let j = 0; j < selectElement.length; j++) {
                    if (selectElement.options[j].innerHTML == this.innerHTML) {
                        selectElement.selectedIndex = j;
                        selectedDiv.innerHTML = this.innerHTML;
                        const sameAsSelected = this.parentNode.getElementsByClassName("same-as-selected");
                        for (let k = 0; k < sameAsSelected.length; k++) {
                            sameAsSelected[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                selectedDiv.click();
                selectElement.dispatchEvent(new Event('change'));
            });
            optionsList.appendChild(optionDiv);
        }
        select.appendChild(optionsList);

        selectedDiv.addEventListener("click", function(e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
}

function closeAllSelect(elmnt) {
    const selectItems = document.getElementsByClassName("select-items");
    const selectedItems = document.getElementsByClassName("select-selected");
    for (let i = 0; i < selectedItems.length; i++) {
        if (elmnt != selectedItems[i]) {
            selectedItems[i].classList.remove("select-arrow-active");
        }
    }
    for (let i = 0; i < selectItems.length; i++) {
        if (elmnt != selectItems[i].previousSibling) {
            selectItems[i].classList.add("select-hide");
        }
    }
}

document.addEventListener("click", closeAllSelect);

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

filterSelect.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);

document.addEventListener("DOMContentLoaded", function() {
    initCustomSelects();
    renderTasks();
    updateStats();
});