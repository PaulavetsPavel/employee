export default class Store {
  user = {};

  setUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
