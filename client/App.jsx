import React, { useEffect } from 'react';
import './styles.css';
import axios from 'axios';

const getCurrent = new Date();

const pastThirty = new Date().setDate(getCurrent.getDate() - 30);

const searchDate = new Date(pastThirty).toISOString().slice(0, 10);

// Convert number to decimal and add 'm' if in millions or 'k' if in thousands
const convertNum = (num) => {
    if (num > 9999999) {
      num = num / 1000000
      return `${num.toFixed(1)}m`
    }
    if (num > 999) {
      num = num / 1000;
      return `${num.toFixed(1)}k`
    }
    return num;
}

let currentPage = 1;

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
        this.handleScroll = this.handleScroll.bind(this);
    }
    componentDidMount() {
        axios.get(`https://api.github.com/search/repositories?q=created:>${searchDate}&sort=stars&order=desc&page=${currentPage}&per_page=25`)
            .then(res => {
                console.log(res.data.items)
                this.setState({
                    data: res.data.items
            })
        })
    }
    handleScroll(e) {
        let height = e.target.scrollHeight;
        let top = e.target.scrollTop;
        let client = e.target.clientHeight;
        if (height - top === client) {
            currentPage++;
            axios.get(`https://api.github.com/search/repositories?q=created:>${searchDate}&sort=stars&order=desc&page=${currentPage}&per_page=50`)
            .then(res => {
                this.setState({
                    data: this.state.data.concat(res.data.items)
                })   
            })
        }
    }
    render () {
        return (
        <div className='scroll-container' onScroll={this.handleScroll}>
            {this.state.data.map(item => {
                return (
                <div className='container'>
                    <div className='avatar'><img src={item.owner.avatar_url}/></div>
                    <div className='repo-wrapper'>
                        <div className='title'>{item.name}</div>
                        <div className='description'>{item.description}
                            <a href={item.html_url}>{item.html_url}</a>
                        </div>
                        <div className='details-wrapper'>
                        <div className='btn-style'>Stars: {convertNum(item.stargazers_count)}</div>
                        {/* should issues include all issues or just current open issues? Included all issues for now */}
                        <div className='btn-style'>Issues: {convertNum(item.open_issues)}</div>
                        <div className='user'>Submitted 30 days ago by {item.owner.login}</div>
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
        )
    }
}

export default App;