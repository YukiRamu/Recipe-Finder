/* ======================== Variable Declaration ======================== */
//Recipe API
//======Modification required===
const baseURL = "https://api.edamam.com/search?q=";
const apiiD = "93398462";
const apiKey = "6440cc80aeb489ed0b5cdf7eda03a7fa";

//Obtain user input
const searchKeyword = document.querySelector(".keyword");
const cuisiine = document.querySelector(".cuisine");
const searchBtn = document.querySelector(".search");
const alertMsg = document.querySelectorAll(".alert");

//display result
const resultSection = document.querySelector(".result");
const resultPanel = document.querySelector(".resultPanel");
let resultArray = []; //to store populated data
let keywordParam = ""; //to use parameter outside of the function block
let firstIdxParam; // same as above
let lastIdxParam; //same as above
let appendHTMLForResult = "";
let appendHTMLForIngrList = "";

//load more
const showMoreBtn = document.querySelector(".showMore");

//display recipe
const recipeSection = document.querySelector(".recipe");
const recipePanel = document.querySelector(".recipePanel");
let appendHTMLForRecipe = "";
let title = "";
let singleObj = {};
let titleParam = ""; //to use parameter outside of the function block
let imgURLParam = "";// same as above

//bookmark
const bookmarkLink = document.querySelector(".bookmarkLink"); //a link on header
let bookmarkArray = []; //array of object
const bookmarkList = document.querySelector(".bookmarkList");
let appendHTMLForBookmark = "";
const delBtn = document.querySelector(".delBtn");//bookmark delete

//countdown timer
const timerBtn = document.getElementById("timerBtn");

//animation
const toTopBtn = document.querySelector("#toTop"); // move to top button
const loader = document.querySelector(".loader"); // loading modal
const colorCheckbox = document.querySelector(".colorCheckbox");//theme color change
const styleSheetLink = document.getElementById("styleSheetLink");//html link tag colorchange pattern 1

//filter to be added : &cuisineType=${cuisine}

/* ==========================Function Declaration =========================== */
/* Fetch API to get recipe data */
const getRecipe = (keyword, firstIndex, lastIndex) => {
  //store parameter
  keywordParam = keyword;
  firstIdxParam = firstIndex;
  lastIdxParam = lastIndex;

  //fetch api
  fetch(`${baseURL}${keyword}&app_id=${apiiD}&app_key=${apiKey}&from=${firstIndex}&to=${lastIndex}`)
    .then((response) => {
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);

      /* Logic to display the result
      // Case 1 : Where the search button is clicked
      // #1 : No recipe found?
      // #2 : When the data length is smaller than the default 16
      // #3 : Show 16 items each time
      //
      // Case 2 : Where the show more button is clicked
      // #1 : Handle IndexOutOfBounds Exception (no more recipe found) 
      // *Note) for now if condition includes "resultArray.length + data.hits.length > data.count".
      //        Because I haven't implemented the method to include recipe names with single/double quote.
      //        Currently they are omitted from the result. That's why the length of a resultArray sometimes
      //        smaller than 16. When it is upgraded, DON'T FORGET to remove the if condition above
      // #2 : Show 16 items each time
       */
      switch (resultArray.length === 0) {
        case true: // search button
          if (data.count === 0) {
            //#1
            stopLoader();
            showAlert("No recipe found.", 0);
            clearInput();
            return false;
          } else if (data.count < lastIndex) {
            //#2
            //show result section
            resultSection.style.display = "block";

            //smooth scroll - calculate Y coordinate
            smoothScroll();

            //create resultArray
            for (let i = 0; i < data.count; i++) {
              //invalid recipe name check (single and double quote)
              //might be able to handle with ESCAPE stuff
              if ((data.hits[i].recipe.label.indexOf("'") != -1) || data.hits[i].recipe.label.indexOf('"') != -1) {
                ;
              } else {
                resultArray.push(data.hits[i]);
              }
            }
            displayResult();
          } else {
            //#3
            //show result section
            resultSection.style.display = "block";

            //smooth scroll - calculate Y coordinate
            smoothScroll();

            //create resultArray 16 items each time 
            for (let i = 0; i < data.hits.length; i++) {

              //invalid recipe name check (single and double quote)
              //might be able to handle with ESCAPE stuff
              if ((data.hits[i].recipe.label.indexOf("'") != -1) || data.hits[i].recipe.label.indexOf('"') != -1) {
                ;
              } else {
                resultArray.push(data.hits[i]);
              }
            }
            displayResult();
          }
          break;
        case false://show more button
          if ((resultArray.length + data.hits.length === data.count) || (resultArray.length + data.hits.length > data.count)) {
            //#1
            //smooth scroll - calculate Y coordinate
            smoothScroll();

            showAlert("No more recipe to display.", 1);
            stopLoader();
            return false;
          } else {
            //#2
            //show result section
            resultSection.style.display = "block";

            //smooth scroll - calculate Y coordinate
            smoothScroll();

            //create resultArray 16 items each time 
            for (let i = 0; i < data.hits.length; i++) {

              //invalid recipe name check (single and double quote)
              //might be able to handle with ESCAPE stuff
              if ((data.hits[i].recipe.label.indexOf("'") != -1) || data.hits[i].recipe.label.indexOf('"') != -1) {
                ;
              } else {
                resultArray.push(data.hits[i]);
              }
            }
            displayResult();
          }
          break;
        default:
          break;
      }
    })
    .catch((error) => {
      console.error(`Unable to get recipe data. Error = ${error}`);
      stopLoader();
      return error
    })
  return resultArray, keywordParam, firstIdxParam, lastIdxParam;
};

