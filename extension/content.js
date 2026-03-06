// content.js

// Array to store all detected dark patterns
window.detectedPatterns = [];

// Function to highlight elements minimally
function highlightElement(el) {
    el.style.border = "1px solid red";
    el.style.backgroundColor = "rgba(255,0,0,0.05)";
    el.style.transition = "background-color 0.3s ease";

    // Add click toggle for individual highlight
    el.addEventListener("click", () => {
        el.classList.toggle("highlighted");
    });
}

// Function to scan elements
function scanPage() {
    const elements = document.querySelectorAll("button, h1, h2, h3, h4, h5, h6, p, span");

    elements.forEach(el => {
        const text = el.innerText.trim();
        if(text.length === 0) return;

        // Send text to backend for prediction
        fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        })
        .then(response => response.json())
        .then(data => {
            if(data.prediction === 1){
                highlightElement(el);

                // Store detected pattern info
                window.detectedPatterns.push({
                    element: el,
                    text: text,
                    category: data.category
                });

                // Send to background & popup
                chrome.runtime.sendMessage({
                    type: "detectedPatterns",
                    data: window.detectedPatterns
                });
            }
        })
        .catch(err => console.log(err));
    });
}

// Create two DOM snapshots with 1.5s delay (for dynamic detection)
scanPage();
setTimeout(scanPage, 1500);
