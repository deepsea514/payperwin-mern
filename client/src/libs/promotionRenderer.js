import React, { useRef, useState, useEffect } from "react";
import SVG from 'react-inlinesvg'

export const ImageRenderer = ({ story, action, config, closePromotion }) => {
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
export const ImageTester = (story) => {
    return {
        condition: !story.content && (!story.type || story.type === 'image'),
        priority: 3
    }
}

export const VideoRenderer = ({ story, action, isPaused, config, messageHandler, closePromotion }) => {
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
        const res = messageHandler('UPDATE_VIDEO_DURATION', { duration: vid.current.duration });
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

export const VideoTester = (story) => {
    return {
        condition: story.type === 'video',
        priority: 3
    }
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