/* display search result */
//first 16 => load more
const displayResult = () => {
  //16 objects at one time
  appendHTMLForResult = resultArray.map((element) => {
    return `        
      <div class="itemPanel">
      <img src="${element.recipe.image}" alt="itemImg">
      <p class="mealTitle">${element.recipe.label}</p>
      <a href="#recipe" class = "view" onclick = "displayRecipe('${element.recipe.label}')">View Detail</a>
      </div>
    `;
  }).join("");
  resultPanel.innerHTML = appendHTMLForResult;
  stopLoader();
};

/* display recipe - when "view detail" is clicked */
const displayRecipe = async (title) => {
  clearAlert(); //if it is already shown

  //show recipe section
  recipeSection.style.display = "block";

  try {
    //1 display
    //find one item index to display
    const mealTitle = document.querySelectorAll(".mealTitle"); //all items in the result

    let selectedIndex = "";
    for (let i = 0; i < mealTitle.length; i++) {
      if (mealTitle[i].innerText === title) { //same tile with the parameter
        selectedIndex = i;
      }
    }

    //create <li> tags - ingredients
    appendHTMLForIngrList = resultArray[selectedIndex].recipe.ingredientLines.map((elem) => {
      return `
          <li>${elem}</li>
        `;
    }).join("");

    //create an entire append HTML and assign
    appendHTMLForRecipe = `    
        <img src="${resultArray[selectedIndex].recipe.image}" alt="itemImg">
        <div class="detailInfo">
          <h2 class="title">${title}</h2>
          <ul class="dishInfo">
            <li><i class="fas fa-balance-scale-right"></i> Calories: ${Math.round(resultArray[selectedIndex].recipe.calories)}</li>
            <li><i class="fas fa-utensils"></i> Serving size: ${resultArray[selectedIndex].recipe.yield}</li>
            <button type="button" class="likeBtn" onclick="addBookmark()"><i class="fas fa-heart"></i>Bookmark</button>
          </ul>
          <div class="recipeInfo">
            <p><i class="fas fa-pepper-hot"></i>Ingredients:</p>
            <ul>
              ${appendHTMLForIngrList}
            </ul>
          </div>
          <a href="${resultArray[selectedIndex].recipe.url}" target="_blank"><i class="fas fa-seedling"></i>Make them</a>
        </div>
        `;

    recipePanel.innerHTML = appendHTMLForRecipe;

    //store parameter and return
    titleParam = title;
    imgURLParam = resultArray[selectedIndex].recipe.image;

    return titleParam, imgURLParam;

  } catch (error) {
    console.error("Failed to display the recipe detial");
  }
};

