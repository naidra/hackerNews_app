import React from 'react';
import { ContextConsumer } from '../ContextApi';

export const ProfilePage = (properties) => (
    <ContextConsumer>
        {
            props => {
                const profile = props.auth.getProfile();
                if(!profile) return (
                    <main className="profile-page">
                        <div className="inner-container">
                            <h3>
                                You should 
                                &nbsp;<span className="green-back" onClick={props.auth.logIn}>log in</span>&nbsp;
                                to see your profile
                            </h3>
                        </div>
                    </main>
                )

                const { name, nickname, picture, updated_at } = profile;
                return(
                    <main className="profile-page">
                        <div className="inner-container">
                            <div className="img-wrapp">
                                <img src={picture} alt="Pic" />
                            </div>
                            <div className="content-wrapp">
                                <p className="user-name"><span className="desc">User name:</span> <span className="green-back">{ name }</span></p>
                                <p className="user-name"><span className="desc">Nickname:</span> <span className="green-back">{ nickname }</span></p>
                                <p className="date-today"><span className="desc">Logged in at:</span> <span className="green-back">
                                    {(new Date(updated_at)).toString().split(' ').splice(0, 5).join(' ') }
                                </span></p>
                            </div>
                        </div>
                    </main>
                )
            }
        }
    </ContextConsumer>
)