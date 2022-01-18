import React, { Component } from "react";
import Stories from 'react-insta-stories';
import SVG from 'react-inlinesvg'
import { ImageRenderer, ImageTester, VideoRenderer, VideoTester } from "../libs/promotionRenderer";
import { getPromotionBanners } from "../redux/services";
import _env from '../env.json';

const defaultStories = [
    {
        url: '/promotions/video banner.mp4',
        type: 'video',
    },
    {
        url: '/promotions/hs banner.png',
        type: 'image',
    },
];

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
        getPromotionBanners()
            .then(({ data }) => {
                if (data.length > 0) {
                    this.setState({
                        stories: data.map(banner => {
                            return {
                                type: banner.type,
                                url: `${_env.appUrl}/static/${banner.path}`,
                            }
                        }),
                        loading: false,
                    })
                } else {
                    this.setState({ stories: defaultStories, loading: false })
                }
            })
            .catch(() => {
                this.setState({ stories: defaultStories, loading: false })
            })
        document.body.classList.add('noscroll');
    }

    componentWillUnmount() {
        document.body.classList.remove('noscroll');
    }

    render() {
        const { stories, loading } = this.state;
        const { closePromotion } = this.props;

        return (
            <div className="modal promotion">
                {stories && <Stories
                    defaultInterval={10000}
                    stories={stories}
                    storyContainerStyles={{ width: '100%', height: '100%' }}
                    width='100%'
                    height='100%'
                    onAllStoriesEnd={closePromotion}
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
