package internettechnologien.quizbackend;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class Question implements Comparable {

    String question;
    String solution;
    String alternative1;
    String alternative2;
    String alternative3;


    public Question(){

    }
    public Question(
            String question,
            String solution,
            String alternative1,
            String alternative2,
            String alternative3) {
        this.question = question;
        this.solution = solution;
        this.alternative1 = alternative1;
        this.alternative2 = alternative2;
        this.alternative3 = alternative3;
    }

    String toJsonString(){

        JsonObject ob = new JsonObject();
        ob.addProperty("a",question);


        JsonArray array= new JsonArray();
        array.add(solution);
        array.add(alternative1);
        array.add(alternative2);
        array.add(alternative3);

        ob.add("l",array);

        System.out.println(ob.toString());
        return  ob.toString();
    }

    void fromJsonString(JsonObject ob){

        JsonObject tmpOb = ob;
        JsonArray solutions = tmpOb.get("l").getAsJsonArray();
        this.question = tmpOb.get("a").getAsString();
        this.solution = solutions.get(0).getAsString();
        this.alternative1 = solutions.get(0).getAsString();
        this.alternative2 = solutions.get(0).getAsString();
        this.alternative3 = solutions.get(0).getAsString();

    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getSolution() {
        return solution;
    }

    public void setSolution(String solution) {
        this.solution = solution;
    }

    public String getAlternative1() {
        return alternative1;
    }

    public void setAlternative1(String alternative1) {
        this.alternative1 = alternative1;
    }

    public String getAlternative2() {
        return alternative2;
    }

    public void setAlternative2(String alternative2) {
        this.alternative2 = alternative2;
    }

    public String getAlternative3() {
        return alternative3;
    }

    public void setAlternative3(String alternative3) {
        this.alternative3 = alternative3;
    }

    @Override
    public int compareTo(Object o) {
        return 0;
    }
}
