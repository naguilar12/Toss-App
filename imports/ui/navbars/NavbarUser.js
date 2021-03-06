import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';
import SignOut from "material-ui/svg-icons/action/power-settings-new"
import {white} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import "./NavbarUser.css";

/**
 * This className contains all needed to display the nav bar on top.
 */
export default class NavbarUser extends Component {

    render() {
        const background = {
            backgroundColor: 'rgb(55,55,55)'
        };
        const titleStyle = {
            textAlign: "center"
        };
        const boldStyle = {
            textAlign: "center",
            fontWeight: "bold"
        };
        let sorteos = [];
        let i = 0;
        this.props.sorteos.sort((s1, s2) => s2.createdAt - s1.createdAt);
        this.props.sorteos.forEach((sorteo) => {
            sorteos.push(<MenuItem primaryText={sorteo.name} style={titleStyle} key={i++}
                                   onClick={this.props.switchSorteo.bind(this, i - 1)}
                                   rightIcon={<ActionDelete onClick={this.props.handleTossDelete.bind(this, i - 1)}/>}
            />)
        });
        return (
            <div>
                <MuiThemeProvider>
                    <AppBar
                        title={<img onClick={this.props.goToIndex} className="col-4 col-sm-2 col-md-1 appbar-logo"
                                    src="name.png" alt="Toss-App"/>}
                        iconElementLeft={
                            <IconMenu
                                iconButtonElement={<IconButton aria-label="Boton para expandir el menu"
                                ><Menu color={white}/></IconButton>}
                                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                                targetOrigin={{horizontal: 'left', vertical: 'top'}}

                            >
                                <MenuItem primaryText="Sign out" leftIcon={<SignOut/>}
                                          onClick={this.props.onLogoutCallback}/>
                                <Divider/>
                                <MenuItem primaryText="New Toss-up" leftIcon={<ContentAdd/>}
                                          onClick={this.props.openNew}/>
                                <Divider/>
                                <MenuItem primaryText="My Toss-ups" style={boldStyle}/>
                                {sorteos}
                                {
                                    this.props.userLocation === "sorteo" ?
                                        <div>
                                            <Divider/>
                                            <MenuItem primaryText="Add Owner" leftIcon={<ContentAdd/>}
                                                      onClick={this.props.addOwner}/>
                                        </div> :
                                        null
                                }
                            </IconMenu>
                        }
                        style={background}
                        titleStyle={titleStyle}
                    />
                </MuiThemeProvider>
                <MuiThemeProvider>
                    <Dialog
                        actions={[

                            <FlatButton
                                label="Add New"
                                primary={true}
                                keyboardFocused={true}
                                onClick={this.props.handleNew}
                                aria-label="Boton para agragar accion"
                            />,
                            <FlatButton
                                label="Cancel"
                                primary={true}
                                onClick={this.props.handleClose}
                                aria-label="Cancelar"
                            />
                        ]}
                        modal={false}
                        open={this.props.open}
                        onRequestClose={this.props.handleClose}
                    >
                        <label htmlFor="textInput">Nombre</label><input id="textInput" type="text"
                                                                        onChange={this.props.onTextChange}
                    />

                    </Dialog>
                </MuiThemeProvider>
            </div>

        );
    }
}
