const baseURL = 'https://mutably.herokuapp.com'
const inputField = document.createElement('input')
const saveBtn = document.createElement('button')
saveBtn.classList.add('btn-success')
saveBtn.classList.add('btn')
saveBtn.classList.add('btn-sm')
saveBtn.innerHTML = 'Save'

$(document).ready(function() {

  getPokemon()
  editButtonEventListener()
  deleteButtonEventListener()
})

function editButtonEventListener() {
  $(document).on('click', '.btn-edit', function(event) {
    console.dir(this.nextSibling.nextSibling);
    toggleInputField(this.nextSibling.nextSibling)
    toggleEditButton(this)
  })
}

function deleteButtonEventListener() {
  $(document).on('click', '.btn-delete', function() {
    this.parentNode.remove()
  })
}

function toggleInputField(editSelectedPokemon) {
  inputField.classList.add('input-edit')
  console.dir(inputField)
  $(editSelectedPokemon).replaceWith(inputField)
  $(inputField).attr('placeholder', editSelectedPokemon.innerHTML)
}

function toggleEditButton(btnSelected) {
  $(btnSelected).replaceWith(saveBtn)
}

function getPokemon() {
  $.ajax({
    method: 'GET',
    url: `${baseURL}/pokemon`,
    success: renderPokemon
  })
}

function renderPokemon(pokemonCollection) {
  const pokemonArray = pokemonCollection.pokemon
  pokemonArray.forEach(pokemon => {
    $(".list-group").append(`
      <div class='list-item'>
        <button class='btn btn-info btn-sm btn-edit' value=${pokemon._id}>Edit</button>
        <p class='pokemon-info'>${pokemon.name}, ${pokemon.pokedex}, ${pokemon.evolves_from}</p>
        <button class='btn btn-danger btn-sm btn-delete' value=${pokemon._id}>Delete</button>
      </div>
    `)
  })
}
