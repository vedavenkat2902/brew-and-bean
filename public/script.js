// ================= API =================

const API_BASE_URL =
    "https://brew-and-bean.onrender.com";

// ================= CART =================

let cart =
    JSON.parse(localStorage.getItem("coffeeCart")) || [];


// ================= SAVE CART =================

function saveCart() {

    localStorage.setItem(
        "coffeeCart",
        JSON.stringify(cart)
    );

}


// ================= CART COUNT =================

// ================= CART COUNT =================

function updateCartCount() {

    const cartCountElements =
        document.querySelectorAll(".cart-btn span");

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// ================= CART DISPLAY =================

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        updateSummary();

        return;
    }


    cart.forEach((item, index) => {

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "cart-item";


        itemElement.innerHTML = `

            <div class="cart-item-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    ₹${item.price}
                </span>

            </div>


            <div class="quantity-controls">

                <button
                    onclick="changeQuantity(${index}, -1)"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity(${index}, 1)"
                >
                    +
                </button>

            </div>

        `;


        cartItems.appendChild(
            itemElement
        );

    });


    updateSummary();

}


// ================= CHANGE QUANTITY =================

function changeQuantity(index, amount) {

    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    displayCart();

    updateCartCount();

}


// ================= REMOVE ITEM =================

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    displayCart();

    updateCartCount();

}


// ================= CART SUMMARY =================

function calculateTotals() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    const tax =
        Math.round(
            subtotal * 0.05
        );


    return {

        subtotal: subtotal,

        tax: tax,

        total:
            subtotal + tax

    };

}


// ================= UPDATE SUMMARY =================

function updateSummary() {

    const subtotalElement =
        document.getElementById("subtotal");

    const taxElement =
        document.getElementById("tax");

    const totalElement =
        document.getElementById("total");


    if (
        !subtotalElement ||
        !taxElement ||
        !totalElement
    ) {
        return;
    }


    const totals =
        calculateTotals();


    subtotalElement.textContent =
        `₹${totals.subtotal}`;


    taxElement.textContent =
        `₹${totals.tax}`;


    totalElement.textContent =
        `₹${totals.total}`;

}


// ================= CHECKOUT =================

function displayCheckout() {

    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );


    if (!checkoutItems) {
        return;
    }


    checkoutItems.innerHTML = "";


    cart.forEach(item => {

        const itemElement =
            document.createElement("div");


        itemElement.className =
            "checkout-item";


        itemElement.innerHTML = `

            <div class="checkout-item-name">

                ${item.name}

                <span>
                    × ${item.quantity}
                </span>

            </div>


            <strong>
                ₹${item.price * item.quantity}
            </strong>

        `;


        checkoutItems.appendChild(
            itemElement
        );

    });


    const totals =
        calculateTotals();


    document.getElementById(
        "checkoutSubtotal"
    ).textContent =
        `₹${totals.subtotal}`;


    document.getElementById(
        "checkoutTax"
    ).textContent =
        `₹${totals.tax}`;


    document.getElementById(
        "checkoutTotal"
    ).textContent =
        `₹${totals.total}`;

}


// ================= PLACE ORDER =================

// ================= PLACE ORDER =================

const placeOrderBtn =
    document.getElementById("placeOrderBtn");

