package internettechnologien.quizbackend;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class QuizModel {

    List<String> categorys = new ArrayList<>();
    List<List<Question>> questionLists  = new ArrayList<>();

    public QuizModel() {
    }

    public QuizModel(List<String> categorys, List<List<Question>> questionLists) {
        this.categorys = categorys;
        this.questionLists = questionLists;
    }

    public List<Question> getAllQuestionsFromCategory(String category){
        int index = categorys.indexOf(category);
        return questionLists.get(index);
    }

    public String getCategorysAsJson(){

        String res = "{\"categorys\":[";

        for(int i=0;i<categorys.size();i++){
            res+= "\""+categorys.get(i)+"\"";
            res+= i==categorys.size()-1 ? "":",";
        }
        res+="]}";
        return res;

    }

    public String getAllQuestionsFromCategoryAsJson(String category){

        List<Question> questionsFromCategory = getAllQuestionsFromCategory(category);

        JsonObject result = new JsonObject();
        JsonArray tmpArray = new JsonArray();
        for(int i=0;i<questionsFromCategory.size();i++){
                tmpArray.add(JsonParser.parseString(questionsFromCategory.get(i).toJsonString()));
        }
        result.add(category,tmpArray);
        return result.toString();
    }

    public Question getOneRandomQuestionFromCategory(String category){
        List<Question> questionsFromCategory = getAllQuestionsFromCategory(category);
        int randomIndex = (int)Math.random()*questionsFromCategory.size();
        return questionsFromCategory.get(randomIndex);
    }

    public String getOneRandomQuestionFromCategoryAsJson(String category){
        Question question = getOneRandomQuestionFromCategory(category);
        return question.toJsonString();
    }

    public String getNQuestionsFromCategoryAsJson(String category,int amount){

        List<Question> questionsFromCategory = getAllQuestionsFromCategory(category);
        questionsFromCategory.sort(new RandomSort());

        JsonObject result = new JsonObject();
        JsonArray tmpArray = new JsonArray();
        for(int i=0;i<questionsFromCategory.size() && i < amount;i++){
            tmpArray.add(JsonParser.parseString(questionsFromCategory.get(i).toJsonString()));
        }
        result.add(category,tmpArray);
        return result.toString();
    }
    // add single Question
    public void addQuestion(Question question,String category){
        int index;
        if(!categorys.contains(category)){
            categorys.add(category);
        }
        index = categorys.indexOf(category);

        if(questionLists.size()>index-1){
            questionLists.add(new ArrayList<Question>());
        }

        questionLists.get(index).add(question);
    }

    // add whole List of Questions
    public void addList(ArrayList<Question> questions,String category){
        int index;
        if(!categorys.contains(category)){
            categorys.add(category);
        }
        index = categorys.indexOf(category);

        if(questionLists.size()-1>index){
            questionLists.add(new ArrayList<Question>());
        }
        questionLists.get(index).addAll(questions);
    }

    public String toJson(){

        JsonObject result = new JsonObject();

        for(int i=0;i<categorys.size();i++){

            JsonArray tmpArray = new JsonArray();

            for(int j=0;j<questionLists.get(i).size();j++){
                tmpArray.add(JsonParser.parseString(questionLists.get(i).get(j).toJsonString()));
            }
            result.add(categorys.get(i),tmpArray);
        }
        return result.toString();
    }


}



class RandomSort<T extends Comparable<T>> implements Comparator<T> {

    @Override
    public int compare(T o1, T o2) {
        double decision = Math.random();
        return decision > 0.5f?1:-1;
    }
}
