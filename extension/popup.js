// popup.js

document.addEventListener("DOMContentLoaded", function() {
    const list = document.getElementById("pattern-list");

    // Request detected patterns from content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs || tabs.length === 0) {
            console.log("No active tabs found.");
            return;
        }

        const tabId = tabs[0].id;

        chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: () => window.detectedPatterns || []
        }, (results) => {
            // Safety check: ensure results exist
            if (!results || !results[0] || !results[0].result) {
                console.log("No detected patterns or unable to inject script on this page.");
                list.innerHTML = "<li>No patterns detected or unsupported page.</li>";
                return;
            }

            const detectedPatterns = results[0].result;

            list.innerHTML = ""; // Clear previous
            if (detectedPatterns.length === 0) {
                list.innerHTML = "<li>No dark patterns detected on this page.</li>";
                return;
            }

            detectedPatterns.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.text} — ${item.category}`;

                // Click to scroll to element and highlight individually
                li.addEventListener("click", () => {
                    if (item.element) {
                        item.element.scrollIntoView({behavior: "smooth", block: "center"});
                        item.element.classList.add("highlighted"); // highlight if not already
                    }
                });

                list.appendChild(li);
            });
        });
    });
});
