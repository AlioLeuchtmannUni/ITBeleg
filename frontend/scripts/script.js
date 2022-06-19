
// CHANGE HERE: ändern je nach dem wo das Backend läuft
baseUrl = "http://iseproject06.informatik.htw-dresden.de:9090/";
//baseUrl = "http://141.56.132.150:8080/";
numberPerRun = 10;


class AnswerStatisticModel {
    question;
    correct;
    timesCorrect;
    timesWrong;
    constructor(question, correct) {
        this.question = question;
        this.correct = correct;

        if (correct) {
            this.timesCorrect = 1;
            this.timesWrong = 0;
        } else {
            this.timesCorrect = 0;
            this.timesWrong = 1;
        }
    }
}

// Model zum speichern der Richtigen Antworten für den Lernfortschritt
class StatisticModel {

    statisticsPerCategory = new Map();
    addAnswerStatistic(answerStatistic, category) {

        const exists = (Array.from(this.statisticsPerCategory.keys())).indexOf(category);

        if (exists >= 0) {

            var prevList = Array.from(this.statisticsPerCategory.get(category));

            // category allredy saved and, question answered more than once
            // only increase counter
            for (var i = 0; i < prevList.length; i++) {
                if (prevList[i].question === answerStatistic.question) {
                    answerStatistic.correct ?
                        prevList[i].timesCorrect++ :
                        prevList[i].timesWrong++;
                    return;
                }
            }
            // category exists but question not -> add to array
            answerStatistic = prevList.concat(answerStatistic);

            const res = this.statisticsPerCategory.delete(category);
        }
        // add new category with first question
        this.statisticsPerCategory.set(category, answerStatistic);
    }

}

// Quelle: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// heisst presenter mach aber alles
class Presenter {
    currentQuestionIndex = 0;
    correctAnswerCount = 0;

    choosenCategory;
    currentArray = [];
    // Umbauen so das in 2D Datenstrucktur und handler universel
    questionArrays = [];
    statisticsModel = new StatisticModel();
    remainingQuestionIndexes = [];
    quizCategorys = [];

    // HTML Elements
    quizContainer;
    aufgabeContainer;
    answerContainer;
    dashboard;
    dashboardCategory;
    dashboardScore;
    progressContainer;
    landingDiv;

    // Form Elements
    quizCreationFormContainer;
    categoryRow;
    categoryInput;
    questionInput;
    answerInput1;
    answerInput2;
    answerInput3;
    answerInput4;

    snackBar;

    constructor() {}

    readFileFromRemote(url, callback) {

        const Http = new XMLHttpRequest();
        Http.open('GET', url);
        Http.send();
        Http.onreadystatechange = (e) => { callback(Http.responseText); }
    }


    getShuffledIndexes(number) {
        console.log('get shuffled indexes');
        var array = [];
        for (var i = 0; i < number; i++) { array.push(i); }
        console.log(array);
        return array.sort((a, b) => (0.5 - Math.random()));
    }


    createAnswerContainerItem(randomIndex) {
        // create Answer Item
        const answer = this.currentArray[this.currentQuestionIndex]['l'][randomIndex].toString();
        const answerContainerItem = document.createElement('Div');

        if (this.choosenCategory === 'teil-mathe') {
            katex.render(answer, answerContainerItem, { throwOnError: false });
        } else {
            answerContainerItem.appendChild(document.createTextNode(answer));
        }
        // wrap in anonymous function to pass index
        answerContainerItem.onclick = () => { this.onAnswerClicked(randomIndex); };
        return answerContainerItem;
    }

    /* Load Current Question */
    fillWithCurrentQuestionData() {

        console.log('fill with current question data');

        this.currentQuestionIndex = this.remainingQuestionIndexes.pop();
        this.aufgabeContainer.innerHTML = "";
        this.answerContainer.innerHTML = "";

        const aufgabe = this.currentArray[this.currentQuestionIndex]['a'];

        if (this.choosenCategory === 'teil-mathe') {
            katex.render(aufgabe, aufgabeContainer, { throwOnError: false });
        } else {
            aufgabeContainer.appendChild(document.createTextNode(aufgabe));
        }

        // add answeres Randomly
        const freeIndexes = this.getShuffledIndexes(4);

        for (var index = 0; index < 4; index++) {
            const randomIndex = freeIndexes.pop();
            const answerContainerItem = this.createAnswerContainerItem(randomIndex);
            answerContainer.appendChild(answerContainerItem);
        };
    }

    fillDashboard() {
        console.log('fill Dashboard');
        this.dashboardCategory.innerHTML = "Category: " + this.choosenCategory;
        this.dashboardScore.innerHTML = this.correctAnswerCount + " / " + this.currentArray.length;
    }

    createPlaceHolder(div) {
        const placeholder = document.createElement('div');
        placeholder.style.color = 'white';
        placeholder.appendChild(document.createTextNode('Bis jetzt noch keine Fragen beantwortet'));
        div.appendChild(placeholder);
    }

