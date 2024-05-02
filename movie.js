/* config.js파일 import */
import config from "./config.js";
/* 선언한 API KEY 불러오기 */
const { API_KEY } = config

// 검색창 부분을 쉽게 찾을 수 있게 변수(formContainer)에 저장
const formContainer = document.querySelector("#form-container");
const cardContainer = document.querySelector("#cardContainer"); // 카드 컨테이너 참조

// 영화 사이트에서 정보를 가져올때 필요한 값들 모음
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzY1N2QxNjJkNDFmYjM3MTI5MzJiZTJjMDRjZjNlNiIsInN1YiI6IjY2MmM2NmEzYzNhYTNmMDEyNmZjNjk2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9nIjoxfQ.Z-F0fQmr3n-V7LtD3mKgQeSrzEaCpAMGco7rHyA0GxY",
  },
};

let movieMap = new Map();
let allMovies;

// 영화 정보 가져오기
fetch(
  `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`,
  options)
  .then((response) => response.json())
  .then((resdate) => {
    console.log(resdate);
    resdate.results.map((data) => {
      createMovie(data);
    });
    allMovies = resdate.results;
  })
  .catch((err) => console.error(err));

//영화 카드를 만드는 함수
function createMovie(data) {
  const movieId = data.id;
  const movieTitle = data.title;
  const movieAverage = data.vote_average;
  const moviePoster = data.poster_path;
  const movieOverview = data.overview;
  const movieRelease = data.release_date;

  let movieCard = document.createElement(`div`);
  movieCard.classList.add(`movieCard`);
  movieCard.setAttribute('data-movie-id', movieId); // 데이터 속성을 사용해 영화 ID 저장
  movieCard.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w300${moviePoster}"
        class="card-img-top" alt="${movieTitle}" title="${movieTitle}">
    <div class="card-body">
        <h3 class="move-text">${movieTitle}</h3>
        <p class="move-text">${movieOverview}</p>
        <p>${movieAverage} / 10</p>
        <p>${movieRelease}</p>
    </div>`;
  cardContainer.append(movieCard);
  movieMap.set(movieTitle, movieCard);
}

// 카드 컨테이너에 이벤트 리스너를 추가하여 이벤트 위임 사용
cardContainer.addEventListener('click', (event) => {
  const movieCard = event.target.closest('.movieCard');
  if (movieCard) {
    const movieId = movieCard.getAttribute('data-movie-id');
    alert(`선택하신 영화의 id는 ${movieId}입니다.`);
  }
});

const searchInput = document.querySelector(`#search-input`);
const searchButton = document.querySelector(`.form-button`);

function movieSearch() {
  const text = searchInput.value.trim().toLowerCase();
  allMovies.forEach((data) => {
    let movieTitle = data.title;
    if (movieTitle.toLowerCase().includes(text)) {
      movieMap.get(movieTitle).style.display = `block`;
    } else {
      movieMap.get(movieTitle).style.display = `none`;
    }
  });
}

searchButton.addEventListener("click", (e) => {
  movieSearch();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    movieSearch();
  }
});

searchInput.addEventListener("keyup", (event) => {
  movieSearch();
});

formContainer.addEventListener("submit", function (e) {
  e.preventDefault();
});

searchInput.focus();