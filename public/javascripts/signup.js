'use strict';

const main = () => {
  const input = document.querySelector('input[name="username"]');
  let button = document.getElementById('signup-button');
  console.log(button);
  button.disabled = false;
  let message;

  input.addEventListener('blur', () => {
    if (input.value) {
      axios.get(`/auth/username-unique?username=${input.value}`)
        .then((response) => {
          if (message) {
            message.remove();
          }
          message = document.createElement('p');
          if (!response.data.unique) {
            message.innerText = 'Username is not unique';
            button.setAttribute('disabled', 'disabled');
          } else {
            button.removeAttribute('disabled');
          }
          input.parentNode.appendChild(message);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};

window.addEventListener('load', main);
