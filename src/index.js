/* ------------------------- SELECTORS ------------------------- */
// Item Selectors
const items = document.querySelector("[data-items]");
const itemForm = document.querySelector("[data-item-form]");
const itemInput = document.querySelector("[data-item-input]");
const itemName = document.querySelector("[data-item-name]");
const itemTemplate = document.getElementById("item-template");
const showAllItemTemplate = document.getElementById("show-all-item-template");

// Task Selectors
const tasks = document.querySelector("[data-tasks]");
const taskForm = document.querySelector("[data-task-form]");
const taskInput = document.querySelector("[data-task-input]");
const taskDateInput = document.querySelector("[data-task-date-input]");
const tasksContainer = document.querySelector("[data-task-container]");
const taskTemplate = document.getElementById("task-template");

/* ------------------------- VARIABLES ------------------------- */
// localStorage key-value pair
const LOCAL_STORAGE_ITEMS_KEY = "items";
const LOCAL_STORAGE_SELECTED_ITEM_KEY = "selectedItemId";

// Variables
let itemList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY)) || [];
let selectedItemId = localStorage.getItem(LOCAL_STORAGE_SELECTED_ITEM_KEY);

/* ------------------------- EVENT LISTENERS ------------------------- */

// Makes each item in list selectable
items.addEventListener("click", listSelect);

// Takes item form input and creates an item object then pushes it to a list
itemForm.addEventListener("submit", itemCreation);

// Takes task form input and creates a task object then pushes it the the item object
taskForm.addEventListener("submit", taskCreation);

/* ------------------------- EVENT FUNCTIONS ------------------------- */

function listSelect(event) {
	// Selects the entire div no matter where you click
	itemContainer = event.target.closest(".item");
	// If the delete button is clicked, it won't select the item
	if (
		event.target.closest("[data-item-delete]") == null &&
		itemContainer.classList.value === "item"
	) {
		selectedItemId = itemContainer.dataset.itemId;
	}
	saveAndRender();
}

function itemCreation(event) {
	event.preventDefault();
	const userInput = itemInput.value;
	// Filters empty inputs
	if (!userInput || userInput.trim().length === 0) {
		return;
	}
	const item = createItem(userInput);
	itemInput.value = null;
	itemList.push(item);
	saveAndRender();
}

function taskCreation(event) {
    event.preventDefault();
	const userInput = taskInput.value;
	const userDateInput = taskDateInput.value;
	// Filters empty inputs
	if (!userInput || userInput.trim().length === 0) {
		return;
	}
	const task = createTask(userInput, userDateInput);
	taskInput.value = null;
	taskDateInput.value = null;
	const selectedItem = selectedItemObject();
	selectedItem.tasks.push(task);
	saveAndRender();
}

/* ------------------------- FACTORY FUNCTIONS ------------------------- */

// Creates an item object with a unique id
function createItem(name) {
	return { id: Date.now().toString(), name: name, tasks: [] };
}

// Creates a task object with a unique id
function createTask(name, date) {
	return { id: Date.now().toString(), name: name, date: date, complete: false };
}

/* ------------------------- HELPER FUNCTIONS ------------------------- */

function save() {
	localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(itemList));
	localStorage.setItem(LOCAL_STORAGE_SELECTED_ITEM_KEY, selectedItemId);
}

function clearElement(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function selectedItemObject() {
	return itemList.find((item) => item.id === selectedItemId);
}

/* ------------------------- RENDER FUNCTIONS ------------------------- */

// function renderShowAllItem() {
// 	const itemTemplate = showAllItemTemplate.content.cloneNode(true);
// 	items.appendChild(itemTemplate);
// }

function renderItems() {
	itemList.forEach((list) => {
		const itemTemplateObject = itemTemplate.content.cloneNode(true);
		const itemContainer = itemTemplateObject.querySelector("div");
		const itemId = itemTemplateObject.querySelector("[data-item-id]");
		const itemText = itemTemplateObject.querySelector("[data-item-text]");
		const itemDelete = itemTemplateObject.querySelector("[data-item-delete]");
		itemId.dataset.itemId = list.id;
		itemText.textContent = list.name;
		if (list.id === selectedItemId) {
			itemContainer.classList.add("active-item");
		}
		items.appendChild(itemTemplateObject);

		// Adds an event listener to the clone of the templates delete button
		itemDelete.addEventListener("click", (event) => {
			// Gets the ID of the item where the delete button was clicked on
			deleteItemId = event.target.closest("[data-item-id]").dataset.itemId;
			itemList = itemList.filter((list) => list.id !== deleteItemId);

			if (deleteItemId == selectedItemId) {
				selectedItemId = null;
			}
			saveAndRender();
		});
	});
}

function renderItemName() {
	const selectedItem = selectedItemObject();
	if (selectedItem == null) {
		itemName.innerText = "";
	} else {
		itemName.innerText = selectedItem.name;
	}
}

function renderTasks(selectedItem) {
	selectedItem.tasks.forEach((task) => {
		const taskTemplateObject = taskTemplate.content.cloneNode(true);
		const taskId = taskTemplateObject.querySelector("[data-task-id]");
		const taskText = taskTemplateObject.querySelector("[data-task-text]");
		const taskDate = taskTemplateObject.querySelector("[data-task-date]");
		const taskCheckbox = taskTemplateObject.querySelector("[data-task-checkbox]");
		const taskDelete = taskTemplateObject.querySelector("[data-task-delete]");

		taskId.dataset.taskId = task.id;
		taskText.textContent = task.name;
		taskDate.textContent = task.date;
		taskCheckbox.checked = task.complete;

		// Strikethroughs tasks text if checkbox is checked. NOT WORKING AFTER ADDING NEW ITEM/TASK OR DELETING ITEM/TASK
		taskCheckbox.addEventListener("click", () => {
			if (taskCheckbox.checked) {
				// taskId.classList.add("checked");
				task.complete = !task.complete;
			} else {
				// taskId.classList.remove("checked");
				task.complete = !task.complete;
			}
            saveAndRender();
		});

		tasks.appendChild(taskTemplateObject);

		// Adds an event listener to the clone of the templates delete button
		taskDelete.addEventListener("click", (event) => {
			// Gets the ID of the task where the delete button was clicked on
			deleteTaskId = event.target.closest("[data-task-id]").dataset.taskId;
			// Removes the task from the selected item object task list
			selectedItem.tasks = selectedItem.tasks.filter((task) => task.id !== deleteTaskId);
			saveAndRender();
		});
	});
}

function render() {
	clearElement(items);
	// renderShowAllItem();
	renderItems();

	// Displays the tasks panel only if an item is selected
	const selectedItem = selectedItemObject();
	if (selectedItemId == null || selectedItem == undefined) {
		tasksContainer.style.display = "none";
	} else {
		tasksContainer.style.display = "";
		renderItemName();
		clearElement(tasks);
		renderTasks(selectedItem);
	}
}

function saveAndRender() {
	save();
	render();
}

// used to render saved items if any
render();

/**
 * Implement SHOW ALL button
 * Fix checkbox strikethrough
 */
