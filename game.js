$(document).ready(initialize)

const game = {
  session: {
    plays: 0
  },
  player: {
    name: 'Soldier',
    strength: {
      health: 100,
      energy: 100
    },
    attacks: {
      punch: 5,
      kick: 10,
      slap: 1,
      addons: 0
    }
  },
  monster: {
    name: ['Ragnor', 'Terrorificus', 'Bill'],
    strength: {
      health: 100,
      energy: 100, //affected by age, random
      age: ''
    },
    attacks: {
      bite: 20,
      claw: 10,
      addons: 0
    }
  },
  addons: {
    player: {
      knife: 0,
      sword: 0,
      armor: 0
    },
    monster: {
      hunger: 0,
      age: 1 //of three 0,1,2 young middle old
    }
  }
}


function initialize() {
  //initialize buttons
  let buttons = Array.from(document.querySelectorAll('#actions button')).forEach(button => {
    button.addEventListener('click', attack)

  })
  let random = Math.floor(Math.random() * 10)
  monsterAge(random)
  updatePage(random)

  let template = ''

}

function attack(event) {
  let attack = event.target.id
  let value = game.player.attacks[attack]
  game.monster.strength.health -= value
  game.session.plays++
  game.monster.strength.health -= value * ((100 - game.monster.strength.energy) / 100)


}

function monsterAge(random) {
  let age = random * 5
  game.monster.strength.energy -= age + 15
  game.monster.strength.age = age < 15 ? 'strong' : age < 30 ? 'young' : 'old'
}

function updatePage(random) {
  console.log(Math.floor(random / 3))
  $('#monsterName').text(game.monster.name[Math.floor(random / 3) - 1])
  $('#monsterAge').text(game.monster.strength.age)
  $('#monsterHealth').text(game.monster.strength.health)
  $('#playerName').text(game.player.name)
  $('#playerHealth').text(game.player.strength.health)
}


//-Math.floor(game.monster.strength.energy / 3)