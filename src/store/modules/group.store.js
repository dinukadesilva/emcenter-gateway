import {custosService} from "../util/custos.util";

const getDefaultState = () => {
    return {
        groupMap: {},
        groupListMap: {},
        groupUserListMap: {}
    }
};

const state = getDefaultState();

const actions = {
    async createGroup({commit}, {name, description, ownerId, realm_roles, client_roles, attributes, sub_groups}) {
        const {id} = await custosService.groups.createGroup({
            name, description, ownerId, realm_roles, client_roles, attributes, sub_groups
        });

        commit('SET_GROUP', {
            groupId: id,
            name,
            description,
            ownerId,
            realm_roles,
            client_roles,
            attributes,
            sub_groups
        });
    },
    async fetchGroups({commit}) {

        // TODO enable api filtering, pagination, etc.
        let queryString = "";

        let {data: {groups}} = await custosService.groups.getAllGroups();
        const groupIds = groups.map((
            {id, name, description, owner_id, realm_roles, client_roles, attributes, sub_groups}
        ) => {
            const groupId = id
            commit('SET_GROUP', {
                groupId, name, description, ownerId: owner_id, realm_roles, client_roles, attributes, sub_groups
            });

            return groupId;
        });
        commit('SET_GROUP_LIST', {queryString, groupIds});
    },


    async updateGroup({commit}, {
        groupId, name, description, ownerId, realm_roles, client_roles, attributes, sub_groups
    }) {
        await custosService.groups.updateGroup({
            groupId, name, description, ownerId, realm_roles, client_roles, attributes, sub_groups
        });
        commit('SET_GROUP', {groupId, name, description, ownerId, realm_roles, client_roles, attributes, sub_groups});
    },

    async deleteGroup({commit}, {groupId}) {
        await custosService.groups.deleteGroup({groupId});
        commit('SET_GROUP_DELETED', {groupId});
    },

    async fetchGroup({commit}, {groupId}) {
        const {
            name, description, ownerId, realm_roles, client_roles, attributes, sub_groups
        } = await custosService.groups.findGroup({groupId});
        commit('SET_GROUP', {groupId, name, description, ownerId, realm_roles, client_roles, attributes, sub_groups});
    },

    async addUserToGroup(obj, {groupId, username, membershipType}) {
        await custosService.groups.addUserToGroup({groupId, username, membershipType});
    },

    async removeUserFromGroup(obj, data) {
        let response = await custosService.groups.removeUserFromGroup(data)
        return response.data
    },

    // async addChildGroup(obj, data) {
    //     let response = await custosService.groups.addChildGroup(data)
    //     return response.data
    // },
    //
    // async removeChildGroup(obj, data) {
    //     let response = await custosService.groups.removeChildGroup(data)
    //     return response.data
    // },
    //
    // async changeGroupMembership(obj, data) {
    //     let response = await custosService.groups.changeGroupMembership(data)
    //     return response.data
    // },
    //
    // async getAllChildUsers(obj, {groupId}) {
    //     let response = await custosService.groups.getAllChildUsers({groupId})
    //     return response.data
    // },

    // async getAllChildGroups(obj, data) {
    //     let response = await custosService.groups.getAllChildGroups(data)
    //     return response.data
    // },

    // async getAllGroupsOfUser(obj, data) {
    //     let response = await custosService.groups.getAllGroupsOfUser(data)
    //     return response.data.groups
    // },
    //
    // async getAllParentGroups(obj, data) {
    //     let response = await custosService.groups.getAllParentGroupsOfGroup(data)
    //     return response.data.groups
    // },

    async hasAccess(obj, data) {
        let response = await custosService.groups.hasAccess(data)
        return response.data
    }
}

const mutations = {
    SET_GROUP(state, {groupId, name, description, ownerId, realm_roles, client_roles, attributes, sub_groups}) {
        state.groupMap = {
            ...state.groupMap,
            [groupId]: {groupId, name, description, ownerId, realm_roles, client_roles, attributes, sub_groups}
        };
    },
    SET_GROUP_DELETED(state, {groupId}) {
        for (let queryString in state.groupListMap) {
            state.groupListMap = {
                ...state.groupListMap,
                [queryString]: state.groupListMap[queryString].filter(_groupId => _groupId !== groupId)
            }
        }

        state.groupMap = {
            ...state.groupMap,
            [groupId]: null
        };
    },
    SET_GROUP_LIST(state, {queryString, groupIds}) {
        // TODO remove
        groupIds = groupIds.filter(groupId => {
            return ["89dc135b-9ee0-4d5f-8ef1-dc8277f86721", "a3e2d7a0-3f33-41c6-ab92-f37e16a6bd26"].indexOf(groupId) < 0;
        })

        state.groupListMap = {
            [queryString]: groupIds
        }
    }
}

const getters = {
    getGroups(state, getters) {
        return () => {
            const queryString = "";
            if (state.groupListMap[queryString]) {
                return state.groupListMap[queryString].map(groupId => getters.getGroup({groupId}));
            } else {
                return null;
            }
        }
    },
    getGroup(state) {
        return ({groupId}) => {
            if (state.groupMap[groupId]) {
                return state.groupMap[groupId];
            } else {
                return null;
            }
        }
    },
    getGroupUsers(state) {
        return ({groupId}) => {
            if (state.groupUserListMap[groupId]) {
                return state.groupUserListMap[groupId];
            } else {
                return null;
            }
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
