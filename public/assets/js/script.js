const $animalForm = document.querySelector('#animal-form');

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
  fetch('/api/animals', { // as a server request, specifying the full url is not needed
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
    alert(`Error: ${response.statusText()}`);
  })
  .then(postResponse => {
    console.log(postResponse);
    alert('animal added to ./data/animals.json');
  });
};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
