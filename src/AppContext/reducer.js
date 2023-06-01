export const initial = {
  user: {},

  userLocal: {
    name: null,
    email: null,
    sem: null,
    branch: null,
    college: null,
    uid: null,
    whatsapp: null,
    NKID: null,
  },

  registered: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "SET_REG":
      return {
        ...state,
        registered: action.registered,
      };

    default:
      return state;
  }
};
