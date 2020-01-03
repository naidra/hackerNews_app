import React from 'react';
import renderHTML from 'react-render-html';

export const Story = ({item, emoji, loadComments, maxScore}) => (
    <div className="story">
        <p className="emoji">{emoji}</p>
        <a href={item.url}><h3>{item.title}</h3></a>
        <p><span className="desc">Posted by: </span><span>{item.by}</span></p>
        <p><span className="desc">Posted at: </span><span>{
            (new Date(item.time * 1000)).toString().split(' ').splice(0, 5).join(' ')
        }</span></p>
        <p>
            <span className="desc">Score: </span>
            <span>{item.score}</span>&nbsp;
            <span className="progress" style={{'--width': ((100/maxScore) * item.score) + '%'}}></span>
        </p>
        <p><span className="desc">Comments: </span><span>{item.kids ? item.kids.length : 0}</span></p>
        {
            item.kids &&
            <button className="green-back" onClick={({currentTarget:btn}) => loadComments(btn, item.id, item.kids)}>Load comments</button>
        }
        {
            item.comments ? 
            <ul className="story-comments">
                {item.comments.map((comment, i) => <li key={comment.by + i}>
                    <span className="text">{comment.text && renderHTML(comment.text)}</span>
                    <span className="autor">By: <span className="green-back">{comment.by}</span></span>
                </li>)}
            </ul> : null
        }
    </div>
)