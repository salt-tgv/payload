const redirectIfCookie = (navigate) => {
  const cookiePlayerId = document.cookie.match(/(playerId)=(\d+)/) || '';
  const cookieUsername = document.cookie.match(/(username)=(\w+)/) || '';
    if ((cookiePlayerId[1] && cookiePlayerId[2]) && (cookieUsername[1] && cookieUsername[2])) {
      return navigate('../user');
    }
}

export default redirectIfCookie;