if (placeOrderBtn) {

    placeOrderBtn.addEventListener(
        "click",
        async function () {

            const loggedInUser =
                getLoggedInUser();


            // CHECK LOGIN

            if (!loggedInUser) {

                localStorage.setItem(
                    "loginReturnPage",
                    "checkout.html"
                );

                window.location.href =
                    "login.html";

                return;
            }


            // GET CUSTOMER DETAILS

            // GET CUSTOMER DETAILS

const customerNameElement =
    document.getElementById("customerName");

const customerPhoneElement =
    document.getElementById("customerPhone");

const tableNumberElement =
    document.getElementById("tableNumber");

const orderNotesElement =
    document.getElementById("orderNotes");


// Make sure checkout fields exist

if (
    !customerNameElement ||
    !customerPhoneElement ||
    !tableNumberElement
) {

    console.error(
        "Checkout fields not found.",
        {
            customerNameElement,
            customerPhoneElement,
            tableNumberElement
        }
    );

    alert(
        "Checkout form could not be loaded correctly. Please refresh the page."
    );

    return;
}


const customerName =
    customerNameElement.value.trim();

const phone =
    customerPhoneElement.value.trim();

const tableNumber =
    tableNumberElement.value.trim();

const orderNotes =
    orderNotesElement
        ? orderNotesElement.value.trim()
        : "";


// CHECK NAME
            // CHECK NAME

            if (!customerName) {

                alert(
                    "Please enter your name."
                );

                return;
            }


            // CHECK PHONE

            if (!phone) {

                alert(
                    "Please enter your phone number."
                );

                return;
            }


            // CHECK TABLE NUMBER

            if (!tableNumber) {

                alert(
                    "Please enter your table number."
                );

                return;
            }


            // GET CART

            const cart =
                JSON.parse(
                    localStorage.getItem(
                        "coffeeCart"
                    )
                ) || [];


            if (
                !Array.isArray(cart) ||
                cart.length === 0
            ) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            // CALCULATE TOTALS

            let subtotal = 0;

            cart.forEach(item => {

                subtotal +=
                    Number(item.price) *
                    Number(item.quantity);

            });


            const tax =
                Math.round(
                    subtotal * 0.05
                );

            const total =
                subtotal + tax;


            // PAYMENT

            const paymentMethod =
                document.querySelector(
                    'input[name="payment"]:checked'
                )?.value || "counter";


            // DISABLE BUTTON

            placeOrderBtn.disabled = true;

            placeOrderBtn.textContent =
                "Placing Order...";


            try {

                // SEND ORDER TO BACKEND

                const response =
                    await fetch(
                       `${API_BASE_URL}/api/orders`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                userId:
                                    loggedInUser.id,

                                customerName:
                                    customerName,

                                phone:
                                    phone,

                                tableNumber:
                                    tableNumber,

                                paymentMethod:
                                    paymentMethod,

                                items:
                                    cart.map(item => ({
                                        name:
                                            item.name,
                                        price:
                                            Number(item.price),
                                        quantity:
                                            Number(item.quantity)
                                    })),

                                subtotal:
                                    subtotal,

                                tax:
                                    tax,

                                total:
                                    total
                            })
                        }
                    );


                const data =
                    await response.json();


                // BACKEND ERROR

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to place order."
                    );

                    placeOrderBtn.disabled =
                        false;

                    placeOrderBtn.textContent =
                        "Place Order →";

                    return;
                }


                // SAVE ORDER FOR ORDERS PAGE

                localStorage.setItem(
                    "lastOrder",
                    JSON.stringify({
                        ...data.order,

                        items: cart,

                        customerName:
                            customerName,

                        customerPhone:
                            phone,

                        tableNumber:
                            tableNumber,

                        paymentMethod:
                            paymentMethod,

                        orderNotes:
                            orderNotes
                    })
                );


                // CLEAR CART

                localStorage.removeItem(
                    "coffeeCart"
                );


                // GO TO ORDERS PAGE

                window.location.href =
                    "orders.html";


            } catch (error) {

                console.error(
                    "Place order error:",
                    error
                );

                alert(
                    "Unable to connect to the server. Please try again."
                );

                placeOrderBtn.disabled =
                    false;

                placeOrderBtn.textContent =
                    "Place Order →";
            }

        }
    );

}
// ================= ORDERS PAGE POPULAR PICKS =================

const popularAddButtons =
    document.querySelectorAll(
        ".popular-add-btn"
    );


popularAddButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name =
            button.dataset.name;

        const price =
            Number(button.dataset.price);


        const existingItem =
            cart.find(
                item => item.name === name
            );


        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({

                name: name,

                price: price,

                quantity: 1

            });

        }


        saveCart();

        updateCartCount();


        button.innerHTML =
            "Added ✓";


        setTimeout(() => {

            button.innerHTML = `Add to cart <span>+</span>`;

        }, 1000);

    });

});


