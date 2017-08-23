const baseURL = 'https://mutably.herokuapp.com'
const saveBtn = document.createElement('button')
saveBtn.classList.add('btn-success')
saveBtn.classList.add('btn')
saveBtn.classList.add('btn-sm')
saveBtn.innerHTML = 'Save'

$(document).ready(function() {

  getPokemon()
  
  editButtonEventListener()
  deleteButtonEventListener()
  saveEditEventListener()
  addPokemonEventListener()
})

// =================== ajax calls ===================== //
function createPokemon(pokemon) {
  $.ajax({
    method: 'POST',
    url: `${baseURL}/pokemon`,
    data: pokemon,
    success: getPokemon
  })
}

function getPokemon() {
  $.ajax({
    method: 'GET',
    url: `${baseURL}/pokemon`,
    success: renderPokemon
  })
}

function updatePokemon(id, pokeinfo) {
  $.ajax({
    method: 'PUT',
    url: `${baseURL}/pokemon/${id}`,
    data: JSON.stringify(pokeinfo),
    success: getPokemon
  })
}

function deletePokemon(id) {
  $.ajax({
    method: 'DELETE',
    url: `${baseURL}/pokemon/${id}`,
    success: getPokemon
  })
}

// =================== render pokemon to DOM ===================== //
function renderPokemon(pokemonCollection) {
  const pokemonArray = pokemonCollection.pokemon
  pokemonArray.forEach(pokemon => {
    $(".list-group").append(`
      <div class='list-item'>
        <button class='btn btn-info btn-sm btn-success' value=${pokemon._id}>Save</button>
        <button class='btn btn-info btn-sm btn-edit' value=${pokemon._id}>Edit</button>
        <input class='input-edit'/>
        <p class='pokemon-info'>${pokemon.name}, ${pokemon.pokedex}, ${pokemon.evolves_from}</p>
        <button class='btn btn-danger btn-sm btn-delete' value=${pokemon._id}>Delete</button>
      </div>
    `)
  })
}

// =================== Event Listeners ===================== //
function editButtonEventListener() {
  $(document).on('click', '.btn-edit', function(event) {
    let pokemonInfo = $(this.parentNode).find('p')
    let input = $(this.parentNode).find('input')
    $(this).hide()
    $(this.parentNode.children[0]).show()
    pokemonInfo.hide()
    input.show()
    $(this.parentNode).find('input').attr('placeholder', pokemonInfo[0].innerHTML )
  })
}

function deleteButtonEventListener() {
  $(document).on('click', '.btn-delete', function() {
    $(this.parentNode).remove()
    deletePokemon($(this).attr('value'))
  })
}

function saveEditEventListener() {
  $(document).on('click', '.btn-success', function() {
    const input = $(this).siblings('input')
    const p = $(this).siblings('p')
    const updatedInfo = input.val()
    p[0].innerHTML = updatedInfo
    input.hide()
    $(this).hide()
    p.show()
    $(this.parentNode.children[1]).show()
    updatePokemon($(this).attr('value'), updatedInfo)
  })
}

function addPokemonEventListener() {
  $(document).on('click', '.add-pokemon-btn', function() {
    const submittedPokemon = {
      name: $('.submit-name').val(),
      pokedex: $('.submit-pokedex').val(),
      evolves_from: $('.submit-evolves').val(),
      image: `https://img.pokemondb.net/artwork/${$('.submit-name').val().toLowerCase()}.jpg`
    }
    resetInputs()
    createPokemon(submittedPokemon)
  })
}

// ======= helper function ==== //
function resetInputs() {
  $('.submit-name').val('')
  $('.submit-pokedex').val('')
  $('.submit-evolves').val('')
}
