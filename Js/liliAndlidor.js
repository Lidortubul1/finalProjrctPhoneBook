"use strict";

// נתוני אנשי קשר ראשוניים
let contacts = [
    { name: "Lidor tubul", phone: "052-535-3869", address: "shlomi", email: "tubul65431@gmail.com", text: "Friend from work" },
    { name: "Lili vainer", phone: "052-456-4846", address: "kfar bialkik", email: "lilivainer@gmail.com", text: "Neighbor" },
    { name: "adi elbaz", phone: "052-345-3453", address: "kiryat yam", email: "ado@gmail.com", text: "Classmate" },
    { name: "moshe levi", phone: "050-456-7654", address: "Tel aviv", email: "moshe652@gmail.com", text: "Coworker" }
];

// הוספת מאזינים לאירועים עבור כפתורים שונים 
document.getElementById("addContactButton").addEventListener("click", openContactForm); // מאזין לפתיחת טופס הוספת איש קשר
document.getElementById("deleteAllButton").addEventListener("click", deleteAllContacts); // מאזין למחיקת כל אנשי הקשר
document.getElementById("contactForm").querySelector("form").addEventListener("submit", saveContact); // מאזין לשמירת איש קשר חדש/ערוך
document.getElementById("cancelButton").addEventListener("click", closeContactForm); // מאזין לסגירת טופס איש הקשר
document.getElementById("searchInput").addEventListener("input", filterContacts); // מאזין לשדה החיפוש עבור סינון אנשי קשר

// מאזין לכפתור של אפקט השפרצת צבע
document.getElementById("colorSplashButton").addEventListener("click", toggleColorSplashEffect);

// מאזין לכפתור צפייה באיש קשר
document.getElementById("contactList").addEventListener("click", function(event) {
    if (event.target.classList.contains("viewButton")) {
        showViewContactPopup(event.target.dataset.index); // מאזין לכפתור צפייה עבור פתיחת חלונית פרטי איש קשר
    }
});

// מאזין לסגירת חלונית צפייה בפרטי איש קשר
document.getElementById("viewContactPopup").querySelector(".close").addEventListener("click", function() {
    document.getElementById("viewContactPopup").style.display = "none"; // סגירת חלונית הצפייה
});

// רינדור (הצגת) אנשי קשר בעת טעינת הדף
renderContacts(contacts);

// פונקציה לרינדור אנשי הקשר בדף
function renderContacts(contactList) {
    const contactListDiv = document.getElementById("contactList");
    contactListDiv.innerHTML = ""; // ניקוי רשימת אנשי הקשר הקיימת

    if (contactList.length === 0) {
        // אם אין אנשי קשר, להציג הודעה ריקה
        document.getElementById("noContactsMessage").style.display = "block";
    } else {
        document.getElementById("noContactsMessage").style.display = "none";
        // סידור אנשי הקשר לפי סדר אלפביתי ורינדור כל אחד מהם
        contactList.sort((a, b) => a.name.localeCompare(b.name)).forEach((contact, index) => {
            const contactDiv = document.createElement("div");
            contactDiv.className = "contact";
            // יצירת אלמנט HTML לכל איש קשר
            contactDiv.innerHTML = `
                <div>
                    <strong>${contact.name}</strong><br>
                    ${contact.phone}
                </div>
                <div class="contact-buttons">
                    <button data-index="${index}" class="viewButton">View</button>
                    <button data-index="${index}" class="editButton">Edit</button>
                    <button data-index="${index}" class="deleteButton">Delete</button>
                </div>
            `;
            // מאזינים לכפתורי עריכה ומחיקה של כל איש קשר
            contactDiv.querySelector(".editButton").addEventListener("click", editContact);
            contactDiv.querySelector(".deleteButton").addEventListener("click", deleteContact);
            contactListDiv.appendChild(contactDiv); // הוספת אלמנט איש הקשר לרשימה בדף
        });
    }
}

