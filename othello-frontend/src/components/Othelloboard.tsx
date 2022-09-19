import { useEffect, useState, useContext, useCallback } from 'react';
import { SocketContext } from '../context/socket';
import { useNavigate } from 'react-router-dom';
import './Othelloboard.css';
import Tile from './Tile';

export default function Othelloboard({ game, current }: any): JSX.Element {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    let board = [];
    const [render, setRender] = useState(0);
    const [color, setColor] = useState<string>('');
    let currentColor = useCallback((): void => { 
        if (current !== '') {
            setColor(current);
        } else {
            setColor(game.board.nextStone);
        };
    }, [current, game.board.nextStone]);

    const handleRemotePut = useCallback((color: string, x: number, y: number) => {
        game.put({
            current: color,
            type: 'put',
            x: x,
            y: y
        });
        setRender(render + 1); // Has to be two, doesn't re-render the board on second move if not for some reason.
    }, [game, render]);

    const handleRemotePass = useCallback((color: string) => {
        game.put({
            type: 'pass',
            current: color
        });
        setRender(render + 1);
    }, [game, render]);

    // Listeners for remote moves.
    useEffect(() => {
        socket.on('move made', (data: any) => {
            const { color, x, y } = data;
            handleRemotePut(color, x, y);
        });
        
        socket.on('pass made', (color: string) => {
            handleRemotePass(color);
        });

        return () => { 
            socket.off('move made');
            socket.off('pass made');
        }
    }, [socket, handleRemotePut, handleRemotePass, render]);

    useEffect(() => {
        if (!localStorage.roomId) {
            setColor(game.board.nextStone);
        } else {
            currentColor();
        }
    // eslint-disable-next-line
    }, [game.board.nextStone, render])

    if (render !== 0) {
        localStorage.setItem('othello.session', JSON.stringify(game.board.log));
    };

    // Push tiles to the board array.
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let ableToPut: any[] = [];
            let key = `${x}${y}`;
            board.push(<Tile 
                key={key}
                xaxis={x} 
                yaxis={y}
                current={current}
                ableToPut={ableToPut}
                game={game}
                render={render} // For re-rendering the othello board component.
                setRender={setRender}
                currentColor={color}
                />);
                // Check for possible moves and give className 'ableToPut' to those tiles.
                // @ts-ignore
                if (game.board.put({
                    type: 'put',
                    current: game.board.nextStone,
                    x: x, y: y
                }, true)) {
                    let cords = `${x}${y}`
                    board.forEach(el => {
                        if(el.key === cords) {
                            el.props.ableToPut.push('ableToPut')
                        }
                    })
                }
            }
    };
    

    // Return tiles from the board array.
    return (
        <div className="othello">
            <div id="othelloboard">{board}
                <div className="btnContainer">
                    <button onClick={() => {
                        if (color === game.board.nextStone) {
                            game.put({
                                type: 'pass',
                                current: game.board.nextStone,
                            });
                            setRender(render + 1);
                            let roomId = localStorage.roomId;
                            let data = { color, roomId };
                            socket.emit('make pass', data);
                        } else {
                            alert('Not your turn');
                        }
                    }}>Pass</button>
                    {/* If user is in an online match the button is give up, else reset game. */}
                    {localStorage.roomId ? 
                    <button onClick={() => {
                        /* Gives up if it's user's move. */
                        if (color === game.board.nextStone) {
                            let roomId = localStorage.getItem('roomId');
                            let data = { color, roomId }
                            socket.emit('give up', data);
                            localStorage.removeItem('roomId');
                            navigate('/');
                            setRender(0);
                        } else {
                            alert('Not your turn, give up later.');
                        };
                    }}>Give up</button>
                    : <button onClick={() => {
                        localStorage.removeItem('othello.session');
                        setRender(0);
                        window.location.reload();
                    }}>Reset</button>}
                    {/* Point count */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', minWidth: '10em', marginLeft: '1em' }}>
                        <p>Black: {game.board.getInfo('black').count}</p>
                        <p>White: {game.board.getInfo('white').count}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};