/* display bookmark list - Add */
const addBookmark = () => {

  if (bookmarkArray.length === 0) {
    //adding to bookmark for the first time
    //add a selected item to an array
    bookmarkArray.unshift(
      {
        "title": `${titleParam}`,
        "imgURL": `${imgURLParam}`
      })
    //create html
    appendHTMLForBookmark = bookmarkArray.map((element) => {
      return `
    <div class="bookmarkItem">
      <input type="checkbox" name="checkbox" class="checkbox">
      <label for="checkbox"></label>
      <img src="${element.imgURL}" alt="itemImg">
      <p>${element.title}</p>
    </div>
    `
    }).join("");
    bookmarkList.innerHTML = appendHTMLForBookmark;
    alert("🔖 Bookmark added😊");//====planning to change to the popup screen
  } else {
    //more than one items already in the bookmark
    //duplication check

    //set an item object you want to add
    let targetItem = {
      title: `${titleParam}`,
      imgURL: `${imgURLParam}`
    };

    //check the target item is already in the list
    let trueOrfalse = bookmarkArray.some(elem => {
      return elem.title === targetItem.title
    });

    if (trueOrfalse) {
      //show pop up - Already in the list
      alert("Item below is already in the bookmark list"); //====planning to change to the popup screen
    } else {
      //add a selected item to an array
      bookmarkArray.unshift(
        {
          "title": `${titleParam}`,
          "imgURL": `${imgURLParam}`
        })

      //create html
      appendHTMLForBookmark = bookmarkArray.map((element) => {
        return `
         <div class="bookmarkItem">
          <input type="checkbox" name="checkbox" class="checkbox">
          <label for="checkbox"></label>
           <img src="${element.imgURL}" alt="itemImg">
           <p>${element.title}</p>
         </div>
         `
      }).join("");
      bookmarkList.innerHTML = appendHTMLForBookmark;
      alert("🔖 Bookmark added😊"); //====planning to change to the popup screen
    }
  }
  return bookmarkArray;
};

/* delete bookmark list */
const deleteBookmark = () => {

  const currentBookmark = document.querySelectorAll(".bookmarkItem");
  let recipeTitleArray = [];
  let newBookmarkArray = [];
  //check if the checkbox is checked 
  for (i = 0; i < currentBookmark.length; i++) {
    if (currentBookmark[i].firstElementChild.checked) {
      //Ok to delete - bookmarkArray[i]
      recipeTitleArray.push(bookmarkArray[i].title); //recipe name to be deleted (string)
      //filter out the items that are ok to be deleted
      newBookmarkArray = bookmarkArray.filter(i => recipeTitleArray.every(item => item !== i.title));

      //============= Error Code for reference : only checking one item ==================
      // newBookmarkArray = bookmarkArray.filter((item => {
      //   console.log(item.title); //1 object
      //   recipeTitle[i].indexOf(item.title) === -1;
      // }));
    }
  }

  //delete

  //to use bookmarkArray for the duplication check
  bookmarkArray = newBookmarkArray;

  //display bookmark again
  //create html
  appendHTMLForBookmark = bookmarkArray.map((element) => {
    return `
      <div class="bookmarkItem">
        <input type="checkbox" name="checkbox" class="checkbox">
        <label for="checkbox"></label>
        <img src="${element.imgURL}" alt="itemImg">
        <p>${element.title}</p>
      </div>
      `
  }).join("");
  bookmarkList.innerHTML = appendHTMLForBookmark;
}

/* clear user input and temp values */
const clearInput = () => {
  searchKeyword.value = "";
};

/* alert pop up - idx for specify which alert class in html tags */
//show alert
const showAlert = (msg, idx) => {
  alertMsg[idx].innerHTML = msg;
  alertMsg[idx].style.display = "block";
}

