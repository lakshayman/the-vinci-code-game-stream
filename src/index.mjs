import "./styles.css";
import edit from './images/edit.png';
import innerBg from './images/inner_bg.jpg';

const myGameContainer = document.getElementById("game");

class Game {
  constructor(container) {
    this.container = container;
  }

  // display functions

  displayMenu() {
    document.body.style.background = ``;
    document.body.style.backgroundSize = "";
    document.body.style.backgroundColor = "rgba(0,0,0,0.6)";
    this.container.innerHTML = `<h1 class="heading">Welcome to The VINCI CODE</h1>
    <div class="name">Welcome ${this.name} <img class="editImg" alt="edit" src="${edit}" width="24px" data-val="3" /></div>
    <div>
      <button class="shrink-border" data-val="1">Start New Game</button>
      <button class="shrink-border" data-val="2">See Leaderboard</button>
    </div>
    `;
    this.container.removeEventListener("click", this.handleMenuClick);
    this.container.addEventListener("click", this.handleMenuClick);
  }

  displayEnterName(update = false) {
    this.container.innerHTML = `
    <div class="input-box">
      <input id="name" type="text" placeholder="What's your name?" value="${update ? this.name : ""}" autofocus/>
      <div class="input-box-line"></div>
    </div>
    <button id="begin" class="shrink-border">${update ? "UPDATE" : "BEGIN🚀"}</button>
    `;
    document.getElementById("name").removeEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("begin").click();
      }
    });
    document.getElementById("name").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("begin").click();
      }
    });
    document.getElementById("begin").removeEventListener("click", this.handleNameInput);
    document.getElementById("begin").addEventListener("click", this.handleNameInput);
  };

  displayNumber(number, ok) {
    this.container.innerHTML = `
    <div class="number">${number}</div>
    <button id="display-number-button" class="shrink-border">${ok ? "OK" : "NEXT"}</button>
    `;
    document.getElementById("display-number-button").removeEventListener("click", this.handleNextNumber);
    document.getElementById("display-number-button").addEventListener("click", this.handleNextNumber);
  };

  displayScore() {
    const scoreArray = JSON.parse(localStorage.getItem("scoreArray")) || [];
    let newArray = [];
    if(scoreArray.length < 5){
      newArray = [{name: this.name, score: this.level}, ...scoreArray];
    } else {
      if(scoreArray[scoreArray.length-1].score > this.level) {
        newArray = scoreArray
      } else {
        scoreArray.pop();
        newArray = [{name: this.name, score: this.level}, ...scoreArray];
      }
    }
    newArray.sort((a, b) => b.score - a.score);
    localStorage.setItem("scoreArray", JSON.stringify(newArray));
    this.container.innerHTML = `
    <div class="number">Congratulations! Your score is ${this.level}</div>
    <button id="display-number-button" class="shrink-border">Main Menu</button>
    `;
    document.getElementById("display-number-button").removeEventListener("click", this.handleMainMenu);
    document.getElementById("display-number-button").addEventListener("click", this.handleMainMenu);
  };

  displayLeaderboard() {
    const scoreArray = JSON.parse(localStorage.getItem("scoreArray")) || [];
    console.log(scoreArray)
    let scoreList = '';
    for(let i = 0; i<scoreArray.length; i++) {
      scoreList += `<div style="font-size: 24px">${scoreArray[i].score}🎉 ${scoreArray[i].name}</div>`
    }
    this.container.innerHTML = `
    ${scoreArray.length ? `<div style="margin-bottom: 24px">${scoreList}</div>` : '<div class="number">Play some games to check leaderboad!</div>'}
    <button id="display-number-button" class="shrink-border">Main Menu</button>
    `;
    document.getElementById("display-number-button").removeEventListener("click", this.handleMainMenu);
    document.getElementById("display-number-button").addEventListener("click", this.handleMainMenu);
  };

  displayInput(ok) {
    document.getElementById("game").style.backgroundColor = 'rgba(0,0,0,0.6)';
    document.getElementById("game").style.padding = '20px';
    document.getElementById("game").style.borderRadius = '25px';

    this.container.innerHTML = `
    <h1 class="heading heading1">Enter values in order one at a time: (press enter after every value)</h1>
    <div class="input-box enter-value">
      <input id="enteredInput" type="number" placeholder="Eg: 8" max="9" min="0"/>
      <div class="input-box-line"></div>
    </div>
    <button id="display-input-button" class="shrink-border">${ok ? "OK" : "NEXT"}</button>
    `;
    document.getElementById("enteredInput").removeEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("display-input-button").click();
      }
    });
    document.getElementById("enteredInput").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("display-input-button").click();
      }
    });
    document.getElementById("enteredInput").focus();
    document.getElementById("display-input-button").removeEventListener("click", this.handleNextInput);
    document.getElementById("display-input-button").addEventListener("click", this.handleNextInput);
  };

  //button click functions

  handleMenuClick = function (event) {
    switch (event.target.dataset?.val) {
      case "1":
        document.body.style.background = `url(${innerBg})`;
        document.body.style.backgroundSize = "cover";
        this.updateLevel(1);
        this.gameLoop();
        break;
      case "2":
        this.displayLeaderboard();
        break;
      case "3":
        this.displayEnterName(true);
    }
  }.bind(this);

  handleNameInput = function (event) {
    this.name = document.getElementById("name").value || "Guest";
    this.displayMenu();
  }.bind(this);

  handleMainMenu = function (event) {
    this.displayMenu();
  }.bind(this);

  handleNextNumber = function() {
    if(this.displayedNumbers + 1 === this.level){
      this.displayInput(this.displayedInputs+1 === this.level);
    } else {
      this.displayedNumbers += 1;
      this.displayNumber(this.generatedNumbers[this.displayedNumbers], (this.displayedNumbers+1 === this.level));
    }
  }.bind(this);

  handleNextInput = function() {
    if(document.getElementById("enteredInput").value == "") {
      alert("Please input a number!");
      return;
    }
    document.getElementById("game").style.backgroundColor = 'transparent';
    document.getElementById("game").style.padding = '0px';
    document.getElementById("game").style.borderRadius = '0px';
    if(document.getElementById("enteredInput").value == this.generatedNumbers[this.displayedInputs]) {
      if(this.displayedInputs + 1 === this.level){
        this.updateLevel(this.level + 1);
        this.gameLoop();
      } else {
        this.displayedInputs += 1;
        this.displayInput(this.displayedInputs+1 === this.level);
      }
    } else {
      this.displayScore();
    }
    
  }.bind(this);

  // utility functions

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  start() {
    this.displayEnterName();
  }

  updateLevel(level = 1) {
    this.displayedNumbers = 0;
    this.displayedInputs = 0;
    this.generatedNumbers = [];
    this.enteredNumbers = [];
    this.level = level;
  }

  generateNumbersForLevel() {
    for (let i = 0; i < this.level; i++) {
      this.generatedNumbers.push(this.randomNumber());
    }
  }

  displayNumbersForLevel = function() {
    this.displayNumber(this.generatedNumbers[this.displayedNumbers], (this.displayedNumbers+1 === this.level))
  }.bind(this);

  gameLoop() {
    this.generateNumbersForLevel();
    this.displayNumbersForLevel();
  }
}

let myGameInstance = new Game(myGameContainer);
myGameInstance.start();
