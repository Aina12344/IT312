document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme') || 'theme-light';
    const lightBtn = document.getElementById('lightThemeBtn');
    const darkBtn = document.getElementById('darkThemeBtn');

    function switchTheme(theme) {
        // Clear old theme class and add new one
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);

        // Clear active class from both buttons first
        lightBtn.classList.remove('active');
        darkBtn.classList.remove('active');

        if (theme === 'theme-light') {
            lightBtn.classList.add('active');
        } else {
            darkBtn.classList.add('active');
        }
    }
    switchTheme(savedTheme);
    lightBtn.addEventListener('click', () => switchTheme('theme-light'));
    darkBtn.addEventListener('click', () => switchTheme('theme-dark'));

    // -------------------------------
    // SORTING
    // -------------------------------
	const serviceContainer = document.querySelector(".services-list .container");
	const services = Array.from(document.querySelectorAll(".service-item"));
	const sortSelect = document.getElementById("sort-criteria");

	function displayServices(list) {
		list.forEach(service => serviceContainer.appendChild(service));
	}
	// the default sort is (name a-z):
	if (services.length > 0) {
		const sorted = [...services].sort((a, b) =>
			a.querySelector("h2").textContent.localeCompare(
				b.querySelector("h2").textContent
			)
		);
		displayServices(sorted);
	}

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


    // -------------------------------
    // BACK TO TOP BUTTON
    // -------------------------------
    const backToTopBtn = document.getElementById("backToTopBtn");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // -------------------------------
    // LIVE CLOCK
    // -------------------------------
    const clockEl = document.getElementById("clock");
    if (clockEl) {
        function updateClock() {
            clockEl.innerText = new Date().toLocaleTimeString();
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // -------------------------------
    // RESPONSIVE LAYOUT OF THE NAVBAR
    // -------------------------------
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.navbar1'); 

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
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


/****************************************************
 * ----------- Ghena work ----
 ****************************************************/
var defaultMembers = [
    { name: "Ghena Fahd", email: "ghena@example.com", photo: "img/profile1.png" },
    { name: "Norah Al Hosain", email: "norah@example.com", photo: "img/profile2.png" },
    { name: "Jawaher Alrasheed", email: "jawaher@example.com", photo: "img/profile3.png" },
    { name: "Shahad Homoud", email: "shahad@example.com", photo: "img/profile1.png" }
];

/****************************************************
 * ----------- 1) MANAGE STAFF PAGE ----------------
 ****************************************************/
function loadMembers() {
    var listDiv = document.getElementById("memberList");
    if (!listDiv) return;

    var members = JSON.parse(localStorage.getItem("members"));

    //load default members
    if (!members || members.length === 0) {
        members = defaultMembers;
        localStorage.setItem("members", JSON.stringify(members));
    }

    listDiv.innerHTML = "";

    for (var i = 0; i < members.length; i++) {
        listDiv.innerHTML +=
            '<div class="member">' +
                '<div class="info">' +
                    '<img src="' + members[i].photo + '">' +
                    '<span>' + members[i].name + '</span>' +
                '</div>' +
                '<input type="radio" name="selectedMember" value="' + i + '">' +
            '</div>';
    }
}

function setupAddMember() {
    var form = document.getElementById("addMemberForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var name = document.getElementById("mName").value.trim();
        var email = document.getElementById("mEmail").value.trim();
        var photo = document.getElementById("mPhoto"); 

        if (!name || !email || photo.files.length === 0) {
            alert("Please fill all fields and upload a photo.");
            return;
        }

        var members = JSON.parse(localStorage.getItem("members")) || [];

        members.push({
            name: name,
            email: email,
            photo: "img/profile1.png" 
        });

        localStorage.setItem("members", JSON.stringify(members));

        alert("Member added successfully!");
        form.reset();
        loadMembers();
    });
}

function setupDeleteMember() {
    var form = document.getElementById("deleteMemberForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var selected = document.querySelector("input[name='selectedMember']:checked");

        if (!selected) {
            alert("Please select a member to delete.");
            return;
        }

        var members = JSON.parse(localStorage.getItem("members")) || [];
        var index = parseInt(selected.value);

        if (!confirm("Are you sure you want to delete this member?")) return;

        members.splice(index, 1);

        localStorage.setItem("members", JSON.stringify(members));

        alert("Member deleted.");
        loadMembers();
    });
}

/****************************************************
 * ----------- 2) ADD SERVICE PAGE -----------------
 ****************************************************/
function setupAddService() {
    var form = document.getElementById("serviceForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var name = document.getElementById("sName").value.trim();
        var desc = document.getElementById("sDesc").value.trim();
        var price = document.getElementById("sPrice").value.trim();
        var photo = document.getElementById("sPhoto"); // NEW

        // NEW: require file upload
        if (!name || !desc || !price || photo.files.length === 0) {
            alert("Please fill all fields and upload a photo.");
            return;
        }

        if (!isNaN(name.charAt(0))) {
            alert("Service name cannot start with a number.");
            return;
        }

        if (isNaN(price)) {
            alert("Price must be a number.");
            return;
        }

        var services = JSON.parse(localStorage.getItem("services")) || [];

        services.push({
            name: name,
            description: desc,
            price: price
        });

        localStorage.setItem("services", JSON.stringify(services));

        alert("Service added successfully!");
        form.reset();
    });
}

/****************************************************
 * ----------- 3) PROVIDER DASHBOARD ----------------
 ****************************************************/
function loadServices() {
    var list = document.getElementById("serviceList");
    if (!list) return;

    var services = JSON.parse(localStorage.getItem("services")) || [];

    if (services.length === 0) {
        list.innerHTML = "<p>No services added yet.</p>";
        return;
    }

    list.innerHTML = "";

    for (var i = 0; i < services.length; i++) {
        list.innerHTML +=
            "<li>" + services[i].name + " — " + services[i].price + " SAR</li>";
    }
}

