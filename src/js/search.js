const resultsArea = document.querySelector(".results__container")
const searchArea = document.querySelector("#options__search")
const optGroupResults = document.querySelector(".options__context-menu")
const optContainer = document.querySelector(".options__container")

let textInput
let arrOptions = []

const debounce = (fn, debounceTime) => {
  let timer
  return function(...args){
    const fnCall = () => fn.apply(this, args)
    clearTimeout(timer)
    timer = setTimeout(fnCall,debounceTime)
  }
}

function createTemplateOption(elem) {
  const option = document.createElement("option")
  option.dataset.name = elem.name
  option.dataset.owner = elem.owner
  option.dataset.stars = elem.stars
  option.textContent = elem.name
  return option
}

function createOptions(arr) {
  if (optContainer.children.length === 0) {
    for (let i = 0; i < 5; i++) {
      optContainer.appendChild(createTemplateOption(arr[i]))
    }
  }
  else {
    for (let i = 0; i < 5; i++) {
      optContainer.replaceChild(createTemplateOption(arr[i]), optContainer.childNodes[i])
    }
  }
}

function getRequest(text) {
  const xhr = new XMLHttpRequest()
  xhr.open("GET",`https://api.github.com/search/repositories?q=${text}`)
  xhr.setRequestHeader("Accept", "application/vnd.github.v3+json")
  xhr.send()
  xhr.onload = function() {
    let parsedResponse = JSON.parse(xhr.response)
    arrOptions = []
    for (let elem of Object.values(parsedResponse.items)){
      let repository = {}
      repository.name = elem.name
      repository.stars = elem.stargazers_count
      repository.owner = elem.owner.login
      arrOptions.unshift(repository)
      optGroupResults.style.display = "block"
    }
    createOptions(arrOptions)
  }
}

let debGetRequest = debounce(getRequest, 400)

function createTemplateResult(element){
  const fragment = document.createDocumentFragment()
  const repository = document.createElement("div")
  repository.classList.add("option_created")
  const nameRepository = document.createElement("p")
  nameRepository.textContent = `Name: ${element.dataset.name}`
  const ownerRepository = document.createElement("p")
  ownerRepository.textContent = `Owner: ${element.dataset.owner}`
  const starsRepository = document.createElement("p")
  starsRepository.textContent = `Stars: ${element.dataset.stars}`
  const deleteButton = document.createElement('img')
  deleteButton.src = "./img/del.png"
  deleteButton.classList.add("btn_delete")
  deleteButton.onclick = function(){
    resultsArea.removeChild(repository)
  }
  repository.appendChild(nameRepository)
  repository.appendChild(ownerRepository)
  repository.appendChild(starsRepository)
  repository.appendChild(deleteButton)
  fragment.appendChild(repository)
  return fragment
}

searchArea.addEventListener("keyup", (e) => {
  textInput = e.target.value
  debGetRequest(textInput)
})

optGroupResults.addEventListener("click", (e) => {
  let target = e.target
  let arrRepositories = Array.from(resultsArea.children)
  arrRepositories.push(createTemplateResult(target))

  arrRepositories.forEach(elem => {
    if (resultsArea.children.length < 3){
      resultsArea.appendChild(elem)
    }
  })
  searchArea.value = ""
  optGroupResults.style.display = "none"
})



