var currentQuestionNo = 0;
var points = 0;
var rightAnswerPoints = 10;
var currentQuestion;

var questions = [
    {
      "id":"1",
      "question" : "Was bedeutet die Abkürzung BSI?",
      "answers" : {
        "A":"Bundesamt für Sicherheit in der Informatik",
        "B":"Bundesamt für Sicherheit und Informationstechnik",
        "C":"Bundesamt für Sicherheit in der Informationstechnik",
        "D":"Bundesamt für Sicherheit und Informationen"
      }, 
      "right":"C"
    },{
      "id":"2",
      "question" : "Was bedeutet DSGVO?",
      "answers" : {
        "A":"Datenschutz-Grundverordnung",
        "B":"Deutsche Sicherheitsgrundverordnung",
        "C":"Datenschutz-Sicherheitsgrundverordnung",
        "D":"Datenschutz-Gesamtverordnung"
      }, 
      "right":"A"
    },{
        "id":"3",
        "question" : "Was bedeuet BDSG-neu?",
        "answers" : {
          "A":"Neues Bundesdatenschutzgericht",
          "B":"Neues Bundesdatenschutzgesetz",
          "C":"Neues Bundesdatensicherheitsgesetz",
          "D":"Neues Bundessicherheitsgericht"
        }, 
        "right":"B"
    },{
        "id":"4",
        "question" : "Seit wann wird die Datenschutzgrundverordnung angewandt?",
        "answers" : {
          "A":"2017",
          "B":"2015",
          "C":"2021",
          "D":"2018"
        }, 
        "right":"D"
    },{
        "id":"5",
        "question" : "Wo gilt das Neue Bundesdatenschutzgesetz?",
        "answers" : {
          "A":"In der Europäischen Union",
          "B":"In Europa",
          "C":"In Deutschland",
          "D":"In Europa sowie Island, Liechtenstein und Norwegen"
        }, 
        "right":"C"
    }
  ];

function showNextQuestion() {
    if (currentQuestionNo >= questions.length) {
        showEnd();
        currentQuestionNo = 0;
      }
    $(".answer").removeClass("btn-primary btn-danger btn-success btn-default");
    $(".answer").addClass("btn-default");
    console.log("Loading Question:" + currentQuestionNo);
    currentQuestion = questions[currentQuestionNo];
    $("#qno").text(currentQuestionNo + 1);
    $("#question_text").text(currentQuestion.question);
    $("#answer_a").text(currentQuestion.answers.A);
    $("#answer_b").text(currentQuestion.answers.B);
    $("#answer_c").text(currentQuestion.answers.C);
    $("#answer_d").text(currentQuestion.answers.D); 
}

function showEnd() {
    $("#endpoints").text(points);
    $("#possiblepoints").text(rightAnswerPoints * questions.length);
    $("#question").fadeOut(function() {
        $(".quiz_end").removeAttr('hidden').fadeIn();  
    });  
  }

function getRightAnswer() {
    return currentQuestion.right;
  }