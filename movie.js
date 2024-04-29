import config from "./config.js";
const { API_KEY } = config

// 검색창 부분을 쉽게 찾을 수 있게 변수(formContainer)에 저장
const formContainer = document.querySelector("#form-container");

// 영화 사이트에서 정보를 가져올때 필요한 값들 모음
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzY1N2QxNjJkNDFmYjM3MTI5MzJiZTJjMDRjZjNlNiIsInN1YiI6IjY2MmM2NmEzYzNhYTNmMDEyNmZjNjk2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Z-F0fQmr3n-V7LtD3mKgQeSrzEaCpAMGco7rHyA0GxY",
  },
};

//map 선언
// 영화 정보를 저장하는 map 생성 movieMap (제목 , 영화 카드)
let movieMap = new Map();
// 전체 영화 목록 정보
let allMovies; 

// 영화 정보 가져오기
fetch(
  `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`, // 영화 정보 사이트 주소
  options // 필요한 인증 정보
) // 연결이 됨 > 이후 진행
  .then((response) => response.json()) // 접속 한 후 받은 정보를 json 형식으로 변환
  .then((resdate) => { //응답받은 데이터 확인과정 시작
    console.log(resdate); //응답받은 데이터를 콘솔에 출력
    resdate.results.map((data) => { //응답받은 데이터를 하나씩 확인하여 createMovie 함수에 넣어줌
      createMovie(data); //createMovie 함수에 data를 넣어줌
    });
    allMovies = resdate.results; //응답받은 데이터를 allMovies에 넣어줌 백업용도로 똑같이 저장
  })
  .catch((err) => console.error(err)); // 만약에 사이트 연결이 실패하면 실패한 이유를 알려줌

//영화 카드를 만드는 함수
function createMovie(data) {
  // 카드 영역 부분을 쉽게 찾을 수 있게 변수(cardContainer)에 저장
  const cardContainer = document.querySelector("#cardContainer");

  //아이디 속성 불러오기
  const movieId = data.id; // 사이트에서 응답받은 값 중에 영화 아이디 값을 저장
  const movieTitle = data.title; // 사이트에서 응답받은 값 중에 영화 제목 값을 저장
  const movieAverage = data.vote_average; // 사이트에서 응답받은 값 중에 영화 평점 값을 저장
  const moviePoster = data.poster_path; // 사이트에서 응답받은 값 중에 영화 포스터 이미지 경로 값을 저장
  const movieOverview = data.overview; // 사이트에서 응답받은 값 중에 영화 설명 값을 저장
  const movieRelease = data.release_date; // 사이트에서 응답받은 값 중에 영화 개봉일 값을 저장

  // div 생성
  // 영화 카드를 만들어주는 div 생성
  let movieCard = document.createElement(`div`); // <div></div>

  // class 이름 부여
  movieCard.classList.add(`movieCard`); // <div class="movieCard">     innerHTML    </div>
  movieCard.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w300${moviePoster}"
        class="card-img-top" alt="${movieTitle}" title="${movieTitle}">
    <div class="card-body">
        <h3 class="move-text">${movieTitle}</h3>
        <p class="move-text">${movieOverview}</p>
        <p>${movieAverage} / 10</p>
        <p>${movieRelease}</p>
    </div>`; 
    /*
    <div class="movieCard">
      <img src="https://image.tmdb.org/t/p/w300${moviePoster}" class="card-img-top" alt="...">
      <div class="card-body">
        <h3 class="move-text">${movieTitle}</h3>
        <p class="move-text">${movieOverview}</p>
        <p>${movieAverage} / 10</p>
        <p>${movieRelease}</p>
      </div>
    </div>
    */
  cardContainer.append(movieCard); // 위에서 추가한 div를 cardContainer 뒷부분에 덧붙여서 추가

  //제목, 카드 값을 set 넣어줌
  // 검색을 위해서 movieMap에 영화 제목과 영화 카드를 저장
  movieMap.set(movieTitle, movieCard);
  //영화 카드를 클릭하면 영화 아이디가 나오도록 함
  // function(events){}  >>>>    (events) => {}
  movieCard.addEventListener(`click`, () => { //moviceCard에 이벤트를 추가
    alert(`선택하신 영화의 id는 ${movieId}입니다.`);
  });
  /*
  <div class="movieCard" onClick="alert(`선택하신 영화의 id는 ${movieId}입니다.`);">
    <img src="https://image.tmdb.org/t/p/w300${moviePoster}" class="card-img-top" alt="...">
    <div class="card-body">
      <h3 class="move-text">${movieTitle}</h3>
      <p class="move-text">${movieOverview}</p>
      <p>${movieAverage} / 10</p>
      <p>${movieRelease}</p>
    </div>
  </div>
  */
}

// 검색 입력창 부분을 쉽게 찾을 수 있게 변수(searchInput)에 저장
const searchInput = document.querySelector(`#search-input`);
// 검색버튼 부분을 쉽게 찾을 수 있게 변수(searchButton)에 저장
const searchButton = document.querySelector(`.form-button`);

// 영화를 검색하는 함수
function movieSearch() {
  const text = searchInput.value.trim().toLowerCase(); // 검색창에 입력한 값을 소문자로 변환하여 저장
  allMovies.forEach((data) => { // 아까 사이트에서 응답받고 저장한 값을 가지고 다시 출력시작
    let movieTitle = data.title; // 영화제목을 추출하여 저장
    if (movieTitle.toLowerCase().includes(text)) { // 영화제목 소문자로 변환후에 검색창에 입력한 값이 포함되어있는지 확인
      console.log("출력"); // 확인이 되면 콘솔에 "출력" 이라고 메시지
      movieMap.get(movieTitle).style.display = `block`; // movieMap에서 영화제목으로 div요소를 선택하고 style태그에서 display속성을 block으로 바꿔서 보이게 함
    } else {
      movieMap.get(movieTitle).style.display = `none`; // movieMap에서 영화제목으로 div요소를 선택하고 style태그에서 display속성을 none 바꿔서 숨기게 함
    }
  });
}

//영화검색 버튼을 눌렀을때 movieSearch 함수 실행
searchButton.addEventListener("click", (e) => {
  movieSearch();
});

// 검색 입력창에서 엔터키가 눌렸을때 movieSearch 함수 실행
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // 폼이 전송되는 것을 막음 // form 이 input에서 엔터를 누르면 자동으로 전송을 함 < 이걸 막음 // 새로고침을 막음
    movieSearch();
  }
});

searchInput.addEventListener("keyup", (event) => {
  movieSearch();
});

formContainer.addEventListener("submit", function (e) {
  e.preventDefault(); // 폼이 전송되는 것을 막음 // form 이 input에서 엔터를 누르면 자동으로 전송을 함 < 이걸 막음 // 새로고침을 막음
});

// 페이지가 처음 로딩되고 이 함수가 실행되면, 검색 입력창에 테두리를 표시하고 강조되도록 해줌 // 유저가 오자마자 키보드로 바로 검색 할 수 있게 도와줌
searchInput.focus();
