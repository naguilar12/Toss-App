import React, {Component} from 'react';
import Roulette from "../roulette/Roulette.js";
import Dialog from '../adding/CustomDialog.js';
import OwnerDialog from '../adding/OwnerDialog.js';
import AddButton from "../adding/AddButton";
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';


// App component - represents the random person sorting app

export default class TossPandA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            spin: false,
            value: "",
            chosenOne: null
        };
        this.handleRouletteSpin = this.handleRouletteSpin.bind(this);
        this.onSpin = this.onSpin.bind(this);
        this.click = this.click.bind(this);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
    }

    handleRouletteSpin(value) {

        Meteor.call("tossUps.addResultPandAs", this.props.selected._id, {person: this.state.chosenOne, action:value});
        this.setState({value:value});

    };

    handleRequestDelete(i, action) {
        this.props.handleDelete(i - 1, action);
    };

    click() {
        this.setState({spin: true, value: ""});
    }

    onSpin(callback) {
        //let's choose the lucky person
        let arr = [];
        let i;
        let j = 0;
        this.props.weightsPersons.forEach((p) => {
            for (i = 0; i < p; i++) {
                arr.push(this.props.persons[j]);
            }
            j++;
        });
        let x = Math.round(Math.random() * (arr.length - 1));
        let chosenOne = arr[x];
        this.setState({spin: false, value: "", chosenOne: chosenOne},
            callback);
    }

    render() {

        let opt = [];
        let persons = [];
        let i = 0;
        let totalWeight = 0;
        if (this.props.weights && this.props.weights.length > 0) {
            totalWeight = this.props.weights.reduce((a, w) => a + w);

            let totalPWeight = 0;
            if (this.props.weightsPersons && this.props.weightsPersons.length > 0) {
                totalWeight = this.props.weightsPersons.reduce((a, w) => a + w);


                this.props.options.forEach((op) => {
                        i += 1;
                        opt.push(<ListItem
                            primaryText={op + " :" + Math.round(this.props.weights[i - 1] / totalWeight * 100) + "%"}
                            key={i}
                            rightIcon={<ActionDelete onClick={this.handleRequestDelete.bind(this, i, true)}/>}/>);
                    }
                );
                i = 0;
                this.props.persons.forEach((op) => {
                        i += 1;
                        persons.push(<ListItem
                            primaryText={op + " :" + Math.round(this.props.weights[i - 1] / totalPWeight * 100) + "%"}
                            key={i}
                            rightIcon={<ActionDelete
                                onClick={this.handleRequestDelete.bind(this, i, false)}/>}/>);
                    }
                );
            }
        }
        i = 0;
        let results = [];
        if(this.props.selected.resultsPandAs) {
            this.props.selected.resultsPandAs.forEach((op) => {
                    i += 1;
                    results.push(<ListItem primaryText={op.person + ": " + op.action} key={i}/>);
                }
            );
        }
        const ink = {
            backgroundColor: '#149bda'
        };
        const paperInk = {
            backgroundColor: "#BBDBB8",
        };

        return (
            <div>
                <div className="row">
                    <div className="col-11"></div>
                    <div className="col-1">
                        <AddButton adding={this.props.adding}/>
                    </div>
                </div>
                <div className="container-fluid row">

                    <div className="col-sm-8 col-12">
                        <div className="roulette-container">
                            <MuiThemeProvider>
                                <RaisedButton label="Spin" style={ink} onClick={this.click}
                                              aria-label="Boton girar Ruleta"/>
                            </MuiThemeProvider>
                        </div>
                        <Roulette options={(this.props.options)?this.props.options:[]} baseSize={250} spin={this.state.spin}
                                  onSpin={this.onSpin}
                                  onComplete={this.handleRouletteSpin} weights={(this.props.weights)?this.props.weights:[]}/>
                    </div>
                    <div className="col-sm-2 col-6">
                        <MuiThemeProvider>
                            <Paper zDepth={2} rounded={false} style={paperInk}>
                                <List>
                                    {opt}
                                </List>
                                <Divider/>
                                <List>
                                    {results}
                                </List>
                            </Paper>
                        </MuiThemeProvider>

                    </div>
                    <div className="col-sm-2 col-6">
                        <MuiThemeProvider>
                            <Paper zDepth={2} rounded={false} style={paperInk}>
                                <List>
                                    {persons}
                                </List>
                                <Divider/>
                            </Paper>
                        </MuiThemeProvider>

                    </div>


                </div>
                <Dialog open={this.props.add} handleClose={this.props.handleClose} action={this.props.action}
                        person={this.props.person} onTextChange={this.props.onTextChange}
                        onNumberChange={this.props.onNumberChange} onAddAction={this.props.onAddAction}
                        onAddPerson={this.props.onAddPerson}/>
                <OwnerDialog open={this.props.addOwner} handleCloseOwner={this.props.handleCloseOwner}
                             onTextChange={this.props.onTextChange} onAddOwner={this.props.onAddOwner}/>
                <MuiThemeProvider>
                    <Snackbar
                        open={this.state.value !== ""}
                        message={this.state.chosenOne + ": " + this.state.value}
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestClose}
                        bodyStyle={{height: 200, width: 200, flexGrow: 0}}
                        contentStyle={{fontSize: 30}}
                    />
                </MuiThemeProvider>
            </div>

        );


    }
}