// ================= DISPLAY ORDERS FROM DATABASE =================

async function displayLastOrder() {

    // CHECK LOGIN

    const user =
        getLoggedInUser();

    if (!user) {

        if (noOrder) {
            noOrder.style.display = "block";
        }

        if (orderSuccess) {
            orderSuccess.style.display = "none";
        }

        if (orderContent) {
            orderContent.style.display = "none";
        }

        return;
    }

    


    try {

        // GET ORDERS FROM POSTGRESQL

        const response =
            await fetch(
                 `${API_BASE_URL}/api/orders/${user.id}`
            );


        const data =
            await response.json();


        // API ERROR

        if (!response.ok || !data.success) {

            console.error(
                "Failed to get orders:",
                data.message
            );

            return;
        }


        // NO ORDERS

        if (
            !data.orders ||
            data.orders.length === 0
        ) {

            if (noOrder) {
                noOrder.style.display = "block";
            }

            if (orderSuccess) {
                orderSuccess.style.display = "none";
            }

            if (orderContent) {
                orderContent.style.display = "none";
            }

            return;
        }


        // GET MOST RECENT ORDER

        const order =
    data.orders[0];


// SHOW ORDER PAGE

if (noOrder) {
    noOrder.style.setProperty(
        "display",
        "none",
        "important"
    );
}

if (orderSuccess) {
    orderSuccess.style.display = "block";
}

if (orderContent) {
    orderContent.style.display = "block";
}
        // ================= TABLE =================

        const orderTable =
            document.getElementById("orderTable");

        if (orderTable) {

            orderTable.textContent =
                order.table_number || "--";

        }


        // ================= CUSTOMER =================

        const orderCustomer =
            document.getElementById("orderCustomer");

        if (orderCustomer) {

            orderCustomer.textContent =
                order.customer_name || "--";

        }


        // ================= PHONE =================

        const orderPhone =
            document.getElementById("orderPhone");

        if (orderPhone) {

            orderPhone.textContent =
                order.customer_phone || "--";

        }


        // ================= PAYMENT =================

        const orderPayment =
            document.getElementById("orderPayment");

        if (orderPayment) {

            const paymentNames = {

                counter:
                    "Payment at Counter"

            };

            orderPayment.textContent =
                paymentNames[
                    order.payment_method
                ] ||
                order.payment_method ||
                "--";

        }


        // ================= SPECIAL INSTRUCTIONS =================

        const orderNotes =
            document.getElementById("orderNotes");

        if (orderNotes) {

            orderNotes.textContent =
                "None";

        }


        // ================= ORDER ITEMS =================

        const orderItems =
            document.getElementById("orderItems");

        if (orderItems) {

            orderItems.innerHTML = "";


            if (
                Array.isArray(order.items)
            ) {

                order.items.forEach(item => {

                    const itemElement =
                        document.createElement("div");


                    itemElement.className =
                        "order-item";


                    itemElement.innerHTML = `

                        <div class="order-item-name">

                            ${item.item_name}

                            <span>
                                × ${item.quantity}
                            </span>

                        </div>


                        <strong>
                            ₹${Number(item.price) * Number(item.quantity)}
                        </strong>

                    `;


                    orderItems.appendChild(
                        itemElement
                    );

                });

            }

        }


        // ================= TOTALS =================

        const orderSubtotal =
            document.getElementById(
                "orderSubtotal"
            );

        const orderTax =
            document.getElementById(
                "orderTax"
            );

        const orderTotal =
            document.getElementById(
                "orderTotal"
            );


        if (orderSubtotal) {

            orderSubtotal.textContent =
                `₹${Number(order.subtotal)}`;

        }


        if (orderTax) {

            orderTax.textContent =
                `₹${Number(order.tax)}`;

        }


        if (orderTotal) {

            orderTotal.textContent =
                `₹${Number(order.total)}`;

        }


    } catch (error) {

        console.error(
            "Get orders error:",
            error
        );

    }

}

// ================= INITIALIZE =================

updateCartCount();

displayCart();

displayCheckout();

displayLastOrder();


// ================= RESERVATIONS =================

