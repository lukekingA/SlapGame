const game = {
  session: {
    plays: 0,
    random: 0,
    monsterName: ''
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
    names: ['Ragnor', 'Terrorificus', 'Bill'],
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
  },
  attack(event) {
    let attack = event.target.id
    let value = game.player.attacks[attack]
    game.monster.strength.health -= value
    game.session.plays++
    game.monster.strength.health -= Math.floor(value * ((100 - game.monster.strength.energy) / 100))

    game.updatePage()

  },
  monsterAge() {
    let age = this.session.random * 5
    game.monster.strength.energy -= age + 15
    game.monster.strength.age = age < 15 ? 'strong' : age < 30 ? 'young' : 'old'
  },
  makeMonsterName() {
    let index = 0
    if (game.session.random < 4) {
      index = 0
    } else if (game.session.random < 7) {
      index = 1
    } else {
      index = 2
    }
    game.session.monsterName = game.monster.names[index]
  },
  updatePage() {
    $('#monsterName').text(game.session.monsterName)
    $('#monsterAge').text(game.monster.strength.age)
    $('#monsterHealth').text(game.monster.strength.health)
    $('.progressBar span').css('width', `${game.monster.strength.health}%`)
    $('#playerName').text(game.player.name)
    $('#playerHealth').text(game.player.strength.health)
  }
}


function initialize() {
  //initialize buttons
  let buttons = Array.from(document.querySelectorAll('#actions button')).forEach(button => {
    button.addEventListener('click', game.attack)

  })
  let random = Math.floor(Math.random() * 10)
  game.session.random = random
  game.monsterAge()
  game.makeMonsterName()
  game.updatePage()

  let template = ''

}







$(document).ready(initialize)
//-Math.floor(game.monster.strength.energy / 3)