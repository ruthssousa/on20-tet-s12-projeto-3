const main = document.getElementById('main-content');
const input = document.querySelector('.search-input');
const button = document.querySelector('.search-button');

button.addEventListener("click", (event) => {
  event.preventDefault()
  const username = input.value.trim()
  username ? getGitHubUser(username) : alert("Digite uma usuária válida!")
  input.value = ""
})

getGitHubUser = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    const userData = await response.json()
    if (response.status == 404) {
      renderUserNotFound();
    } else if (response.status == 200) {
      createCard(userData)
    }
  }
  catch(err) {
    console.error("Capturei um erro: ",err)
  }
}

createCard = (user) => {
  const { avatar_url, name, login, bio, followers, public_repos, html_url  } = user
  main.innerHTML = `
    <div class='card'>
      <a href=${html_url} target="_blank"><img class='profile-img' src=${avatar_url} alt="foto da usuária no github"></a>
      <h2 class='profile-title'>${name}</h2>
      <h4 class='profile-subtitle'>${login}</h4> 
      <p class='profile-description'>${bio ? bio : ""}</p>
      <div class='profile-infos'>
        <div class='info-box'>
          <img src='../assets/people_outlineRoxa.png' class='box-icon'>
          <p class='box-text'>${followers}</p>
        </div>
        <a class='link-repositories'>
          <div class='info-box'>
            <img src='../assets/VectorRoxa.png' class='box-icon'>
            <p class='box-text'>${public_repos}</p>
          </div> 
        </a>
      </div>
    </div>
  `
  const linkRepositories = document.querySelector('.link-repositories')
  
  linkRepositories.addEventListener('click', clickLink = (event) => {
    event.preventDefault()
    getRepositories(login) 
    // SOLUÇÃO DO BUG QUE IMPEDE DE REALIZAR A REQUISIÇÃO NOVAMENTE 
    linkRepositories.removeEventListener('click', clickLink) 
  })
}

getRepositories = async (username) => {
  try {
    // sugestão extra - verificar conteúdo do innerHTML da repositoriesList antes do fetch()
    const response = await fetch(`https://api.github.com/users/${username}/repos`)
    const repositories = await response.json()
    if(repositories.length > 0) {
      createRepositoriesCards(repositories)
    } else {
      renderNotFoundRepositories(username)
    }
  }
  catch(err) {
    console.error("Capturei um erro: ",err)
  }
}

createRepositoriesCards = (repositories) => { 

  const repositoriesList = document.createElement('div')
  repositoriesList.setAttribute('id', 'repositories-list')
  main.appendChild(repositoriesList) 

  // SOLUÇÃO DO BUG QUE PERMITE ATUALIZAR O CONTEÚDO DOS REPOSITÓRIOS: 
  // let repositoriesList = document.getElementById('repositories-list')
  // if(!repositoriesList) {
  //   repositoriesList = document.createElement('div') 
  //   repositoriesList.setAttribute('id', 'repositories-list')
  //   main.appendChild(repositoriesList)
  // } else {
  //   repositoriesList.innerHTML = ""
  // }

  repositories.forEach((repository) => {
    const { name, description, language, stargazers_count } = repository
    return repositoriesList.innerHTML += `
      <div class='repository'>
        <h2 class='repository-title'>${name}</h2>
        <p class='repository-description'>${description ? description : ""}</p> 
        <div class='repository-details'>
          <p class='repository-text'>${language ? language : "não-definida"}</p>
          <p class='repository-icon'>
            <img src="../assets/starRoxa.png">
            ${stargazers_count}
          </p>
        </div>
      </div>
    `
  })
}

renderNotFoundRepositories = (username) => main.innerHTML += `<div class='not-found-repositories'><h2 class='not-found-subtitle'>${username} não possui nenhum repositório público ainda.</h2></div>`

renderUserNotFound = () => {
  return main.innerHTML = `
    <div class='not-found-box'>
      <h2 class='not-found-title'>Usuária não encontrada 😖</h2>
      <h4 class='not-found-subtitle'>Pesquise novamente</h4>
      <img class='not-found-img' src='../assets/notfound.png'>
    </div>
  `
}


// caso queira atualizar -> permitir o evento, permitir que a chamada http acontecer, substituir o conteúdo que já existe

// caso queira impossibilitar que seja feita novamente a renderização dos repositórios -> pode impedir o evento, pode impedir a chamada http ou pode impedir uma nova renderização
