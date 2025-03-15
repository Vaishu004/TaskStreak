const taskForm = document.getElementById('task-form');
            const taskInput = document.getElementById('task-input');
            const taskList = document.getElementById('task-list');
            const streakCount = document.getElementById('streak-count');
            const pointsCount = document.getElementById('points-count');

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let streak = JSON.parse(localStorage.getItem('streak')) || 0;
            let points = JSON.parse(localStorage.getItem('points')) || 0;
            let lastActiveDate = localStorage.getItem('lastActiveDate') || null;

            function saveData() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
                localStorage.setItem('streak', JSON.stringify(streak));
                localStorage.setItem('points', JSON.stringify(points));
                localStorage.setItem('lastActiveDate', new Date().toISOString().split('T')[0]);
            }

            function renderTasks() {
                taskList.innerHTML = '';
                tasks.forEach((task, index) => {
                    const li = document.createElement('li');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = task.completed;
                    checkbox.addEventListener('change', () => {
                        task.completed = checkbox.checked;
                        if (task.completed) points += 10; // Add 10 points per completed task
                        saveData();
                        renderTasks();
                        updateStats();
                    });

                    const label = document.createElement('label');
                    label.textContent = task.name;

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.addEventListener('click', () => {
                        tasks.splice(index, 1);
                        saveData();
                        renderTasks();
                        updateStats();
                    });

                    li.appendChild(checkbox);
                    li.appendChild(label);
                    li.appendChild(deleteBtn);
                    taskList.appendChild(li);
                });
            }

            function updateStats() {
                streakCount.textContent = streak;
                pointsCount.textContent = points;
            }

            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const taskName = taskInput.value.trim();
                if (taskName) {
                    tasks.push({ name: taskName, completed: false });
                    saveData();
                    renderTasks();
                    taskInput.value = '';
                }
            });

            function checkStreak() {
                const today = new Date().toISOString().split('T')[0];

                if (lastActiveDate && lastActiveDate !== today) {
                    const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);

                    if (allTasksCompleted) {
                        streak++;
                        tasks = [];
                        saveData();
                        renderTasks();
                    } else {
                        streak = 0;
                        tasks = [];
                        saveData();
                        renderTasks();
                    }
                }

                saveData();
                updateStats();
            }

            checkStreak();
            renderTasks();
            updateStats();
        
            