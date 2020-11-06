//products
const products = [{
        category: "female",
        img: "img/1.jpg",
        name: "Gown",
        price: 2000,
    },
    {
        category: "female",
        img: "img/2.jpg",
        name: "One-piece",
        price: 200,
    },
    {
        category: "female",
        img: "img/3.jpg",
        name: "Bridal Lehenga",
        price: 10000,
    },
    {
        category: "male",
        img: "img/4.jpg",
        name: "Sherwani",
        price: 5000,
    },
    {
        category: "male",
        img: "img/5.jpg",
        name: "Blezzar",
        price: 2000,
    },
    {
        category: "male",
        img: "img/6.jpg",
        name: "Pant",
        price: 1000,
    },
    {
        category: "baby-girl",
        img: "img/7.jpg",
        name: "Jama",
        price: 2000,
    },
    {
        category: "baby-girl",
        img: "img/8.jpg",
        name: "Lehenga",
        price: 2500,
    },
    {
        category: "baby-boy",
        img: "img/9.jpg",
        name: "Coat for baby boy",
        price: 2000,
    },
    {
        category: "baby-boy",
        img: "img/10.jpg",
        name: "3 combo pants",
        price: 500,
    }
];

// taking html elements
const productsContainer = document.querySelector(".products-container");
const btnContainer = document.querySelector(".btn-container");
const cartContainer = document.querySelector(".cart-container");
const cartBtn = document.querySelector(".cart-btn");
const closeCart = document.querySelector(".close");
const cartProducts = document.querySelector(".cart-products");
const totalPrice = document.querySelector(".total-price");
const itemNo = document.querySelector(".items-no");
const clearBtn = document.querySelector(".clear-btn");

let arr = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
let btns = [];

clearBtn.addEventListener("click", clearCart);

cartBtn.addEventListener("click", () => {
    cartContainer.classList.add("show");
});

// closing the cart
closeCart.addEventListener("click", () => {
    cartContainer.classList.remove("show");
});

// function to display category btns
const categoryButtons = () => {
    const reducedBtns = products.reduce((value, item) => {
        if (!value.includes(item.category)) {
            value.push(item.category);
        }
        return value;
    }, ["All"]);

    const displayedCategories = reducedBtns.map(category => {
        return `<button type="button" class="category-btns" data-target="${category}">${category}</button>`
    }).join("");

    btnContainer.innerHTML = displayedCategories;

    const categoryBtns = document.querySelectorAll(".category-btns");

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetedBtn = e.currentTarget.dataset.target;

            const filteredProducts = products.filter(product => {
                if (product.category == targetedBtn) {
                    return product;
                }
            });

            if (targetedBtn == "All") {
                displayProducts(products);
            } else {
                displayProducts(filteredProducts);
            }
        });
    });
};

// function to display the products when the browser loads
const displayProducts = (items) => {
    const itemsDisplayed = items.map(item => {
        return `<div class="products" data-target="${item.category}">
         <img src="${item.img}" class="product-img" height="400" alt=""><br>
         <button type="button" class="add-to-cart" data-target="${item.name}">Add to Cart</button>
         <h1>${item.name}</h1>
        <p>${item.price}</p>
    </div>`;
    }).join("");
    productsContainer.innerHTML = itemsDisplayed;

    btns = [...document.querySelectorAll(".add-to-cart")];
    const addToCartBtn = document.querySelectorAll(".add-to-cart");
    addToCartBtn.forEach(add => {
        add.addEventListener("click", cartItems);
    });
};

// getting the products from localstorage
const getFromLocalStorage = () => {
    return localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
};

const addToLocalStorage = () => {
    let items = getFromLocalStorage();

    if (items.length <= 0) {
        products.forEach(p => {
            items.push(p);
        });
    }

    localStorage.setItem("products", JSON.stringify(items));
};
addToLocalStorage();


// add to cart
function addToCart(name) {
    let items = getFromLocalStorage();

    return items.find(item => item.name == name);
}


