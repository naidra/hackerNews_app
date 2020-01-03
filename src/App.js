import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { createBrowserHistory } from "history";
import { Header } from './components/header';
import { Footer } from './components/footer';
import { MultiStories } from './components/multiStories';
import { SingleStorie } from './components/singleStorie';
import { ProfilePage } from './components/profile';
import { NotFound } from './components/404';
import { ContextProvider } from './ContextApi';
import Auth from './Auth';

const auth = new Auth();
const history = createBrowserHistory();

class App extends Component {
	constructor() {
		super();
		this.state = {
			user: auth.getProfile(),
			isLogedIn: auth.isAuthenticated(),
			error: null,
			stories: [],
			maxScore: 0,
			loading: false
		};

		this.changeState = this.changeState.bind(this);
		this.getStories = this.getStories.bind(this);
		this.loadComments = this.loadComments.bind(this);
		this.rotateMenu = this.rotateMenu.bind(this);
	}
	componentDidMount() {
		console.log();

		// if(!this.state.isLogedIn)
		if(history.location.hash)
			auth.handleAuthentication((ob) => this.changeState(ob));

		this.getStories();
	}
	componentWillUpdate(nextProps, nextState) {
		this.rotateMenu(nextState.loading, 0);
	}
	changeState(newState) {
		this.setState({...this.state, ...newState});
	}
	async getStories() {
		this.setState({ loading: true });
		const stories = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
		this.fetchStories(stories.data.splice(0, 50));
	}
	async fetchStories(storiesIds) {
		const storiesFetched = await Promise.all(
			storiesIds.map(story => axios.get('https://hacker-news.firebaseio.com/v0/item/' + story + '.json'))
		);
		const stories = storiesFetched.map(story => story.data),
			maxScore = stories.map(s => s.score);

		this.setState({stories, maxScore: Math.max(...maxScore), loading: false});
	}
	async loadComments(button, storyId, commentsIds) {
		if(button.hasAttribute('clicked')) {
			button.classList.toggle('active');
			return;
		}
		const storiesCopy = [...this.state.stories];
		button.classList.add('active', 'loading');
		button.setAttribute('clicked', 1);
		const commentsFetched = await Promise.all(
			commentsIds.map(comment => axios.get('https://hacker-news.firebaseio.com/v0/item/' + comment + '.json'))
		);
		
		button.classList.remove('loading');
		const story = storiesCopy.find(story => story.id === storyId),
			index = storiesCopy.indexOf(story);

		storiesCopy[index].comments = commentsFetched.map(story => story.data);
		this.setState({stories: storiesCopy});
	}
	rotateMenu(loading, degrees) {
		//console.log(parseInt(getComputedStyle(this.appTag).getPropertyValue('--deg')));
		if(!degrees) this.appTag.querySelector('nav .inner-container').style.removeProperty('transition');
		if(loading || (degrees * 20) % 360) {
			this.appTag.classList.add('loading');
			++degrees;
			this.appTag.style.setProperty('--deg', `${degrees * 20}deg`);

			setTimeout(() => this.rotateMenu(this.state.loading, degrees), 51);
			
			if(!loading && !((degrees * 20) % 360)) {
				this.appTag.classList.remove('loading');
				setTimeout(() => {
					this.appTag.style.removeProperty('--deg');
					this.appTag.querySelector('nav .inner-container').style.setProperty('transition', 'all 0s');
				}, 200);
			}
		}
	}
	render() {
		const propsToPass = {
			state: this.state,
			changeState: this.changeState,
			loadComments: this.loadComments,
			auth
		};
		return (
			<Router basepath="/newsApp">
				<ContextProvider value={propsToPass}>
					<PerfectScrollbar onScrollDown={container => console.log(`Scrolled to: ${container.scrollTop}px`)}>
						<div className="App" ref={app => this.appTag = app}>
							<Header />
							<Switch>
								<Route exact path="/" render={props => (this.state.isLogedIn ? <MultiStories /> : <SingleStorie />) } />
								<Route path="/Profile" component={ProfilePage} />
								<Route component={NotFound} />
							</Switch>
							<Footer />
						</div>
					</PerfectScrollbar>
				</ContextProvider>
			</Router>
		);
	}
}

export default App;
