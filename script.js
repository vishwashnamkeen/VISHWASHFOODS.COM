// ==========================================
// ADVANCED TASK MANAGER SCRIPT (JavaScript)
// ==========================================

class TaskManager {
    constructor() {
        // LocalStorage se saved tasks load karo, ya empty array rakho
        this.tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
        this.init();
    }

    // App Initialize karne ka function
    init() {
        console.log("Task Manager Script Loaded Successfully!");
        this.renderTasks();
        this.setupEventListeners();
    }

    // New Task Add karne ke liye
    addTask(title, priority = 'Medium') {
        if (!title.trim()) {
            console.error("Task title khali nahi ho sakta!");
            return false;
        }

        const newTask = {
            id: Date.now(), // Unique ID
            title: title.trim(),
            priority: priority,
            completed: false,
            createdAt: new Date().toLocaleDateString()
        };

        this.tasks.push(newTask);
        this.saveAndRefresh();
        console.log(`Task Add hua: "${title}"`);
        return true;
    }

    // Task Complete / Uncomplete toggle karne ke liye
    toggleTaskStatus(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        this.saveAndRefresh();
    }

    // Task Delete karne ke liye
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveAndRefresh();
        console.log(`Task ID ${id} delete kar diya gaya.`);
    }

    // LocalStorage me data save aur UI Refresh
    saveAndRefresh() {
        localStorage.setItem('myTasks', JSON.stringify(this.tasks));
        this.renderTasks();
    }

    // Console me tasks print/render karne ke liye (UI ke bina test karne hetu)
    renderTasks() {
        console.clear();
        console.log("=== APKI TASK LIST ===");
        
        if (this.tasks.length === 0) {
            console.log("Koi task nahi hai!");
            return;
        }

        this.tasks.forEach((task, index) => {
            const status = task.completed ? "[DONE]" : "[PENDING]";
            console.log(`${index + 1}. ${status} ${task.title} | Priority: ${task.priority} | Date: ${task.createdAt}`);
        });
        
        this.getStats();
    }

    // Tasks ka summary nikalne ke liye
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        console.log("----------------------");
        console.log(`Total: ${total} | Completed: ${completed} | Pending: ${pending}`);
    }

    // Event Listeners setup (agar Browser DOM se connect karna ho)
    setupEventListeners() {
        // Keypress Event: Enter se task add karne ke liye
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                console.log("Escape key press hui!");
            }
        });
    }
}

// ==========================================
// SCRIPT EXECUTION / TESTING
// ==========================================

// Script ko run karna:
const myApp = new TaskManager();

// Sample Tasks add karke dekhein:
myApp.addTask("JavaScript Seekhna", "High");
myApp.addTask("Project submit karna", "High");
myApp.addTask("Gym jaana", "Low");

// Web Browser ke Developer Console (F12) par yeh script chalayenge toh yeh poora logic run hoga!
