import React, { Fragment } from 'react';
import { ContextConsumer } from '../ContextApi';
import { NavLink } from "react-router-dom";

export const Header = () => (
    <ContextConsumer>
        {
            props => {
                return(
                    <Fragment>
                        <header>
                            <div className="inner-container">
                                <h1 className="app-title">News App</h1>
                            </div>
                        </header>
                        <nav>
                            <div className="inner-container">
                                <NavLink exact activeClassName="activated" to="./"><span>Home</span></NavLink>
                                <NavLink activeClassName="activated" to="./Profile"><span>Profile</span></NavLink>
                                {
                                    props.auth.isAuthenticated() ?
                                    <button className="last-item" onClick={() => {
                                        props.auth.logOut();
                                        props.changeState({isLogedIn: false});
                                    }}><span>Log out</span></button> : 
                                    <button className="last-item" onClick={props.auth.logIn}><span>Log in</span></button>
                                }
                            </div>
                        </nav>
                    </Fragment>
                )
            }
        }
    </ContextConsumer>
)