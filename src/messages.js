var senders = {
  gzorp: {
    test: false
  }
};

var messages = [{
  message: "",
  customBG: "img/handwritten.png",
  closeText: "REPLY",
  onRead: function() {
    player.reply = {
      onSend: function () {
        senders.gzorp.test = true;
      }
    }
  },
  read: false
},
{
  message: "This is a test\n\nYo!",
  closeText: "Whatever.",
  onRead: function() {
    console.log("Message closed");
  },
  read: false
}];
