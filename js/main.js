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
let appendHTMLforList = "";

const showMoreBtn = document.querySelector(".showMore");
const moreItem = document.querySelectorAll(".moreItem");

//display recipe detail
const view = document.querySelector(".view");
let appendHTMLForRecipe = "";
let title = "";
let singleObj = {};

//countdown timer
const timerBtn = document.getElementById("timerBtn");

//animation
const toTopBtn = document.querySelector("#toTop");
// url example
//"https://api.edamam.com/search?q=chicken&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=0&to=3&calories=591-722&health=alcohol-free"

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

      //switch case maybe??

      if (data.count === 0) {
        alert("No recipe found."); //change this to modal popup
        clearInput();
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
      <p id="mealTitle">${element.recipe.label}</p>
      <a href="#recipe" class = "view" onclick = "displayRecipe()">View detail</a>
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
const displayRecipe = () => {
  //find the item to display
  const mealTitle = document.getElementById("mealTitle");
  console.log("hi I am here " );
  console.log(mealTitle);
  console.log(typeof(mealTitle));
  title = mealTitle.textContent; //get meal title in string format
  console.log("mealtitle is " + title);
  singleObj = resultArray.find(obj => obj.recipe.label === title)// find an index of the object array of the selected item
  console.log(singleObj);

  //create <li> tags - ingredients
  appendHTMLforList = singleObj.recipe.ingredientLines.map((elem) => {
    return `
      <li>${elem}</li>
    `;
  }).join("");

  console.log(appendHTMLforList);

  //create an entire append HTML
  appendHTMLForRecipe = `
      <p class="title">${title}</p>
      <ul class="dishInfo">
        <li><i class="fas fa-balance-scale-right"></i> Calories: ${Math.round(singleObj.recipe.calories)}</li>
        <li><i class="fas fa-utensils"></i> Serving size: ${singleObj.recipe.yield}</li>
        <button type="button" class="likeBtn"><i class="fas fa-heart"></i>Bookmark</button>
      </ul>
      <div class="displayRecipe">
        <img src="${singleObj.recipe.image}" alt="itemImg">
        <div class="detailInfo">
          <p>Ingredients</p>
          <ul>
          ${appendHTMLforList}
          </ul>
          <a href="${singleObj.recipe.url}" target="_blank"><i class="fas fa-seedling"></i>View detail</a>
        </div>
      </div>
    `;
  console.log("appendHTMLForRecipe is ..... " + appendHTMLForRecipe);

  //append before the time button
  timerBtn.insertAdjacentHTML("beforebegin", appendHTMLForRecipe);
}

//clear user input
const clearInput = () => {
  ingredient.value = "";
  cuisiine.value = "";
}

/* =========Function Call ========= */
//recipe search
searchBtn.addEventListener("click", () => {
  //validation check
  if ((ingredient.value === null) || !(isNaN)) {
    alert("This field is required. Number is not allowed.");
    ingredient.value = "";
  } else {
    getRecipe(`${ingredient.value}`, `0`, '8');
  }
})

//load more results
// showMoreBtn.addEventListener("click", () => {
//   showMore();
// })


/*＝＝＝＝＝＝＝＝＝＝＝　To Think List ＝＝＝＝＝＝＝＝＝＝*/
//１．最初のデータ表示が一番最初にExecuteされるように、Async/Awaitつける