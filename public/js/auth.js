// const button = document.getElementById("google-signout");
const form = document.querySelector("form");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/"
  : "";

// Use if different error handlers are needed
function handleErr(errCode) {
  switch (errCode) {
    case 400:
      console.log("An Error occured: ", errCode);
      break;
    case 401:
      console.log("An Error occured: ", errCode);
      break;
    case 404:
      console.log("An Error occured: ", errCode);
      break;
    case 500:
      console.log("An Error occured: ", errCode);
      break;

    default:
      break;
  }
}

async function submitHandler(event) {
  event.preventDefault();

  const formData = {};
  for (let elem of form.elements) {
    if (elem.value.length > 0) {
      formData[elem.name] = elem.value;
    }
  }

  const fetchInfo = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };

  try {
    const res = await fetch(url + "api/auth/login", fetchInfo);
    if (!res.ok) {
      const errors = await res.json();
      throw new Error("Bad response", {
        cause: { errors },
      });
    }
    const { token } = await res.json();
    localStorage.setItem("token", token);
    window.location.href = url + "chat.html";
  } catch (err) {
    // handleErr(err.cause.res?.status);
    console.error(err.cause);
  }
}

form.addEventListener("submit", submitHandler);

function handleCredentialResponse(response) {
  // Google Token / ID_TOKEN
  // console.log("id_token", response.credential);

  const body = { id_token: response.credential };

  fetch(url + "api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      window.location.href = url + "chat.html";
    })
    .catch(console.warn);
}

// button.onclick = () => {
//   console.log(google.accounts.id);
//   google.accounts.id.disableAutoSelect();

//   google.accounts.id.revoke(localStorage.getItem("token"), (done) => {
//     localStorage.clear();
//     location.reload();
//   });
// };
