import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { getTeamMembers } from '../redux/services';
import _env from '../env.json';
const serverUrl = _env.appUrl;

class Team extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            selectedMember: null
        }
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Meet PAYPER WIN Team.' });

        getTeamMembers()
            .then(({ data }) => {
                this.setState({ members: data });
            })
            .catch(() => { })
    }

    render() {
        const { members, selectedMember } = this.state;

        return (
            <div className="col-in">
                <div className='text-center my-5'>
                    <h1 className='text-white'>Meet Our Team</h1>
                    <p></p>
                </div>
                {selectedMember == null && <div className='row'>
                    {members.map((member, index) => (
                        <div className='col-12 col-sm-6 col-md-4 cursor-pointer' key={index} onClick={() => this.setState({ selectedMember: member })}>
                            <div className='d-flex flex-column align-items-center member-wrapper shadow py-3'>
                                <img src={serverUrl + member.photo} className='member-photo' />
                                <h3 className='member-name mt-2'>{member.name}</h3>
                                <h5 className='member-position'>{member.position}</h5>
                                <p className='member-short-description'>{member.shortDescription}</p>
                                <p className='member-read-more'>Read More</p>
                            </div>
                        </div>
                    ))}
                </div>}
                {selectedMember && <div className='row'>
                    <div className='col-md-4 d-flex justify-content-start justify-content-md-end'>
                        <img src={serverUrl + selectedMember.photo} className='member-photo-detail' />
                    </div>
                    <div className='col-md-8'>
                        <h3 className='member-name mt-2'>{selectedMember.name}</h3>
                        <h5 className='member-position'>{selectedMember.position}</h5>
                        <div className='my-2' dangerouslySetInnerHTML={{ __html: selectedMember.fullDescription }}></div>
                        <span className='member-back-button' onClick={() => this.setState({ selectedMember: null })}><i className='fas fa-chevron-left' /> Back</span>
                    </div>
                </div>}
            </div>
        );
    }
}

export default Team;