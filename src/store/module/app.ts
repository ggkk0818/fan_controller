import { GetterTree, MutationTree, ActionTree } from "vuex";
import Fan from "@/model/Fan";

declare interface AppState {
  fanList?: Fan[];
}

const state: AppState = {
  fanList: []
};

const mutations: MutationTree<any> = {
  SET_FANLIST(state: AppState, data: Fan[]) {
    state.fanList = data;
  }
};

const actions: ActionTree<AppState, any> = {
  SetFanList({ commit }, data: Fan[]) {
    commit("SET_FANLIST", data);
  }
};
export default {
  state,
  mutations,
  actions
};
