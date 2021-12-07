import './PlayCell.css';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { PLAY_MOVE } from '../graphql/mutations';
import { dbRed, dbGreen, serverGreen, serverRed } from '../graphics/assets';
import { cellGradientWhite, cellGradientGreen, cellSolidGreen, cellSolidRed} from '../graphics/cells';
import { explode } from './fx/explosion';

function PlayCell ({ cellData, x, y, active, assetType }) {

  const [isHovering, setIsHovering] = useState(false);

  const [playMove] = useMutation(PLAY_MOVE);

  const handleClick = (active && cellData === 'UNKNOWN')
    ? (e) => {
      playMove({variables: {coords: [x,y]}})
    }
    : null

  const graphics = () => { 
    if (assetType) {
      if (/DESTROYED/.test(assetType)){
        const myAsset = /DB/i.test(assetType) ? <div className="asset-container">{dbRed}</div> : <div className="asset-container">{serverRed}</div>;
        return (<>
          {cellSolidRed}
          {myAsset}
        </>)
      }
      const myAsset = /DB/i.test(assetType) ? <div className="asset-container">{dbGreen}</div> : <div className="asset-container">{serverGreen}</div>;
      return (<>
        {cellSolidGreen}
        {myAsset}
      </>)
    }

    switch(cellData) {
      case 'UNKNOWN':
        return isHovering ? cellSolidGreen : cellGradientGreen;
      case 'MISS':
        return cellGradientWhite;
      case 'HIT':
        return cellSolidRed;
      case 'DB':
        return <>{cellSolidRed}{<div className="asset-container">{dbRed}</div>}</>;
      case 'SERVER':
        return <>{cellSolidRed}{<div className="asset-container">{serverRed}</div>}</>;
    }
  }

  // const cellClass = () => {
  //   if (assetType) {
  //     if (/DESTROYED/.test(assetType)){
  //       return 'board__cell--destroyed'
  //     }
  //     return 'board__cell--asset';
  //   }

  //   switch(cellData) {
  //     case 'UNKNOWN':
  //       return "board__cell--unknown";
  //     case 'MISS':
  //       return "board__cell--miss";
  //     case 'HIT':
  //       return "board__cell--hit";
  //     case 'DB':
  //       return "board__cell--revealed";
  //     case 'SERVER':
  //       return "board__cell--revealed";
  //   }
  // }

  const handleMouseEnter = () => {
    setIsHovering(true);
  }

  const handleMouseLeave = () => {
    setIsHovering(false);
  }

  // const cellClassList = `${cellClass()} ${hoverClass}`
  const graphicsToRender = graphics()

  return (
    <div 
      // className={cellClassList} 
      className="cell"
      id={`${x},${y}`}
      onClick={handleClick}
      onMouseEnter={active ? handleMouseEnter : () => {}}
      onMouseLeave={active ? handleMouseLeave : () => {}}>
        {graphicsToRender}
    </div>
  )
}

export default PlayCell;