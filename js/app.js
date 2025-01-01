// Store Management
const store = {
    classes: JSON.parse(localStorage.getItem('classes')) || [],
    students: JSON.parse(localStorage.getItem('students')) || []
};

function saveToLocalStorage() {
    localStorage.setItem('classes', JSON.stringify(store.classes));
    localStorage.setItem('students', JSON.stringify(store.students));
}

// Modal Management
function openClassModal() {
    document.getElementById('classModal').classList.remove('hidden');
}

function closeClassModal() {
    document.getElementById('classModal').classList.add('hidden');
    document.getElementById('classForm').reset();
    document.getElementById('modalTitle').textContent = 'Add New Class';
    document.getElementById('classId').value = '';
}

function openStudentModal() {
    document.getElementById('studentModal').classList.remove('hidden');
}

function closeStudentModal() {
    document.getElementById('studentModal').classList.add('hidden');
    document.getElementById('addStudentForm').reset();
    document.getElementById('studentId').value = '';
}

// Class CRUD Operations
function addClass(cls) {
    cls.students = 0;
    store.classes.push({
        id: `CLS${String(store.classes.length + 1).padStart(3, '0')}`,
        ...cls
    });
    updateClassesGrid();
    saveToLocalStorage();
}

function deleteClass(classId) {
    store.classes = store.classes.filter(cls => cls.id !== classId);
    updateClassesGrid();
    saveToLocalStorage();
}

function updateClass(classId, updatedData) {
    const index = store.classes.findIndex(cls => cls.id === classId);
    if (index !== -1) {
        store.classes[index] = { ...store.classes[index], ...updatedData };
        updateClassesGrid();
        saveToLocalStorage();
    }
}

// Student CRUD Operations
function addStudent(studentData) {
    const newStudent = {
        id: `STD${String(store.students.length + 1).padStart(3, '0')}`,
        ...studentData
    };
    store.students.push(newStudent);
    updateStudentsTable();
    saveToLocalStorage();
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        store.students = store.students.filter(student => student.id !== studentId);
        updateStudentsTable();
        saveToLocalStorage();
    }
}

function editStudent(studentId) {
    const studentToEdit = store.students.find(student => student.id === studentId);
    console.log(studentToEdit.id);
    if (studentToEdit) {
        document.getElementById('studentId').value = studentToEdit.id;
        document.getElementById('studentName').value = studentToEdit.name;
        document.getElementById('studentClass').value = studentToEdit.class;
        document.getElementById('studentContact').value = studentToEdit.contact;
        openStudentModal();
    }
}

function updateClassStudentCount(className) {
    const studentCount = store.students.filter(student => student.class === className).length;
    const classIndex = store.classes.findIndex(cls => cls.name === className);
    if (classIndex !== -1) {
        store.classes[classIndex].students = studentCount;
        saveToLocalStorage();
    }
}
function editClass(classId) {
    const classToEdit = store.classes.find(cls => cls.id === classId);
    console.log(classToEdit.id);
    if (classToEdit) {
        updateClassStudentCount(classToEdit.name);
        document.getElementById('classId').value = classToEdit.id;
        document.getElementById('className').value = classToEdit.name;
        document.getElementById('classTeacher').value = classToEdit.teacher;
        document.getElementById('classSchedule').value = classToEdit.schedule;

        openClassModal();
    }
}

function updateStudent(studentId, updatedData) {
    const index = store.students.findIndex(student => student.id === studentId);
    if (index !== -1) {
        store.students[index] = { ...store.students[index], ...updatedData };
        updateStudentsTable();
        saveToLocalStorage();
    }
}

// UI Updates
function updateClassesGrid() {
    const grid = document.querySelector('.grid');
    if (!grid) return;

    grid.innerHTML = store.classes.map(cls => `
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">${cls.name}</h3>
                <div class="flex space-x-2">
                    <button onclick="editClass('${cls.id}')" 
                            class="text-blue-500 hover:text-blue-700">Edit</button>
                    <button onclick="deleteClass('${cls.id}')" 
                            class="text-red-500 hover:text-red-700">Delete</button>
                </div>
            </div>
            <div class="space-y-2">
                <p><span class="font-semibold">Class Teacher:</span> ${cls.teacher}</p>
                <p><span class="font-semibold">Students:</span> ${cls.students}</p>
                <p><span class="font-semibold">Schedule:</span> ${cls.schedule}</p>
            </div>
        </div>
    `).join('');
}

function updateStudentsTable() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    tbody.innerHTML = store.students.map(student => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap studentId">${student.id}</td>
            <td class="px-6 py-4 whitespace-nowrap studentName">${student.name}</td>
            <td class="px-6 py-4 whitespace-nowrap studentClass">${student.class}</td>
            <td class="px-6 py-4 whitespace-nowrap studentContact">${student.contact}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="editStudent('${student.id}')" 
                        class="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                <button onclick="deleteStudent('${student.id}')" 
                        class="text-red-500 hover:text-red-700">Delete</button>
            </td>
        </tr>
    `).join('');

    // Update class select options
    const classSelect = document.querySelector('select[name="class"]');
    if (classSelect) {
        const classOptions = store.classes.map(cls => 
            `<option value="${cls.name}">${cls.name}</option>`
        ).join('');
        classSelect.innerHTML = `<option value="">Select Class</option>${classOptions}`;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    updateClassesGrid();
    updateStudentsTable();

    // Class Form Handler
    const classForm = document.getElementById('classForm');
    if (classForm) {
        classForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(classForm);
            const classId = formData.get('classId');
            
            const classData = {
                name: formData.get('name'),
                teacher: formData.get('teacher'),
                schedule: formData.get('schedule')
            };

            if (classId) {
                updateClass(classId, classData);
            } else {
                addClass(classData);
            }

            closeClassModal();
            classForm.reset();
        });
    }

    // Student Form Handler
    const studentForm = document.getElementById('addStudentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(studentForm);
            const studentId = formData.get('studentId');
            
            const studentData = {
                name: formData.get('name'),
                class: formData.get('class'),
                contact: formData.get('contact')
            };

            if (studentId) {
                updateStudent(studentId, studentData);
            } else {
                addStudent(studentData);
            }

            closeStudentModal();
            studentForm.reset();
        });
    }

    // Search and Filter Functionality
    const searchInput = document.querySelector('input[placeholder="Search students..."]');
    const filterSelect = document.querySelector('select.p-2.border');
    const filterButton = document.querySelector('button.bg-gray-200');

    if (searchInput && filterSelect && filterButton) {
        filterButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedClass = filterSelect.value;

            const filteredStudents = store.students.filter(student => {
                const matchesSearch = student.name.toLowerCase().includes(searchTerm) ||
                                   student.id.toLowerCase().includes(searchTerm);
                const matchesClass = selectedClass === 'All Classes' || 
                                   student.class === selectedClass;
                return matchesSearch && matchesClass;
            });

            updateStudentsTableWithData(filteredStudents);
        });
    }

    // Navigation active state
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('nav a');
    
    navItems.forEach(item => {
        item.classList.remove('bg-blue-900');
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('bg-blue-900');
        }
    });
});

// Helper function for filtered table updates
function updateStudentsTableWithData(students) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    tbody.innerHTML = students.map(student => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">${student.id}</td>
            <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
            <td class="px-6 py-4 whitespace-nowrap">${student.class}</td>
            <td class="px-6 py-4 whitespace-nowrap">${student.contact}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="editStudent('${student.id}')" 
                        class="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                <button onclick="deleteStudent('${student.id}')" 
                        class="text-red-500 hover:text-red-700">Delete</button>
            </td>
        </tr>
    `).join('');
}