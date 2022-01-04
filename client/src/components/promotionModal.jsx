import React, { Component, useRef, useState, useEffect } from "react";
import Stories from 'react-insta-stories';
import SVG from 'react-inlinesvg'

const imageContent = ({ story, action, isPaused, config, closePromotion }) => {
    const [loaded, setLoaded] = useState(false);
    const { width, height, loader, storyStyles } = config;
    let computedStyles = {
        ...styles.storyContent,
        ...(storyStyles || {}),
        width: '100%',
        display: 'block',
        height: 'auto',
        maxHeight: 'auto',
        position: 'absolute',
        top: '-100%',
        left: 0,
        right: 0,
        bottom: '-100%',
        margin: 'auto'
    }

    const imageLoaded = () => {
        setLoaded(true);
        action('play');
    }

    return (
        <>
            <div style={{
                width: width,
                height: height,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <img style={computedStyles} src={story.url} onLoad={imageLoaded} />
                {!loaded && (
                    <div style={{
                        width: width,
                        height: height,
                        position: "absolute",
                        left: 0,
                        top: 0,
                        background: "rgba(0, 0, 0, 0.9)",
                        zIndex: 9,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#ccc"
                    }}>
                        {loader || <SVG src="/images/puff.svg" />}
                    </div>
                )}
            </div>
            <div style={{ position: "absolute", right: 12, top: 20, zIndex: 19 }}>
                <div style={styles.header}>
                    <div style={styles.close} onClick={closePromotion}>
                        <i className="fa fa-times" style={styles.closeIcon} />
                    </div>
                </div>
            </div>
        </>
    )
}

const videoContent = ({ story, action, isPaused, config, messageHandler, closePromotion }) => {
    const [loaded, setLoaded] = useState(false);
    const [muted, setMuted] = useState(false);
    const { width, height, loader, storyStyles } = config;

    let computedStyles = {
        ...styles.storyContent,
        ...(storyStyles || {})
    }

    let vid = useRef(null);

    useEffect(() => {
        if (vid.current) {
            if (isPaused) {
                vid.current.pause();
            } else {
                vid.current.play().catch(() => { });
            }
        }
    }, [isPaused]);

    const onWaiting = () => {
        action("pause", true);
    }

    const onPlaying = () => {
        action("play", true);
    }

    const videoLoaded = () => {
        messageHandler('UPDATE_VIDEO_DURATION', { duration: vid.current.duration });
        setLoaded(true);
        vid.current.play().then(() => {
            action('play');
        }).catch(() => {
            setMuted(true);
            vid.current.play().finally(() => {
                action('play');
            })
        });
    }

    return (
        <>
            <div style={{
                ...styles.videoContainer, ...{
                    width: width,
                    height: height,
                }
            }}>
                <video
                    ref={vid}
                    style={computedStyles}
                    src={story.url}
                    controls={false}
                    onLoadedData={videoLoaded}
                    playsInline
                    onWaiting={onWaiting}
                    onPlaying={onPlaying}
                    muted={muted}
                    autoPlay
                    webkit-playsinline="true"
                />
                {!loaded && (
                    <div
                        style={{
                            width: width,
                            height: height,
                            position: "absolute",
                            left: 0,
                            top: 0,
                            background: "rgba(0, 0, 0, 0.9)",
                            zIndex: 9,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#ccc"
                        }}
                    >
                        {loader || <SVG src="/images/puff.svg" />}
                    </div>
                )}
            </div>
            <div className="header-close" style={{ position: "absolute", right: 12, top: 20, zIndex: 19 }}>
                <div style={styles.header}>
                    <div style={styles.close} onClick={closePromotion}>
                        <i className="fa fa-times" style={styles.closeIcon} />
                    </div>
                </div>
            </div>
        </>
    )
}

const styles = {
    storyContent: {
        width: "auto",
        maxWidth: "100%",
        maxHeight: "100%",
        margin: "auto"
    },
    header: {
        display: 'flex',
        alignItems: 'center'
    },
    close: {
        width: 40,
        height: 40,
        borderRadius: 40,
        filter: 'drop-shadow(0 0px 2px rgba(0, 0, 0, 0.5))',
        display: 'flex',
        alignItems: 'center',
        background: '#0004'
    },
    closeIcon: {
        margin: 'auto',
        fontSize: '20px',
        padding: '0',
        color: 'white'
    },
    videoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}

export default class PromotionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stories: null,
            loading: false,
        }
    }

    componentDidMount() {
        const { closePromotion } = this.props;
        this.setState({ loading: true });
        setTimeout(() => this.setState({
            stories: [
                {
                    url: '/images/promotion-banner.jpg',
                    content: (params) => imageContent({ ...params, closePromotion }),
                    loader: true,
                },
                {
                    url: 'https://placeimg.com/640/480',
                    content: (params) => imageContent({ ...params, closePromotion }),
                    loader: true,
                },
                {
                    url: 'https://placeimg.com/480/640',
                    content: (params) => imageContent({ ...params, closePromotion }),
                    loader: true,
                },
                {
                    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                    // type: 'video',
                    content: (params) => videoContent({ ...params, closePromotion }),
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
                    preventDefault
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