const guestButtons =
    document.querySelectorAll(
        ".guest-btn"
    );


let selectedGuests = "1";


guestButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                guestButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                selectedGuests =
                    button.dataset.guests;

            }
        );

    }
);


// ================= RESERVATION DATE =================

const reservationDate =
    document.getElementById(
        "reservationDate"
    );


if (reservationDate) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    reservationDate.min =
        today;

}
// ================= DIFFERENT RESERVATION DETAILS =================

const differentReservationDetails =
    document.getElementById(
        "useDifferentReservationDetails"
    );

if (differentReservationDetails) {

    const reservationName =
        document.getElementById("reservationName");

    const reservationPhone =
        document.getElementById("reservationPhone");


    differentReservationDetails.addEventListener(
        "change",
        () => {

            if (differentReservationDetails.checked) {

                // Allow different details
                reservationName.readOnly = false;
                reservationPhone.readOnly = false;

                reservationName.value = "";
                reservationPhone.value = "";

                reservationName.placeholder =
                    "Enter different name";

                reservationPhone.placeholder =
                    "Enter different phone number";

            } else {

                // Restore logged-in user's details
                const user = getLoggedInUser();

                if (user) {

                    reservationName.value =
                        user.name;

                    reservationPhone.value =
                        user.phone;

                }

                reservationName.readOnly = true;
                reservationPhone.readOnly = true;

            }

        }
    );

}

// ================= CONFIRM RESERVATION =================

const reserveButton =
    document.getElementById("reserveBtn");

if (reserveButton) {

    reserveButton.addEventListener(
        "click",
        async () => {

            // CHECK LOGIN

            const loggedInUser =
                getLoggedInUser();

            if (!loggedInUser) {

                alert(
                    "Please log in to make a reservation."
                );

                localStorage.setItem(
                    "loginReturnPage",
                    "reservations.html"
                );

                window.location.href =
                    "login.html";

                return;
            }


            // GET RESERVATION DETAILS

            const date =
                document.getElementById(
                    "reservationDate"
                ).value;

            const time =
                document.getElementById(
                    "reservationTime"
                ).value;

            const name =
                document.getElementById(
                    "reservationName"
                ).value.trim();

            const phone =
                document.getElementById(
                    "reservationPhone"
                ).value.trim();

            const notes =
                document.getElementById(
                    "reservationNotes"
                ).value.trim();


            // GET NUMBER OF GUESTS

            const guests =
                selectedGuests;


            // VALIDATE DETAILS

            const missingFields = [];


            if (!date) {
                missingFields.push("date");
            }

            if (!time) {
                missingFields.push("time");
            }

            if (!name) {
                missingFields.push("name");
            }

            if (!phone) {
                missingFields.push("phone number");
            }


            if (missingFields.length > 0) {

                if (missingFields.length === 1) {

                    alert(
                        `Please select/enter your ${missingFields[0]}.`
                    );

                } else {

                    alert(
                        `Please select/enter your ${missingFields.join(", ")}.`
                    );

                }

                return;
            }


            // DISABLE BUTTON

            reserveButton.disabled = true;

            reserveButton.textContent =
                "Confirming...";


            try {

                // CREATE RESERVATION ID

                const reservationId =
                    "RES" +
                    Date.now()
                        .toString()
                        .slice(-6);


                // SEND TO BACKEND

                const response =
                    await fetch(
                         `${API_BASE_URL}/api/reservations`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                userId:
                                    loggedInUser.id,

                                reservationId:
                                    reservationId,

                                date:
                                    date,

                                time:
                                    time,

                                guests:
                                    guests,

                                name:
                                    name,

                                phone:
                                    phone,

                                notes:
                                    notes

                            })
                        }
                    );


                const data =
                    await response.json();


                // BACKEND ERROR

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to create reservation."
                    );

                    reserveButton.disabled =
                        false;

                    reserveButton.textContent =
                        "Confirm Reservation →";

                    return;
                }


                // GET SAVED RESERVATION

                const reservation =
                    data.reservation;


                // HIDE RESERVATION HERO

                const reservationHero =
                    document.getElementById(
                        "reservationHero"
                    );

                if (reservationHero) {

                    reservationHero.style.display =
                        "none";

                }


                // HIDE FORM

                const reservationForm =
                    document.querySelector(
                        ".reservation-layout"
                    );

                if (reservationForm) {

                    reservationForm.style.display =
                        "none";

                }


                // SHOW SUCCESS

                const reservationSuccess =
                    document.getElementById(
                        "reservationSuccess"
                    );

                if (reservationSuccess) {

                    window.scrollTo({
                        top: 0,
                        behavior: "instant"
                    });


                    reservationSuccess.style.display =
                        "block";


                    document.getElementById(
                        "successReservationId"
                    ).textContent =
                        reservation.reservation_id;


                    document.getElementById(
                        "successReservationDate"
                    ).textContent =
                        reservation.reservation_date;


                    document.getElementById(
                        "successReservationTime"
                    ).textContent =
                        reservation.reservation_time;


                    document.getElementById(
                        "successReservationGuests"
                    ).textContent =
                        reservation.guests;


                    document.getElementById(
                        "successReservationName"
                    ).textContent =
                        reservation.customer_name;


                    document.getElementById(
                        "successReservationPhone"
                    ).textContent =
                        reservation.customer_phone;

                }


            } catch (error) {

                console.error(
                    "Reservation error:",
                    error
                );


                alert(
                    "Unable to connect to the server. Please try again."
                );


            } finally {

                reserveButton.disabled =
                    false;

                reserveButton.textContent =
                    "Confirm Reservation →";

            }

        }
    );

}

