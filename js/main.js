/* =========Variable Declaration ========= */
//Recipe API
const baseURL = "https://api.edamam.com/search?q=";
const apiiD = "93398462";
const apiKey = "6440cc80aeb489ed0b5cdf7eda03a7fa";

//Obtain user input
const ingredient = document.querySelector(".ingredients");
const cuisiine = document.querySelector(".cuisine");
const searchBtn = document.querySelector(".search");

//display
const result = document.querySelector(".resultLine");
let resultArray = [];
let appendHTML = "";

const showMoreBtn = document.querySelector(".showMore");
const moreItem = document.querySelectorAll(".moreItem");

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
      if (data.count === 0) {
        alert("No recipe found."); //change this to modal popup
        clearInput();
      } else {
        //create resultArray
        console.log("last index is " + lastIndex);
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
//first 10 => load more
const displayResult = () => {
  //10 objects at one time
  appendHTML = resultArray.map((element) => {
    return `        
  <div class="itemPanel">
  <img src="${element.recipe.image}" alt="textImg">
  <p>${element.recipe.label}</p>
  </div>
  `;
  }).join("");
  result.innerHTML = appendHTML;
  console.log(appendHTML);
}

// //show more results
// const showMore = () => {
//   result.classList.toggle("moreResult");
// }

//clear user input
const clearInput = () => {
  ingredient.value = "";
  cuisiine.value = "";
}

/* =========Function Call ========= */
//recipe search
searchBtn.addEventListener("click", () => {
  //validation check
  if ((ingredient.value === null) || (isNaN)) {
    alert("This field is required. Number is not allowed.");
    ingredient.value = "";
  } else {
    getRecipe(`${ingredient.value}`, `0`, '10');
  }
})

//load more results
// showMoreBtn.addEventListener("click", () => {
//   showMore();
// })