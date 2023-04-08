const incompleteList = document.getElementById("incompleteList");
const completeList = document.getElementById("completeList");

const data = [
    {
        "status": "O",
        "text": "do laundry"
    },
    {
        "status": "O",
        "text": "do dishes"
    },
    {
        "status": "X",
        "text": "clean something"
    },
    {
        "status": "O",
        "text": "eat caow"
    },
    {
        "status": "O",
        "text": "run a mile"
    },
    {
        "status": "O",
        "text": "blow my brains out"
    }
];

function saveData(updatedData) {
    // Here, you would save the updated data to the JSON file.
    // This example just logs the updated content to the console.
    console.log(JSON.stringify(updatedData, null, 2));
}

function makeGhost(div) {
    const ghost = div.cloneNode(true);
    ghost.classList.add("ghost");
    ghost.style.backgroundColor = "#b3e5fc";
    ghost.style.borderColor = "#4fc3f7";
    ghost.style.opacity = "0.5";
    ghost.style.position = "absolute";
    ghost.style.top = "-1000px";
    ghost.style.width = "auto";
    return ghost;
}

function createTodoItem(todo) {
    const div = document.createElement("div");
    div.classList.add("todo-item");
    div.draggable = true;
    div.innerHTML = `
        <input type="checkbox" ${todo.status === "X" ? "checked" : ""}>
        <span class="todo-text ${todo.status === "X" ? "checked" : ""}">${todo.text}</span>
    `;

    div.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", div.parentElement.children.length - Array.from(div.parentElement.children).indexOf(div));
    });
    div.addEventListener("dragstart", (e) => {
        const ghost = makeGhost(div);
        document.body.appendChild(ghost);

        div.classList.add("dragging");
    
        // Set the ghost element as the drag image
        e.dataTransfer.setDragImage(ghost, 0, 0);
    
        // Clean up the ghost element after the drag operation is finished
        div.addEventListener("dragend", () => {
            ghost.remove();
        }, { once: true });
    });
    
    div.addEventListener("dragend", (e) => {
        div.classList.remove("dragging");
    });

    // Change event listener for the checkbox
    div.querySelector("input").addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        div.querySelector(".todo-text").classList.toggle("checked", isChecked);
        todo.status = isChecked ? "X" : "O";

        // Move the element to the appropriate list
        if (isChecked) {
            completeList.insertBefore(div, completeList.firstChild);
        } else {
            incompleteList.appendChild(div);
        }

        updateData();
    });

    // Add contenteditable attribute to make the text editable
    div.querySelector(".todo-text").setAttribute("contenteditable", "true");

    // Add event listener for input events to update the data
    div.querySelector(".todo-text").addEventListener("input", (e) => {
        todo.text = e.target.textContent;
        updateData();
    });

    return div;
}

function updateData() {
    const updatedData = {
        incomplete: Array.from(incompleteList.children).map(child => ({
            status: child.querySelector("input").checked ? "X" : "O",
            text: child.querySelector(".todo-text").textContent
        })),
        complete: Array.from(completeList.children).map(child => ({
            status: child.querySelector("input").checked ? "X" : "O",
            text: child.querySelector(".todo-text").textContent
        }))
    };
    saveData(updatedData);
}

// Update dragover event listeners for both incomplete and complete lists
incompleteList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggedElement = document.querySelector(".dragging");
    const hoveredElement = e.target.closest(".todo-item");
    if (hoveredElement && draggedElement.parentElement === incompleteList) {
        const hoveredElementRect = hoveredElement.getBoundingClientRect();
        const hoverMiddleY = (hoveredElementRect.top + hoveredElementRect.bottom) / 2;
        if (e.clientY < hoverMiddleY) {
            incompleteList.insertBefore(draggedElement, hoveredElement);
        } else {
            incompleteList.insertBefore(draggedElement, hoveredElement.nextElementSibling);
        }
    }
});

completeList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggedElement = document.querySelector(".dragging");
    const hoveredElement = e.target.closest(".todo-item");
    if (hoveredElement && draggedElement.parentElement === completeList) {
        const hoveredElementRect = hoveredElement.getBoundingClientRect();
        const hoverMiddleY = (hoveredElementRect.top + hoveredElementRect.bottom) / 2;
        if (e.clientY < hoverMiddleY) {
            completeList.insertBefore(draggedElement, hoveredElement);
        } else {
            completeList.insertBefore(draggedElement, hoveredElement.nextElementSibling);
        }
    }
});


for (const todo of data) {
    if (todo.status === "O") {
        incompleteList.appendChild(createTodoItem(todo));
    } else {
        completeList.appendChild(createTodoItem(todo));
    }
}
