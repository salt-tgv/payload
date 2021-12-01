import './Cell.css';
import { useMutation } from '@apollo/client';
import { PLAY_MOVE } from '../graphql/mutations';

function Cell ({ cellData, x, y, active, assetType }) {

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

  return (
    <div>
      <div 
        className={cellClass()} 
        id={`${x},${y}`}
        onClick={handleClick}>
      </div>
      <div>

      </div>
    </div>
  )
}

export default Cell;