
const redirectIfCookie = (navigate) => {
  const cookiePlayerId = document.cookie.match(/(playerId)=(\d+)/) || '';
    if (cookiePlayerId[1] && cookiePlayerId[2]) {
      return navigate('../user');
    }
}

export default redirectIfCookie;