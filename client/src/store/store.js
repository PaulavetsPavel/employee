import $api from '../http';

import { makeAutoObservable } from 'mobx';

class Store {
  user = null;
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const { data } = await $api.get(`/refresh`, { withCredentials: true });
      this.setUser(data.user);
      this.setAuth(true);
    } catch (error) {
      this.setAuth(false);
    } finally {
      this.setLoading(false);
    }
  }
}

export const store = new Store();
