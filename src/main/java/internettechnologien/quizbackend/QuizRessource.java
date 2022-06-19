package internettechnologien.quizbackend;
import org.springframework.web.bind.annotation.*;

import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController
class QuizRessource{

    QuizModel quizModel;

    String ip = InetAddress.getLocalHost().getHostAddress();
    String ip2 = InetAddress.getLocalHost().getHostName();

    QuizRessource() throws UnknownHostException {

        // Lade QuizModel in Arbeitsspeicher
        quizModel = FileService.readJsonFileToQuizModel();
        System.out.println("running on: "+ip);
        System.out.println(ip2);
    }


    @GetMapping("/addQuestion/{category}/{question}/{solution}/{alt1}/{alt2}/{alt3}")
    boolean addQuestion(
            @PathVariable("category") String category,
            @PathVariable("question") String question,
            @PathVariable("solution") String solution,
            @PathVariable("alt1") String alt1,
            @PathVariable("alt2") String alt2,
            @PathVariable("alt3") String alt3){

        System.out.println("Entering Endpoint to save Question to File");
        // parsen
        Question questionObject = new Question(
                question,
                solution,
                alt1,
                alt2,
                alt3
        );
        QuizModel quizModel = FileService.readJsonFileToQuizModel();
        quizModel.addQuestion(questionObject,category);
        System.out.println(quizModel.toJson());

        // Spring Restcontroller Server Dispatchlet multithreaded,
        // also keine Auslagerung in Thread nötig um blockieren zu verhindern
        // Nicht sicher ob sich auch synchronisation des Zugriffes gekümmert wird,
        // -> vlt Fehler bei unatürlich schnell aufeinanderfolgenden addQuestion anfragen
        FileService.saveJsonFile(quizModel.toJson());
        return true;

    }

    /*
    * Returns Quiz Questions as Json,
    * Bei Sehr vielen Fragen paging Sinnvoll
    * */
    @GetMapping("/questions")
    String getQuizQuestions(){
        return quizModel.toJson();
    }

    @GetMapping("/categorys")
    String getQuizCategories(){
        System.out.println("/categorys, try to get categorys");
        String res = quizModel.getCategorysAsJson();
        System.out.println(res);
        return res;
    }


    @GetMapping("/questions/{category}")
    String getAllQuestionsFromCategory(@PathVariable("category") String category){
        System.out.println("/questions/{category} entered with category: "+category);
        String res = quizModel.getAllQuestionsFromCategoryAsJson(category);
        System.out.println(res);
        return res;
    }

    @GetMapping("/questions/{category}/{amount}")
    String getNQuestionsFromCategory(@PathVariable("category") String category,@PathVariable("amount") int amount){
        System.out.println("/questions/{category}/{amount} entered with category: "+category+" and amount: "+amount);
        String res = quizModel.getNQuestionsFromCategoryAsJson(category,amount);
        System.out.println(res);
        return res;
    }

    @GetMapping("/question/{category}")
    String getOneQuestionFromCategory(@PathVariable("category") String category){
        System.out.println("/question/{category} entered with category: "+category);
        String res = quizModel.getOneRandomQuestionFromCategoryAsJson(category);
        System.out.println(res);
        return res;
    }






}