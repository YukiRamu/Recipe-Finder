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
      // console.log(`${baseURL}${keyword}&app_id=${apiiD}&app_key=${apiKey}&from=${firstIndex}&to=${lastIndex}`);
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      // console.log("firstIndex is " + firstIndex + " lastIndex is " + lastIndex)//0-8
      // console.log("data count is " + data.count)
      // console.log("length of array is  " + resultArray.length);

      //validation check for IndexOutOfBoundsException
      if (resultArray.length === data.count) {
        //  console.log("hi index out of bounds here");
        //in case there is no more data to display
        showAlert("No more recipe to display.", 1);
        stopLoader();
        //  console.log(resultArray);
        return false;
      }

      //first load validation check
      if (data.count === 0) {
        showAlert("No recipe found.", 0);
        clearInput();
        return false;
      } else if (data.count < lastIndex) {
        //in case the data count is less than 8
        //create resultArray
        for (let i = 0; i < data.count; i++) {
          resultArray.push(data.hits[i]);
        }
        // console.log(resultArray);
        displayResult();
      } else {
        //create resultArray 8 items in each time
        for (let i = 0; i < 8; i++) {
          resultArray.push(data.hits[i]);
        }
        // console.log(resultArray);
        displayResult();
      }
    })
    .catch((error) => {
      //errorの内容をThrowする --> to understand what causes the error
      console.error(`Unable to get recipe data. Error = ${error}`);
      //or redo the fetch again? Think how I want to handle the error. At least return it.
      return error
    })
  return resultArray, keywordParam, firstIdxParam, lastIdxParam;
};

/* display search result */
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
  stopLoader();
};

/* display recipe - when "view detail" is clicked */
const displayRecipe = async (title) => {
  //show recipe section
  recipeSection.style.display = "block";

  //GSAP scrollTo plugin
  //Move to the next section when view detail is clicked
  const scrollToRecipe = async () => {
    // console.log("#1 scroll to recipe");
    gsap.to(window, { duration: 2, scrollTo: "#recipe" }); //=====not working, css fadeIn animation currently applied
  };

  try {
    //1 scroll
    await scrollToRecipe();
    //2 display
    //console.log("#2 displaying recipe");
    //find the item to display
    const mealTitle = document.querySelectorAll(".mealTitle");

    // console.log(mealTitle);//NodeList
    // console.log(typeof (mealTitle));//Object
    // console.log("meal title is " + title);

    let selectedIndex = "";
    for (let i = 0; i < mealTitle.length; i++) {
      console.log("getting index");
      if (mealTitle[i].innerText === title) {
        selectedIndex = i;
      }
    }
    // console.log("index is " + selectedIndex);
    //  console.log(resultArray[selectedIndex]);

    //create <li> tags - ingredients
    appendHTMLForIngrList = resultArray[selectedIndex].recipe.ingredientLines.map((elem) => {
      return `
          <li>${elem}</li>
        `;
    }).join("");

    //  console.log(appendHTMLForIngrList);

    //create an entire append HTML
    appendHTMLForRecipe = `    
          <ul class="dishInfo">
            <p class="title">${title}</p>
            <li><i class="fas fa-balance-scale-right"></i> Calories: ${Math.round(resultArray[selectedIndex].recipe.calories)}</li>
            <li><i class="fas fa-utensils"></i> Serving size: ${resultArray[selectedIndex].recipe.yield}</li>
            <button type="button" class="likeBtn" id="likeBtn" onclick="addBookmark()"><i class="fas fa-heart"></i>Bookmark</button>
          </ul>
          <div class="recipeInfo">
            <img src="${resultArray[selectedIndex].recipe.image}" alt="itemImg">
            <div class="detailInfo">
              <p>Ingredients</p>
              <ul>
              ${appendHTMLForIngrList}
              </ul>
              <a href="${resultArray[selectedIndex].recipe.url}" target="_blank"><i class="fas fa-seedling"></i> View Recipe</a>
            </div>
          </div>
        `;
    // console.log("appendHTMLForRecipe is ..... " + appendHTMLForRecipe);
    recipePanel.innerHTML = appendHTMLForRecipe;

    //store parameter and return
    titleParam = title;
    imgURLParam = resultArray[selectedIndex].recipe.image;

    console.log("recipe field is displayed", bookmarkArray);
    return titleParam, imgURLParam;

  } catch (error) {
    console.error("Failed to display the recipe detial");
  }
};

