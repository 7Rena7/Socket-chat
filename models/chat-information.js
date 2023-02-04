class Message {
  constructor(uid, userName, message, dateSend, sendTo) {
    this.uid = uid;
    this.userName = userName;
    this.message = message;
    this.dateSend = dateSend;
    this.sendTo = sendTo;
  }
}

class ChatMessages {
  constructor() {
    this.messages = [];
    this.users = {};
  }

  get last50Messages() {
    return this.messages.slice(0, 50);
  }

  get usersArr() {
    return Object.values(this.users);
  }

  sendMessage(uid, userName, message, dateSend, sendTo) {
    this.messages.unshift(
      new Message(uid, userName, message, dateSend, sendTo, null)
    );
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  disconnectUser(id) {
    delete this.users[id];
  }
}

module.exports = ChatMessages;
