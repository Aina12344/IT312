// =======================
// Services Page Script
// Shuffle services on page load and allow sorting
// =======================

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme') || 'theme-light';
    document.body.classList.add(savedTheme);

    // THEME SWITCHER
    const lightBtn = document.getElementById('lightThemeBtn');
    const darkBtn = document.getElementById('darkThemeBtn');

    if (lightBtn && darkBtn) {
        lightBtn.addEventListener('click', () => {
            document.body.classList.replace('theme-dark', 'theme-light');
            localStorage.setItem('theme', 'theme-light');
        });

        darkBtn.addEventListener('click', () => {
            document.body.classList.replace('theme-light', 'theme-dark');
            localStorage.setItem('theme', 'theme-dark');
        });
    }


    /* ============================
       SHUFFLE + SORTING
    ============================= */
    const serviceContainer = document.querySelector(".services-list .container");
    const services = Array.from(document.querySelectorAll(".service-item"));
    const sortSelect = document.getElementById("sort-criteria");

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function displayServices(list) {
        list.forEach(service => serviceContainer.appendChild(service));
    }

    if (services.length > 0) displayServices(shuffle(services));

    sortSelect?.addEventListener("change", () => {
        const option = sortSelect.value;
        const sorted = [...services];

        if (option === "name-asc") {
            sorted.sort((a, b) =>
                a.querySelector("h2").textContent.localeCompare(
                    b.querySelector("h2").textContent
                )
            );
        } else if (option === "name-desc") {
            sorted.sort((a, b) =>
                b.querySelector("h2").textContent.localeCompare(
                    a.querySelector("h2").textContent
                )
            );
        } else if (option === "price-low") {
            sorted.sort((a, b) => extractPrice(a) - extractPrice(b));
        } else if (option === "price-high") {
            sorted.sort((a, b) => extractPrice(b) - extractPrice(a));
        }

        displayServices(sorted);
    });

    function extractPrice(service) {
        return parseFloat(service.querySelector(".price").textContent.replace(/[^0-9.]/g, ""));
    }


    /* ============================
       BACK TO TOP BUTTON
    ============================= */
    const backToTopBtn = document.getElementById("backToTopBtn");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* ============================
       LIVE CLOCK
    ============================= */
    const clockEl = document.getElementById("clock");
    if (clockEl) {
        function updateClock() {
            clockEl.innerText = new Date().toLocaleTimeString();
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

});



// =======================
// Request a Service Page Script 
// =======================

document.addEventListener("DOMContentLoaded", function () {

    var form = document.getElementById("requestForm");

    if (!form) {
        return;
    }

    var requestsContainer = document.getElementById("requestsContainer");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var service = document.getElementById("service").value.trim();
        var name = document.getElementById("custName").value.trim();
        var dueDate = document.getElementById("due").value;
        var desc = document.getElementById("desc").value.trim();

        var errors = [];

        if (!service) {
            errors.push("Please select a service.");
        }

        var hasDigitsOrSymbols = /[0-9?@!#\$%\^&\*]/.test(name);
        var wordsArr = name.split(/\s+/);
        var cleanedWords = [];
        for (var i = 0; i < wordsArr.length; i++) {
            if (wordsArr[i]) {
                cleanedWords.push(wordsArr[i]);
            }
        }
        var wordsCount = cleanedWords.length;

        if (!name) {
            errors.push("Customer name is required.");
        } else {
            if (wordsCount < 2) {
                errors.push("Please enter full name (first & last).");
            }
            if (hasDigitsOrSymbols) {
                errors.push("Name should not contain numbers or symbols.");
            }
        }

        
        if (!dueDate) {
            errors.push("Please select a due date.");
        } else {
            var today = new Date();
            var due = new Date(dueDate);

            var MS_PER_DAY = 1000 * 60 * 60 * 24;

            var todayDays = Math.floor(today.getTime() / MS_PER_DAY);
            var dueDays = Math.floor(due.getTime() / MS_PER_DAY);

            var diffDays = dueDays - todayDays;

            
            if (diffDays <= 3) {
                errors.push("Due date must be more than 3 days from today.");
            }
        }

        
        if (!desc) {
            errors.push("Description is required.");
        } else if (desc.length < 100) {
            errors.push("Description must be at least 100 characters.");
        }

        
        if (errors.length > 0) {
            var msg = "Please fix the following:\n\n";
            for (var j = 0; j < errors.length; j++) {
                msg += "- " + errors[j] + "\n";
            }
            alert(msg);
            return;
        }

        

        
        var confirmMsg =
            "Thank you, " + name + ". Your request has been submitted.\n\n" +
            "Press OK to stay on this page and review your requests.\n" +
            "Press Cancel to go to your dashboard.";

        var stayOnPage = window.confirm(confirmMsg);

        if (!stayOnPage) {
            
            window.location.href = "customer-dashboard.html";
            return;
        }

        

        var item = document.createElement("div");
        item.className = "request-item";

        item.innerHTML =
            "<h3>" + service + "</h3>" +
            "<p><strong>Customer:</strong> " + name + "</p>" +
            "<p><strong>Due Date:</strong> " + dueDate + "</p>" +
            "<p>" + desc + "</p>" +
            "<hr>";

        if (requestsContainer) {
            requestsContainer.appendChild(item);
        }

       
        form.reset();

        
    });

});


// =======================
// Service Evaluation Page Script 
// =======================

document.addEventListener("DOMContentLoaded", function () {

    var evalForm = document.getElementById("evaluationForm");

    if (!evalForm) {
        return;
    }

    evalForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var service = document.getElementById("srv").value;
        var ratingInputs = document.getElementsByName("rating");
        var ratingValue = "";
        var i;

        for (i = 0; i < ratingInputs.length; i++) {
            if (ratingInputs[i].checked) {
                ratingValue = ratingInputs[i].value; 
                break;
            }
        }

        var feedback = document.getElementById("fb").value.trim();

        var errors = [];

        if (!service) {
            errors.push("Please select a service to evaluate.");
        }

        
        if (!ratingValue) {
            errors.push("Please select a rating .");
        }

        
        if (!feedback) {
            errors.push("Feedback is required.");
        }

        
        if (errors.length > 0) {
            var msg = "Please fix the following:\n\n";
            for (i = 0; i < errors.length; i++) {
                msg += "-" + errors[i] + "\n";
            }
            alert(msg);
            return;
        }

        
        if (ratingValue === "4" || ratingValue === "5" || ratingValue === "3") {
            alert("Thank you for your positive feedback! We are happy you enjoyed our service.");
        } else {
            
            alert("We are sorry that your experience was not perfect. We will work to improve our services.");
        }

        
        window.location.href = "customer-dashboard.html";
    });

});



