import styled from "styled-components"

function App() {
    return (
        <AppDetails>
            <div className="overflow" />

            <div className="player">
                <iframe id="twitchPlayer" src={"https://player.twitch.tv/?channel=Yagasaki7K&muted=true&parent=localhost"} allowfullscreen autoPlay />
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

    .player {
        display: flex;
        justify-content: center;
        align-items: center;

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
    }

    .footer {
        display: flex;
        align-items: center;
        text-align: center;
        padding: 1rem 6rem;

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