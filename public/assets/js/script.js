// data | dom elements
const $animalForm = document.getElementById('animal-form');
const $zookeeperForm = document.getElementById('zookeeper-form');

// logic | form input
const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

  // - fetch method:POST | sends frontend animalObject to the backend
  fetch('api/animals', {
    method: 'POST', // specifying post method required
    headers: {
      Accept: 'application/json', // data type to be sent
      'Content-Type': 'application/json' // data type provided
    },
    body: JSON.stringify(animalObject) // sending animalObject as stringified json to body property.
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    alert(`Error: ${response.statusText}`);
  })
  .then(postResponse => {
    console.log(postResponse);
    alert('animal added to ./data/animals.json');
  });
};

const handleZookeeperFormSubmit = event => {
  event.preventDefault();

  // organizes form submitted data
  const name = $zookeeperForm.querySelector('[name="zookeeper-name"]').value;
  const age = parseInt($zookeeperForm.querySelector('[name="age"]').value);
  const favoriteAnimal = $zookeeperForm.querySelector('[name="favorite-animal"]').value;

  // consolidates form data variables into an object
  const zookeeperObj = { name, age, favoriteAnimal };
  console.log(zookeeperObj);

  // configures fetch req to post method. posts object to ./data/zookeepers.json
  fetch('api/zookeepers', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(zookeeperObj)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    alert(`error: ${response.statusText}`);
  })
  .then(postResponse => {
    console.log(`added ${postResponse}`);
    alert('zookeeper added.');
  });
};

$zookeeperForm.addEventListener('submit', handleZookeeperFormSubmit);
$animalForm.addEventListener('submit', handleAnimalFormSubmit);