// ================= CONTINUE TO CHECKOUT =================

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        window.location.href = "checkout.html";
    });
}

// ================= REGISTER =================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();

            const phone =
                document
                    .getElementById("registerPhone")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;

            const message =
                document.getElementById(
                    "registerMessage"
                );


            // PASSWORD RULE

            const passwordPattern =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


            if (!passwordPattern.test(password)) {

                message.textContent =
                    "Password must be at least 8 characters and include uppercase, lowercase, number and special character.";

                return;
            }


            // CONFIRM PASSWORD

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                return;
            }


            // SEND REGISTRATION TO BACKEND

            try {

                message.textContent =
                    "Creating your account...";

                message.style.color = "";


                const response =
                    await fetch(
                       `${API_BASE_URL}/api/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                phone: phone,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                // BACKEND ERROR

                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        "Registration failed.";

                    message.style.color =
                        "#b33a3a";

                    return;
                }


                // SUCCESS

                message.textContent =
                    "Account created successfully! Redirecting to login...";

                message.style.color =
                    "green";


                // REDIRECT TO LOGIN

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1200);


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                message.textContent =
                    "Unable to connect to the server. Please try again.";

                message.style.color =
                    "#b33a3a";
            }

        }
    );

}
/// ================= LOGIN =================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;

            const message =
                document.getElementById("loginMessage");


            // CHECK REQUIRED FIELDS

            if (!email || !password) {

                message.textContent =
                    "Email and password are required.";

                message.style.color =
                    "#b33a3a";

                return;
            }


            try {

                message.textContent =
                    "Logging in...";

                message.style.color = "";


                // SEND LOGIN TO BACKEND

                const response =
                    await fetch(
                      `${API_BASE_URL}/api/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                // LOGIN FAILED

                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        "Incorrect email or password.";

                    message.style.color =
                        "#b33a3a";

                    return;
                }


                // SAVE LOGGED-IN USER

                localStorage.setItem(
    "brewBeanLoggedInUser",
    JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone
    })
);


                // SUCCESS

                message.textContent =
                    "Login successful!";

                message.style.color =
                    "green";


                // RETURN TO PREVIOUS PAGE

                const returnPage =
                    localStorage.getItem(
                        "loginReturnPage"
                    );

                localStorage.removeItem(
                    "loginReturnPage"
                );


                setTimeout(() => {

                    window.location.href =
                        returnPage || "index.html";

                }, 700);


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                message.textContent =
                    "Unable to connect to the server. Please try again.";

                message.style.color =
                    "#b33a3a";
            }

        }
    );

}
// ================= LOGIN CHECK =================

