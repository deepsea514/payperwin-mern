import React, { Component } from "react";
import Stories from 'react-insta-stories';

const stories = [
    {
        url: '/images/promotion-banner.jpg',
        loader: true,
    },
    {
        url: 'https://placeimg.com/1080/1920',
        loader: true,
    },
    {
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        type: 'video',
        loader: true,
    }
]

export default class PromotionModal extends Component {

    render() {
        const { closePromotion } = this.props;
        return (
            <div className="modal promotion">
                <div className="promotion-modal-header">
                    <div className="d-flex justify-content-between">
                        <div className="logo">
                            <img src="/images/logo-white.png" />
                        </div>
                        <i className="fas fa-times" onClick={closePromotion} />
                    </div>
                </div>
                <div>
                    <Stories
                        loop
                        keyboardNavigation
                        defaultInterval={10000}
                        stories={stories}
                        // onStoryEnd={(s, st) => console.log('story ended', s, st)}
                        // onAllStoriesEnd={(s, st) => console.log('all stories ended', s, st)}
                        // onStoryStart={(s, st) => console.log('story started', s, st)}
                        storyContainerStyles={{ width: '100%', height: '100%' }}
                        storyStyles={{ width: '100%', height: '100%' }}
                        width='100%'
                        height='100%'
                    />
                </div>
            </div>
        );
    }
}
