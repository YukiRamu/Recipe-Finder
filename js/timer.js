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
let interval;

/* ====== Function Declaration  ===== */

const startTimer = () => {
  //second untiil 59
  console.log("timer started");

  if (displaySec < 60) {
    //count second up to 59
    displaySec++;

    if (displaySec < 10) {
      second.innerHTML = "0" + displaySec;
    } else {
      second.innerHTML = displaySec;
    }

  }
  //continue from here

  // if (displaySec > 60) {
  //   //increment min
  //   displayMin++
  //   if (displayMin < 10) {
  //     min.innerHTML = "0" + displayMin;
  //   } else {
  //     min.innerHTML = displayMin;
  //   }
  // }


}

const stopTimer = () => {
  clearInterval(interval);
}

const resetTimer = () => {
  clearInterval(interval);
  hour.innerHTML = "00";
  min.innerHTML = "00";
  second.innerHTML = "00";
}

/* ====== Function Call  ===== */
startBtn.addEventListener("click", () => {
  interval = setInterval(startTimer, 1000);
  startBtn.disabled = true; //disabled : prevent the button from being clicked multiple times
  console.log(interval);//1
});

stopBtn.addEventListener("click", () => {
  stopTimer();
  startBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
  resetTimer();
  startBtn.disabled = false;
});
