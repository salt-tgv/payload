import './PlayCell.css';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { PLAY_MOVE } from '../graphql/mutations';
import { dbRed, dbGreen, serverGreen, serverRed } from '../graphics/assets';
import { cellGradientWhite, cellGradientGreen, cellSolidGreen, cellSolidRed} from '../graphics/cells';
import explode from './fx/explosion';

function PlayCell ({ cellData, x, y, active, assetType }) {
  const [explosionCoords, setExplosionCoords] = useState({x: 0, y: 0, hasExploded: true});
  const [isHovering, setIsHovering] = useState(false);

  const [playMove] = useMutation(PLAY_MOVE);

  const handleClick = (active && cellData === 'UNKNOWN')
    ? (e) => {
      setExplosionCoords({ x: e.pageX, y: e.pageY, hasExploded: false});
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
        if (!explosionCoords.hasExploded) {
          explode(explosionCoords.x, explosionCoords.y);
          setExplosionCoords({...explosionCoords, hasExploded: true});
        }
          
        return cellSolidRed;
      case 'DB':
        if (!explosionCoords.hasExploded) {
          // setTimeout(() => explode(explosionCoords.x + 50, explosionCoords.y + 50), 100)
          setTimeout(() => explode(explosionCoords.x + (Math.cos(10) * 100), explosionCoords.y + (Math.sin(10) * 100)), 200);
          setTimeout(() => explode(explosionCoords.x - (Math.cos(40) * 100), explosionCoords.y - (Math.sin(40) * 100)), 300);
          setTimeout(() => explode(explosionCoords.x - (Math.cos(20) * 100), explosionCoords.y - (Math.sin(20) * 100)), 400);
          setTimeout(() => explode(explosionCoords.x + (Math.cos(60) * 100), explosionCoords.y + (Math.sin(60) * 100)), 500);
          setExplosionCoords({...explosionCoords, hasExploded: true});
        }
        return <>{cellSolidRed}{<div className="asset-container">{dbRed}</div>}</>;
      case 'SERVER':
        if (!explosionCoords.hasExploded) {
          // setTimeout(() => explode(explosionCoords.x + 50, explosionCoords.y + 50), 100)
          setTimeout(() => explode(explosionCoords.x + (Math.cos(10) * 100), explosionCoords.y + (Math.sin(10) * 100)), 200);
          setTimeout(() => explode(explosionCoords.x - (Math.cos(40) * 100), explosionCoords.y - (Math.sin(40) * 100)), 300);
          setTimeout(() => explode(explosionCoords.x - (Math.cos(20) * 100), explosionCoords.y - (Math.sin(20) * 100)), 400);
          setTimeout(() => explode(explosionCoords.x + (Math.cos(60) * 100), explosionCoords.y + (Math.sin(60) * 100)), 500);
          setExplosionCoords({...explosionCoords, hasExploded: true});
        }
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