/* display bookmark list - Add */
const addBookmark = () => {

  console.log("bookmark icon is clicked. current bookmark is ", bookmarkArray);
  console.log("I want to add to bookmark " + titleParam + " and " + imgURLParam);

  if (bookmarkArray.length === 0) {
    //adding to bookmark for the first time
    //GSAP scrollTo plugin
    //Move to the bookmark section when the bookmark icon is clicked
    gsap.to(window, { duration: .5, scrollTo: "#bookmark" });
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
      <img src="${element.imgURL}" alt="itemImg">
      <p>${element.title}</p>
    </div>
    `
    }).join("");
    bookmarkList.innerHTML = appendHTMLForBookmark;
  } else {
    //more than one items already in the bookmark
    //duplication check
    let targetItem = {
      title: `${titleParam}`,
      imgURL: `${imgURLParam}`
    };

    console.log(targetItem.title, targetItem.imgURL);

    let trueOrfalse = bookmarkArray.some(elem => {
      return elem.title === targetItem.title
    });
    console.log(trueOrfalse);

    if (trueOrfalse) {
      //show pop up - Already in the list
      alert("Item below is already in the bookmark list"); //=======to be changed to popup screen
    } else {
      //リストに入ってないものをリストにいれる
      console.log("before unshift ", bookmarkArray);
      //GSAP scrollTo plugin
      //Move to the bookmark section when the bookmark icon is clicked
      gsap.to(window, { duration: .5, scrollTo: "#bookmark" });
      //add a selected item to an array
      bookmarkArray.unshift(
        {
          "title": `${titleParam}`,
          "imgURL": `${imgURLParam}`
        })
      console.log("After unshift ", bookmarkArray);
      //create html
      appendHTMLForBookmark = bookmarkArray.map((element) => {
        return `
         <div class="bookmarkItem">
           <input type="checkbox" name="checkbox" class="checkbox">
           <img src="${element.imgURL}" alt="itemImg">
           <p>${element.title}</p>
         </div>
         `
      }).join("");
      bookmarkList.innerHTML = appendHTMLForBookmark;
    }

    //=====================Error Code =========================
    // for (i = 0; i < bookmarkArray.length; i++) {
    //   if (bookmarkArray[i].title === titleParam) {
    //     //show pop up - Already in the list
    //     console.log("Item below is already in the bookmark list"); //=======change to popup
    //     console.log(bookmarkArray[i].title);
    //     console.log("current bookmark ", bookmarkArray);
    //     break; //need to break if it finds the item already in the bookmark list
    //   } else { //リストに入ってないものをリストにいれる
    //     //====================== ISSUE HERE=====================
    //     // Second time or after, ALWAYS comes into the else statement
    //     // although if statement is executed
    //     //===========================================================
    //     console.log("before unshift ", bookmarkArray);
    //     //Add a new item and break the loop
    //     //GSAP scrollTo plugin
    //     //Move to the bookmark section when the bookmark icon is clicked
    //     gsap.to(window, { duration: .5, scrollTo: "#bookmark" });
    //     //add a selected item to an array
    //     bookmarkArray.unshift(
    //       {
    //         "title": `${titleParam}`,
    //         "imgURL": `${imgURLParam}`
    //       })
    //     console.log("After unshift ", bookmarkArray);
    //     //create html
    //     appendHTMLForBookmark = bookmarkArray.map((element) => {
    //       return `
    //         <div class="bookmarkItem">
    //           <input type="checkbox" name="checkbox" class="checkbox">
    //           <img src="${element.imgURL}" alt="itemImg">
    //           <p>${element.title}</p>
    //         </div>
    //         `
    //     }).join("");
    //     bookmarkList.innerHTML = appendHTMLForBookmark;
    //     break;
    //   }
    // }
  }

  return bookmarkArray;
};

