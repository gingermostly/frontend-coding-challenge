import React from 'react';
import './styles.css';
import axios from 'axios';

const getCurrent = new Date();

const pastThirty = new Date().setDate(getCurrent.getDate() - 30);

const searchDate = new Date(pastThirty).toISOString().slice(0, 10);

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        axios.get(`https://api.github.com/search/repositories?q=created:>${searchDate}&sort=stars&order=desc`)
            .then(res => {
                this.setState({
                    data: res.data.items
            })
        })
    }
    render () {
        return (
        <div>
            <button onClick={this.handleClick}>
                GET REPOS
            </button>
            {this.state.data.map(item => {
                console.log(this.state.data)
                return (
                <div className='container'>
                    <img src={item.owner.avatar_url}/>
                    <div className='repo-wrapper'>
                        <div className='title'>{item.name}</div>
                        <div className='description'>{item.description}</div>
                    </div>
                    <div># of stars: {item.stargazers_count}</div>
                    {/* should issues include all issues or just current open issues? */}
                    <div># of issues: {item.open_issues}</div>
                    <div>GitHub Username: {item.owner.login}</div>
                </div>
                )
            })}
        </div>
        )
    }
}

export default App;