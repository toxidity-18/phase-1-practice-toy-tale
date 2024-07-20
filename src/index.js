let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const form = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

 
  fetchToys();
  setupFormListener();
});

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    })
    .catch(error => console.error('Error fetching toys:', error));
}

function renderToy(toy) {
  const toyContainer = document.getElementById('toy-collection');
  const toyCard = document.createElement('div');
  toyCard.className = 'card';
  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  toyContainer.appendChild(toyCard);
  
 
  toyCard.querySelector('.like-btn').addEventListener('click', () => likeToy(toy));
}

function setupFormListener() {
  const form = document.querySelector('.add-toy-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;
    addNewToy(toyName, toyImage);
    form.reset();
  });
}

function addNewToy(name, image) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0
    })
  })
  .then(response => response.json())
  .then(newToy => {
    renderToy(newToy);
  })
  .catch(error => console.error('Error adding new toy:', error));
}

function likeToy(toy) {
  const newLikes = toy.likes + 1;
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
  .then(response => response.json())
  .then(updatedToy => {
    const toyCard = document.getElementById(toy.id).closest('.card');
    toyCard.querySelector('p').innerText = `${updatedToy.likes} Likes`;
    toy.likes = updatedToy.likes; 
  })
  .catch(error => console.error('Error updating toy likes:', error));
}
