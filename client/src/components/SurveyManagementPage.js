import React from 'react';
import CreateSurvey from './SurveyManagement/CreateSurvey.js';
import ActiveQuestions from './SurveyManagement/ActiveQuestions.js'
import SubmittedResponse from './SurveyManagement/SubmittedResponse.js'
import AppMode from './../AppMode.js'
import SearchQestions from './SurveyManagement/SearchQuestions.js'

class SurveyManagementPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            questions: [],
            responses: [],
            surveys : []
        };

        this.getQuestions();
    }

    getQuestions = async () => {

        let response = await fetch("/responses/" + this.props.userObj.id+"/"+["cpts489Fall2020"]);
        response = await response.json();
          console.log("getQuestions: RESPONSE");
        const obj = JSON.parse(response);
    
        console.log("GET /responses/"+ this.props.userObj.id);
        console.log(obj);
    
        var getAllResponses = (questions) => {
            if(questions.length == 0){
              return [];
            }
        
            console.log("getAllResponses");
            console.log(questions);
        
            var responses = [];
            var newquestions = [];
        
            questions.forEach((survey) => {
              var allQuestions = survey.questions;
              console.log("Questions");
              console.log(allQuestions);
        
              allQuestions.forEach((question) => {
                console.log(question);
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
                      question: question
                    });
                });
              });
            });
        
            console.log("all responses:");
            console.log(responses);
            console.log("all questions:");
            console.log(newquestions);
            return [responses, newquestions];
            // this.setState({
            //   allResponses : responses,
            //   origResponses : responses
            // });
          }

        var data = getAllResponses(obj);
    
        this.setState({
          surveys : obj,
          questions : data[1],
          responses : data[0]
        });
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
                    <CreateSurvey>
                    </CreateSurvey>
                );
            case AppMode.SURVEY_MANAGEMENT_SEARCH:
                return (
                    <SearchQestions>
                    </SearchQestions>
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