/****************************************************
 * ------------------- INITIALIZE ------------------
 ****************************************************/
document.addEventListener("DOMContentLoaded", function () {
    loadMembers();
    setupAddMember();
    setupDeleteMember();

    setupAddService();
    loadServices();
});


/* ABOUT US page */

document.addEventListener("DOMContentLoaded", function () {

    const joinForm = document.querySelector(".joinus-form form");
    if (!joinForm) return;

    joinForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get all input values
        const name = joinForm.querySelector("input[name='name']").value.trim();
        const dob = joinForm.querySelector("input[name='date']").value;
        const email = joinForm.querySelector("input[name='email']").value.trim();
        const phone = joinForm.querySelector("input[name='tel']").value.trim();
        const education = joinForm.querySelector("input[name='education']").value.trim();
        const expertise = joinForm.querySelector("input[name='expertise']").value.trim();
        const skills = joinForm.querySelector("input[name='skills']").value.trim();
        const photoInput = joinForm.querySelector("input[name='photo']");

        let errors = [];

        // Check Empty fields 
        if (!name || !dob || !email || !phone || !education || !expertise || !skills || photoInput.files.length === 0) {
            errors.push("All fields are required.");
        }

        // Name can't start with number
        if (/^[0-9]/.test(name)) {
            errors.push("Name cannot start with a number.");
        }

        // Photo must be an image 
        if (photoInput.files.length > 0) {
            const file = photoInput.files[0];
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

            if (!allowedTypes.includes(file.type)) {
                errors.push("Photo must be an image file (jpg, png, jpeg, webp).");
            }
        }

        // DOB must not be after 2008
        if (dob) {
            const birthYear = new Date(dob).getFullYear();
            if (birthYear > 2008) {
                errors.push("DOB must be 2008 or earlier.");
            }
        }

        // Show errors if exist
        if (errors.length > 0) {
            let msg = "Please fix the following:\n\n";
            errors.forEach(err => msg += "- " + err + "\n");
            alert(msg);
            return;
        }

        // Confirmation message 
        alert("Thank you, " + name + "! Your application has been submitted successfully.");
        joinForm.reset();
    });

});


 /* WISHLIST page */
 

document.addEventListener("DOMContentLoaded", function () {

    // ADD TO WISHLIST 
    var serviceCards = document.querySelectorAll(".service-item");

    serviceCards.forEach(function(card) {
        var checkbox = card.querySelector(".wishlist-checkbox");

        if (!checkbox) return;

        checkbox.addEventListener("change", function () {
            var saved = JSON.parse(localStorage.getItem("wishlist")) || [];

            var title = card.querySelector("h2").textContent.trim();
            var desc = card.querySelector(".description").textContent.trim();
            var img = card.querySelector("img").getAttribute("src");

            if (!title || !img) return;

            if (checkbox.checked) {
                var exists = false;
                for (var i = 0; i < saved.length; i++) {
                    if (saved[i].title === title) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    saved.push({ title: title, desc: desc, img: img });
                    alert(title + " added to wishlist");
                }

            } else {
                var updated = [];
                for (var j = 0; j < saved.length; j++) {
                    if (saved[j].title !== title) {
                        updated.push(saved[j]);
                    }
                }
                saved = updated;
                alert(title + " removed from wishlist");
            }

            localStorage.setItem("wishlist", JSON.stringify(saved));
        });
    });


    // DISPLAY WISHLIST PAGE 
    var wishlistPage = document.querySelector(".wishlist-page");

    if (wishlistPage) {
        var savedItems = JSON.parse(localStorage.getItem("wishlist")) || [];

        if (savedItems.length === 0) {
            wishlistPage.innerHTML +=
                '<p class="empty-wishlist-msg">Your wishlist is empty</p>';
            return;
        }

        savedItems.forEach(function(item) {
            var box = document.createElement("div");
            box.className = "wishlist-item";

            box.innerHTML =
                '<img src="' + item.img + '">' +
                '<div class="details">' +
                    '<strong>' + item.title + '</strong>' +
                    '<span>' + item.desc + '</span>' +
                '</div>' +
                '<div class="wish-buttons">' +
                    '<button class="remove-wish" data-title="' + item.title + '">Remove</button>' +
                    '<a href="request-service.html" class="request-wish">Request</a>' +
                '</div>';

            wishlistPage.appendChild(box);
        });

        // delete item
        var removeBtns = document.querySelectorAll(".remove-wish");

        removeBtns.forEach(function(btn) {
            btn.addEventListener("click", function () {
                var title = btn.getAttribute("data-title");
                var saved = JSON.parse(localStorage.getItem("wishlist")) || [];

                var updated = [];
                for (var i = 0; i < saved.length; i++) {
                    if (saved[i].title !== title) {
                        updated.push(saved[i]);
                    }
                }

                localStorage.setItem("wishlist", JSON.stringify(updated));

                alert(title + " removed from wishlist");
                location.reload();
            });
        });
    }
	
	// KEEP HEART DARK AFTER REFRESH 
var serviceCards = document.querySelectorAll(".service-item");

if (serviceCards.length > 0) {
    var saved = JSON.parse(localStorage.getItem("wishlist")) || [];

    serviceCards.forEach(function(card) {
        var title = card.querySelector("h2").textContent.trim();
        var checkbox = card.querySelector(".wishlist-checkbox");

        for (var i = 0; i < saved.length; i++) {
            if (saved[i].title === title) {
                checkbox.checked = true;
            }
        }
    });
}

	});



