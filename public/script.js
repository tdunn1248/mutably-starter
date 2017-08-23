const baseURL = 'https://mutably.herokuapp.com'

$(document).ready(function() {
  getPokemon()
  setEventListeners()
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
    data: pokeinfo,
    success: getPokemon
  })
}

function deletePokemon(id) {
  $.ajax({
    method: 'DELETE',
    url: `${baseURL}/pokemon/${id}`,
    success: getPokemon``
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
        <input class='input-edit' type='text'/>
        <p class='pokemon-info'>${pokemon.name}, ${pokemon.pokedex}, ${pokemon.evolves_from}</p>
        <div class='modal'>
          <img class= 'pokemon-img' src='' alt="">
        </div>
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

function saveUpdateButtonEventListener() {
  $(document).on('click', '.btn-success', function() {
    const input = $(this).siblings('input')
    const pokemonInfo = $(this).siblings('p')
    const inputValue = input.val()
    const pieces = inputValue.split(',')
    const newPokemon = {
      id: $(this).attr('value'),
      name: pieces[0],
      pokedex: pieces[1],
      evolves_from: pieces[2],
      image: ''
    }
    pokemonInfo[0].innerHTML = inputValue
    input.hide()
    $(this).hide()
    pokemonInfo.show()
    $(this.parentNode.children[1]).show()
    updatePokemon(newPokemon.id, newPokemon)
  })
}

function submitNewPokemonEventListener() {
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

function displayImgEventListener() {
  $(document).on('mouseover', '.pokemon-info', function() {
      const arrayInfo = this.innerHTML.split(',')
      $('.pokemon-img').attr('src',`https://img.pokemondb.net/artwork/${arrayInfo[0].toLowerCase()}.jpg`)
      $('.modal').show()
  })
}

function setEventListeners() {
  editButtonEventListener()
  deleteButtonEventListener()
  saveUpdateButtonEventListener()
  submitNewPokemonEventListener()
  displayImgEventListener()
}

// ======= helper function ==== //
function resetInputs() {
  $('.submit-name').val('')
  $('.submit-pokedex').val('')
  $('.submit-evolves').val('')
}
