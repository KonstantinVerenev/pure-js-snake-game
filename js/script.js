// Определяем игровое поле и задаём ему контекс для 2d графики
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

// Определяем картинку фона игрового поля
let groundImage = new Image(); // может быть переписать
groundImage.src = "img/bg.png";

// Определяем картинку еды, которую будет есть змейка
let foodImage = new Image(); // может быть переписать
foodImage.src = "img/food.png";

// Ширина и высота одного квадрата игрового поля
let box = 32;

// Переменная для подсчёта очков
let score = 0;

let gameOverMarker = false;

// Переменная для отображения еды
let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
};

// Переменная для отображения змейки
let snake = [];
// Первый элемент - массим с координатами головы(выбираем центральные координаты)
snake[0] = {
  x: 15 * box,
  y: 10 * box
};

// Переменная направления движения змейки
let dir = "left";

// Обработчик событий нажатия кнопок для движения змейки
document.addEventListener('keydown', direction);

// Флаг для только одного изменения направления за ход
let directionChangeMarker = 0;

// Функция обработчика событий нажатия кнопок
function direction(event) {
  if (event.keyCode == 37 && dir != "right" && (directionChangeMarker == 1)) {
    dir = "left";
  } else if (event.keyCode == 38 && dir != "down" && (directionChangeMarker == 1)) {
    dir = "up";
  } else if (event.keyCode == 39 && dir != "left" && (directionChangeMarker == 1)) {
    dir = "right";
  } else if (event.keyCode == 40 && dir != "up" && (directionChangeMarker == 1)) {
    dir = "down";
  }

  directionChangeMarker = 0;
}

// Функция которая рисует нашу игру
function drawGame() {
  ctx.drawImage(groundImage, 0, 0);// Рисуем поле(задник)
  ctx.drawImage(foodImage, food.x, food.y);// Рисуем поле(задник)

  // Рисуем змейку
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "darkgreen";
    } else {
      ctx.fillStyle = "green";
    }
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Рисуем счёт
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, box * 2.2, box * 1.7);

  // Меняем флажок напрвления движения
  directionChangeMarker = 1;

  // Описываем координаты головы змейки
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Передвигаем координаты головы в зависимости от направления движения
  switch (dir) {
    case "left":
      snakeX -= box;
      break;
    case "right":
      snakeX += box;
      break;
    case "up":
      snakeY -= box;
      break;
    case "down":
      snakeY += box;
      break;
  }

  // Реализуем поедание еды
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box
    };
  } else {
    snake.pop();
  }

  // Определяем координаты новой головы змеи
  let newHead = {
    x: snakeX,
    y: snakeY
  };

  // Рисуем новую голову змейки
  snake.unshift(newHead);

  // Прописываем функцию Game Over-a
  function gameOver() {
    gameOverMarker = true;
    clearInterval(gameInterval);
    ctx.fillStyle = "white";
    ctx.font = "80px Arial";
    ctx.fillText("КОНЕЦ ИГРЫ", box * 1.3, box * 9);
    ctx.fillText("Очков:", box * 4.8, box * 12);
    ctx.fillText(score, box * 13, box * 12);
  }

  // Прописываем условие Game Over при выходе за игровое поле
  if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17) {
    gameOver();
  }

  // Прописываем условие Game Over при попадании головы в хвост
  function eatTail(head, snakeBody) {
    for (let i = 1; i < snakeBody.length; i++) {
      if (head.x == snakeBody[i].x && head.y == snakeBody[i].y) {
        gameOver();
      }
    }
  }

  eatTail(newHead, snake);
}

// Прописываем переменную начальной скорости игры
let delay = 150;

// Прописываем интервал с изменяющимся таймер задержки
let gameInterval = setTimeout(function interval() {
  drawGame();

  if (score > 5) {
    delay = 120;
  } else if (score > 10) {
    delay = 100;
  } else if (score > 20) {
    delay = 80;
  } else if (score > 30) {
    delay = 40;
  }

  if (gameOverMarker) {
    return;
  }

  gameInterval = setTimeout(interval, delay);

}, delay);


// Вызов рисования игры через интервал (нельзя реализовать сложность через уменьшающийся таймер)
// let gameInterval = setInterval(drawGame, 150);

// Перезагрузка страницы по кнопке
document.querySelector(".restart").addEventListener('click', function () {
  location.reload();
});
