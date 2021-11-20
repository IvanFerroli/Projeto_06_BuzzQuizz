let requisicaoGetQuizz;
let requisicaoGetQuizzID;
const lugarQuiz = document.querySelector(".quiz-servidor");

const comecarApp = () => {
  requisicaoGetQuizz = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
  );

  requisicaoGetQuizz.then((resposta) => {
    let dados = resposta.data;
    for (let i = 0; i < dados.length; i++) {
      let id = dados[i].id;
      let titulo = dados[i].title;
      let imagem = dados[i].image;

      lugarQuiz.innerHTML += RenderizarQuiz(id, titulo, imagem);
      /* let urlImage = document.querySelector(`.id${id}`);
      urlImage.style.backgroundImage = "url(" + imagem + ")"; */
    }
  });
};
comecarApp();

function RenderizarQuiz(id, titulo, imagem) {
  return `
      <div class="quiz-content id${id}" onclick="mudarTelaQuizz(this)">
        <img src="${imagem}" alt="error">
        <div id="insideTextSpan">${titulo}</div>
      </div>`;
}
function mudarTelaQuizz(quiz) {
  let idSelecionadoStr = quiz.className;

  idSelecionadoStr = quiz.className.replace(" ", "");

  let idSelecionado = idSelecionadoStr.replace("quiz-contentid", "");
  console.log(idSelecionado);

  lugarQuiz.innerHTML = "";

  let fechandoPrimeiraTela = document.querySelector(".corpo-app");
  fechandoPrimeiraTela.classList.add("escondido");
  let segundaTela = document.querySelector(".exibicao-quiz");
  segundaTela.classList.remove("escondido");

  requisicaoGetQuizzID = axios.get(
    `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idSelecionado}`
  );
  requisicaoGetQuizzID.then((resposta) => {
    //transformando a resposta em uma variavel para utilizar posteriormente
    let dadosExibicao = resposta.data;
    //titulo e imagem do quiz
    let title = dadosExibicao.title;
    let imagem = dadosExibicao.image;

    //local para deploy do quiz
    const corpoApp2 = document.querySelector(".corpo-app-tela2");

    corpoApp2.innerHTML += RenderizarQuizExibicaoGeral(title, imagem);

    for (let i = 0; i < dadosExibicao.questions.length; i++) {
      let titleQuestion = dadosExibicao.questions[i].title;
      let colorQuestion = dadosExibicao.questions[i].color;
      let cardPergunta = document.querySelector(".card-pergunta");
      console.log(cardPergunta);

      cardPergunta.innerHTML += RenderizarQuizExibicaoPergunta(
        titleQuestion,
        colorQuestion
      );
      let trocaCor = (color) => {
        let caixaPergunta = document.querySelector(".caixa-de-pergunta");
        caixaPergunta.style.backgroundColor = color;
      };
      trocaCor(colorQuestion);
      for (let j = 0; j < dadosExibicao.questions[i].answers.length; j++) {
        let titleAnswer = dadosExibicao.questions[i].answers[j].title;
        let imageAnswer = dadosExibicao.questions[i].answers[j].image;
        let isCorrectAnswer =
          dadosExibicao.questions[i].answers[j].isCorrectAnswer;
        let containerAlternativas = document.querySelector(
          ".container-alternativas"
        );
        containerAlternativas.innerHTML += RenderizarQuizExibicaoRespostas(
          titleAnswer,
          isCorrectAnswer,
          j
        );
        let respostaRenderizada = document.querySelector(
          `.alternativa${j} .alternativa`
        );
        respostaRenderizada.style.backgroundImage = "url(" + imageAnswer + ")";
      }
    }
    /* const cardsParaBaixo = document.querySelector(".parrot-place");

    arrayComCartas.sort(embaralhador); */
    /* for (let i = 0; i < dadosExibicao.levels.length; i++) {
      console.log(
        `No nivel ${i + 1} o titulo eh : ${dadosExibicao.levels[i].title} `
      );
      console.log(
        ` No nivel ${i + 1} temos a imagem : ${dadosExibicao.levels[i].image}`
      );
      console.log(
        ` No nivel ${i + 1} temos o texto : ${dadosExibicao.levels[i].text}`
      );
      console.log(
        ` No nivel ${i + 1} temos o minValue : ${
          dadosExibicao.levels[i].minValue
        }`
      );
    } */
  });
}
function RenderizarQuizExibicaoGeral(title, imagem) {
  return `<div class="banner">
            <<img src="${imagem}" alt="error">
            <div id="titleSpan">${title}</div>
          </div>`;
}
function RenderizarQuizExibicaoPergunta(title) {
  return ` 
          <div class="caixa-de-pergunta">${title}</div>
          <div class="container-alternativas">
          `;
}
function RenderizarQuizExibicaoRespostas(texto, isCorret, j) {
  return `
            <div class="alternativa${j}">
              <div class="alternativa ${isCorret}"></div>
              <span>${texto}</span>
            </div>`;
}

