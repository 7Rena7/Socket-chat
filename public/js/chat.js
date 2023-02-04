const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/"
  : "https://socket-chat-le9enwyil-7rena7.vercel.app/";

let socketServer = null;

const txtUid = document.querySelector("#txtUid");
const txtMessage = document.querySelector("#txtMessage");
const ulUsers = document.querySelector("#ulUsers");
const ulMessages = document.querySelector("#ulMessages");
const btnExit = document.querySelector("#btnExit");

async function checkToken() {
  const token = localStorage.getItem("token");

  const fetchInfo = {
    mode: "no-cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
  };

  try {
    const res = await fetch(url + "api/auth/", fetchInfo);
    if (!res.ok) {
      const errors = await res.json();
      throw new Error("Bad response", {
        cause: { errors },
      });
    }
    const { user, token } = await res.json();
    localStorage.setItem("token", token);
    document.title = user.name;
  } catch (err) {
    // handleErr(err.cause.res?.status);
    console.error(err.cause);
    window.location.href = url;
  }
}

async function connectSocket() {
  socketServer = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socketServer.on("connect", () => {
    console.log("Connected to server");
  });

  socketServer.on("disconnect", () => {
    console.log("Disconected from server");
  });

  socketServer.on("receive-messages", renderMessages);

  socketServer.on("active-users", renderUsers);

  socketServer.on("receive-private-messages", (payload) => {
    console.log(payload);
  });
}

const renderUsers = (usersArr = []) => {
  let html = "";
  usersArr.forEach(({ name, uid }) => {
    html += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
          <button class="fs-6 btn btn-dark" id='${uid}'>Copy</button>
        </p>
      </li>
    `;
  });

  ulUsers.innerHTML = html;

  // usersArr.forEach(({ uid }) => {
  //   const copyButton = document.getElementById(`${uid}`);
  //   copyButton.addEventListener("onclick", () => {
  //     console.log(uid);
  //     txtUid.name = uid;
  //   });
  // });
};

const renderMessages = (messagesArr = []) => {
  // console.table(messagesArr);
  let html = "";
  messagesArr.forEach(({ userName, message, dateSend: date }) => {
    let localTime = new Date(date).toLocaleTimeString().split(":");
    localTime = localTime[0] + ":" + localTime[1];

    html += `
      <li>
        <span class="fs-7 text-success">${userName}</span>
        <small class="text-muted fs-7">${localTime} : </small>
        <span class="fs-5 text-black">${message}</span>
      </li>
    `;
  });

  ulMessages.innerHTML = html;
};

txtMessage.addEventListener("keyup", ({ keyCode }) => {
  const message = txtMessage.value.trim();
  const uid = txtUid.value.trim();

  // Keycode 13 -> ENTER
  if (keyCode !== 13) {
    return;
  }
  if (message.length === 0) {
    return;
  }

  socketServer.emit("send-message", { uid, message });

  txtMessage.value = "";
});

btnExit.addEventListener("click", () => {
  localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = url;
  }, 300);
});

async function main() {
  // Check if user is signed in
  await checkToken();

  await connectSocket();
}

main();
