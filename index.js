class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breakLength: 5,
            sessionLength: 25,
            onPlay: false,
            timerType: "SESSION",
            timeLeft: 25 * 60
        }
        this.timeout = null;
    }

    componentDidMount() {
        this.clock();
        console.log("Mounted")
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.onPlay !== this.state.onPlay ||
            prevState.timeLeft !== this.state.timeLeft) {
            this.clock();
            console.log("Updated")
        }
    }

    handleIncDec = (type, operation) => {
        const { breakLength, sessionLength, timeLeft } = this.state;
        if (type == "break") {
            if (operation == "inc") {
                if (breakLength < 60) {
                    this.setState({ breakLength: breakLength + 1 });
                }
            } else {
                if (breakLength > 1) {
                    this.setState({ breakLength: breakLength - 1 });

                }
            }
        } else {
            if (operation == "inc") {
                if (sessionLength < 60) {
                    this.setState({
                        sessionLength: sessionLength + 1,
                        timeLeft: timeLeft + 60
                    });
                }
            } else {
                if (sessionLength > 1) {
                    this.setState({
                        sessionLength: sessionLength - 1,
                        timeLeft: timeLeft - 60
                    });
                }
            }
        }
    };

    timeFormat = () => {
        const { timeLeft } = this.state;
        const minutes = Math.floor(timeLeft / 60)
        const seconds = timeLeft - minutes * 60;
        const fortmattedSec = seconds < 10 ? '0' + seconds : seconds;
        const formattedMin = minutes < 10 ? '0' + minutes : minutes;
        return `${formattedMin}:${fortmattedSec}`;
    };

    handlePlay = () => {
        clearTimeout(this.timeout);
        this.setState((prevState) => ({ onPlay: !prevState.onPlay }));
    };

    handleReset = () => {
        this.setState({
            breakLength: 5,
            sessionLength: 25,
            timeLeft: 25 * 60,
            onPlay: false,
            timerType: "SESSION"
        })
        clearTimeout(this.timeout);
        const audio = document.getElementById('beep');
        audio.pause();
        audio.currentTime = 0;
    };

    resetTimer = () => {
        const { timeLeft, timerType, breakLength, sessionLength } = this.state;
        const audio = document.getElementById('beep');

        if (timeLeft < 0 && timerType === "SESSION") {
            this.setState({
                timeLeft: breakLength * 60,
                timerType: "BREAK"
            });
            audio.play();
            clearTimeout(this.timeout);
        }
        if (timeLeft < 0 && timerType === "BREAK") {
            this.setState({
                timeLeft: sessionLength * 60,
                timerType: "SESSION"
            });
            audio.pause();
            audio.currentTime = 0;
            clearTimeout(this.timeout);
        }
    };

    clock = () => {
        const { onPlay, timeLeft } = this.state;
        if (onPlay) {
            this.timeout = setTimeout(() => {
                this.setState((prevState) => ({ timeLeft: prevState.timeLeft - 1 }));
                this.resetTimer();
            }, 1000)
        } else {
            clearTimeout(this.timeout);
        }
    };

    componentWillUnmount() {
        clearTimeout(this.timeout);
        console.log("Triggered");
    }

    render() {
        const { breakLength, sessionLength, onPlay, timerType, timeLeft } = this.state;

        const title = timerType === "SESSION" ? "Session" : "Break";

        return (
            <div className="wrapper">
                <h2>25 + 5 Clock</h2>
                <div>
                    <Length type="break" count={breakLength} handleIncDec={this.handleIncDec} onPlay={onPlay} />
                    <Length type="session" count={sessionLength} handleIncDec={this.handleIncDec} onPlay={onPlay} />
                </div>
                <div className="timer-wrapper">
                    <div className="timer">
                        <h2 id="timer-label">{title}</h2>
                        <h3 id="time-left">{this.timeFormat()}</h3>
                    </div>
                    <button id="start_stop" onClick={this.handlePlay}>Start/Stop</button>
                    <button id="reset" onClick={this.handleReset}>Reset</button>
                </div>
                <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
            </div>
        )
    }
}

const Length = ({ type, handleIncDec, onPlay, count }) => {
    return (
        <div className={type + "-session-length"}>
            <h3 id={type + "-label"}>{type + " length"}</h3>
            <div>
                <button disabled={onPlay} onClick={() => handleIncDec(type, "inc")} id={type + "-increment"}>Increase</button>
                <strong id={type + "-length"}>{count}</strong>
                <button disabled={onPlay} onClick={() => handleIncDec(type, "dec")} id={type + "-decrement"}>Decrease</button>
            </div>
        </div>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
