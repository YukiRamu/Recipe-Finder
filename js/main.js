/* ======================== Variable Declaration ======================== */
//Recipe API
const baseURL = "https://api.edamam.com/search?q=";
const apiiD = "93398462";
const apiKey = "6440cc80aeb489ed0b5cdf7eda03a7fa";

//Obtain user input
const searchKeyword = document.querySelector(".keyword");
const cuisiine = document.querySelector(".cuisine");
const searchBtn = document.querySelector(".search");

//display result
const resultPanel = document.querySelector(".resultPanel");
let resultArray = []; //to store populated data
let keywordParam = ""; //to use parameter outside of the function block
let firstIdxParam; // same as above
let lastIdxParam; //same as above
let appendHTMLForResult = "";
let appendHTMLforIngrList = "";

//load more
const showMoreBtn = document.querySelector(".showMore");

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

/* ==========================Function Declaration =========================== */
//Fetch API to get recipe data
const getRecipe = (keyword, firstIndex, lastIndex) => {
  //store parameter
  keywordParam = keyword;
  firstIdxParam = firstIndex;
  lastIdxParam = lastIndex;

  //fetch api
  fetch(`${baseURL}${keyword}&app_id=${apiiD}&app_key=${apiKey}&from=${firstIndex}&to=${lastIndex}`)
    .then((response) => {
      console.log(`${baseURL}${keyword}&app_id=${apiiD}&app_key=${apiKey}&from=${firstIndex}&to=${lastIndex}`);
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      console.log("firstIndex is " + firstIndex + " lastIndex is " + lastIndex)//0-8
      console.log("data count is " + data.count)
      console.log("length of array is  " + resultArray.length);

      //validation check for IndexOutOfBoundsException
      if (resultArray.length === data.count) {
        console.log("hi index out of bounds here");
        //in case there is no more data to display
        alert("No more recipe to display");  //change this to modal popup later
        console.log(resultArray);
        return false;
      }

      //forst load validation check
      if (data.count === 0) {
        alert("No recipe found."); //change this to modal popup later
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
        //create resultArray 8 items in each time
        for (let i = 0; i < 8; i++) {
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
  return resultArray, keywordParam, firstIdxParam, lastIdxParam;
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
      <a href="#recipe" class = "view" onclick = 'displayRecipe("${element.recipe.label}")'>View Detail</a>
      </div>
    `;
  }).join("");
  resultPanel.innerHTML = appendHTMLForResult;
  console.log(appendHTML);
}

//show more results
const showMore = () => {
  console.log("Loading more");
  //Add items to the resultArray

  console.log(resultArray);
}

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
          <a href="${resultArray[selectedIndex].recipe.url}" target="_blank"><i class="fas fa-seedling"></i> View Recipe</a>
        </div>
      </div>
    `;
  console.log("appendHTMLForRecipe is ..... " + appendHTMLForRecipe);

  //append before the time button
  recipePanel.innerHTML = appendHTMLForRecipe;
}

//clear user input and temp value
const clearInput = () => {
  searchKeyword.value = "";
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

/* ============================== Function Call ============================== */
//recipe search
searchBtn.addEventListener("click", () => {
  console.log(searchKeyword.value)
  //validation check
  if ((searchKeyword.value === "") || !(isNaN)) {
    alert("This field is required. Number is not allowed.");
    clearInput();
  } else {
    getRecipe(`${searchKeyword.value}`, 0, 8);
    clearInput();
  }
})

//load more results
showMoreBtn.addEventListener("click", () => {
  //fetch data from the lastIndex of data to the next 8
  console.log(resultArray);
  getRecipe(`${keywordParam}`, lastIdxParam, lastIdxParam + 8);
})

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