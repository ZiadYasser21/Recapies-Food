/// <reference types="./@types/jquery" />

//global
data = [];

// *********************************ID APIS ******************************************

let rowData = document.getElementById("rowData");
let area = document.getElementById("areaData");
let ingredients = document.getElementById("ingredients");
let categories = document.getElementById("categoriesData");

// *********************************loading ******************************************

$(function () {
  $(".loader").fadeOut(2000, function () {
    $(".loading").fadeOut(3000, function () {
      $("body").css("overflow", "auto");
    });
  });
});

// *********************************backToTop ******************************************

window.onscroll = function () {
  checkScroll();
};

function checkScroll() {
  var backToTopBtn = document.getElementById("backToTopBtn");

  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// *********************************links ******************************************

let links = document.querySelectorAll(".home .nav-link");

//todo...links
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function (e) {
    let currentText = e.target.innerHTML;
    getAPIData(currentText);
  });
}

// *********************************setLoading ******************************************

function setLoading(button) {
  button.classList.add("loading");

  setTimeout(() => {
    button.classList.remove("loading");

    window.location.href = "page2.html";
  }, 2500);
}

// *********************************buttonأختفاء ******************************************

$("#myButton").on("click", function () {
  $(".btn").hide(2000);
});

// *********************************getAPIData******************************************

//todo...another solution
async function getAPIData(meal) {
  let https = await fetch(
    `https://forkify-api.herokuapp.com/api/search?q=${meal}`
  );
  let response = await https.json();
  data = response.recipes;
  displayData();
}
getAPIData("pizza");

// *********************************displayData******************************************

function displayData() {
  let cols = ``;
  for (let i = 0; i < data.length; i++) {
    cols += `<div class="col-md-4">
            <div class="card">
                <img class="card-img-top images" src="${data[i].image_url}" width="100" alt="Title" />
                <div class="card-body">
                    <p class="card-title">${data[i].publisher}</p>
                    <h4 class="card-title">${data[i].title}</h4>
                    <a href="${data[i].source_url}" target="-blank" class="btn btn-dark">source</a>
                </div>
            </div>
        </div>`;
  }
  document.getElementById("colsData").innerHTML = cols;
}

// *********************************getAPICategories******************************************

async function getCategories() {
  let https = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let response = await https.json();
  data = response.categories;
  displayDataCategories();
}

// *********************************displayDataCategories******************************************

function displayDataCategories() {
  let categoryData = ``;
  for (let i = 0; i < data.length; i++) {
    categoryData += `
         <div class="col-md-3">
              <div onclick="getCategoryMeals('${
                data[i].strCategory
              }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                  <img class="w-100" src="${
                    data[i].strCategoryThumb
                  }" alt="" srcset="">
                  <div class="meal-layer position-absolute text-center text-black p-2">
                      <h3>${data[i].strCategory}</h3>
                      <p>${data[i].strCategoryDescription
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}</p>
                  </div>
              </div>
      </div>
      `;
  }
  categories.innerHTML = categoryData;
}

getCategories();

// *********************************getAPIArea******************************************

async function getArea() {
  rowData.innerHTML = "";

  $(".loading").fadeIn(300);

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  respone = await respone.json();

  displayArea(respone.meals);
  $(".loading").fadeOut(300);
}

// *********************************displayArea******************************************

function displayArea(arr) {
  let cartona = "";

  for (let i = 0; i < arr.length; i++) {
    cartona += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `;
  }

  area.innerHTML = cartona;
}

getArea();
// *********************************Ingredients******************************************

async function getIngredients() {
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    let dataResponse = await response.json();

    console.log("Ingredients Data:", dataResponse.meals);

    data = dataResponse.meals;
    displayDataIngredients();
  } catch (error) {
    console.error("Error fetching ingredients:", error);
  }
}

// *********************************displayDataIngredients******************************************

function displayDataIngredients() {
  let ingredientsHTML = ``;

  for (let i = 0; i < data.length; i++) {
    ingredientsHTML += `
        <div class="col-md-3">
            <div onclick="getIngredientsMeals('${
              data[i].strIngredient
            }')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${data[i].strIngredient}</h3>
                <p>${
                  data[i].strDescription
                    ? data[i].strDescription.split(" ").slice(0, 20).join(" ")
                    : "No description available"
                }</p>
            </div>
        </div>
      `;
  }

  ingredients.innerHTML = ingredientsHTML;
}

getIngredients();

// *********************************displayMeals******************************************

function displayMeals(meals) {
  let output = "";
  meals.forEach((meal) => {
    if (meal) {
      output += `
          <div class="col-md-3">
                 <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                     <img class="w-100" src="${meal.strMealThumb}" alt="" srcset="">
                     <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                         <h3>${meal.strMeal}</h3>
                     </div>
                 </div>
         </div>
          `;
    }
  });
  document.getElementById("rowData").innerHTML = output;
}

// *********************************getCategoryMeals******************************************

async function getCategoryMeals(category) {
  categories.innerHTML = "";
  $(".loading").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();

  displayMeals(response.meals);
  $(".loading").fadeOut(300);
}

// *********************************getAreaMeals******************************************

async function getAreaMeals(selectorArea) {
  area.innerHTML = "";
  $(".loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectorArea}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".loading").fadeOut(300);
}

// *********************************getIngredientsMeals******************************************

async function getIngredientsMeals(ingredient) {
  ingredients.innerHTML = "";
  $(".loading").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  response = await response.json();
  console.log(response.meals);

  displayMeals(response.meals.slice(0, 20));
  $(".loading").fadeOut(300);
}

// *********************************getMealDetails******************************************

async function getMealDetails(mealID) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".loading").fadeIn(300);

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  respone = await respone.json();

  displayMealDetails(respone.meals[0]);
  $(".loading").fadeOut(300);
}
// *********************************displayMealDetails******************************************

function displayMealDetails(meal) {
  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>
  
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
  
                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  rowData.innerHTML = cartoona;
}

// *********************************nav-slid******************************************

function openSideNav() {
  $(".side-nav-menu").animate(
    {
      left: 0,
    },
    500
  );

  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");

  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}

function closeSideNav() {
  let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
  $(".side-nav-menu").animate(
    {
      left: -boxWidth,
    },
    500
  );

  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");

  $(".links li").animate(
    {
      top: 300,
    },
    500
  );
}

closeSideNav();
$(".side-nav-menu i.open-close-icon").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

// *********************************setting icon******************************************

const settingsIcon = document.getElementById("settingsIcon");

settingsIcon.addEventListener("click", () => {
  settingsIcon.classList.toggle("rotate");
});

// ********************************* toggleDarkMode *********************************
const toggleDarkModeLink = document.getElementById("toggleDarkMode");

if (toggleDarkModeLink) {
  toggleDarkModeLink.addEventListener("click", function (event) {
    event.preventDefault();
    document.body.classList.toggle("dark-mode");

    toggleDarkModeLink.textContent = document.body.classList.contains(
      "dark-mode"
    )
      ? "Light Mode"
      : "Dark Mode";
  });
}
