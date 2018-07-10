import React            from 'react';
import Modal            from './modal';
import { isomorph }     from '../../lib/isomorphic';

import './loading-bar.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0,
            target: 0,
        }

        this.interval = null;
        this.progressChange = this.progressChange.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentWillMount() {
        this.progressChange(this.props.progress);
    }

    componentWillReceiveProps(nextProps) {
        this.progressChange(nextProps.progress);
    }

    progressChange(target) {
        isomorph(() => {
            this.setState({ target: Math.max(this.state.target, Math.min(target, this.props.maxValue)) }, () => {
                if(this.interval == null) {
                    this.interval = setInterval(this.tick, 7);
                }
            });
        });
    }

    tick() {
        const progress = this.state.progress + 1;
        if(progress <= this.state.target) {
            this.setState({ progress: progress });
        } else if(progress >= this.props.maxValue) {
            this.state.progress = 0;
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    render() {
        const progress = this.props.maxValue - this.state.progress;
        const loadingBar = progress > 0 && progress < this.props.maxValue ? (
            <div className="loading-bar">
                <div className="loading-bar__bar" style={{ right: `${progress}%` }}></div>
            </div>
        ) : null;

        return (
            <Modal>
                {loadingBar}
            </Modal>
        )
    }
}
Controller.defaultProps = {
    maxValue: 100
}

export default Controller;