// פונקציה להצגת פרטי איש קשר בחלונית צפייה
function showViewContactPopup(index) {
    const contact = contacts[index];
    document.getElementById("contactName").innerText = `Name: ${contact.name}`;
    document.getElementById("contactPhone").innerText = `Phone: ${contact.phone}`;
    document.getElementById("contactAddress").innerText = `Address: ${contact.address}`;
    document.getElementById("contactEmail").innerText = `Email: ${contact.email}`;
    document.getElementById("contactNotes").innerText = `Additional Info: ${contact.text}`;
    
    const viewContactPopup = document.getElementById("viewContactPopup");
    viewContactPopup.style.display = "flex"; // פתיחת חלונית הצפייה
}

// פונקציה לפתיחת טופס הוספת איש קשר
function openContactForm() {
    const form = document.getElementById("contactForm");
    form.querySelector("#formTitle").innerText = "Add Contact"; // שינוי הכותרת ל-"הוסף איש קשר"
    form.querySelector("form").reset(); // איפוס שדות הטופס
    form.querySelector("button[type='submit']").removeAttribute("data-index"); // הסרת אינדקס לשמירה כאיש קשר חדש
    form.style.display = "flex"; // הצגת הטופס
}

// פונקציה לסגירת טופס איש קשר
function closeContactForm() {
    document.getElementById("contactForm").style.display = "none"; // סגירת הטופס
}

// פונקציה לשמירת איש קשר חדש או ערוך
function saveContact(event) {
    event.preventDefault(); // מניעת רענון הדף ברירת מחדל

    const form = document.getElementById("contactForm").querySelector("form");
    const name = form.querySelector("#name").value;
    const phone = form.querySelector("#phone").value;
    const address = form.querySelector("#address").value;
    const email = form.querySelector("#email").value;
    const text = form.querySelector("#text").value;

    const index = form.querySelector("button[type='submit']").getAttribute("data-index"); // קבלת אינדקס אם זה עריכה
    
    // בדיקת ייחודיות השם ברשימת אנשי הקשר
    if (contacts.some(contact => contact.name === name && contact !== contacts[index])) {
        alert("Contact with this name already exists.");
        return;
    }

    // אם אין אינדקס, מדובר באיש קשר חדש, אחרת מדובר בעריכה
    if (index === null) {
        contacts.push({ name, phone, address, email, text });
    } else {
        contacts[index] = { name, phone, address, email, text };
    }

    renderContacts(contacts); // רינדור אנשי הקשר לאחר השמירה
    closeContactForm(); // סגירת הטופס
}

// פונקציה לעריכת איש קשר קיים
function editContact(event) {
    const index = event.target.getAttribute("data-index"); // קבלת אינדקס איש הקשר לעריכה
    const contact = contacts[index];
    
    const form = document.getElementById("contactForm");
    form.querySelector("#formTitle").innerText = "Edit Contact"; // שינוי כותרת הטופס לעריכה
    form.querySelector("#name").value = contact.name;
    form.querySelector("#phone").value = contact.phone;
    form.querySelector("#address").value = contact.address;
    form.querySelector("#email").value = contact.email;
    form.querySelector("#text").value = contact.text;
    form.querySelector("button[type='submit']").setAttribute("data-index", index); // קביעת אינדקס לכפתור השמירה
    
    form.style.display = "flex"; // פתיחת הטופס
}

// פונקציה למחיקת איש קשר מהרשימה
function deleteContact(event) {
    const index = event.target.getAttribute("data-index"); // קבלת אינדקס איש הקשר למחיקה
    contacts.splice(index, 1); // מחיקת איש הקשר מהרשימה
    renderContacts(contacts); // רינדור מחדש של אנשי הקשר
}

// פונקציה למחיקת כל אנשי הקשר
function deleteAllContacts() {
    contacts = []; // איפוס רשימת אנשי הקשר
    renderContacts(contacts); // רינדור מחדש עם רשימה ריקה
}

// פונקציה לסינון אנשי קשר לפי שדה החיפוש
function filterContacts() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase(); // המרת הקלט לאותיות קטנות
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery) // סינון אנשי הקשר לפי השם
    );
    renderContacts(filteredContacts); // רינדור מחדש של אנשי הקשר המסוננים
}

// פונקציה להפעלת/כיבוי אפקט השפרצת צבע
function toggleColorSplashEffect() {
    const colorSplashDiv = document.getElementById("colorSplashEffect");
    colorSplashDiv.classList.toggle("active"); // שינוי מצב האפקט (הפעלה/כיבוי)
}
