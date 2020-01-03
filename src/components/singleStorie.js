import React from 'react';
import { ContextConsumer } from '../ContextApi';
import { Story } from './story.js';
import { Loader } from './loader.js';

export const SingleStorie = () => (
    <ContextConsumer>
        {
            props => {
                if(!props.state.stories.length) return <Loader />
                return(
                    <main className="stories-page one">
                        <div className="inner-container">
                            <p>Log in to see more stories from hacker news</p>
                            {props.state.stories.length &&
                                <Story item={props.state.stories[0]} emoji={'💢'} loadComments={props.loadComments} />}
                        </div>
                    </main>
                )
            }
        }
    </ContextConsumer>
)