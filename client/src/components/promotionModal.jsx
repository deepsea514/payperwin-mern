import React, { Component } from "react";
import Stories from 'react-insta-stories';
import SVG from 'react-inlinesvg'
import { ImageRenderer, ImageTester, VideoRenderer, VideoTester } from "../libs/promotionRenderer";

export default class PromotionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stories: null,
            loading: false,
        }

        const { closePromotion } = props;
        this.renderers = [
            {
                renderer: (props) => ImageRenderer({ ...props, closePromotion }),
                tester: ImageTester
            },
            {
                renderer: (props) => VideoRenderer({ ...props, closePromotion }),
                tester: VideoTester
            }
        ]
    }

    componentDidMount() {
        this.setState({ loading: true });
        setTimeout(() => this.setState({
            stories: [
                {
                    url: '/images/promotion-banner.jpg',
                    type: 'image',
                },
                {
                    url: 'https://placeimg.com/640/480',
                    type: 'image',
                },
                {
                    url: '/media/demo video.mp4',
                    type: 'video',
                },
                {
                    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                    type: 'video',
                }
            ],
            loading: false,
        }), 2000);
    }

    render() {
        const { stories, loading } = this.state;

        return (
            <div className="modal promotion">
                {stories && <Stories
                    loop
                    defaultInterval={10000}
                    stories={stories}
                    storyContainerStyles={{ width: '100%', height: '100%' }}
                    width='100%'
                    height='100%'
                    // preventDefault
                    renderers={this.renderers}
                />}
                {loading && <>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: "rgba(0, 0, 0, 0.9)",
                        zIndex: 9,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#ccc"
                    }}>
                        <SVG src="/images/puff.svg" />
                    </div>
                </>}
            </div>
        );
    }
}
