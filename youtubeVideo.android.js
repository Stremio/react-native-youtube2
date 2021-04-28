import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, UIManager, requireNativeComponent, findNodeHandle } from 'react-native';

class YouTubeVideo extends Component {
    constructor(props) {
        super(props);

        this.callbacks = {
            [RCTYouTubeVideoViewConstants.ON_BUFFERING]: this._invokeEventCallback.bind(this, 'onBuffering'),
            [RCTYouTubeVideoViewConstants.ON_PLAYING]: this._invokeEventCallback.bind(this, 'onPlaying'),
            [RCTYouTubeVideoViewConstants.ON_PAUSED]: this._invokeEventCallback.bind(this, 'onPaused'),
            [RCTYouTubeVideoViewConstants.ON_END_REACHED]: this._invokeEventCallback.bind(this, 'onEndReached'),
            [RCTYouTubeVideoViewConstants.ON_ERROR]: this._invokeEventCallback.bind(this, 'onError'),
            [RCTYouTubeVideoViewConstants.ON_TIME_CHANGED]: this._invokeEventCallback.bind(this, 'onTimeChanged'),
            [RCTYouTubeVideoViewConstants.ON_SEEK_PERFORMED]: this._invokeEventCallback.bind(this, 'onSeekPerformed'),
            [RCTYouTubeVideoViewConstants.ON_SEEK_REQUESTED]: this._invokeEventCallback.bind(this, 'onSeekRequested')
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.sourceUrl !== this.props.sourceUrl ||
            nextProps.style !== this.props.style;
    }

    _assignRoot = (root) => {
        this._root = root;
    }

    _getViewHandle = () => {
        return findNodeHandle(this._root);
    }

    _invokeEventCallback = (eventName, event) => {
        if (typeof this.props[eventName] === 'function') {
            this.props[eventName](event.nativeEvent);
        }
    }

    seek = (time) => {
        if (typeof time !== 'number' || isNaN(time) || time < 0) {
            time = 0;
        }

        UIManager.dispatchViewManagerCommand(
            this._getViewHandle(),
            UIManager.RCTYouTubeVideoView.Commands.seek,
            [time]
        );
    }

    play = () => {
        UIManager.dispatchViewManagerCommand(
            this._getViewHandle(),
            UIManager.RCTYouTubeVideoView.Commands.play,
            null
        );
    }

    pause = () => {
        UIManager.dispatchViewManagerCommand(
            this._getViewHandle(),
            UIManager.RCTYouTubeVideoView.Commands.pause,
            null
        );
    }

    render() {
        const media = {
            sourceUrl: this.props.sourceUrl,
            autoplay: this.props.autoplay,
            startTime: this.props.startTime
        };

        return (
            <RCTYouTubeVideoView
                ref={this._assignRoot}
                style={this.props.style}
                media={media}
                {...this.callbacks}
            />
        );
    }
}

YouTubeVideo.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    sourceUrl: PropTypes.string.isRequired,
    autoplay: PropTypes.bool.isRequired,
    startTime: PropTypes.number.isRequired,
    onBuffering: PropTypes.func,
    onPlaying: PropTypes.func,
    onPaused: PropTypes.func,
    onEndReached: PropTypes.func,
    onError: PropTypes.func,
    onTimeChanged: PropTypes.func,
    onSeekPerformed: PropTypes.func,
    onSeekRequested: PropTypes.func
};

YouTubeVideo.defaultProps = {
    autoplay: true,
    startTime: 0
};

const RCTYouTubeVideoViewConstants = UIManager.RCTYouTubeVideoView.Constants;

const RCTYouTubeVideoViewInterface = {
    name: 'YouTubeVideo',
    propTypes: {
        ...View.propTypes,
        media: PropTypes.object.isRequired,
        [RCTYouTubeVideoViewConstants.ON_BUFFERING]: PropTypes.func,
        [RCTYouTubeVideoViewConstants.ON_PLAYING]: PropTypes.func,
        [RCTYouTubeVideoViewConstants.ON_PAUSED]: PropTypes.func,
        [RCTYouTubeVideoViewConstants.ON_END_REACHED]: PropTypes.func,
        [RCTYouTubeVideoViewConstants.ON_ERROR]: PropTypes.func,
        [RCTYouTubeVideoViewConstants.ON_TIME_CHANGED]: PropTypes.func,
        [RCTYouTubeVideoViewConstants.ON_SEEK_PERFORMED]: PropTypes.func,
        [RCTYouTubeVideoViewConstants.ON_SEEK_REQUESTED]: PropTypes.func
    }
};

const RCTYouTubeVideoView = requireNativeComponent('RCTYouTubeVideoView', RCTYouTubeVideoViewInterface, {
    nativeOnly: {
        media: true
    }
});

export default YouTubeVideo;
