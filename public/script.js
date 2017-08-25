const baseURL = 'https://mutably.herokuapp.com'

$(document).ready(function() {
  CONTROLLER().readData()
  UI.addEventListeners()
})

function CONTROLLER() {
  return {
    readData: DATA.read,
    createPokedom: DATA.create,
    updatedPokemon: DATA.update,
    deletePokemon: DATA.delete,
    newPokemon: ELEMENT.newPokedom,
    renderData: ELEMENT.renderData
  }
}

const UI = {
  addEventListeners() {
    $(document).on('click', '.add-pokemon-btn', UI.submitNewPokemon)
    $(document).on('click', '.btn-edit', UI.editPokemon)
    $(document).on('click', '.btn-success', UI.saveUpdate)
    $(document).on('click', '.btn-delete', UI.deletePokemon)
    $(document).on('mouseover', '.pokemon-info', UI.getImg)
  },
  submitNewPokemon() {
    ELEMENT.newPokedom()
    ELEMENT.resetInputs()
  },
  editPokemon() {
    ELEMENT.editPokemon(this)
  },
  deletePokemon() {
    ELEMENT.deletePokemon(this)
  },
  getImg() {
    ELEMENT.displayImg(this)
  },
  saveUpdate() {
    ELEMENT.submitEdit(this)
  }
}

const DATA = {
  read() {
    $.ajax({
      method: 'GET',
      url: `${baseURL}/pokemon`,
      success: CONTROLLER().renderData
    })
  },
  create(pokemonInfo) {
    $.ajax({
      method: 'POST',
      url: `${baseURL}/pokemon`,
      data: pokemonInfo,
      success: CONTROLLER().readData
    })
  },
  update(id, pokemonInfo) {
    $.ajax({
      method: 'PUT',
      url: `${baseURL}/pokemon/${id}`,
      data: pokemonInfo,
      success: CONTROLLER().readData
    })
  },
  delete(id) {
    $.ajax({
      method: 'DELETE',
      url: `${baseURL}/pokemon/${id}`,
      success: CONTROLLER().readData
    })
  }
}

const ELEMENT = {
  newPokedom() {
    const newPokemon = {
      name: $('.submit-name').val(),
      pokedex: $('.submit-pokedex').val(),
      evolves_from: $('.submit-evolves').val(),
      image: `https://img.pokemondb.net/artwork/${$('.submit-name').val().toLowerCase()}.jpg`
    }
    CONTROLLER().createPokedom(newPokemon)
  },
  displayImg(selectedPokemon) {
    const name = $(selectedPokemon).attr('value').toLowerCase() // different syntax
    $('.pokemon-img').attr('src', `https://img.pokemondb.net/artwork/${name}.jpg`)
    $('.pokemon-img').show()
  },
  editPokemon(selectedPokemon) {
    const placeholder = $(selectedPokemon.nextElementSibling)[0].innerHTML.split(',')
    $(selectedPokemon.nextElementSibling).hide()
    $(selectedPokemon).hide()
    let inputField = $(selectedPokemon.nextElementSibling.nextElementSibling)
    $(inputField).attr('placeholder', placeholder)
    inputField.show()
    const saveBtn = $(selectedPokemon.parentNode)[0].childNodes[1]
    $(saveBtn).show()
  },
  submitEdit(selectedPokemon) {
    const id = $(selectedPokemon).attr('value')
    const inputValue = ($(selectedPokemon).siblings('input')[0].value)
    const pokemonInfo = $(selectedPokemon).siblings('p')
    const info = inputValue.split(',')
    const updatedPokemonInfo = {
      id: $(selectedPokemon).attr('value'),
      name: info[0],
      pokedex: info[1],
      evolves_from: info[2],
      image: ''
    }
    pokemonInfo[0].innerHTML = inputValue
    $(selectedPokemon).siblings('input').hide()
    pokemonInfo.show()
    $(selectedPokemon).hide()
    $(selectedPokemon.nextElementSibling).show()
    CONTROLLER().updatedPokemon(id, updatedPokemonInfo)
  },
  deletePokemon(selectedPokemon) {
    const id = $(selectedPokemon).attr('value')
    $(selectedPokemon.parentNode).remove()
    CONTROLLER().deletePokemon(id)
  },
  resetInputs() {
  $('.submit-name').val('')
  $('.submit-pokedex').val('')
  $('.submit-evolves').val('')
  },
  renderData(pokemonCollection) {
    const pokemonArray = pokemonCollection.pokemon
    pokemonArray.forEach(pokemon => {
      $(".list-group").append(`
        <div class='list-item'>
          <button class='btn btn-info btn-sm btn-success' value=${pokemon._id}>Save</button>
          <button class='btn btn-info btn-sm btn-edit' value=${pokemon._id}>Edit</button>
          <p class='pokemon-info' value=${pokemon.name}>${pokemon.name}, ${pokemon.pokedex}, ${pokemon.evolves_from}</p>
          <input class='input-edit' type='text'/>
          <button class='btn btn-danger btn-sm btn-delete' value=${pokemon._id}>Delete</button>
        </div>
          `)
        })
      }
    }
