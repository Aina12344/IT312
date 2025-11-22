// services.js

// Shuffle services on page load and allow sorting

document.addEventListener("DOMContentLoaded", () => {
    const serviceContainer = document.querySelector(".services-list .container");
    const services = Array.from(document.querySelectorAll(".service-item"));
    const sortSelect = document.getElementById("sort-criteria");

    // Function to shuffle array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Display services
    function displayServices(list) {
        list.forEach(service => serviceContainer.appendChild(service));
    }

    // Initial random order
    const shuffled = shuffle(services);
    displayServices(shuffled);

    // Sorting logic
    sortSelect.addEventListener("change", () => {
        const option = sortSelect.value;
        const sorted = [...services];

        if (option === "name-asc") {
            sorted.sort((a, b) => a.querySelector("h2").textContent.localeCompare(b.querySelector("h2").textContent));
        } else if (option === "name-desc") {
            sorted.sort((a, b) => b.querySelector("h2").textContent.localeCompare(a.querySelector("h2").textContent));
        } else if (option === "price-low") {
            sorted.sort((a, b) => extractPrice(a) - extractPrice(b));
        } else if (option === "price-high") {
            sorted.sort((a, b) => extractPrice(b) - extractPrice(a));
        }

        displayServices(sorted);
    });

    // Helper to extract numeric price
    function extractPrice(service) {
        const text = service.querySelector(".price").textContent;
        return parseFloat(text.replace(/[^0-9.]/g, ""));
    }
});
