/* =========Variable Declaration ========= */
//Recipe API
const baseURL = "https://api.edamam.com/search?q=";
const apiiD = "93398462";
const apiKey = "6440cc80aeb489ed0b5cdf7eda03a7fa";

//Obtain user input
const ingredient = document.querySelector(".ingredients");
const cuisiine = document.querySelector(".cuisine");
const searchBtn = document.querySelector(".search");

//display result
const resultPanel = document.querySelector(".resultPanel");
let resultArray = [];
let appendHTMLForResult = "";
let appendHTMLforIngrList = "";

const showMoreBtn = document.querySelector(".showMore");
const moreItem = document.querySelectorAll(".moreItem");

//display recipe detail
const recipePanel = document.querySelector(".recipePanel");
let appendHTMLForRecipe = "";
let title = "";
let singleObj = {};

//countdown timer
const timerBtn = document.getElementById("timerBtn");

//animation
const toTopBtn = document.querySelector("#toTop");

//filter to be added : &cuisineType=${cuisine}

/* =========Function Declaration ========= */
//Fetch API to get recipe data
const getRecipe = (ingredients, firstIndex, lastIndex) => {
  //fetch api
  fetch(`${baseURL}${ingredients}&app_id=${apiiD}&app_key=${apiKey}&from=${firstIndex}&to=${lastIndex}`)
    .then((response) => {
      console.log(`${baseURL}${ingredients}&app_id=${apiiD}&app_key=${apiKey}&from=${firstIndex}&to=${lastIndex}`);
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);

      if (data.count === 0) {
        alert("No recipe found."); //change this to modal popup
        clearInput();
        return false;
      } else if (data.count < lastIndex) {
        //in case the data count is less than 8
        //create resultArray
        for (let i = 0; i < data.count; i++) {
          resultArray.push(data.hits[i]);
        }
        console.log(resultArray);
        displayResult();
      } else {
        //create resultArray
        for (let i = 0; i < lastIndex; i++) {
          resultArray.push(data.hits[i]);
        }
        console.log(resultArray);
        displayResult();
      }

      //planning: switch-case then assign necessary function for each case?
      // switch (action) {
      //   case diplay:
      //     displayResult();
      //     break;

      //   default:
      //     break;
      // }
    })
    .catch(() => {
      console.error("Something went wrong. Unable to get recipe data")
    })
  return resultArray;
}

//display search result
//first 8 => load more
const displayResult = () => {
  //8 objects at one time
  appendHTMLForResult = resultArray.map((element) => {
    return `        
      <div class="itemPanel">
      <img src="${element.recipe.image}" alt="itemImg">
      <p class="mealTitle">${element.recipe.label}</p>
      <a href="#recipe" class = "view" onclick = 'displayRecipe("${element.recipe.label}")'>View detail</a>
      </div>
    `;
  }).join("");
  resultPanel.innerHTML = appendHTMLForResult;
  console.log(appendHTML);
}

// //show more results
// const showMore = () => {
//   result.classList.toggle("moreResult");
// }

//display recipe - when "view detail" is clicked
const displayRecipe = (title) => {
  //find the item to display
  const mealTitle = document.querySelectorAll(".mealTitle");
  console.log("hi I am here ");
  console.log(mealTitle);//NodeList
  console.log(typeof (mealTitle));//Object

  let selectedIndex = "";
  for (let i = 0; i < mealTitle.length; i++) {
    console.log("hi I am here 2");
    if (mealTitle[i].innerHTML === title) {
      selectedIndex = i;
    }
  }
  console.log("index is " + selectedIndex);

  console.log(resultArray[selectedIndex]);

  //create <li> tags - ingredients
  appendHTMLforIngrList = resultArray[selectedIndex].recipe.ingredientLines.map((elem) => {
    return `
      <li>${elem}</li>
    `;
  }).join("");

  console.log(appendHTMLforIngrList);

  //create an entire append HTML
  appendHTMLForRecipe = `    
      <ul class="dishInfo">
        <p class="title">${title}</p>
        <li><i class="fas fa-balance-scale-right"></i> Calories: ${Math.round(resultArray[selectedIndex].recipe.calories)}</li>
        <li><i class="fas fa-utensils"></i> Serving size: ${resultArray[selectedIndex].recipe.yield}</li>
        <button type="button" class="likeBtn"><i class="fas fa-heart"></i>Bookmark</button>
      </ul>
      <div class="displayRecipe">
        <img src="${resultArray[selectedIndex].recipe.image}" alt="itemImg">
        <div class="detailInfo">
          <p>Ingredients</p>
          <ul>
          ${appendHTMLforIngrList}
          </ul>
          <a href="${resultArray[selectedIndex].recipe.url}" target="_blank"><i class="fas fa-seedling"></i>View detail</a>
        </div>
      </div>
    `;
  console.log("appendHTMLForRecipe is ..... " + appendHTMLForRecipe);

  //append before the time button
  recipePanel.innerHTML = appendHTMLForRecipe;
}

//clear user input and temp value
const clearInput = () => {
  ingredient.value = "";
  cuisiine.value = "";
  resultArray = [];
  appendHTMLForResult = "";
  ppendHTMLforIngrList = "";
  appendHTMLForRecipe = "";
}

//scroll down
const scrollBottom = () => {

}

//scroll to top
const scrollToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

/* =========Function Call ========= */
//recipe search
searchBtn.addEventListener("click", () => {
  console.log(ingredient.value)
  //validation check
  if ((ingredient.value === "") || !(isNaN)) {
    alert("This field is required. Number is not allowed.");
    clearInput();
  } else {
    getRecipe(`${ingredient.value}`, `0`, '8');
    clearInput();
  }
})

//load more results
// showMoreBtn.addEventListener("click", () => {
//   showMore();
// })

// Move to top button appears after 200 px scroll down the page
$(window).scroll(function () {
  let height = $(window).scrollTop();
  if (height > 200) {
    $('#toTop').fadeIn();
  } else {
    $('#toTop').fadeOut();
  }
});
$(document).ready(function () {
  $("#toTop").click(function (event) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });
});


/*＝＝＝＝＝＝＝＝＝＝＝　To Think List ＝＝＝＝＝＝＝＝＝＝*/
//１．最初のデータ表示が一番最初にExecuteされるように、Async/Awaitつける