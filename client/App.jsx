import React from 'react';
import './styles.css';
import axios from 'axios';

// get current date
const getCurrent = new Date();
// calculate and set date to 30 days previous based on current date
const pastThirty = new Date().setDate(getCurrent.getDate() - 30);
// format date for inclusion in GitHub api call
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
                this.setState({
                    data: res.data.items
            })
        })
    }
    handleScroll(e) {
        let height = e.target.scrollHeight;
        let top = e.target.scrollTop;
        let client = e.target.clientHeight;
        if ((height - top) - client <= 150) {
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
                console.log(item)
                // get repo creation date
                let createdDate = new Date(item.created_at);
                // get difference betweeen dates in milliseconds
                let milliseconds = getCurrent.getTime() - createdDate.getTime();
                // convert milliseconds to days to get number of days since creation date to current date
                let timeInterval = Math.floor(milliseconds / (1000 * 3600 * 24));
                return (
                <div className='container' key={item.id}>
                    <div className='avatar'>
                        <img src={item.owner.avatar_url} />
                    </div>
                    <div className='repo-wrapper'>
                        <div className='title'>{item.name}</div>
                        <div className='description'>{item.description}
                            <a href={item.html_url} target='_blank'>{item.html_url}</a>
                        </div>
                    <div className='details-wrapper'>
                        <div className='btn-style'>Stars: {convertNum(item.stargazers_count)}</div>
                        {/* should issues include all issues or just current open issues? Included only open issues for now as a separate issues API would need to be utilized to get all issues and would involve some code refactoring to include
                         */}
                        <div className='btn-style'>Issues: {convertNum(item.open_issues)}</div>
                        <div className='user'>Submitted {timeInterval} days ago by <a href={item.owner.html_url} target='_blank'>{item.owner.login}</a></div>
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