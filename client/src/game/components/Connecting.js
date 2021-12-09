import { connectingText } from "../graphics/text";
import './Connecting.css';

function Connecting({ gameId }) {
    const link = `${window.location.hostname}/joingame/${gameId}`

    return (
    <div className="connecting-page">
        <main className="connecting-wrapper">
            {connectingText}
            <div className="connecting-info">
                <h1 className="connecting-info__title">Waiting for opponent to join</h1>
                <h2 className="connecting-info__title">Click to copy the game ID or link</h2>
                <div className="card-wrapper" onClick={()=>{
                    navigator.clipboard.writeText(gameId)
                }}>
                    <div className="connecting-info__card">
                        <h2 className="connecting-info__heading">Game ID:</h2>
                        <p className="connecting-info__text">{gameId}</p>
                    </div>
                    <i className="far fa-clone"></i>
                </div>
                <div className="card-wrapper" onClick={()=>{
                    navigator.clipboard.writeText(link)
                }}>
                    <div className="connecting-info__card">
                        <h2 className="connecting-info__heading">Link:</h2>
                    <p className="connecting-info__text">{link}</p>
                    </div>
                    <i className="far fa-clone"></i>
                </div>
                <h2 className="connecting-info__title">Send the ID/link to your bitter rival</h2>
            </div>
        </main>
    </div>)
}

export default Connecting;