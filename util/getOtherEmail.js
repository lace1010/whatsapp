const getOtherEmail = (users, currentUserEmail) => {
  return users.filter((user) => user !== currentUserEmail)[0];
};

export default getOtherEmail;
