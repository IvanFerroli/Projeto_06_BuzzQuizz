let requisicaoGetQuizz;
let requisicaoGetQuizzID;
let idSelecionado;
const lugarQuiz = document.querySelector(".quiz-servidor");
let primeiraTela = document.querySelector(".corpo-app");
let segundaTela = document.querySelector(".exibicao-quiz");
let corpoApp2 = document.querySelector(".corpo-app-tela2");
let containerBotoesTela2;
let cardResultado;
let terceiraTela1 = document.querySelector(".criacao-quizz");
let todasPerguntas;
let respostasRenderizadasArray = [];
let numeroRespostasSelecionadas = 0;
let numeroRespostaCertas = 0;
let porcentagemAcertos;
let resultadosPossiveisArray = [];
let resultadosPossiveisArrayDiv = [];
let nivelARenderizar;
function embaralhador() {
  return Math.random() - 0.5;
}
const containerAlternativas = document.querySelectorAll(
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
      <div id="gradiente" class="quiz-content id${id}" onclick="mudarTelaQuizz(this)" data-identifier="quizz-card">
        <img src="${imagem}" alt="error">
        <span>${titulo}</span>
      </div>`;
}
function mudarTelaQuizz(quiz) {
  let idSelecionadoStr = quiz.className;

  idSelecionadoStr = quiz.className.replace(" ", "");

  idSelecionado = idSelecionadoStr.replace("quiz-contentid", "");
  console.log(idSelecionado);

  lugarQuiz.innerHTML = "";

  primeiraTela.classList.add("escondido");

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
      const caixaPergunta = document.querySelectorAll(".caixa-de-pergunta");
      caixaPergunta[i].style.backgroundColor = colorQuestion;

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
    for (let j = 0; j < dadosExibicao.levels.length; j++) {
      let tituloNiveis = dadosExibicao.levels[j].title;
      let imagemNiveis = dadosExibicao.levels[j].image;
      let textoNiveis = dadosExibicao.levels[j].text;
      let minValueNiveis = dadosExibicao.levels[j].minValue;
      resultadosPossiveisArray.push({
        titulo: tituloNiveis,
        imagem: imagemNiveis,
        texto: textoNiveis,
        minValue: minValueNiveis,
      });
      resultadosPossiveisArrayDiv.push(
        RenderizarQuizResultado(
          tituloNiveis,
          imagemNiveis,
          textoNiveis,
          minValueNiveis
        )
      );
    }
  });
}

function RenderizarQuizExibicaoGeral(title, imagem) {
  return `<div id="gradiente" class="banner">
            <img src="${imagem}" alt="error">
            <span>${title}</span>
          </div>
          `;
}
function RenderizarQuizExibicaoPergunta(title) {
  return ` 
          <div class="caixa-de-pergunta" data-identifier="question">
            <span>${title}</span>
          </div>
          <div class="container-alternativas"></div>`;
}
function RenderizarQuizExibicaoRespostas(texto, isCorrect, imagem) {
  return `
            <div class="alternativa ${isCorrect}" onclick="addSelecionado(this)" data-identifier="answer">
              <img src="${imagem}" alt = "error"/>
              <div id="span">
                <span>${texto}</span>
              </div>
              </div>
              `;
}

function RenderizarQuizResultado(nivel, imagem, texto) {
  return `<div class="nivel-resultado">
            <span>${nivel}</span>
          </div>
          <img src="${imagem}" alt = "erro"/>
          <div class="texto-resultado">
            ${texto}
          </div>`;
}

function addSelecionado(respostaquiz) {
  respostaquiz.classList.add("selecionado");
  respostaquiz.removeAttribute("onclick");
  if (respostaquiz.className.includes("true")) {
    respostaquiz.style.color = "#009C22";
  } else {
    respostaquiz.style.color = "#FF4B4B";
  }

  numeroRespostasSelecionadas += 1;

  setTimeout(scrollaProximaPergunta, 2000, numeroRespostasSelecionadas);

  checarNumeroPerguntas(numeroRespostasSelecionadas);
  const containerThis = respostaquiz.parentElement;

  for (let i = 0; i < containerThis.children.length; i++) {
    respostaNaoSelecionada = containerThis.children[i];
    if (respostaNaoSelecionada.className.includes("selecionado") === false) {
      respostaNaoSelecionada.classList.add("branco");
      respostaNaoSelecionada.removeAttribute("onclick");
      if (respostaNaoSelecionada.className.includes("true")) {
        respostaNaoSelecionada.style.color = "#009C22";
      } else {
        respostaNaoSelecionada.style.color = "#FF4B4B";
      }
    } else {
      continue;
    }
  }
}
function scrollaProximaPergunta(indexResposta) {
  todasPerguntas = document.querySelectorAll(".card-pergunta");
  cardResultado = document.querySelector(".card-resultado");
  if (todasPerguntas[indexResposta] === undefined) {
    cardResultado = document.querySelector(".card-resultado");
    cardResultado.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  } else {
    todasPerguntas[indexResposta].scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }
}
function checarNumeroPerguntas(numeroResposta) {
  todasPerguntas = document.querySelectorAll(".card-pergunta");
  let pegarCaixaBotao = document.querySelector(".container-botoes-tela2");
  let pegarCaixaResultado = document.querySelector(".card-resultado");
  if (numeroResposta === todasPerguntas.length) {
    calculaResultado();

    pegarCaixaBotao.classList.remove("escondido");

    pegarCaixaResultado.classList.remove("escondido");
  }
  return;
}
function calculaResultado() {
  let pegarTodasRespostasSelecionadas =
    document.querySelectorAll(".selecionado");
  for (let i = 0; i < pegarTodasRespostasSelecionadas.length; i++) {
    if (pegarTodasRespostasSelecionadas[i].className.includes(true)) {
      numeroRespostaCertas += 1;
    }
  }
  let numeroPerguntas = document.querySelectorAll(".card-pergunta");

  let calcula = (numeroPerguntas, numeroAcertos) => {
    let porcentagemAcertos = (numeroAcertos / numeroPerguntas) * 100;
    porcentagemAcertos = Math.ceil(porcentagemAcertos);
    return porcentagemAcertos;
  };
  porcentagemAcertos = calcula(numeroPerguntas.length, numeroRespostaCertas);

  let comparaResultado = (array, porcentagem) => {
    for (let i = 0; i < array.length; i++) {
      if (i === array.length - 1) {
        return i;
      }
      if (
        array[i].minValue < porcentagem &&
        array[i + 1].minValue > porcentagem
      ) {
        return i;
      } else {
        continue;
      }
    }

    //Pegar o resultado comparar no array com os objetos e chamar a tela.
  };

  cardResultado = document.querySelector(".card-resultado");

  cardResultado.innerHTML =
    resultadosPossiveisArrayDiv[
      comparaResultado(resultadosPossiveisArray, porcentagemAcertos)
    ];
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

function abreTerceiraTela() {
  primeiraTela.classList.add("escondido");
  terceiraTela1.classList.remove("escondido");
}

function voltandoHome() {
  primeiraTela.classList.remove("escondido");
  corpoApp2.innerHTML = "";
  numeroRespostasSelecionadas = 0;
  segundaTela.classList.add("escondido");
  comecarApp();
  containerBotoesTela2 = document.querySelector(".container-botoes-tela2");
  containerBotoesTela2.classList.add("escondido");

  cardResultado.classList.add("escondido");
}

function reniciarQuizzExibiciao() {
  corpoApp2.innerHTML = "";
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
      const caixaPergunta = document.querySelectorAll(".caixa-de-pergunta");
      caixaPergunta[i].style.backgroundColor = colorQuestion;

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
  numeroRespostasSelecionadas = 0;
  numeroRespostaCertas = 0;
  containerBotoesTela2 = document.querySelector(".container-botoes-tela2");
  containerBotoesTela2.classList.add("escondido");

  cardResultado.classList.add("escondido");
}