    fillProgressScreen() {
        console.log('fill Progress Screen');
        this.progressContainer.innerHTML = '';
        var div = document.createElement("div");

        const keys = Array.from(this.statisticsModel.statisticsPerCategory.keys());

        if (keys.length == 0) {
            this.createPlaceHolder(div);
            return;
        }

        keys.forEach((key) => {

            const statisticCategoryContainer = document.createElement('div');
            statisticCategoryContainer.className = 'statisticCategoryContainer';

            // header for Category of answered Questions
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'categoryHeader';
            categoryHeader.appendChild(document.createTextNode('\n\n' + key));
            statisticCategoryContainer.appendChild(categoryHeader);


            // hr
            const hr = document.createElement('hr');
            hr.className = 'divider';

            statisticCategoryContainer.appendChild(hr);

            const arrayFromCurrentCategory = this.statisticsModel.statisticsPerCategory.get(key);

            Array.from(arrayFromCurrentCategory).forEach((answerStatistic) => {

                const statQuestionItem = document.createElement('div');
                statQuestionItem.className = 'statQuestionItem';

                const questionLabel = document.createElement('div');
                questionLabel.appendChild(document.createTextNode(answerStatistic.question));

                const resultLabel = document.createElement('div');
                resultLabel.appendChild(document.createTextNode(
                    'Correct: ' + answerStatistic.timesCorrect + ' ' +
                    'Wrong: ' + answerStatistic.timesWrong + '\n'));

                statQuestionItem.appendChild(questionLabel);
                statQuestionItem.appendChild(resultLabel);
                statisticCategoryContainer.appendChild(statQuestionItem);
                statisticCategoryContainer.appendChild(hr.cloneNode());
            });

            div.appendChild(statisticCategoryContainer);

        });


        this.progressContainer.appendChild(div);
    }

    /*
     * State Managment
     * Change visibility of Elements depending on the current State
     */
    setState(state) {
        console.log('set state ' + state);
        switch (state) {
            case 0:
                {
                    console.log(this.currentArray);
                    this.remainingQuestionIndexes = this.getShuffledIndexes(this.currentArray.length);
                    this.quizContainer.style.display = '';
                    this.dashboard.style.display = 'none';
                    this.progressContainer.style.display = 'none';
                    this.landingDiv.style.display = 'none';
                    this.quizCreationFormContainer.style.display = 'none';
                }
                break;
            case 1:
                {
                    this.fillDashboard();
                    this.quizContainer.style.display = 'none';
                    this.dashboard.style.display = '';
                    this.progressContainer.style.display = 'none';
                    this.landingDiv.style.display = 'none';
                    this.quizCreationFormContainer.style.display = 'none';
                }
                break;
            case 2:
                {
                    this.fillProgressScreen();
                    this.quizContainer.style.display = 'none';
                    this.dashboard.style.display = 'none';
                    this.progressContainer.style.display = '';
                    this.landingDiv.style.display = 'none';
                    this.quizCreationFormContainer.style.display = 'none';
                }
                break;
            case 3:
                {
                    this.fillProgressScreen();
                    this.quizContainer.style.display = 'none';
                    this.dashboard.style.display = 'none';
                    this.progressContainer.style.display = 'none';
                    this.landingDiv.style.display = '';
                    this.quizCreationFormContainer.style.display = 'none';
                }
                break;
            case 4:
                {
                    this.quizContainer.style.display = 'none';
                    this.dashboard.style.display = 'none';
                    this.progressContainer.style.display = 'none';
                    this.landingDiv.style.display = 'none';
                    this.quizCreationFormContainer.style.display = '';
                }
                break;
        }
    }



    onAnswerClicked(index) {
        console.log('on answer clicked');
        const isCorrect = index == 0;

        if (isCorrect) { this.correctAnswerCount++; }

        const answerStatistic = new AnswerStatisticModel(
            this.currentArray[this.currentQuestionIndex]['a'],
            isCorrect
        );

        this.statisticsModel.addAnswerStatistic(answerStatistic, this.choosenCategory);

        if (this.remainingQuestionIndexes.length == 0) {
            this.processQuizCompleted();
            return;
        }

        this.fillWithCurrentQuestionData();
    }

    processQuizCompleted() {
        console.log('process quiz completion');
        this.currentQuestionIndex = 0;
        this.setState(1);
    }



    baseReset() {
        console.log('base reset');
        this.setState(0);
        this.correctAnswerCount = 0;
        this.currentQuestionIndex = 0;
    }


    createSnackbar(bgColor, message) {
        console.log('load snackbar');
        this.snackBar.classList.add("show");
        this.snackBar.appendChild(document.createTextNode(message));
        this.snackBar.style.backgroundColor = bgColor;

        setTimeout(
            () => {
                this.snackBar.classList.remove("show");
                console.log('done');
            },
            3000);
    }

