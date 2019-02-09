const game = {
  session: {
    plays: 0,
    random: 0,
    monsterName: ""
  },
  games: {
    count: 0
  },
  player: {
    name: "Soldier",
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
    names: ["Ragnor", "Terrorificus", "Bill"],
    strength: {
      health: 100,
      energy: 100, //affected by age, random
      age: ""
    },
    attacks: {
      bite: 20,
      claw: 10,
      addons: 0
    }
  },
  addons: {
    player: {
      knife: {
        set: false,
        value: 5
      },
      sword: {
        set: false,
        value: 10
      },
      armor: {
        set: false,
        value: -5
      }
    },
    monster: {
      hunger: 0
    }
  },
  attack(event) {
    let attack = event.target.id;
    let value = game.player.attacks[attack];
    game.session.plays++;
    if (game.monster.strength.health - value < 0) {
      game.monster.strength.health = 0;
      game.winGame();
    } else {
      game.monster.strength.health -= Math.floor(
        value + value * ((100 - game.monster.strength.energy) / 100)
      );
    }
    game.updatePage();
  },
  monsterAge() {
    let age = game.session.random * 5;
    game.monster.strength.energy -= age + 15;
    game.monster.strength.age =
      age < 15 ? "strong" : age < 30 ? "young" : "old";
  },
  monsterHunger() {
    game.addons.monster.hunger = game.session.random * 10;
  },
  makeMonsterName() {
    let index = 0;
    if (game.session.random < 4) {
      index = 0;
    } else if (game.session.random < 7) {
      index = 1;
    } else {
      index = 2;
    }
    game.session.monsterName = game.monster.names[index];
  },
  setAddons(event) {},
  winGame() {},
  updatePage() {
    $("#monsterName").text(game.session.monsterName);
    $("#monsterAge").text(game.monster.strength.age);
    $("#monsterHunger").text(game.addons.monster.hunger);
    $("#monsterHealth").text(game.monster.strength.health);
    $("#monsterName~div>.progressBar span").css(
      "width",
      `${game.monster.strength.health}%`
    );
    $("#playerName~div>.progressBar span").css(
      "width",
      `${game.player.strength.health}%`
    );
    $("#playerName").text(game.player.name);
    $("#playerHealth").text(game.player.strength.health);
  }
};

function initialize() {
  //initialize buttons
  Array.from(document.querySelectorAll("#actions button")).forEach(button => {
    button.addEventListener("click", game.attack);
  });
  Array.from(document.querySelectorAll("#adons button")).forEach(button => {
    button.addEventListener("click", game.setAddons);
  });
  let random = Math.floor(Math.random() * 10);
  game.session.random = random;
  game.monsterAge();
  game.makeMonsterName();
  game.monsterHunger();
  game.updatePage();

  let template = "";
  template += ``;
}

$(document).ready(initialize);
//-Math.floor(game.monster.strength.energy / 3)