function RenderizarQuizResultado(nivel, imagem, texto) {
  //let urlImagemResultado = document.querySelector("imagem-resultado")
  return `<div class="nivel-resultado">
            ${nivel}
          </div>
          <div class="imagem-resultado"></div>
          <div class="texto-resultado">
            ${texto}
          </div>`;
}

/* promisse.then((resposta) => {
  


    for (let i = 0; i < resposta.data.length; i++) {
        console.log("o id eh :" + resposta.data[i].id);


    console.log("o titulo do quizz eh" + resposta.data[i].title);
    console.log("o link da imagem eh" + resposta.data[i].image);
    console.log("as perguntas do quizz sao :");
    console.log(resposta.data[i].questions);
    console.log("o level eh :");
    console.log(resposta.data[i].levels);



        for (let x = 0; x < resposta.data[i].questions.length; x++) {
            console.log(
                `o titulo da pergunta ${x + 1} eh :  ${
          resposta.data[i].questions[x].title
        }`
            );
            console.log(
                `a cor da pergunta ${x + 1} eh :  ${
          resposta.data[i].questions[x].color
        }`
            );
            for (let n = 0; n < resposta.data[i].questions[x].answers.length; n++) {
                console.log(
                    `O texto da resposta ${n + 1} da pergunta ${x + 1} eh :
            ${resposta.data[i].questions[x].answers[n].text}`
                );
                console.log(
                    `A image, da resposta ${n + 1} da pergunta ${x + 1} eh : 
            ${resposta.data[i].questions[x].answers[n].image}`
                );
                console.log(
                    `O isCorrectAnswer da resposta ${n + 1} da pergunta ${x + 1} eh : 
            ${resposta.data[i].questions[x].answers[n].isCorrectAnswer}`
                );
            }
        }
        for (let x = 0; x < resposta.data[i].levels.length; x++) {
            console.log(
                `No nivel ${x + 1} o titulo eh : ${resposta.data[i].levels[x].title} `
            );
            console.log(
                ` No nivel ${x + 1} temos a imagem : ${
          resposta.data[i].levels[x].image
        }`
            );
            console.log(
                ` No nivel ${x + 1} temos o texto : ${resposta.data[i].levels[x].text}`
            );
            console.log(
                ` No nivel ${x + 1} temos o minValue : ${
          resposta.data[i].levels[x].minValue
        }`
            );
        }
    }
});
 */
//Funcoes de validacao
function validacaoInfBasicaTitulo(input) {
  if (input.value.length < 20 || input.value.length > 65) {
    return false;
  }
  return true;
}
function validacaoInfBasicaURL(input) {
  const regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(input.value)) {
    return;
  }
  return false;
}

function validacaoInfBasicaPergunta(input) {
  if (input.value > 3) {
    return true;
  }

  return false;
}

function validacaoInfBasicaNivel(input) {
  if (input.value >= 2) {
    return true;
  }
  return false;
}

function validacaoInfPerguntasTexto(input) {
  if (input.value.length >= 20) {
    return;
  }
  return false;
}
function validacaoInfPerguntasCor(input) {
  const regexp = /^#[0-9A-F]{6}$/;
  if (regexp.test(input)) {
    return true;
  }
  return false;
}

function validacaoInfPerguntasTextoResp(input) {
  if (input.value !== "") {
    return true;
  }
  return false;
}

function validacaoInfPerguntasURL(input) {
  const regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(input.value)) {
    return true;
  }
  return false;
}

function validacaoInfNiveisTitulo(input) {
  if (input.value.length >= 10) {
    return true;
  }
  return false;
}

function validacaoInfNiveisPorc(input) {
  if (input.value < 100 || input.value > 0) {
    return true;
  }
  return false;
}

function validacaoInfNiveisURL(input) {
  const regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(input.value)) {
    return true;
  }
  return false;
}

function validacaoInfNiveisDescri(input) {
  if (input.value.length > 29) {
    return true;
  }
  return false;
}
