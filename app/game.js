// const player = {
//   name: "Soldier",
//   strength: {
//     health: 100,
//     energy: 100
//   },
//   experience: 0,
//   attacks: {
//     punch: 5,
//     kick: 10,
//     slap: 1
//   },
//   addons: {
//     slap: {
//       set: false,
//       value: 2
//     },
//     punch: {
//       set: false,
//       value: 5
//     },
//     armor: {
//       set: false,
//       value: -5
//     }
//   }
// }

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
    experience: 0,
    attacks: {
      punch: 5,
      kick: 10,
      slap: 1
    }
  },
  monster: {
    names: ["Ragnor", "Terrorificus", "Bill"],
    strength: {
      health: 100,
      energy: 100, //affected by age, random
      age: ""
    },
    hunger: 0,
    attacks: {
      bite: 10,
      claw: 7
    }
  },
  addons: {
    player: {
      slap: {
        set: false,
        value: 2
      },
      punch: {
        set: false,
        value: 5
      },
      armor: {
        set: false,
        value: -5
      }
    }
  },
  attack(event) {
    let attack = event.target.id;
    let value = game.player.attacks[attack];
    if (game.addons.player[attack] && game.addons.player[attack].set == true) {
      value += game.addons.player[attack].value;
    }
    game.session.plays++;
    game.player.experience++;
    if (game.monster.strength.health - value < 0) {
      game.monster.strength.health = 0;
    } else {
      game.monster.strength.health -= Math.floor(
        value + value * ((100 - game.monster.strength.energy) / 100)
      );
    }
    game.monsterAttack();
    game.updatePage();
    if (!game.monster.strength.health || !game.player.strength.health) {
      game.winGame();
    }
  },
  monsterAttack() {
    let attackValue = game.monster.attacks.claw;
    if (Math.ceil(Math.random() * 10) > 5) {
      attackValue = game.monster.attacks.bite;
    }
    attackValue -= game.addons.player.armor.set
      ? game.addons.player.armor.value
      : 0;
    attackValue += attackValue * (game.monster.hunger / 100);
    if (game.player.strength.health - attackValue < 0) {
      game.player.strength.health = 0;
    } else {
      game.player.strength.health -= Math.floor(attackValue);
    }
    console.log(attackValue);
  },
  monsterAge() {
    let age = game.session.random * 5;
    game.monster.strength.energy -= age + 15;
    game.monster.strength.age =
      age < 15 ? "strong" : age < 30 ? "young" : "old";
  },
  monsterHunger() {
    game.monster.hunger = game.session.random * 10;
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
  setAddons(event) {
    let value = event.target.dataset.upgrade;
    if (game.player.experience >= 7) {
      game.addons.player[value].set = true;
      event.target.disabled = true;
      event.target.nextElementSibling.disabled = false;
      game.player.experience -= 7;
    } else {
      $(".col-6").prepend(`<h5 id="drop">You Need 7 Experience</h5>`);
      setTimeout(() => {
        $("#drop").remove();
      }, 800);
    }
    game.updatePage();
  },
  winGame() {
    alert("game over");
    game.games.count++;
  },
  updatePage() {
    $("#monsterName").text(game.session.monsterName);
    $("#monsterAge").text(game.monster.strength.age);
    $("#monsterHunger").text(game.monster.hunger);
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
    $("#playerExperience").text(game.player.experience);
  }
};

function initialize() {
  //initialize buttons
  Array.from(document.querySelectorAll("#actions button")).forEach(button => {
    button.addEventListener("click", game.attack);
  });
  Array.from(document.querySelectorAll("#playerName~button")).forEach(
    button => {
      button.addEventListener("click", game.setAddons);
    }
  );
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