/* delete bookmark list */
const deleteBookmark = () => {
  console.log("delete clicked");
  console.log(bookmarkArray);
  const currentBookmark = document.querySelectorAll(".bookmarkItem");
  console.log(currentBookmark);
  let newBookmarkArray = [];
  //check if the checkbox is checked 
  for (i = 0; i < currentBookmark.length; i++) {
    if (currentBookmark[i].firstElementChild.checked) {
      //Ok to delete - bookmarkArray[i]
      console.log(bookmarkArray[i]); //object
      bookmarkArray.splice(i, 1);

      //immutably delete the item ---- not working
      // newBookmarkArray = bookmarkArray.filter((array, idx)=> {
      //   array !== i; // create a new array with values except for the deleteIndex
      // })
      console.log(bookmarkArray);

      //display bookmark again
      //create html
      appendHTMLForBookmark = bookmarkArray.map((element) => {
        return `
          <div class="bookmarkItem">
            <input type="checkbox" name="checkbox" class="checkbox">
            <img src="${element.imgURL}" alt="itemImg">
            <p>${element.title}</p>
          </div>
          `
      }).join("");
      bookmarkList.innerHTML = appendHTMLForBookmark;
    }
  }
}

/* clear user input and temp values */
const clearInput = () => {
  searchKeyword.value = "";
  resultArray = [];
};

/* alert pop up - idx for specify which alert class in html tags */
//show alert
const showAlert = (msg, idx) => {
  console.log(idx);
  alertMsg[idx].innerHTML = msg;
  alertMsg[idx].style.display = "block";
}

//clear alert
const clearAlert = () => {
  for (i = 0; i < alertMsg.length; i++) {
    alertMsg[i].style.display = "none";
  }
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
  //console.log(searchKeyword.value) //tomato
  //validation check
  if ((searchKeyword.value === "") || !(isNaN)) {
    showAlert("This field is required. Number is not allowed", 0);
    clearInput();
  } else {
    activateLoader();
    //show result section
    resultSection.style.display = "block";
    //GSAP scrollTo plugin
    // Move to the next section when the search button is clicked
    gsap.to(window, { duration: .5, scrollTo: "#result" });
    getRecipe(`${searchKeyword.value}`, 0, 8);
    clearInput();
  }
});

/* load more results - Show More button */
showMoreBtn.addEventListener("click", () => {
  activateLoader();
  //fetch data from the lastIndex of data to the next 8
  console.log(resultArray);
  //GSAP scrollTo plugin
  // Move to the next 8 results when the show more button is clicked
  //convert
  let viewHeight = document.documentElement.clientHeight; //vh to pixel
  gsap.to(resultPanel, { duration: 2, scrollTo: { y: + 1000 } }); //=== not working need css animation. may not need?? better without??
  getRecipe(`${keywordParam}`, lastIdxParam, lastIdxParam + 8);
});

/* bookmark - Bookmark link in the header */
bookmarkLink.addEventListener("click", () => {
  //GSAP scrollTo plugin
  //Move to the bookmark section when the search button is clicked
  gsap.to(window, { duration: 2, scrollTo: "#bookmark" }); //=== not working
});

/* Open a new window for a countdown timer */
timerBtn.addEventListener("click", () => {
  window.open("countdownTimer.html", "", "width=300, height=300");
});

/* delete bookmark */
delBtn.addEventListener("click", () => {
  deleteBookmark();
})

/* ============================== Animation ============================== */
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

//==== keep for ref purpose - another way with jQuery - keep as a reference
// $(document).ready(function () {
//   $("#toTop").click(function (event) {
//     event.preventDefault();
//     $("html, body").animate({ scrollTop: 0 }, "slow");
//     return false;
//   });
// });
