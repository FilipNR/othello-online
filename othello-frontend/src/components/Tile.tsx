import './Tile.css';
import { useState, useEffect } from 'react';

interface IProps {
    xaxis: number,
    yaxis: number,
    game: any,
    current: string,
    ableToPut: any
};

export default function Tile({ xaxis, yaxis, game, current, ableToPut }: IProps) {
    const cellClass: any[] = [];
    cellClass.push(game.board.getCell(xaxis, yaxis).type);
    cellClass.push(ableToPut.join(' '))
    console.log(cellClass)

    return <span onClick={() => {
        console.log(xaxis, yaxis);
        game.put({
            current: current,
        })
    }} 
    className={`tile`}><span className={`circle ${cellClass.join(' ')}`}></span></span>
}
