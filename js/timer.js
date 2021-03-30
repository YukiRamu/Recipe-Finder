/* ====== Variable Declaration ===== */
const startBtn = document.querySelector(".startBtn");
const stopBtn = document.querySelector(".stopBtn");
const resetBtn = document.querySelector(".resetBtn");

const hour = document.querySelector(".hour");
const min = document.querySelector(".min");
const second = document.querySelector(".second");

let displayHour = 0;
let displayMin = 0;
let displaySec = 0;
let timerId;

/* ====== Function Declaration  ===== */

const startTimer = () => {
  //second
  if (displaySec < 59) {
    //count second up to 59
    displaySec++;

    if (displaySec < 10) {
      second.innerHTML = displaySec.toString().padStart(2, "0");
    } else {
      second.innerHTML = displaySec;
    }
  } else {
    //increment min
    displayMin++;
    displaySec = 0;
    if (displaySec < 10) {
      second.innerHTML = displaySec.toString().padStart(2, "0");
    } else {
      second.innerHTML = displaySec;
    }
  }

  //minutes
  if (displayMin < 59) {
    if (displayMin < 10) {
      min.innerHTML = displayMin.toString().padStart(2, "0");
    } else {
      min.innerHTML = displayMin;
    }
  } else {
    //increment hour
    displayHour++;
    displayMin = 0;
    if (displayMin < 10) {
      min.innerHTML = displayMin.toString().padStart(2, "0");
    } else {
      min.innerHTML = displayMin;
    }
  }

  //hour 
  if (displayHour < 10) {
    hour.innerHTML = displayHour.toString().padStart(2, "0");
  } else {
    hour.innerHTML = displayHour;
  }
}

const stopTimer = () => {
  clearInterval(timerId);
}

const resetTimer = () => {
  clearInterval(timerId);
  hour.innerHTML = "00";
  min.innerHTML = "00";
  second.innerHTML = "00";
  displayHour = 0;
  displayMin = 0;
  displaySec = 0;
}

/* ====== Function Call  ===== */
startBtn.addEventListener("click", () => {
  timerId = setInterval(startTimer, 1000);
  console.log("start", timerId);
  startBtn.disabled = true; //disabled : prevent the button from being clicked multiple times
});

stopBtn.addEventListener("click", () => {
  stopTimer();
  console.log("stop", timerId);
  startBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
  resetTimer();
  console.log("reset", timerId);
  startBtn.disabled = false;
});
