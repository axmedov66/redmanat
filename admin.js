const API_URL = 'http://localhost:3000/api/users';

async function updatePanel() {
    try {
        const res = await fetch(API_URL);
        const users = await res.json();

        document.getElementById('userCount').innerText = users.length;

        const totalAds = users.reduce((sum, u) => sum + (u.ads || 0), 0);
        document.getElementById('adCount').innerText = totalAds;

        const tbody = document.querySelector('#userTable tbody');
        tbody.innerHTML = '';

        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = <td>${u.id}</td><td>${u.name}</td><td>${u.ads || 0}</td>;
            tbody.appendChild(tr);
        });
    } catch(err) {
        console.error('Panel yenilənmədi:', err);
    }
}

async function searchUser() {
    const query = document.getElementById('searchUser').value.toLowerCase();
    const res = await fetch(API_URL);
    const users = await res.json();
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';

    users.filter(u => u.name.toLowerCase().includes(query))
         .forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = <td>${u.id}</td><td>${u.name}</td><td>${u.ads || 0}</td>;
            tbody.appendChild(tr);
         });
}

async function resetAds() {
    const res = await fetch(API_URL);
    const users = await res.json();
    for (let u of users) {
        await fetch(`${API_URL}/${u.id}/ad`, { 
            method: 'POST', 
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ reset: true })
        });
    }
    updatePanel();
}

updatePanel();
