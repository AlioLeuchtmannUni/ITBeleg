package internettechnologien.quizbackend;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class FileService {


    public static String getDatasetPath(){

        try{
            String path = new java.io.File(".").getCanonicalPath();
            System.out.println("Question Endpoint has been reached ! ");
            System.out.println(System.getProperty("os.name"));
            if(System.getProperty("os.name").toLowerCase().contains("windows")){
                path+="\\assets\\dataSets.json";
            }else{
                path+="/assets/dataSets.json";
            }

            return path;
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return  "fail";
    }


    public static String saveJsonFile(String jsonString){
        try {
            String path = getDatasetPath();
            BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(path));
            bufferedWriter.write(jsonString);
            bufferedWriter.flush();
            bufferedWriter.close();

        }catch(Exception e){
            System.out.println("Exception reading file "+ e.getMessage());
        }

        return "null";
    }

    public static String readJsonFile(){
        try {

            String path = getDatasetPath();

            System.out.println("FileService try reading: "+path);
            File file = new File(path);
            String jsonString = "";

            if (!file.exists()) {
                System.out.println("could not read the file, does not exist");
            }else {
                Scanner myReader = new Scanner(file, StandardCharsets.UTF_8);
                System.out.println(file.isFile());
                System.out.println(file.getCanonicalPath());
                while (myReader.hasNextLine()) {
                    System.out.println("append");
                    jsonString += myReader.nextLine();
                }
                myReader.close();
                System.out.println("Json String");
                System.out.println(jsonString);
                return jsonString;
            }

        }catch(Exception e){
            System.out.println("Exception reading file "+ e.getMessage());
        }

        return "null";
    }

    public static QuizModel readJsonFileToQuizModel(){

        String currentFileContent = FileService.readJsonFile();
        System.out.println(currentFileContent);
        System.out.println("does contain category:");
        JsonObject jsonObject = new JsonParser()
                .parse(currentFileContent)
                .getAsJsonObject();

        QuizModel quizModel = new QuizModel();
        Object[] categorys =  jsonObject.keySet().toArray();
        System.out.println(categorys[0].getClass());

        for(int i=0;i< categorys.length ;i++){

            String tmpCat = (String)categorys[i];
            JsonArray questionStrings = jsonObject.get(tmpCat)
                    .getAsJsonArray();

            for(int j=0;j<questionStrings.size();j++){

                JsonObject tmpOb = questionStrings.get(j).getAsJsonObject();
                Question tmpQuestion = new Question();
                tmpQuestion.fromJsonString(tmpOb);
                System.out.println("res: "+tmpQuestion.toJsonString());
                quizModel.addQuestion(tmpQuestion,tmpCat);
            }
        }

        return quizModel;
    }
}