function getLoggedInUser() {

    const user =
        localStorage.getItem(
            "brewBeanLoggedInUser"
        );

    if (!user) {
        return null;
    }

    try {

        return JSON.parse(user);

    } catch (error) {

        localStorage.removeItem(
            "brewBeanLoggedInUser"
        );

        return null;
    }
}

// ================= AUTO-FILL USER DETAILS =================

function fillUserDetails() {

    const user = getLoggedInUser();

    if (!user) {
        return;
    }


    // CHECKOUT

    const customerName =
        document.getElementById("customerName");

    const customerPhone =
        document.getElementById("customerPhone");


    if (customerName && !customerName.value) {
        customerName.value = user.name;
    }

    if (customerPhone && !customerPhone.value) {
        customerPhone.value = user.phone;
    }


    // RESERVATION

    const reservationName =
        document.getElementById("reservationName");

    const reservationPhone =
        document.getElementById("reservationPhone");


   if (reservationName) {

    reservationName.value = user.name;
    reservationName.readOnly = true;

}

if (reservationPhone) {

    reservationPhone.value = user.phone;
    reservationPhone.readOnly = true;

}

}

fillUserDetails();

// ================= NAVBAR LOGIN BUTTON =================

const loginButton =
    document.querySelector(".login-btn");

if (loginButton) {

    loginButton.addEventListener("click", () => {

        window.location.href = "login.html";

    });

}

// ================= HOME + MENU ADD TO CART =================

const addToCartButtons =
    document.querySelectorAll(
        ".add-btn, .menu-add-btn"
    );

addToCartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card =
            button.closest(
                ".coffee-card, .menu-card"
            );

        if (!card) {
            return;
        }

        const nameElement =
            card.querySelector("h3");

        const priceElement =
            card.querySelector(
                ".product-title span, .menu-title strong"
            );

        if (!nameElement || !priceElement) {
            return;
        }

        const name =
            nameElement.textContent.trim();

        const price =
            Number(
                priceElement.textContent
                    .replace("₹", "")
                    .trim()
            );

        if (!name || !price) {
            return;
        }

        const existingItem =
            cart.find(
                item => item.name === name
            );

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }

        saveCart();
        updateCartCount();

        button.innerHTML =
            "Added ✓";

        setTimeout(() => {

            button.innerHTML =
                `Add to cart <span>+</span>`;

        }, 1000);

    });

});

// ================= PROFILE + LOGOUT =================

const profileContainer =
    document.getElementById("profileContainer");

const loginProfileBtn =
    document.getElementById("loginProfileBtn");

const profileBtn =
    document.getElementById("profileBtn");

const profileDropdown =
    document.getElementById("profileDropdown");

const logoutBtn =
    document.getElementById("logoutBtn");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profilePhone =
    document.getElementById("profilePhone");


const loggedInUser =
    getLoggedInUser();


if (loggedInUser) {

    // Hide Login button

    if (loginProfileBtn) {
        loginProfileBtn.style.display =
            "none";
    }


    // Show Profile

    if (profileContainer) {
        profileContainer.style.display =
            "block";
    }


    // Fill profile details

    if (profileName) {
        profileName.textContent =
            loggedInUser.name;
    }

    if (profileEmail) {
        profileEmail.textContent =
            loggedInUser.email;
    }

    if (profilePhone) {
        profilePhone.textContent =
            loggedInUser.phone;
    }

} else {

    // Hide Profile

    if (profileContainer) {
        profileContainer.style.display =
            "none";
    }


    // Show Login

    if (loginProfileBtn) {
        loginProfileBtn.style.display =
            "block";
    }

}


// OPEN / CLOSE PROFILE

if (profileBtn && profileDropdown) {

    profileBtn.addEventListener(
        "click",
        () => {

            profileDropdown.classList.toggle(
                "show"
            );

        }
    );

}


// LOGOUT

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "brewBeanLoggedInUser"
            );

            window.location.href =
                "index.html";

        }
    );

}
