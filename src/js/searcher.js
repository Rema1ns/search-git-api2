//==================================================== ПЕРЕМЕННЫЕ ИЗ DOMa
const searchWrapper = document.querySelector('.search-input')
const suggBox = document.querySelector('.autocom-box')
const value = document.querySelector('#myInput');
const selectedList = document.querySelector('.selected-list__content');


//================================================== DEBOUNCE
const debounce = (fn, debounceTime) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn.apply(this, args), debounceTime)
    }
};
const debRep = debounce(getRepo, 400)

//=================================================== ОБРАБОТЧИК ПО ПОИСКУ РЕПОЗИТОРИЕВ
value.addEventListener('keyup', (e) => {
    if (e.keyCode == '32') {

    } else {
        debRep(value.value)
        console.log(value.value)
    }
})
//============================================ ОСНОВНАЯ ФУНКЦИЯ
async function getRepo(text = '') {
    const response = await fetch(`https://api.github.com/search/repositories?q=${text}&per_page=5`);
    const data = await response.json();
    console.log(data);

    suggBox.insertAdjacentHTML('afterbegin',
                    '<li>'+ data.items[0].name + '</li>' + '\n'
                       +'<li>'+ data.items[1].name + '</li>' + '\n'
                       +'<li>'+ data.items[2].name + '</li>' + '\n'
                       +'<li>'+ data.items[3].name + '</li>' + '\n'
                       +'<li>'+ data.items[4].name + '</li>' + '\n');
    searchWrapper.classList.add('active');

    let allList = suggBox.querySelectorAll('li');
    for (let i = 0; i< allList.length; i++) {
        allList[i].addEventListener('click', (e) => {
            value.value = ''
            suggBox.innerHTML = '';
            selectedList.insertAdjacentHTML('afterbegin',
            `<li class = 'selected-list__item'>
                name: ${data.items[i].name} <br>
                owner: ${data.items[i].owner.login} <br>
                stars: ${data.items[i].stargazers_count} <br>
                <button class = 'selected-list__remove-button'>x</button> 
        </li>`);
            searchWrapper.classList.remove('active');
        })
    }

    function removeItem(evt) {
        if (evt.target.className === 'selected-list__remove-button') {
            evt.target.closest('.selected-list__item').remove();
        }
    }
    selectedList.addEventListener('click', removeItem);
}
