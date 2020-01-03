import React from 'react';
import { ContextConsumer } from '../ContextApi';
import { Loader } from './loader.js';
import { Story } from './story.js';
import countryFlagEmoji from "country-flag-emoji";
const emoji = countryFlagEmoji.list.map(item => item.emoji);
export const MultiStories = () => (
    <ContextConsumer>
        {
            props => {
                if(!props.auth.isAuthenticated()) return null;
                if(!props.state.stories.length) return <Loader />
                return(
                    <main className="stories-page">
                        <div className="inner-container">
                            <p>Stories from hacker news</p>
                            <div className="story-wrapper">
                            {
                                props.state.stories.map((story, i) =>
                                    <Story key={i}
                                        item={story}
                                        emoji={emoji[Math.floor(Math.random()*emoji.length)]}
                                        loadComments={props.loadComments}
                                        maxScore={props.state.maxScore} />
                                )
                            }
                            </div>
                        </div>
                    </main>
                )
            }
        }
    </ContextConsumer>
)