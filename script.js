// Quote Rotator
const quotes = [
    "You are safe here.",
    "Healing begins with honesty.",
    "Every story matters.",
    "Every feeling belongs.",
    "It's okay not to be okay.",
    "You are not alone.",
    "Your voice matters."
];

let quoteIndex = 0;
const quoteElement = document.getElementById('quote');

function rotateQuote() {
    quoteElement.textContent = quotes[quoteIndex];
    quoteIndex = (quoteIndex + 1) % quotes.length;
}

setInterval(rotateQuote, 5000); // Change quote every 5 seconds

// Panic Button Modal
const panicBtn = document.getElementById("panicBtn");
const panicModal = document.getElementById("panicModal");
const span = document.getElementsByClassName("close")[0];

panicBtn.onclick = function() {
    panicModal.style.display = "block";
}

span.onclick = function() {
    panicModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == panicModal) {
        panicModal.style.display = "none";
    }
}