    clearForm() {
        categoryInput.value = '';
        questionInput.value = '';
        answerInput1.value = '';
        answerInput2.value = '';
        answerInput3.value = '';
        answerInput4.value = '';
    }

    saveQuestion() {

        console.log('saving question');
        const category = this.categoryInput.value;
        const question = this.questionInput.value;
        const solution = this.answerInput1.value;
        const alternative1 = this.answerInput2.value;
        const alternative2 = this.answerInput3.value;
        const alternative3 = this.answerInput4.value;

        const Http = new XMLHttpRequest();
        const url = `${baseUrl}addQuestion/${category}/${question}/${solution}/${alternative1}/${alternative2}/${alternative3}`;
        Http.open('GET', url);
        Http.send();

        Http.onreadystatechange = (e) => {
            if (Http.readyState == 4) {

                Http.status === '404' ?
                    this.createSnackbar("red", "failed to save check connection") :
                    this.createSnackbar("green", "saved successfully");

                Http.status !== '404' ? this.clearForm() : null;

            }
        }

        // reload all Data afterwards
    }

    getXQuestionsFromCategory(index, number) {
        this.choosenCategory = this.quizCategorys[index];
        const end = Math.min(number, this.questionArrays[index].length); // limit to length of array
        this.currentArray = this.questionArrays[index]
            .sort((a, b) => (0.5 - Math.random()))
            .slice(0, end);
    }


    // gets dynamically Filled
    categoryClickHandlers = [];


    // dynamicaly create Quiz Option Dropdown
    initializeChoices() {
        var dropdown = document.getElementById("categoryDropdown");
        dropdown.innerHTML = "";

        for (var i = 0; i < this.quizCategorys.length; i++) {

            var div = document.createElement("div");
            var textContent = document.createTextNode(this.quizCategorys[i]);
            div.onclick = this.categoryClickHandlers[i];
            div.appendChild(textContent);
            dropdown.appendChild(div);
        }
    }

    initForm() {
        this.quizCreationFormContainer = document.getElementById("quizCreationFormContainer");
        this.categoryRow = document.getElementById("categoryRow");
        this.categoryInput = document.getElementById("categoryInput");
        this.questionInput = document.getElementById("questionInput");
        this.answerInput1 = document.getElementById("answerInput1");
        this.answerInput2 = document.getElementById("answerInput2");
        this.answerInput3 = document.getElementById("answerInput3");
        this.answerInput4 = document.getElementById("answerInput4");
        this.snackBar = document.getElementById('snackBar');
    }


    initCategoryRow() {

        this.categoryRow.innerHTML = '';
        this.quizCategorys.forEach((category) => {
            const tmp = document.createElement('div');
            tmp.className = 'categoryChoiceItem';
            tmp.onclick = () => { this.categoryInput.value = category; }; // add auto fill on Click
            tmp.appendChild(document.createTextNode(category));
            this.categoryRow.appendChild(tmp);
        });
    }

    initDashboard() {
        this.dashboard = document.getElementById("dashboard");
        this.dashboard.className = 'dashboard';
        this.dashboardCategory = document.getElementById("dashboardCategory");
        this.dashboardScore = document.getElementById("dashboardScore");
    }

    initQuiz() {
        this.quizContainer = document.getElementById("quizContainer");
        this.aufgabeContainer = document.getElementById("aufgabeContainer");
        this.answerContainer = document.getElementById("answerContainer");
    }


    // Umbauen, immer nur laden was ich brauche
    loadData() {
        this.readFileFromRemote(`${baseUrl}questions`, (res) => {

            // read and parse file from backend, // kehrt irgendwie 2 mal zurück 
            this.quizCategorys = [];
            this.questionArrays = []; // deshalb hier empty
            console.log(res);
            var json = JSON.parse(res);

            // dynamisch Kategorien erzeugen
            this.quizCategorys = Object.keys(json);
            this.quizCategorys.filter(onlyUnique);
            this.initCategoryRow();


            // Add Questions Sets to the According Index
            for (var i = 0; i < this.quizCategorys.length; i++) {
                this.questionArrays.push(json[this.quizCategorys[i]]);

                console.log(this.quizCategorys[i]);
                const index =  i; // have to copy here otherwise reference used

                this.categoryClickHandlers.push(
                    () => {
                        console.log(index);
                        console.log('click handler for category:'+this.quizCategorys[index]);
                        this.baseReset();
                        this.getXQuestionsFromCategory(index, numberPerRun);
                        this.setState(0);
                        this.fillWithCurrentQuestionData();
                    }
                );
            }
            // set Start Setz
            this.getXQuestionsFromCategory(0, numberPerRun);

            this.initializeChoices();
            this.fillWithCurrentQuestionData();

        });
    }

    initialize() {

        this.initQuiz();
        this.initDashboard();
        this.progressContainer = document.getElementById("progressContainer");
        this.landingDiv = document.getElementById("landingDiv");
        this.initForm();

        this.loadData();
        this.setState(3);

    }

}

var presenter = new Presenter();