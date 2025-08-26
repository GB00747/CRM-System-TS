export const validation = {
  login: {
    min: 2,
    max: 60,
    pattern: /^[a-zA-Z]+$/,
    message: "Только латинские буквы",
  },
  password: {
    min: 6,
    max: 60,
    pattern: /^[A-Za-z]+$/,
    message: "Только латинские буквы",
  },
  username: {
    min: 1,
    max: 60,
    pattern: /^[a-zA-Zа-яА-ЯёЁ\s-]+$/,
    message: "Только буквы русского или латинского алфавита",
  },
  phone: {
    pattern: /^\+[0-9]{10,15}$/,
    message: "Введите корректный номер телефона, начиная с +",
  },
};