// items to be added in the cart
function cartItems(e) {
    cartContainer.classList.add("show");
    let productName = e.currentTarget.dataset.target;
    let btn = e.currentTarget;

    let cartItem = {...addToCart(productName), amount: 1 };
    arr = [...arr, cartItem];

    let carts = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    let inCart = carts.find(item => item.name == productName);

    if (inCart) {
        alert("Item already added in the cart");
    }
    if (!inCart) {
        carts.push(cartItem);
        saveToCart(carts);
    }

    cartProduct(carts);
    totalAmount(carts);
}

// saving products to the cart
function saveToCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// displaying cart item when the browser loads
function cartItem() {
    let items = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    cartProduct(items);
}

// displaying cart products
function cartProduct(items) {
    const cartItems = items.map(c => {
        return `<div class="cart" data-target="${c.name}">
        <div class="product-desc">
         <img src="${c.img}" class="cart-img" height="400" alt="">
         <div class="product-name">
         <h6>${c.name}</h6>
        <p class="price-container">${c.price}</p>
        <p class="remove" data-target="${c.name}">remove</p>
         </div>
         
        </div>

        <div class="amount">
        <i class="fas fa-chevron-up increase" data-target="${c.name}"></i>
        <p class="price">${c.amount}</p>
        <i class="fas fa-chevron-down decrease" data-target="${c.name}"></i>
        </div>
    </div>`;
    }).join("");
    cartProducts.innerHTML = cartItems;

    const remove = document.querySelectorAll(".remove");
    const increase = document.querySelectorAll(".increase");
    const decrease = document.querySelectorAll(".decrease");

    remove.forEach(r => {
        r.addEventListener("click", removeFromCart);
    });

    increase.forEach(i => {
        i.addEventListener("click", increaseItem);
    });

    decrease.forEach(d => {
        d.addEventListener("click", decreaseItem);
    });
};

// increasing item
function increaseItem(e) {
    const price = e.currentTarget.dataset.target;
    const priceContainer = e.currentTarget.nextElementSibling;

    arr.filter(a => {
        if (price == a.name) {

            priceContainer.innerHTML = parseInt(++a.amount);
        }
    });
    totalAmount(arr);
    saveToCart(arr);
}

// decreasing item
function decreaseItem(e) {
    const price = e.currentTarget.dataset.target;
    const priceContainer = e.currentTarget.previousElementSibling;

    arr.filter(a => {
        if (price == a.name) {
            priceContainer.innerHTML = parseInt(--a.amount);
        }
        if (a.amount <= 1) {
            a.amount = 1;
            priceContainer.innerHTML = 1
        }
    });
    totalAmount(arr);
    saveToCart(arr);
}

// removing items from the cart
function removeFromCart(e) {
    const id = e.currentTarget.parentElement.parentElement.parentElement;
    const name = e.currentTarget.dataset.target;


    let item = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    cartProducts.removeChild(id);
    const filteredProducts = item.filter(i => {
        if (i.name != name) {
            return i;
        }
    });

    localStorage.setItem("cart", JSON.stringify(filteredProducts));
    totalAmount(filteredProducts);
    saveToCart(filteredProducts);
}

// clearing products from the cart
function clearCart() {
    const product = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    product.forEach(p => {
        localStorage.removeItem("cart");
    });
    cartProducts.innerHTML = "";
    totalPrice.innerHTML = 0;
    itemNo.innerHTML = 0;
    btns.disabled = false;
    btns.innerHTML = "Add to cart";
}

// calculating total 
function totalAmount(cart) {

    let itemTotal = 0;
    let itemAmount = 0;

    cart.forEach(c => {
        itemTotal += c.amount * c.price;
        itemAmount += c.amount;
    });

    totalPrice.innerHTML = itemTotal;
    itemNo.innerHTML = itemAmount;
}


// event listeners
window.addEventListener("DOMContentLoaded", categoryButtons);
window.addEventListener("DOMContentLoaded", displayProducts(products));
window.addEventListener("DOMContentLoaded", cartItem);
window.addEventListener("DOMContentLoaded", totalAmount(arr));
window.addEventListener("DOMContentLoaded", cartContainer.classList.remove("show"));