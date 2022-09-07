import { useState, useEffect } from 'react';
import './Othelloboard.css';
import Tile from './Tile';

interface Stone {
    color: string,
    x: number,
    y: number
};

const stones: Stone[] = [];

stones.push({color: 'black', x: 3, y: 3},
    {color: 'white', x: 3, y: 4},
    {color: 'black', x: 4, y: 4},
    {color: 'white', x: 4, y: 3});

export default function Othelloboard({ game }: any): JSX.Element {
    let board = [];
    const [current, setCurrent] = useState('black');

    useEffect(() => {
        // @ts-ignore
        if (game.board.nextStone === 'white') {
            setCurrent('black');
        } else {
            setCurrent('white');
        };
    }, [current])
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
            />);
            // @ts-ignore
            if (game.board.put({
                type: 'put',
                current: game.board.nextStone,
                x: x, y: y
            }, true)) {
                console.log(x, y)
                let cords = `${x}${y}`
                board.forEach(el => {
                    console.log(`Cords: ${cords}`, `Key: ${el.key}, x: ${x}, y: ${y}`)
                    if(el.key === cords) {
                        el.props.ableToPut.push('ableToPut')
                        console.log(el.key, el.props.ableToPut)
                    }
                })
            }
        }
    };

    return <div id="othelloboard">{board}</div>
}