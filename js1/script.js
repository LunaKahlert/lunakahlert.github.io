$(".start").click(function() {
    console.log( "Start" );
    $(".quiz_start").fadeOut(function(){
        startQuiz();
    });
  });

function startQuiz() {
    showNextQuestion();
    $("#continue_btn").hide();
    $("#question").removeAttr('hidden').fadeIn();   
  }

function selectAnswer(id) {
    $(id).addClass("btn-primary");
    $(id).removeClass("btn-default");
  }

function deselectAnswer(id) {
    $(id).addClass("btn-default");
    $(id).removeClass("btn-primary");  
  }

$("#answer_a_btn").click(function() {
    selectAnswer("#answer_a_btn");
    deselectAnswer("#answer_b_btn");
    deselectAnswer("#answer_c_btn");
    deselectAnswer("#answer_d_btn");
});
$("#answer_b_btn").click(function() {
    selectAnswer("#answer_b_btn");
    deselectAnswer("#answer_a_btn");
    deselectAnswer("#answer_c_btn");
    deselectAnswer("#answer_d_btn");
});
$("#answer_c_btn").click(function() {
    selectAnswer("#answer_c_btn");
    deselectAnswer("#answer_b_btn");
    deselectAnswer("#answer_a_btn");
    deselectAnswer("#answer_d_btn");
});
$("#answer_d_btn").click(function() {
    selectAnswer("#answer_d_btn");
    deselectAnswer("#answer_b_btn");
    deselectAnswer("#answer_c_btn");
    deselectAnswer("#answer_a_btn");
});

$("#answer_commit_btn").click(function() {
    validateAnswer();
  });

function validateAnswer() {
    $("#answer_commit_btn").hide();
    var rightAnswer = getRightAnswer();
    var selectedAnswerId = $(".answer.btn-primary").attr("id");
    var selectedAnswer = $(".answer.btn-primary").text()[0]; 
    $(".answer.btn-primary").removeClass("btn-primary");
    $(".answer.btn-default").removeClass("btn-default");  
  if (selectedAnswer == rightAnswer) {
        points += rightAnswerPoints;
        $("#"+selectedAnswerId).addClass("btn-success");
    } 
  else {
        $("#"+selectedAnswerId).addClass("btn-danger");
    } 
    $("#continue_btn").show();
  }

$("#continue_btn").click(function() {
    $("#continue_btn").hide();
    $("#answer_commit_btn").show();
    currentQuestionNo++;
    showNextQuestion();  
});