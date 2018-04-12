import React, {Component} from 'react';
import PropTypes from "prop-types"
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Subheader from 'material-ui/Subheader';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionHelp from 'material-ui/svg-icons/action/help-outline';
import Divider from 'material-ui/Divider';

import "./UserIndex.css";

export default class UserIndex extends Component {


    render() {
        let sorteos = [];
        let i = 0;

        const paperStyle = {

            backgroundColor: "#FAFAFA",
        };

        const itemStyle = {
            padding:"padding: 0px 72px 0px 16px",
            fontFamily: "\'Hind Madurai\', cursive",
            fontSize: "20px",
            color: "#14061F",
        };

        const subHeaderStyle = {
            color: "#14061F",
            fontSize: "23px",
            fontFamily: "\'Lora\', cursive",
            paddingRight: "5%",
        };

        this.props.sorteos.forEach((s)=>{
            sorteos.push(<ListItem style={itemStyle} key={i} primaryText={<div style={{width:"100%", height:"100%"}} onClick={this.props.switchSorteo.bind(this,i)}>{s.name}</div>} onClick={this.props.switchSorteo.bind(this,i)}
                                   rightIcon={<ActionDelete style={itemStyle}
                                                            onClick={this.props.handleTossDelete.bind(this, i)}/>}/>);
            i++;
        });
        if (sorteos.length===0){
            sorteos.push(<ListItem style={itemStyle} key={i++} primaryText={"Let's start by creating a new toss-up." +
            " Once you have toss-ups you'll see them here. Enter a name that characterizes your toss-up when prompted."}/>);
            sorteos.push(<button
                key={i++}
                onClick={this.props.openNew}
                className="btn btn-new">NEW TOSS-UP</button>);
        }
        return (
            <div className="row justify-content-around center-items backgroundUser">
                <div className="col-md-5 col-12 center-items">
                    <div className="card welcome-card">
                        <img className="card-img-top welcome-image" src="./resources/welcome.jpg" alt="welcome image"/>
                        <div className="card-body">
                            <h4 className="card-title">Welcome to Toss-App!</h4>
                            <h5 className="card-subtitle">We are pleased to have you here.</h5>
                            <p>This is your dashboard were you can get informed about new features, content and much
                                more.
                                Also you can explore and manage your toss-ups. If you haven't made any toss-ups, give it
                                a
                                try right now!</p>
                            <p>Invite your friend to your toss-ups as owners so you can all see them at the same time!</p>
                            <button
                                id={"newTossUpButton"}
                                onClick={this.props.openNew}
                                className="btn btn-new">NEW TOSS-UP</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 col-12 center-items sorteos-list">
                    <MuiThemeProvider>
                        <Paper zDepth={2} rounded={false} style={paperStyle}>
                            <List>
                                <Subheader style={subHeaderStyle}>Your Toss-ups</Subheader>
                                <Divider/>
                                {sorteos}
                            </List>
                        </Paper>
                    </MuiThemeProvider>
                </div>
            </div>
        );
    }
}

UserIndex.propTypes = {
    sorteos: PropTypes.array.isRequired,
};
