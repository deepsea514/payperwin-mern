import React from 'react'
 
class Subscribe extends React.Component {

    state = {
        term: ''
    };

    render(){
        return (
            <section className="subscribe-area">
                <div className="container">
                    <div className="subscribe-inner">
                        <span>Want Something Extra?</span>
                        <h2>Sign Up For Our Newsletter</h2>

                        <form className="newsletter-form" data-toggle="validator">
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="Enter your email address" 
                                name="EMAIL" 
                                required 
                                autoComplete="off" 
                                value={this.state.term}
                                onChange={(e) => this.setState({term: e.target.value})}
                            />
                            <button className="btn btn-primary" type="submit">Subscribe</button>
                            <div id="validator-newsletter" className="form-result"></div>
                        </form>
                    </div>

                </div>
            </section>
        );
    }
}
 
export default Subscribe;