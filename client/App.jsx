import React from 'react';
import './styles.css';
import axios from 'axios';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        axios.get('https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc')
            .then(res => {
                this.setState({
                    data: res.data.items
            })
        })
        console.log(this.state.data)
    }
    render () {
        return (
        <div>
            <button onClick={this.handleClick}>
                GET REPOS
            </button>
            {this.state.data.map(item => {
                return (
                <div>
                    <img src={item.owner.avatar_url}/>
                    <div>GitHub Username: {item.owner.login}</div>
                    <div>repo name: {item.name}</div>
                    <div>description: {item.description}</div>
                    <div># of stars: {item.stargazers_count}</div>
                    {/* should issues include all issues or just current open issues? */}
                    <div># of issues: {item.open_issues}</div>
                </div>
                )
            })}
        </div>
        )
    }
}

export default App;