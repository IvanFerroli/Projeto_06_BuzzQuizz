let requisicaoGetQuizz;
let requisicaoGetQuizzID;
const lugarQuiz = document.querySelector(".quiz-servidor");
let respostasRenderizadasArray = [];
function embaralhador() {
  return Math.random() - 0.5;
}
let containerAlternativas = document.querySelectorAll(
  ".container-alternativas"
);

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
        <img class="gradiente"src="${imagem}" alt="error">
        <span>${titulo}</span>
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

      const geraCardPergunta = () => {
        return ` <div class="card-pergunta"></div>`;
      };
      corpoApp2.innerHTML += geraCardPergunta();

      const cardPergunta = document.querySelectorAll(".card-pergunta");

      cardPergunta[i].innerHTML +=
        RenderizarQuizExibicaoPergunta(titleQuestion);

      /* let trocaCor = (color, i) => {
        const caixaPergunta = document.querySelectorAll(".caixa-de-pergunta");
        caixaPergunta[i].style.backgroundColor = color;
        console.log(caixaPergunta);

        console.log(color, i);
        caixaPergunta.style.backgroundColor = color;
      };
      trocaCor(colorQuestion, i); */
      for (let j = 0; j < dadosExibicao.questions[i].answers.length; j++) {
        let titleAnswer = dadosExibicao.questions[i].answers[j].text;
        let imageAnswer = dadosExibicao.questions[i].answers[j].image;
        let isCorrectAnswer =
          dadosExibicao.questions[i].answers[j].isCorrectAnswer;

        respostasRenderizadasArray.push(
          RenderizarQuizExibicaoRespostas(
            titleAnswer,
            isCorrectAnswer,

            imageAnswer
          )
        );
      }
      let containerAlternativas = document.querySelectorAll(
        ".container-alternativas"
      );
      respostasRenderizadasArray.sort(embaralhador);
      for (let j = 0; j < respostasRenderizadasArray.length; j++) {
        containerAlternativas[i].innerHTML += respostasRenderizadasArray[j];
      }

      respostasRenderizadasArray = [];
    }
  });
}

function RenderizarQuizExibicaoGeral(title, imagem) {
  return `<div class="banner gradiente">
            <img src="${imagem}" alt="error">
            <span>${title}</span>
          </div>
          `;
}
function RenderizarQuizExibicaoPergunta(title) {
  return ` 
          <div class="caixa-de-pergunta">
            <span>${title}</span>
          </div>
          <div class="container-alternativas"></div>
          // <div class="caixa-de-pergunta">
          //   <span>${title}</span>
          // </div>
          // <div class="container-alternativas">
          //   <div class="grid-container">
          //     <div class="grid-item">
          //       <span>Sapo gordo</span>
          //     </div>  . 
          //   </div>
          // </div>
          `;
}
function RenderizarQuizExibicaoRespostas(texto, isCorrect, imagem) {
  return `
            <div class="alternativa ${isCorrect}" onClick="addSelecionado(this)">
              <img src="${imagem}" alt = "error"/>
            </div>
            <span>${texto}</span>`;
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

function addSelecionado(respostaquiz) {
  respostaquiz.classList.add("selecionado");
  respostaquiz.removeAttribute("onClick");
  let containerThis = respostaquiz.parentElement;
  console.log(containerThis);
  console.log(containerThis.nodeName);
  console.log(containerThis.length);
  for (let i = 0; i < containerThis.length; i++) {
    let respostaNaoSelecionada = document.querySelector(".alternativa");
    if (respostaNaoSelecionada.classList.contains("selecionada")) {
      respostaNaoSelecionada.classList.add("branco");
      respostaNaoSelecionada.removeAttribute("onClick");
    }
  }
}

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
