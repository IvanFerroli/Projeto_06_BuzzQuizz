let promisse;
promisse = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

promisse.then((resposta) => {
  console.dir(resposta.data);

  for (let i = 0; i < resposta.data.length; i++) {
    console.log("o id eh :" + resposta.data[i].id);

    console.log("o titulo do quizz eh" + resposta.data[i].title);
    console.log("o link da imagem eh" + resposta.data[i].image);
    console.log("as perguntas do quizz sao :");
    console.log(resposta.data[i].questions);
    console.log("o level eh :");
    console.log(resposta.data[i].levels);
    /* console.log(
      "o tamanho do array de perguntas eh: " + resposta.data[i].questions.length
    ); */

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

//Funcoes de validacao
function validacaoInfBasicaTitulo(input) {
  if (input.value.length < 20 || input.value.length > 65) {
    return false;
  } else {
    return true;
  }
}
function validacaoInfBasicaURL(input) {
  const regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(input.value)) {
    return true;
  } else {
    return false;
  }
}

function validacaoInfBasicaPergunta(input) {
  if (input.value < 3) {
    return false;
  } else {
    return true;
  }
}
