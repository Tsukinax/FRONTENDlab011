const API_URL = 'http://localhost:3000/students';


function fetchStudents() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('studentTableBody');
            tbody.innerHTML = ''; 

            data.forEach(student => {
                tbody.innerHTML += `
                    <tr id="student-${student.id}">
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.age}</td>
                        <td>
                            <input type="number" step="0.1" id="grade-${student.id}" value="${student.grade}" disabled>
                        </td>
                        <td>
                            <button onclick="enableEdit(${student.id})" id="update-${student.id}">Update</button>
                            <button onclick="deleteStudent(${student.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error fetching students:', error));
}


function deleteStudent(id) {
    if(!confirm("Are you sure you want to delete this student?")) return; 

    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchStudents())
    .catch(error => console.error('Error deleting student:', error));
}

document.getElementById('addStudentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const grade = document.getElementById('grade').value;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, grade })
    })
    .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.error) });
        return res.json();
    })
    .then(() => {
        document.getElementById('addStudentForm').reset();
        fetchStudents();
    })
    .catch(error => alert('Error: ' + error.message));
});


function enableEdit(id) {
    const gradeInput = document.getElementById(`grade-${id}`);
    const updateBtn = document.getElementById(`update-${id}`);

    if (!gradeInput || !updateBtn) return; 


    if (gradeInput.disabled) {
        gradeInput.disabled = false;
        gradeInput.focus();
        updateBtn.innerText = 'Save';
        updateBtn.style.backgroundColor = '#28a745'; 
    } 
    
    else {
        const newGrade = gradeInput.value;

        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grade: newGrade })
        })
        .then(res => {
            if (!res.ok) return res.json().then(err => { throw new Error(err.error) });
            return res.json();
        })
        .then(() => {
            alert('Grade updated successfully!');
            gradeInput.disabled = true;
            updateBtn.innerText = 'Update';
            updateBtn.style.backgroundColor = '';
            fetchStudents();
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    }
}


window.onload = fetchStudents;
