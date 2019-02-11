const player = {
  name: "Soldier",
  wins: 0,
  strength: {
    health: 100,
    energy: 100
  },
  experience: 0,
  attacks: {
    punch: 5,
    kick: 10,
    slap: 1
  },
  addons: {
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
  },
  setName(event) {
    if ($("#setPlayerName").val()) {
      player.name = $("#setPlayerName").val();
    } else {
      player.name = "Soldier";
    }
    $("#nameBox").remove();
    game.updatePage();
  },
  setAddons(event) {
    let value = event.target.dataset.upgrade;
    if (player.experience >= 4) {
      player.addons[value].set = true;
      event.target.disabled = true;
      if (event.target.nextElementSibling) {
        event.target.nextElementSibling.disabled = false;
      }
      player.experience -= 4;

      $(`#${value}`).text(event.target.id);
    } else {
      $(".col-6").prepend(
        `<h5 id='drop'>You Need ${4 - player.experience} More Experience</h5>`
      );
      setTimeout(() => {
        $("#drop").remove();
      }, 800);
    }
    game.updatePage();
  }
};

const monster = {
  names: ["Ragnor", "Terrorificus", "Bill"],
  name: "",
  strength: {
    health: 100,
    energy: 100, //affected by age, random
    age: ""
  },
  hunger: 0,
  attacks: {
    bite: 18,
    claw: 10
  },
  monsterAge() {
    let age = game.session.random * 5;
    monster.strength.energy -= age + 15;
    monster.strength.age = age < 15 ? "strong" : age < 30 ? "young" : "old";
  },
  monsterHunger() {
    monster.hunger = game.session.random * 10;
  },
  monsterName() {
    let index = 0;
    if (game.session.random < 4) {
      index = 0;
    } else if (game.session.random < 7) {
      index = 1;
    } else {
      index = 2;
    }
    monster.name = monster.names[index];
  },
  monsterAttack() {
    let attackValue = monster.attacks.claw;
    if (Math.ceil(Math.random() * 10) > 5) {
      attackValue = monster.attacks.bite;
    }
    attackValue -= player.addons.armor.set ? player.addons.armor.value : 0;
    attackValue += attackValue * Math.floor(monster.hunger / 100);
    attackValue -= Math.floor(
      attackValue * (monster.strength.energy / 2 / 100)
    );
    if (player.strength.health - attackValue < 0) {
      player.strength.health = 0;
    } else {
      player.strength.health -= attackValue;
    }
  }
};

const game = {
  session: {
    plays: 0,
    random: 0
  },
  count: 0,
  attack(event) {
    let attack = event.target.id;
    let value = player.attacks[attack];
    if (player.addons[attack] && player.addons[attack].set == true) {
      value += player.addons[attack].value;
    }
    value = Math.floor(value + value * ((100 - monster.strength.energy) / 100));
    game.session.plays++;
    player.experience++;
    if (monster.strength.health - value < 0) {
      monster.strength.health = 0;
    } else {
      monster.strength.health -= value;
    }
    monster.monsterAttack();
    game.updatePage();
    if (!monster.strength.health || !player.strength.health) {
      game.winGame();
    }
  },
  winGame() {
    Array.from(document.querySelectorAll("#actions button")).forEach(button => {
      button.disabled = true;
    });
    game.count++;
    let picture = $("#bearPicture").attr("src");
    if (monster.strength.health < player.strength.health) {
      player.wins++;
      $("#bearPicture").attr("src", "assetts/images/discraceBear.png");
      $("#bearPicture").addClass("win");
      setTimeout(() => {
        $("#bearPicture").removeClass("win");
        $("#bearPicture").attr("src", "assetts/images/cool-Bear.png");
      }, 1000);
    } else {
      $("#bearPicture").attr("src", "assetts/images/bear1.png");
      $("#bearPicture").addClass("lose");
      setTimeout(() => {
        $("#bearPicture").removeClass("lose");
        $("#bearPicture").attr("src", picture);
      }, 1800);
    }
    let winner = player.strength.health ? player.name : monster.name;

    game.updatePage();
    $("body").append(
      `<div id="winBox" class="card popup">
        <div class="card-body text-center">
          <h4 class="card-title">${winner} Has Won</h4>
          <button
            id="replay"
            class="btn btn-lg bg-dark text-white"
            type="button"
          onclick="game.replay()">
            Play Again
          </button>
        </div>
      </div>`
    );
  },
  replay() {
    player.strength.health = 100;
    monster.strength.health = 100;
    monster.strength.energy = 100;
    game.session.random = Math.floor(Math.random() * 10);
    monster.attacks.bite++;
    monster.attacks.claw++;
    monster.monsterName();
    monster.monsterAge();
    monster.monsterHunger();
    Array.from(document.querySelectorAll("#actions button")).forEach(button => {
      button.disabled = false;
    });
    if (game.session.random * 10 < 50) {
      $("#bearPicture").attr("src", "assetts/images/bbear.png");
    } else {
      $("#bearPicture").attr("src", "assetts/images/bear3s.png");
    }
    game.updatePage();
    if ($("#winBox")) {
      $("#winBox").remove();
    }
  },
  reset() {
    game.replay();
    player.experience = 0;
    monster.attacks.claw = 10;
    monster.attacks.bite = 18;
    player.name = "Soldier";
    for (let addon in player.addons) {
      player.addons[addon].set = false;
    }
    $("#sword").disabled = true;
    $("#arrmor").disabled = true;
    game.updatePage();
  },
  updatePage() {
    $("#monsterName").text(monster.name);
    $("#monsterAge").text(monster.strength.age);
    $("#monsterHunger").text(monster.hunger);
    $("#monsterHealth").text(monster.strength.health);
    if (monster.strength.health < 35) {
      $("#monsterName~div>.progressBar span").css("background-color", "red");
    } else {
      $("#monsterName~div>.progressBar span").css(
        "background-color",
        "rgb(43, 194, 83)"
      );
    }
    $("#monsterName~div>.progressBar span").css(
      "width",
      `${monster.strength.health}%`
    );
    if (player.strength.health < 35) {
      $("#playerName~div>.progressBar span").css("background-color", "red");
    } else {
      $("#playerName~div>.progressBar span").css(
        "background-color",
        "rgb(43, 194, 83)"
      );
    }
    $("#playerName~div>.progressBar span").css(
      "width",
      `${player.strength.health}%`
    );
    $("#playerName").text(player.name);
    $("#playerHealth").text(player.strength.health);
    $("#playerExperience").text(player.experience);
    $("#games").text(game.count);
    $("#wins").text(player.wins);
  }
};

function initialize() {
  //initialize buttons
  Array.from(document.querySelectorAll("#actions button")).forEach(button => {
    button.addEventListener("click", game.attack);
  });
  Array.from(document.querySelectorAll("#playerName~button")).forEach(
    button => {
      button.addEventListener("click", player.setAddons);
    }
  );
  document.getElementById("reset").addEventListener("click", game.reset);
  let random = Math.floor(Math.random() * 10);
  game.session.random = random;
  monster.monsterAge();
  monster.monsterName();
  monster.monsterHunger();

  let template = "";
  template += `<div id="nameBox" class="card popup">
      <div class="card-body text-center">
      <h4 class="card-title">Soldier</h4>
      <input id="setPlayerName" class="rounded pl-1" type="text" placeholder="Your Name"></input>
        <button
          id="player"
          class="btn btn-sm mt-2 bg-dark text-white"
          type="button"
          onclick="player.setName()">
          OK
          </button>
      </div>
    </div>`;
  $("body").append(template);

  game.updatePage();
}

$(document).ready(initialize);
