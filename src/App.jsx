import { useEffect, useState } from "react";
import styled from "styled-components"

function App() {
    const [isChat, setIsChat] = useState(false)
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            handleResize();

            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <AppDetails>
            <div className="card card-page">
                <p>
                    <a className="backToHome" href={'https://yagasaki.dev/'}><i className="uil uil-arrow-left"> Back To Home</i></a>
                    {
                        windowSize && windowSize.width > 1024 ? <button onClick={() => setIsChat(!isChat)}>Show Chat</button> : null
                    }
                </p>
            </div>

            <div className="overlay" />

            <div className="player">
                <iframe id="twitchPlayer" src={"https://player.twitch.tv/?channel=Yagasaki7K&muted=true&parent=stream.yagasaki.dev"} allowfullscreen autoPlay />

                {isChat ?
                    <iframe id="twitchChat" className="chat" src={"https://www.twitch.tv/embed/yagasaki7k/chat?darkpopout&parent=stream.yagasaki.dev"} allowFullScreen />
                    : null
                }
            </div>

            <div className="footer">
                <img src="https://github.com/Yagasaki7K.png" alt="yagasaki.dev" />

                <div className="content">
                    <h1>Twitch/Yagasaki7K</h1>
                    <p>{"["}PT/BR{"]"} I{"'"}m live on <a href="https://stream.yagasaki.dev" target="_blank" rel="noreferrer">stream.yagasaki.dev</a> and live on <a href="https://www.twitch.tv/Yagasaki7K" target="_blank" rel="noreferrer">Twitch</a>.</p>
                </div>
            </div>

            <div className="copyright">
                ©&nbsp;2024 - {new Date().getFullYear()}&nbsp;<a href="https://github.com/Yagasaki7K/app-stream" target="_blank" rel="noreferrer">stream.yagasaki.dev</a>&nbsp;|&nbsp;The broadcasting right is a registered trademark of Anderson {"\""}Yagasaki{"\""} Marlon
            </div>
        </AppDetails>
    )
}

export default App

const AppDetails = styled.div`
    display: flex;
    flex-direction: column;

    .card {
        margin-top: 1rem;
        text-align: right;
        margin-right: 7rem;

        @media (max-width: 1024px) {
            margin-right: 4rem;
        }

        @media (max-width: 768px) {
            margin-right: 1.5rem;
        }

        .backToHome {
            text-decoration: none;
            color: var(--red);
            margin-right: 1rem;

            &:hover {
                text-decoration: underline;
            }

            i {
                font-style: normal;
            }
        }

        button {
            height: 50px;
            font-size: 18px;
            background: var(--red);
            color: var(--font-light);
            margin-right: 1rem;
            border: 2px solid var(--border);
            border-radius: 15px;
            outline: none;
            padding: 10px 20px;

            &:hover {
                cursor: pointer;
                background-color: var(--background-alt);
            }
        }
    }

    .player {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 2rem;

        iframe {
            width: 90%;
            height: 50rem;
            border: none;
            border-radius: 15px;
            margin-top: 1rem;

            @media (max-width: 1024px) {
                height: 28rem;
            }
        }

        .chat {
            width: 20%;
            height: 50rem;
            border: none;
            margin-left: 1rem;

            @media (max-width: 768px) {
                height: 30rem;
            }
        }
    }

    .footer {
        display: flex;
        align-items: center;
        text-align: center;
        padding: 1rem 8rem;

        @media (max-width: 1024px) {
            justify-content: center;
        }

        @media (max-width: 768px) {
            padding: 1rem 2rem;
            flex-direction: column;
        }

        img {
            width: 5rem;
            border-radius: 50px;
            margin-right: 1rem;
            border: 4px solid var(--red);
        }

        .content {
            display: flex;
            flex-direction: column;
            text-align: left;

            h1 {
                color: var(--font-light);
                font-weight: bold;
                font-size: 2.5rem;
                line-height: 1.5rem;
                margin: 0.8rem 0;

                @media (max-width: 768px) {
                    font-size: 2rem;
                }
            }

            p {
                margin-left: 0.2rem;
                color: var(--font-dark);
                
                a {
                    text-decoration: none;
                    color: var(--red);
                    font-weight: bold;
                }
            }
        }
    }

    .copyright {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--font-light);
        margin-bottom: 0.5rem;

        @media (max-width: 1024px) {
            font-size: 0.8rem;
            margin: 0.5rem 0;
        }

        @media (max-width: 768px) {
            display: none;
        }

        a {
            text-decoration: none;
            color: var(--font-light);
            font-weight: bold;
        }
    }
`
