import React from 'react';
import CreateSurvey from './SurveyManagement/CreateSurvey.js';
import ActiveQuestions from './SurveyManagement/ActiveQuestions.js'
import SubmittedResponse from './SurveyManagement/SubmittedResponse.js'
import AppMode from './../AppMode.js'
import SearchQestions from './SurveyManagement/SearchQuestions.js'
import CreateQuestion from './SurveyManagement/CreateQuestion.js';
import SearchSurveys from './SurveyManagement/SearchSurveys.js';

class SurveyManagementPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            questions: [],
            responses: [],
            surveys : [],
            errorMsg : ""
        };

        this.getQuestions();
    }

    /*
        Save a question to the mongoDB 
    */
    saveQuestion = async (surveyId, newQuestion) => {
        const url = '/questions/' + surveyId;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(newQuestion)});
        const msg = await res.text();
        if (res.status != 200) {
            this.setState({errorMsg: msg});
            console.log("Question NOT Created!");
            this.props.changeMode(AppMode.SURVEY_MANAGEMENT_SEARCH);
        } else {
            this.setState({errorMsg: ""});
            console.log("Question Created!");
            this.props.refreshOnUpdate(AppMode.SURVEY_MANAGEMENT_SEARCH);
        }
    }

    /*
        Save a survey to the mongoDB 
    */
    saveSurvey = async (surveyID, newSurvey) => {
        const url = '/surveys/' + surveyID;
        console.log(url);
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(newSurvey)}); 
        const msg = await res.text();
        if (res.status != 200) {
            this.setState({errorMsg: msg});
            this.props.changeMode(AppMode.SURVEY_MANAGEMENT_SEARCH_SURVEYS);
        } else {
            this.setState({errorMsg: ""});
            this.props.refreshOnUpdate(AppMode.SURVEY_MANAGEMENT_SEARCH_SURVEYS);
        }
    }

    /* 
        Name: getQuestions
        Purpose: Gets all of the questions, surveys, and responses for the particular instructor.
    */     
    getQuestions = async () => {

        var courses = [];
        courses = this.props.userObj.courses.map((course) => {
            return course.courseID;
        });

        console.log("Courses:");
        console.log(courses);

        if(courses.length == 0){
            courses = [""]
        }

        let response = await fetch("/responses/" + this.props.userObj.id+"/"+JSON.stringify(courses)); //["cpts489Fall2020"]
    
        if (response.status == 200) {
            response = await response.json();
            const obj = JSON.parse(response);    
            console.log("GET /responses/"+ this.props.userObj.id+"/"+courses);
            console.log(obj);
        
            var getAllResponses = (questions) => {
                if(questions.length == 0){
                  return [];
                }
            
                var responses = [];
                var newquestions = [];
                questions.forEach((survey) => {
                  survey.questions.forEach((question) => {
                    newquestions.push({
                        questionID: question.questionID,
                        surveyID: survey.surveyID,
                        responses: question.responses,
                        survey: survey,
                        question: question
                      });
                    question.responses.forEach((response) => {
                        responses.push({
                          questionID: question.questionID,
                          surveyID: survey.surveyID,
                          response: response,
                          survey: survey,
                          question: question,
                          responseType: response.students.length > 1 ? "Group" : "Individual"
                        });
                    });
                  });
                });
                return [responses, newquestions];
              }
    
            var data = getAllResponses(obj);
            this.setState({
              surveys : obj,
              questions : data[1],
              responses : data[0]
            });
        }
    }

    render() {
        switch(this.props.mode) {
            case AppMode.SURVEY_MANAGEMENT:
                return (
                    <>
                    <ActiveQuestions>
                    </ActiveQuestions>
                    </>
                );
            case AppMode.SURVEY_MANAGEMENT_CREATE:
                return (
                    <CreateQuestion 
                    userObj={this.props.userObj}
                    surveys={this.state.surveys}
                    changeMode={this.props.changeMode}
                    >
                    </CreateQuestion>
                );
            case AppMode.SURVEY_MANAGEMENT_CREATE_SURVEY:
                return (
                    <CreateSurvey 
                    userObj={this.props.userObj}
                    surveys={this.state.surveys}
                    changeMode={this.props.changeMode}>
                    </CreateSurvey>
                );
            case AppMode.SURVEY_MANAGEMENT_SEARCH:
                return (
                    <SearchQestions>
                    </SearchQestions>
                );
            case AppMode.SURVEY_MANAGEMENT_SEARCH_SURVEYS:
                return (
                    <SearchSurveys
                    saveSurvey={this.saveSurvey}
                    >
                    </SearchSurveys>
                );
            case AppMode.SURVEY_MANAGEMENT_RESPONSES:
                return (
                    <SubmittedResponse
                    userObj={this.props.userObj}
                    getQuestions={this.getQuestions}
                    questions={this.state.questions}
                    responses={this.state.responses}
                    >
                    </SubmittedResponse>
                );
        }
    }   
}

export default SurveyManagementPage;


/*
    CODE TO HOW HOW TO CALL THE METHODS FOR RESPONSE

BELOW IS HOW YOU CAN CALL THE GET METHOD FOR responses
        const url = '/responses/' + this.props.userObj.id;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'GET',
            body: JSON.stringify({"courses": ["cpts489Fall2020"]})}); 
        const msg = await res.text();
        if (res.status == 200) {
          console.log("getQuestions: SUCCESS");
          console.log(res);
          console.log(msg);
        } else {
          console.log(res);
          console.log(msg);
          console.log("getQuestions: ERROR");
        }

    
BELOW IS HOW YOU CAN CALL THE CREATE METHOD FOR responses
    var newResponse = {
    "students": [
        {
        "userID": "marco.arceo@wsu.edu",
        "studentDisplayName": "marco.arceo@wsu.edu"
        }],
    "responseId": "rID55",
    "responseDateTime": "Wed Nov 12 2020 14:19:12 GMT-0800",
    "surveyResponse": "Choice 5"
    }

    var newData = {
    "response" : newResponse,
    "questionID": "questionID1",
    "courseID": "cpts489Fall2020",
    "surveyID": "testID",
    }
    
    
    const url = '/responses/';// + this.props.userObj.id;
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        method: 'POST',
        body: JSON.stringify(newData)}); 
    const msg = await res.text();
    if (res.status == 200) {
        console.log("getQuestions: SUCCESS");
        console.log(res);
        console.log(msg);
    } else {
        console.log(res);
        console.log(msg);
        console.log("getQuestions: ERROR");
    }
*/