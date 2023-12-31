const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const score = document.querySelector('.score--value')
const finalscore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const buutonplay = document.querySelector('.btn-paly')
const size = 30
const audio = new Audio('../assets/audio.mp3')
const initiPosition = { x: 270, y: 240 }

let snake = [initiPosition]
const randonumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}
const incrementoscore = () => {
  score.innerText = +score.innerText + 10
}
const randomPosition = () => {
  const number = randonumber(0, canvas.width - size)
  return Math.round(number / 30) * 30
}
const randomColor = () => {
  const red = randonumber(0, 255)
  const green = randonumber(0, 255)
  const blue = randonumber(0, 255)

  return `rgb(${red}, ${green}, ${blue})`
}
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor()
}

let direction, loopId
const drawFood = () => {
  const { x, y, color } = food
  ctx.shadowColor = color
  ctx.shadowBlur = 6
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}
drawFood()

const drawSnake = () => {
  ctx.fillStyle = '#ddd'

  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = 'white'
    }
    ctx.fillRect(position.x, position.y, size, size)
  })
}
const drawGrid = () => {
  ctx.lineWidth = 1
  ctx.strokeStyle = '#191919'

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 600)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)
    ctx.stroke()
  }
}
drawGrid()
const moverSnake = () => {
  if (!direction) return
  const head = snake[snake.length - 1]

  if (direction == 'rigth') {
    snake.push({ x: head.x + size, y: head.y })
  }
  if (direction == 'left') {
    snake.push({ x: head.x - size, y: head.y })
  }
  if (direction == 'down') {
    snake.push({ x: head.x, y: head.y + size })
  }
  if (direction == 'up') {
    snake.push({ x: head.x, y: head.y - size })
  }
  snake.shift()
}
const chackEat = () => {
  const head = snake[snake.length - 1]
  if (head.x == food.x && head.y == food.y) {
    incrementoscore()
    snake.push(head)
    audio.play()
    let x = randomPosition()
    let y = randomPosition()
    while (snake.find(position => position.x == x && position.y == y)) {
      ;(x = randomPosition()), (y = randomPosition())
    }
    food.x = x
    food.y = y
    food.color = randomColor()
  }
}

const gameloop = () => {
  clearInterval(loopId)
  ctx.clearRect(0, 0, 600, 600)
  drawGrid()
  drawFood()
  moverSnake()
  drawSnake()
  chackEat()
  checkCollision()
  loopId = setTimeout(() => {
    gameloop()
  }, 300)
}
const checkCollision = () => {
  const head = snake[snake.length - 1]
  const canvasLinit = canvas.width - size
  const neckIndex = snake.length - 2

  const wallcolisson =
    head.x < 0 || head.x > canvasLinit || head.y < 0 || head.y > canvasLinit

  const setfcollission = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y
  })
  if (wallcolisson || setfcollission) {
    gamerOver()
  }
}
const gamerOver = () => {
  direction = undefined
  menu.style.display = 'flex'
  finalscore.innerText = score.innerText
  canvas.style.filter = 'blur(2px)'
}
gameloop()

document.addEventListener('keydown', ({ key }) => {
  if (key == 'ArrowRight' && direction != 'left') {
    direction = 'rigth'
  }
  if (key == 'ArrowLeft' && direction != 'rigth') {
    direction = 'left'
  }
  if (key == 'ArrowDown' && direction != 'up') {
    direction = 'down'
  }

  if (key == 'ArrowUp' && direction != 'down') {
    direction = 'up'
  }
})
buutonplay.addEventListener('click', () => {
  score.innerText = '00'
  menu.style.display = 'none'
  canvas.style.filter = 'none'
  snake = [initiPosition]
})