//clear alert
const clearAlert = () => {
  for (i = 0; i < alertMsg.length; i++) {
    alertMsg[i].style.display = "none";
  }
}

/* smooth scroll and Y coordinate caltulation */
const smoothScroll = () => {
  /* Math for smooth scroll
  // When the search button is clicked, scroll to the top of Gallery
  // When the show more button is clicked, webpage shows the bottom of the result section
  */
  let position = resultSection.getBoundingClientRect().bottom - resultSection.getBoundingClientRect().y
  window.scrollTo(0, position);
}

/* loader - 2s */
//activate
const activateLoader = () => {
  loader.style.display = "block";
}

//stop
const stopLoader = () => {
  loader.style.display = "none";
}

/* ============================== Function Call ============================== */
/* recipe search - Search button */
searchBtn.addEventListener("click", () => {
  clearAlert(); // clear alert if it is already shown

  //validation check
  if ((searchKeyword.value === "") || !(isNaN)) {
    showAlert("This field is required. Number is not allowed", 0);
    clearInput();
  } else {
    activateLoader();
    //clear previous search result
    resultArray = [];
    //hide result section if it is already shown
    resultSection.style.display = "none";
    //hide recipe section if it is already shown
    recipeSection.style.display = "none";

    getRecipe(`${searchKeyword.value}`, 0, 16);
    clearInput();
  }
});

/* load more results - Show More button */
showMoreBtn.addEventListener("click", () => {
  activateLoader();
  //fetch data from the lastIndex of data to the next 16
  getRecipe(`${keywordParam}`, lastIdxParam, lastIdxParam + 16);
});

/* bookmark - Bookmark link in the header */
bookmarkLink.addEventListener("click", () => {
  //GSAP scrollTo plugin
  //Move to the bookmark section when the search button is clicked
  gsap.to(window, { duration: 1, scrollTo: "#bookmark" });
});

/* Open a new window for a countdown timer */
timerBtn.addEventListener("click", () => {
  window.open("timer.html", "", "width=300, height=300");
});

/* delete bookmark */
delBtn.addEventListener("click", () => {
  deleteBookmark();
})

/* Enable light theme */
const enableLightTheme = () => {
  //document.body.classList.toggle("light");
  localStorage.setItem("mode", "light");
}

/* Disable light theme = back to default */
const disableLightTheme = () => {
  //document.body.classList.remove("light");
  localStorage.setItem("mode", "default");
  console.log("mode changed to ", localStorage);
}

/* ============================== Animation ============================== */
//When the window is loaded
// mode = null : first loaded => assign "default" to mode

let mode = localStorage.getItem("mode"); //default or light

if (mode === "light") {
  enableLightTheme();
} else if ((mode === "default") || (mode === null)) {
  disableLightTheme();
}

//color change button is clicked
colorCheckbox.addEventListener("change", () => {
  //====pattern 2 : add "light" class to body
  mode = localStorage.getItem("mode"); // get the current mode

  if (mode === "light") {
    disableLightTheme(); // if current mode is light, then change back to default
  } else if (mode === "default") {
    enableLightTheme(); // if current mode is light, then change to light theme
  }
});

//jQuery
/* Move to top button appears after 200 px scroll down the page */
$(window).scroll(function () {
  let height = $(window).scrollTop();
  if (height > 200) {
    $('#toTop').fadeIn();
  } else {
    $('#toTop').fadeOut();
  }
});
//GSAP scrollTo plugin
toTop.addEventListener("click", () => {
  gsap.to(window, { duration: .5, scrollTo: "#header" });
});

//==== keep for ref purpose - another way with jQuery - keep this as a reference
// $(document).ready(function () {
//   $("#toTop").click(function (event) {
//     event.preventDefault();
//     $("html, body").animate({ scrollTop: 0 }, "slow");
//     return false;
//   });
// });

  //====pattern 1 : two css files used
  // if(colorCheckbox.checked) {
  //   styleSheetLink.setAttribute("href", "./scss/lightTheme.css");
  // }else {
  //   styleSheetLink.setAttribute("href", "./scss/style.css");
  // }
  //================================================================
