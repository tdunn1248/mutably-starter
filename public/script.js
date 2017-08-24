const baseURL = 'https://mutably.herokuapp.com'

$(document).ready(function() {
  POKEMON.catchEm()
  UI.eventListeners()
})

const UI = {
  editButtonEventListener: function() {
    $(document).on('click', '.btn-edit', function() {
      ELEMENT.replaceWithInputAndSaveBtn(this)
    })
  },
  deleteButtonEventListener: function() {
    $(document).on('click', '.btn-delete', function() {
      ELEMENT.deletePokemonListItem(this)
    })
  },
  saveUpdateButtonEventListener: function() {
    $(document).on('click', '.btn-success', function() {
      ELEMENT.grabUpdatedInfo(this)
    })
  },
  submitNewPokemonEventListener: function() {
    $(document).on('click', '.add-pokemon-btn', function() {
      ELEMENT.submittedPokemon()
      ELEMENT.resetInputs()
    })
  },
  displayImgEventListener: function() {
    $(document).on('mouseover', '.pokemon-info', function() {
      ELEMENT.showPokemonImg(this)
    })
  },
  eventListeners: function() {
    UI.editButtonEventListener()
    UI.deleteButtonEventListener()
    UI.saveUpdateButtonEventListener()
    UI.submitNewPokemonEventListener()
    UI.displayImgEventListener()
  }
}

const ELEMENT = {
  submittedPokemon: function() {
    const submittedPokemon = {
      name: $('.submit-name').val(),
      pokedex: $('.submit-pokedex').val(),
      evolves_from: $('.submit-evolves').val(),
      image: `https://img.pokemondb.net/artwork/${$('.submit-name').val().toLowerCase()}.jpg`
    }
    POKEMON.createPokemon(submittedPokemon)
  },
  replaceWithInputAndSaveBtn: function(buttonClicked) {
    let pokemonInfo = $(buttonClicked.parentNode).find('p')
    let input = $(buttonClicked.parentNode).find('input')
    $(buttonClicked).hide()
    $(buttonClicked.parentNode.children[0]).show()
    pokemonInfo.hide()
    input.show()
    $(buttonClicked.parentNode).find('input').attr('placeholder', pokemonInfo[0].innerHTML )
  },
  deletePokemonListItem: function(buttonClicked) {
    $(buttonClicked.parentNode).remove()
    POKEMON.deletePokemon($(buttonClicked).attr('value'))
  },
  grabUpdatedInfo: function(buttonClicked) {
    const input = $(buttonClicked).siblings('input')
    const pokemonInfo = $(buttonClicked).siblings('p')
    const inputValue = input.val()
    const pieces = inputValue.split(',')
    const newPokemon = {
      id: $(buttonClicked).attr('value'),
      name: pieces[0],
      pokedex: pieces[1],
      evolves_from: pieces[2],
      image: ''
    }
    pokemonInfo[0].innerHTML = inputValue
    input.hide()
    $(buttonClicked).hide()
    pokemonInfo.show()
    $(buttonClicked.parentNode.children[1]).show()
    POKEMON.updatePokemon(newPokemon.id, newPokemon)
  },
  renderPokemon: function(pokemonCollection) {
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
  },
  resetInputs: function() {
    $('.submit-name').val('')
    $('.submit-pokedex').val('')
    $('.submit-evolves').val('')
  },
  showPokemonImg: function(pokemonSelected) {
    const arrayInfo = pokemonSelected.innerHTML.split(',')
    $('.pokemon-img').attr('src',`https://img.pokemondb.net/artwork/${arrayInfo[0].toLowerCase()}.jpg`)
    $('.modal').show()
  }
}

const POKEMON = {
  catchEm: function() {
    $.ajax({
      method: 'GET',
      url: `${baseURL}/pokemon`,
      success: ELEMENT.renderPokemon
    })
  },
  createPokemon: function(pokemon) {
    $.ajax({
      method: 'POST',
      url: `${baseURL}/pokemon`,
      data: pokemon,
      success: POKEMON.catchEm
    })
  },
  updatePokemon: function(id, pokeinfo) {
    $.ajax({
      method: 'PUT',
      url: `${baseURL}/pokemon/${id}`,
      data: pokeinfo,
      success: POKEMON.catchEm
    })
  },
  deletePokemon: function(id) {
    $.ajax({
      method: 'DELETE',
      url: `${baseURL}/pokemon/${id}`,
      success: POKEMON.catchEm
    })
  }
}
