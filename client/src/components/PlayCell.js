import './PlayCell.css';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { PLAY_MOVE } from '../graphql/mutations';

function PlayCell ({ cellData, x, y, active, assetType }) {

  const [hoverClass, setHoverClass] = useState('');

  const [playMove] = useMutation(PLAY_MOVE);
  const handleClick = (active && cellData === 'UNKNOWN')
    ? (e) => {
      playMove({variables: {coords: [x,y]}})
    }
    : null
  const cellClass = () => { 
    if (assetType) {
      if (/DESTROYED/.test(assetType)){
        return 'board__cell--destroyed'
      }
      return 'board__cell--asset';
    }

    switch(cellData) {
      case 'UNKNOWN':
        return "board__cell--unknown";
      case 'MISS':
        return "board__cell--miss";
      case 'HIT':
        return "board__cell--hit";
      case 'DB':
        return "board__cell--revealed";
      case 'SERVER':
        return "board__cell--revealed";
    }
  }

  const handleMouseEnter = () => {
    setHoverClass('board__cell--hover');
  }

  const handleMouseLeave = () => {
    setHoverClass('');
  }

  const cellClassList = `${cellClass()} ${hoverClass}`

  return (
    <div>
      <div 
        className={cellClassList} 
        id={`${x},${y}`}
        onClick={handleClick}
        onMouseEnter={active ? handleMouseEnter : ''}
        onMouseLeave={active ? handleMouseLeave : ''}>
      </div>
      <div>

      </div>
    </div>
  )
}

export default PlayCell;