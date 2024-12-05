const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    computer: "computer-cards",
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissor",
    img: `${pathImages}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

async function getRandomCardId(params) {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });

    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(IdCard);
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  hiddenCardDetails();

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Empate";
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "Ganhou!";
    await playAudio("win");
    state.score.playerScore++;
  }

  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "Perdeu!";
    await playAudio("lose");
    state.score.computerScore++;
  }

  return duelResults;
}

async function removeAllCardsImages() {
  let cards = document.querySelector("#computer-cards");
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => {
    img.remove();
  });

  cards = document.querySelector("#player-cards");
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => {
    img.remove();
  });
}

async function drawSelectedCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

async function bgmAudio() {
  const bgm = document.getElementById("bgm");
  bgm.play();
}

function init() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.computer);

  bgmAudio();
}

init();
