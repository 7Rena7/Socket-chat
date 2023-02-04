const { Socket } = require("socket.io");
require("colors");

const { validateJWT } = require("../helpers");
const { ChatMessages } = require("../models");

const chatMessages = new ChatMessages();

// TODO: remove new Socket() before pushing to repo
const socketController = async (socket = new Socket(), io) => {
  const user = await validateJWT(socket.handshake.headers["x-token"]);

  if (!user) {
    socket.emit("invalid-user", {
      msg: "User not valid (JWT not valid)",
    });
    return socket.disconnect();
  }

  // Add connected user
  chatMessages.connectUser(user);
  io.emit("active-users", chatMessages.usersArr);
  socket.emit("receive-messages", chatMessages.last50Messages);

  // Create a private room
  socket.join(user._id);

  // Remove user when disconnects
  socket.on("disconnect", () => {
    chatMessages.disconnectUser(user._id);
    console.log("Client Disconnected: ".red + user._id + " " + user.name);
    io.emit("active-users", chatMessages.usersArr);
  });

  socket.on("send-message", ({ uid, message }) => {
    if (uid) {
      // Private message
      const now = new Date().getTime();

      socket
        .to(uid)
        .emit("receive-private-messages", { from: user.name, message, now });
    } else {
      const now = new Date().getTime();
      chatMessages.sendMessage(user._id, user.name, message, now);
      io.emit("receive-messages", chatMessages.last50Messages);
    }
  });

  console.log("Client Connected: ".green + user._id + " " + user.name);
};

module.exports = {
  socketController,
};
