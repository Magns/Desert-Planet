var messages = [
  // 0
  {
    message: "",
    customBG: "img/handwritten.png",
    closeText: "REPLY",
    onRead: function() {
      messages[0].expired = true;
      spawner.spawners[0] = 0;
      showLetter(1);
    },
    expired: false
  },
  // 1
  {
    message: "Please tell your parents I am stuck here.",
    closeText: "SEND",
    onRead: function() {
      player.reply = {
        onSend: function () {
          spawner.spawners[2] = 1;
        }
      }
    }
  },
  // 2
  {
    message: "Hello,\n\n" +
             "Are you lost? What do you need?\n\n" +
             "I attached some cookies in case you\n" +
             "are hungry.\n\n" +
             "Klarb",
    closeText: "REPLY",
    onRead: function() {
      document.cookie = "cookie_from_Klarb = yummy";
      messages[2].expired = true;
      spawner.spawners[2] = 0;
      showLetter(3);
    },
    expired: false
  },
  // 3
  {
    message: "Crashlanded. Need spare parts, glue,\n" +
             "and a map to get out of here.",
    closeText: "SEND",
    onRead: function() {
      player.reply = {
        onSend: function () {
          spawner.spawners[4] = 1;
        }
      }
    }
  },
  // 4
  {
    message: "Sure thing!\n\nKlarb",
    closeText: "OK",
    onRead: function() {
      messages[4].expired = true;
      spawner.spawners[4] = 0;
      spawner.spawners[5] = 1;
      spawner.spawners[6] = 1;
      spawner.spawners[7] = 1;
      questLog = new QuestLog();
    },
    expired: false
  },
  // 5
  {
    message: false,
    special: "parts"
  },
  // 6
  {
    message: false,
    special: "glue"
  },
  // 7
  {
    message: " ",
    customBG: "img/map.png",
    closeText: "OK",
    onRead: function () {
      player.inventory.map++;
      spawner.spawners[7] = 0;
    }
  },
];

var spam = [{
  message: "My dearest,\n\n" +
           "Greetings to you my Dear beloved, I am\n" +
           "Mrs. Walton, heiress to the throne of\n" +
           "Newfoundland. I bring to you a proposal\n" +
           "worth One Billion US dollars. Please\n" +
           "reply me back if you are interested.\n\n" +
           "Stay Blessed\n" +
           "Mrs. A. Walton",
  closeText: "Whatever."
},
{
  message: "Welcome to Papa Rnxgor's!\n\n" +
           "1. Plain Cheese ....... $9.25\n" +
           "2. Pepperoni .......... $10.00\n" +
           "3. Hawaiian ........... $11.50\n" +
           "4. Orion squid ........ $12.00\n" +
           "5. Beef .................. $11.50",
  closeText: "I'm hungry.",
  onRead: function () {
    spawner.spawn("pizza");
  }
}];
