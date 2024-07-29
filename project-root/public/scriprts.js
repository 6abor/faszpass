// scripts.js
document.getElementById('menu-toggle').addEventListener('click', function() {
    document.getElementById('menu').classList.toggle('show');
});

document.querySelectorAll('.menu a').forEach(function(item) {
    item.addEventListener('click', function() {
        document.getElementById('input-value').setAttribute('placeholder', 'Írd be az ' + this.textContent.toLowerCase() + ' értéket');
        document.getElementById('input-value').setAttribute('data-type', this.getAttribute('data-type'));
        document.getElementById('menu').classList.remove('show');
    });
});

document.getElementById('check-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputValue = document.getElementById('input-value').value;
    const inputType = document.getElementById('input-value').getAttribute('data-type');
    if (!inputValue) {
        document.getElementById('result').textContent = 'Kérjük, adj meg egy értéket!';
        return;
    }
    checkDataLeak(inputType, inputValue);
});

function checkDataLeak(type, value) {
    fetch('/check-leak', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, value })
    })
    .then(response => response.json())
    .then(data => {
        if (data.leaked) {
            document.getElementById('result').textContent = `Adatszivárgás történt: ${value} - Egyéb adatok is kiszivárogtak: ${data.other_info}, dátum: ${data.leak_date}`;
        } else {
            document.getElementById('result').textContent = `Nincs adat szivárgás erre az értékre: ${value}`;
        }
    })
    .catch(error => {
        document.getElementById('result').textContent = 'Hiba történt az ellenőrzés során.';
        console.error('Error:', error);
    });
}
