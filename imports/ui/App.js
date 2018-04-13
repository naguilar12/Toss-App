import React, {Component} from "react";
import {Meteor} from 'meteor/meteor';
import {withTracker} from "meteor/react-meteor-data";
import NavbarIndex from './navbars/NavbarIndex.js';
import NavbarUser from './navbars/NavbarUser.js';
import Index from './index/Index.js';
import LoginManager from './authentication/LoginManager.js';
import RegisterManager from "./authentication/RegisterManager.js";
import UserIndex from "./index/UserIndex.js";
import Selector from "./tabs/Selector.js";
import Footer from "./footer/Footer.js";
import {TossUps} from "../api/tossUps"


import {Users} from '../api/users.js';
import CustomDialog from "./adding/CustomDialog";
import NewTossUpDialog from "./adding/NewTossUpDialog";

import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "index",
            userLocation: "index",
            newToss: false,
            sorteo: 0,
            add: false,
            addOwner: false,
            inputText: "",
            inputNumb: 1,
            inputName: "",

        };

        this.goToIndex = this.goToIndex.bind(this);
        this.goToIndexUser = this.goToIndexUser.bind(this);
        this.goToRegister = this.goToRegister.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
        this.handleLogoutSubmit = this.handleLogoutSubmit.bind(this);
        this.adding = this.adding.bind(this);
        this.addingOwner = this.addingOwner.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseOwner = this.handleCloseOwner.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onNumberChange = this.onNumberChange.bind(this);
        this.onAddPerson = this.onAddPerson.bind(this);
        this.onAddAction = this.onAddAction.bind(this);
        this.onAddOwner = this.onAddOwner.bind(this);
        this.handleNew = this.handleNew.bind(this);
        this.handleNotNew = this.handleNotNew.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.handleNewTossUp = this.handleNewTossUp.bind(this);
        this.switchSorteo = this.switchSorteo.bind(this);
        this.handleTossDelete = this.handleTossDelete.bind(this);
        this.handleSelectedTossOnePerson = this.handleSelectedTossOnePerson.bind(this);
        this.handleSelectedTossOneAction = this.handleSelectedTossOneAction.bind(this);
        this.handleSelectedTossPandA = this.handleSelectedTossPandA.bind(this);
        this.handleSelectedToss4All = this.handleSelectedToss4All.bind(this)

        Meteor.startup(()=> {
            $(window).bind('beforeunload', () => {
                console.log("exit");
                Meteor.call('appusers.offline');
                Meteor.call('appusers.updateUserLocation',"index");
            });
        });
    }

    goToIndex() {
        this.setState({location: "index"});
    }

    goToIndexUser() {
        Meteor.call('appusers.updateUserLocation',"index","null");
        this.setState({userLocation: "index"});
    }

    goToRegister() {
        this.setState({location: "register"});
    }

    goToLogin() {
        this.setState({location: "login"});
    }

    handleLogoutSubmit() {
        Meteor.call('appusers.offline');
        Meteor.call('appusers.updateUserLocation',"index","null");
        Meteor.logout();
    }

    handleNew() {
        this.setState({newToss: true, userLocation: "sorteo"});
    }

    handleNotNew() {
        this.setState({newToss: false});
    }

    handleNewTossUp() {
        this.setState({newToss: false, sorteo: 0});
        Meteor.call('tossUps.insert', this.state.inputName);
    }

    nameChange(e) {
        this.setState({inputName: e.target.value})
    }

    adding() {
        this.setState({add: true});
    }

    addingOwner() {
        this.setState({addOwner: true, userLocation: "sorteo"});
    }

    handleClose() {
        this.setState({add: false});
    }

    handleCloseOwner() {
        this.setState({addOwner: false});
    }

    handleDelete(id, action) {
        let i;
        if (action) {

            let newActions = [];
            let newAWeights = [];
            if (id === -1) {
                newActions = this.props.sorteos[this.state.sorteo].actions;
                newAWeights = this.props.sorteos[this.state.sorteo].weightsActions;
                newActions.pop();
                newAWeights.pop();
            } else {
                for (i = 0; i < this.props.sorteos[this.state.sorteo].actions.length; i++) {
                    if (i !== id) {
                        newActions.push(this.props.sorteos[this.state.sorteo].actions[i]);
                        newAWeights.push(this.props.sorteos[this.state.sorteo].weightsActions[i]);
                    }
                }
            }
            Meteor.call("tossUps.switchActions", this.props.sorteos[this.state.sorteo]._id, newActions, newAWeights);

        }
        else {

            let newpersons = [];
            let newAWeights = [];
            if (id === -1) {
                newpersons = this.props.sorteos[this.state.sorteo].persons;
                newAWeights = this.props.sorteos[this.state.sorteo].weightsPersons;
                newpersons.pop();
                newAWeights.pop();
            }
            else {
                for (i = 0; i < this.props.sorteos[this.state.sorteo].persons.length; i++) {
                    if (i !== id) {
                        newpersons.push(this.props.sorteos[this.state.sorteo].persons[i]);
                        newAWeights.push(this.props.sorteos[this.state.sorteo].weightsPersons[i]);
                    }
                }
            }
            Meteor.call("tossUps.switchPersons", this.props.sorteos[this.state.sorteo]._id, newpersons, newAWeights);

        }
    }

    handleTossDelete(id) {
        this.setState({userLocation: "index", sorteo: 0}, () => {
            let idd = this.props.sorteos[id]._id;
            Meteor.call('tossUps.deleteMyOwnership', idd);
        });

    }

    onTextChange(e) {
        this.setState({inputText: e.target.value});
    }

    onNumberChange(e) {
        if (Number(e.target.value)) {
            this.setState({inputNumb: Number(e.target.value)});
        }
        else {
            this.setState({inputNumb: 0});
        }
    }

    onAddPerson() {
        Meteor.call('tossUps.addPerson', this.props.sorteos[this.state.sorteo]._id, this.state.inputText, this.state.inputNumb);
        this.setState({add: false});
    }

    onAddAction() {
        Meteor.call('tossUps.addAction', this.props.sorteos[this.state.sorteo]._id, this.state.inputText, this.state.inputNumb);
        this.setState({add: false});

    }

    onAddOwner() {
        Meteor.call("tossUps.addOwner", this.props.sorteos[this.state.sorteo]._id, this.state.inputText);
        this.setState({addOwner: false})
    }

    switchSorteo(id) {
        this.setState({sorteo: id, userLocation: "sorteo"});
    }

    handleSelectedTossOnePerson(selected) {
        Meteor.call("tossUps.addResultP", this.props.sorteos[this.state.sorteo]._id, selected);
    }

    handleSelectedTossOneAction(selected) {
        Meteor.call("tossUps.addResultA", this.props.sorteos[this.state.sorteo]._id, selected);
    }

    handleSelectedTossPandA(selected) {
        Meteor.call("tossUps.addResultPandAs", this.props.sorteos[this.state.sorteo]._id, selected);
    }

    handleSelectedToss4All(selected) {
        Meteor.call("tossUps.addResult4All", this.props.sorteos[this.state.sorteo]._id, selected);
    }

    render() {

        return (
            <div>
                <div className={this.props.currentUser ? "user-banner" : "main-banner"}>
                    <div className={this.props.currentUser ? null : "main-content"}>
                        {
                            this.props.currentUser ?
                                <NavbarUser onLogoutCallback={this.handleLogoutSubmit} open={this.state.newToss}
                                            handleClose={this.handleNotNew} onTextChange={this.nameChange}
                                            handleNew={this.handleNewTossUp} openNew={this.handleNew}
                                            sorteos={this.props.sorteos} switchSorteo={this.switchSorteo}
                                            handleTossDelete={this.handleTossDelete} goToIndex={this.goToIndexUser}
                                            addOwner={this.addingOwner} userLocation={this.state.userLocation}
                                            sorteo={(this.props.sorteos && this.props.sorteos.length > 0 &&
                                                this.props.sorteos[this.state.sorteo]) ? this.props.sorteos[this.state.sorteo] : null}
                                            users={(this.props.users && this.props.users.length > 0 ? this.props.users : [])}
                                /> :
                                <NavbarIndex goToIndex={this.goToIndex}/>
                        }
                        <div className="body-content">
                            {
                                this.props.currentUser ?
                                    (this.state.userLocation === "sorteo" && this.props.sorteos && this.props.sorteos.length > 0) ?
                                        <Selector adding={this.adding} add={this.state.add}
                                                  addOwner={this.state.addOwner}
                                                  actions={(this.props.sorteos && this.props.sorteos.length > 0
                                                      && this.props.sorteos[this.state.sorteo]) ? this.props.sorteos[this.state.sorteo].actions : []}
                                                  persons={(this.props.sorteos && this.props.sorteos.length > 0
                                                      && this.props.sorteos[this.state.sorteo]) ? this.props.sorteos[this.state.sorteo].persons : []}
                                                  weightsActions={(this.props.sorteos && this.props.sorteos.length > 0
                                                      && this.props.sorteos[this.state.sorteo]) ? this.props.sorteos[this.state.sorteo].weightsActions : []}
                                                  weightsPersons={(this.props.sorteos && this.props.sorteos.length > 0
                                                      && this.props.sorteos[this.state.sorteo]) ? this.props.sorteos[this.state.sorteo].weightsPersons : []}
                                                  handleClose={this.handleClose}
                                                  handleCloseOwner={this.handleCloseOwner}
                                                  handleDelete={this.handleDelete} onTextChange={this.onTextChange}
                                                  tossData={(this.props.sorteos && this.props.sorteos.length > 0) ? this.props.sorteos[this.state.sorteo] : {}}
                                                  onNumberChange={this.onNumberChange}
                                                  onAddAction={this.onAddAction} onAddPerson={this.onAddPerson}
                                                  onAddOwner={this.onAddOwner}
                                                  handleSelectedPerson={this.handleSelectedTossOnePerson}
                                                  handleSelectedAction={this.handleSelectedTossOneAction}
                                                  handleSelectedPandA={this.handleSelectedTossPandA}
                                                  handleSelectedToss4All={this.handleSelectedToss4All}
                                                  owners={(this.props.sorteos && this.props.sorteos.length > 0
                                                      && this.props.sorteos[this.state.sorteo]) ? this.props.sorteos[this.state.sorteo].owners : []}
                                                  addSteps={this.addSteps}
                                                  inputNumb={this.state.inputNumb}
                                                  sorteo={(this.props.sorteos && this.props.sorteos.length > 0 &&
                                                      this.props.sorteos[this.state.sorteo]) ? this.props.sorteos[this.state.sorteo] : null}
                                                  users={(this.props.users && this.props.users.length > 0 ? this.props.users : [])}
                                        />
                                        :
                                        <UserIndex
                                            sorteos={(this.props.sorteos) ? this.props.sorteos : []}
                                            openNew={this.handleNew}
                                            switchSorteo={this.switchSorteo}
                                            handleTossDelete={this.handleTossDelete}
                                            addSteps={this.addSteps}
                                        />
                                    :
                                    this.state.location === "index" ?
                                        <Index handleGetStarted={this.goToRegister}
                                               goToLogin={this.goToLogin}/> :
                                        this.state.location === "login" ?
                                            <LoginManager/> :
                                            <RegisterManager/>
                            }
                        </div>
                    </div>
                </div>
                <Footer goToIndex={this.goToIndex}/>
                <CustomDialog open={this.state.add} handleClose={this.handleClose} action={true}
                              person={true} onTextChange={this.onTextChange}
                              onNumberChange={this.onNumberChange} onAddAction={this.onAddAction}
                              onAddPerson={this.onAddPerson} inputNumb={this.state.inputNumb}/>
                <NewTossUpDialog open={this.state.newToss}
                                 handleClose={this.handleNotNew} onTextChange={this.nameChange}
                                 handleNew={this.handleNewTossUp} openNew={this.handleNew}/>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("appusers");
    Meteor.subscribe("sorteos");
    let all = TossUps.find().fetch();
    all.sort((a,b)=>b.createdAt-a.createdAt);
    let users = Users.find().fetch();
    return {
        currentUser: Meteor.user(),
        users: users,
        sorteos: all
    }
})(App);


