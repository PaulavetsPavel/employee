export default class Store {
  user = null;

  setUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
