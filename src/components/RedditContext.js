import React, { Component, createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getPostsBySubreddit } from '../services/redditAPI';

const Context = createContext();
const { Provider, Consumer } = Context;

function RedditProvider({ children }) {
  const [ postsBySubreddit, setPostsBySubreddit ] = useState({});
  const [ selectedSubreddit, setSelectedSubreddit ] = useState('reactjs');
  const [ availableSubreddits, setAvailableSubreddits ] = useState(['reactjs', 'frontend']);
  const [ posts, setPosts ] = useState([]);

  const Context = {
    postsBySubreddit, setPostsBySubreddit, selectedSubreddit, setSelectedSubreddit,
    availableSubreddits, setAvailableSubreddits, posts, setPosts,
  };

  const fetchPosts = async (selectedSubreddit) => {
    await getPostsBySubreddit(selectedSubreddit)
      .then((response) => {
        setPostsBySubreddit({ [selectedSubreddit]: response.data.children });
        setPosts(response.data.children.map((post) => post.data.title));
      });
  }

  useEffect(() => {
    fetchPosts(selectedSubreddit);
  }, [selectedSubreddit]);

  return (
    <Provider value={Context}>
      {children}
    </Provider>
  );
}
/*
class RedditProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postsBySubreddit: {
        frontend: {},
        reactjs: {},
      },
      selectedSubreddit: 'reactjs',
      shouldRefreshSubreddit: false,
      isFetching: false,
    };

    this.fetchPosts = this.fetchPosts.bind(this);
    this.shouldFetchPosts = this.shouldFetchPosts.bind(this);
    this.handleFetchSuccess = this.handleFetchSuccess.bind(this);
    this.handleFetchError = this.handleFetchError.bind(this);
    this.handleSubredditChange = this.handleSubredditChange.bind(this);
    this.handleRefreshSubreddit = this.handleRefreshSubreddit.bind(this);
  }

  componentDidUpdate(_prevProps, prevState) {
    const { state } = this;
    const { shouldRefreshSubreddit } = state;
    const selectedSubredditChanged = prevState.selectedSubreddit !== state.selectedSubreddit;

    if (selectedSubredditChanged || shouldRefreshSubreddit) {
      this.fetchPosts();
    }
  }

  fetchPosts() {
    if (!this.shouldFetchPosts()) return;

    this.setState({
      shouldRefreshSubreddit: false,
      isFetching: true,
    });

    const { selectedSubreddit } = this.state;
    getPostsBySubreddit(selectedSubreddit)
      .then(this.handleFetchSuccess, this.handleFetchError);
  }

  shouldFetchPosts() {
    const {
      selectedSubreddit,
      postsBySubreddit,
      shouldRefreshSubreddit,
      isFetching,
    } = this.state;
    const posts = postsBySubreddit[selectedSubreddit];

    if (!posts.items) return true;
    if (isFetching) return false;
    return shouldRefreshSubreddit;
  }

  handleFetchSuccess(json) {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);

    this.setState((state) => {
      const newState = {
        ...state,
        shouldRefreshSubreddit: false,
        isFetching: false,
      };

      newState.postsBySubreddit[state.selectedSubreddit] = {
        items,
        lastUpdated,
      };

      return newState;
    });
  }

  handleFetchError(error) {
    this.setState((state) => {
      const newState = {
        ...state,
        shouldRefreshSubreddit: false,
        isFetching: false,
      };

      newState.postsBySubreddit[state.selectedSubreddit] = {
        error: error.message,
        items: [],
      };

      return newState;
    });
  }

  handleSubredditChange(selectedSubreddit) {
    this.setState({ selectedSubreddit });
  }

  handleRefreshSubreddit() {
    this.setState({ shouldRefreshSubreddit: true });
  }

  render() {
    const { children } = this.props;
    const { selectedSubreddit, postsBySubreddit } = this.state;
    const context = {
      ...this.state,
      selectSubreddit: this.handleSubredditChange,
      fetchPosts: this.fetchPosts,
      refreshSubreddit: this.handleRefreshSubreddit,
      availableSubreddits: Object.keys(postsBySubreddit),
      posts: postsBySubreddit[selectedSubreddit].items,
    };

    return (
      <Provider value={context}>
        {children}
      </Provider>
    );
  }
}

RedditProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
*/
export { RedditProvider as Provider, Consumer, Context };