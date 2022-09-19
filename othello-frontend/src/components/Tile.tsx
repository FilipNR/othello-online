import { SocketContext } from '../context/socket';
import { useContext } from 'react';
import './Tile.css';

interface IProps {
    xaxis: number,
    yaxis: number,
    game: any,
    current: string,
    ableToPut: any,
    setRender: any,
    render: number,
    currentColor: string
};

export default function Tile({ xaxis, yaxis, game, ableToPut, setRender, render, currentColor }: IProps) {
    const socket = useContext(SocketContext);
    const cellClass: any[] = [];
    cellClass.push(game.board.getCell(xaxis, yaxis).type);
    cellClass.push(ableToPut.join(' '));
    return (
    <span 
    onClick={() => { setRender(render + 1); }} 
    className={`tile`}>
        {/* If there is a stone, place it on the tile with className of "circle (white || black)" */}
        {cellClass[0] !== 'none' && <span className={`circle ${cellClass[0]}`}></span>} 
        {/* Return tiles where user can put */}
        {cellClass[1] === 'ableToPut' && currentColor === game.board.nextStone && <span className={`circle ${cellClass[1]}`} onClick={() => {
            game.put({
                current: currentColor,
                type: 'put',
                x: xaxis,
                y: yaxis
            });
            socket.emit('make move', {
                roomId: localStorage.roomId,
                color: currentColor,
                x: xaxis,
                y: yaxis
            });
        }}></span>}
    </span>
    );
};
