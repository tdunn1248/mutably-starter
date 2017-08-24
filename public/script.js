const baseURL = 'https://mutably.herokuapp.com'

$(document).ready(function() {
  DATA.readPokemon()
  UI.editButtonEventListener()
  UI.deleteButtonEventListener()
  UI.saveUpdateButtonEventListener()
  UI.submitNewPokemonEventListener()
})

var UI = {
  editButtonEventListener: function() {
    $(document).on('click', '.btn-edit', function(event) {
      let pokemonInfo = $(this.parentNode).find('p')
      let input = $(this.parentNode).find('input')
      $(this).hide()
      $(this.parentNode.children[0]).show()
      pokemonInfo.hide()
      input.show()
      $(this.parentNode).find('input').attr('placeholder', pokemonInfo[0].innerHTML )
    })
  },
  deleteButtonEventListener: function() {
    $(document).on('click', '.btn-delete', function() {
      $(this.parentNode).remove()
      DATA.deletePokemon($(this).attr('value'))
    })
  },
  saveUpdateButtonEventListener: function() {
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
      DATA.updatePokemon(newPokemon.id, newPokemon)
    })
  },
  submitNewPokemonEventListener: function() {
    $(document).on('click', '.add-pokemon-btn', function() {
      const submittedPokemon = {
        name: $('.submit-name').val(),
        pokedex: $('.submit-pokedex').val(),
        evolves_from: $('.submit-evolves').val(),
        image: `https://img.pokemondb.net/artwork/${$('.submit-name').val().toLowerCase()}.jpg`
      }
      UI.resetInputs()
      DATA.createPokemon(submittedPokemon)
    })
  },
  displayImgEventListener: function() {
    $(document).on('mouseover', '.pokemon-info', function() {
        const arrayInfo = this.innerHTML.split(',')
        $('.pokemon-img').attr('src',`https://img.pokemondb.net/artwork/${arrayInfo[0].toLowerCase()}.jpg`)
        $('.modal').show()
    })
  },
  resetInputs: function() {
    $('.submit-name').val('')
    $('.submit-pokedex').val('')
    $('.submit-evolves').val('')
  }
}

var ELEMENT = {
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
  }
}

var DATA = {
  createPokemon: function(pokemon) {
    $.ajax({
      method: 'POST',
      url: `${baseURL}/pokemon`,
      data: pokemon,
      success: DATA.readPokemon
    })
  },
  readPokemon: function() {
    $.ajax({
      method: 'GET',
      url: `${baseURL}/pokemon`,
      success: ELEMENT.renderPokemon
    })
  },
  updatePokemon: function(id, pokeinfo) {
    $.ajax({
      method: 'PUT',
      url: `${baseURL}/pokemon/${id}`,
      data: pokeinfo,
      success: DATA.readPokemon
    })
  },
  deletePokemon: function(id) {
    $.ajax({
      method: 'DELETE',
      url: `${baseURL}/pokemon/${id}`,
      success: DATA.readPokemon
    })
  }
}
