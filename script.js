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
  }
});
