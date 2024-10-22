import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(process.env.VUE_APP_BACKEND_URL);

const store = createStore({
	state: {
		user: null,
		username: "",
		isAuthenticated: false,
		connectedUsers: [],
		selectedUser: null,
		messages: [],
		searchMessagesResults: [],
		sendingUsers: [],
	},
	mutations: {
		setUser(state, user) {
			state.user = user;
		},
		setUsername(state, username) {
			state.username = username;
		},
		setAuthenticated(state, isAuthenticated) {
			state.isAuthenticated = isAuthenticated;
		},
		setConnectedUsers(state, users) {
			state.connectedUsers = users;
		},
		setSelectedUser(state, user) {
			state.selectedUser = user;
		},
		setMessages(state, newMessages) {
			newMessages.forEach((newMessage) => {
				const exists = state.messages.some(
					(message) => message.id === newMessage.id
				);
				if (!exists) {
					state.messages.push(newMessage);
				}
			});
		},
		setSearchMessagesResults(state, results) {
			state.searchMessagesResults = results;
		},
		resetSearchMessagesResults(state) {
			state.searchMessagesResults = [];
		},
		resetMessages(state) {
			state.messages = [];
		},
		addMessage(state, message) {
			//state.messages.push(message);

			const messageExists = state.messages.some(
				(msg) => msg.id === message.id
			);
			if (!messageExists) {
				state.messages.push(message);
			}
		},
		addSendingUsers(state, userId) {
			if (!state.sendingUsers.includes(userId)) {
				state.sendingUsers.push(userId);
			}
		},
		removeSendingUser(state, userId) {
			state.sendingUsers = state.sendingUsers.filter(
				(id) => id !== userId
			);
		},
		resetSendingUsers(state) {
			state.sendingUsers = [];
		},
	},
    getters: {
		getToken(state) {
            if(state.user?.id){
                const userData = JSON.parse(localStorage.getItem(state.user.id));
                const token = userData ? userData.token : null;

                return token;
            }
            
            return null;
		},
	},
	actions: {
		async login({ commit, getters, dispatch }, username) {
			try {
				//const token = localStorage.getItem("token");
                const token = getters.getToken;

				const response = await axios.post(
					`${process.env.VUE_APP_API_URL}/auth/login`,
					{
						username: username,
						token: token,
					}
				);

				if (response.data.error) {
					console.error("Login failed: ", response.data.message);
					return;
				}

				//const newToken = response.data.token;
				//localStorage.setItem("token", newToken);
                const user = response.data;
                localStorage.setItem(user.id,  JSON.stringify(user));

				//const user = response.data;

				commit("setUser", user);
				commit("setAuthenticated", true);
				commit("setSelectedUser", null);
				commit("resetSendingUsers");
				commit("resetMessages");
				commit("resetSearchMessagesResults");

				socket.emit("userConnected", user);
				await dispatch("fetchConnectedUsers");

				return true;
			} catch (error) {
				console.error("Login failed: ", error.response.data.message);
				return false;
			}
		},

		async logout({ commit, dispatch }) {
			try {
				const user = this.state.user;
				await axios.post(`${process.env.VUE_APP_API_URL}/auth/logout`, {
					user,
				});


                if(store.user?.id){ 
                    localStorage.removeItem(store.user.id);
                }
				//localStorage.removeItem("token");

				commit("setUser", "");
				commit("setAuthenticated", false);
                commit("setSelectedUser", null);
				commit("resetSendingUsers");
				commit("resetMessages");
				commit("resetSearchMessagesResults");

				socket.emit("userDisconnected", user);

				dispatch("fetchConnectedUsers");
			} catch (error) {
				console.error("Error logging out:", error);
			}
		},

		async fetchConnectedUsers({ commit }) {
			try {
				const response = await axios.get(
					`${process.env.VUE_APP_API_URL}/users/connected-users`
				);
				commit("setConnectedUsers", response.data);

				socket.on("updateUsers", (users) => {
					store.commit("setConnectedUsers", users);
				});
			} catch (error) {
				console.error("Error fetching connected users:", error);
			}
		},

		async selectUser({ commit, dispatch }, user) {
			commit("setSelectedUser", user);
			commit("removeSendingUser", user.id);

			// Fetch messages for the selected user
			await dispatch("fetchMessages", {
				sender: this.state.user,
				recipient: user,
			});
		},

		async sendMessage({ commit, getters, state }, { text, recipient, fileUrl }) {
			try {
                const token = getters.getToken;

				let message = {
					sender: state.user,
					recipient: recipient,
					text: text,
					fileUrl,
				};

				message = await axios.post(
					`${process.env.VUE_APP_API_URL}/messages`,
					message,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				commit("addMessage", message.data);
				socket.emit("sendMessage", message.data);

				return true;
			} catch (error) {
				console.error("Error sending message:", error);
			}
		},
		async uploadFile({ dispatch }, { file, recipient }) {
			if (!file) return;

			// Define allowed file types and maximum file size (e.g., 5MB)
			const allowedFileTypes = [
				// Images
				"image/jpeg",
				"image/png",
				"image/gif",
				"image/bmp",
				"image/webp",
				"image/tiff",
				"image/svg+xml",

				// Documents
				"application/pdf",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
				"application/vnd.ms-excel",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
				"application/vnd.ms-powerpoint",
				"application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
				"text/plain",
				"text/csv",
				"application/rtf",

				// Audio
				"audio/mpeg",
				"audio/wav",
				"audio/ogg",
				"audio/mp4",
				"audio/aac",

				// Video
				"video/mp4",
				"video/x-msvideo", // .avi
				"video/x-matroska", // .mkv
				"video/webm",
				"video/ogg",
			];
			const maxFileSize = 5 * 1024 * 1024; // 5MB

			// Validate file type and size
			if (!allowedFileTypes.includes(file.type)) {
				alert("Invalid file type. Please upload a valid file.");
				return;
			}

			if (file.size > maxFileSize) {
				alert("File size exceeds the maximum limit of 5MB.");
				return;
			}

			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await axios.post(
					`${process.env.VUE_APP_API_URL}/files/upload`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);

				const fileUrl = response.data.fileUrl;

				await dispatch("sendMessage", {
					text: "File uploaded",
					recipient: recipient,
					fileUrl: fileUrl,
				});
			} catch (error) {
				console.error("Error uploading file:", error);
			}
		},

		async fetchMessages({ commit, getters }, { sender, recipient }) {
			//const token = localStorage.getItem("token");
            const token = getters.getToken;

			try {
				const messagesResponse = await axios.get(
					`${process.env.VUE_APP_API_URL}/messages`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
						params: {
							sender: JSON.stringify(sender),
							recipient: JSON.stringify(recipient),
						},
					}
				);

				if (messagesResponse.data.error) {
					console.error(
						"Failed to fetch messages: ",
						messagesResponse.data.message
					);
					return;
				}

				commit("setMessages", messagesResponse.data);
			} catch (error) {
				console.error(
					"Failed to fetch messages: ",
					error.response.data.message
				);
			}
		},

		async searchMessages({ commit, getters }, { query, sender }) {
			if (query.length > 2) {
				//const token = localStorage.getItem("token");
                const token = getters.getToken;

				try {
					const response = await axios.get(
						`${process.env.VUE_APP_API_URL}/messages`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
							params: {
								query: query,
								sender: JSON.stringify(sender),
							},
						}
					);
					commit("setSearchMessagesResults", response.data);
				} catch (error) {
					console.error("Error searching messages:", error);
				}
			} else {
				commit("setSearchMessagesResults", []);
			}
		},
	},
	plugins: [createPersistedState()],
});

// Handle the receiveMessage event inside the store
socket.on("receiveMessage", (message) => {
	store.commit("addMessage", message);

	if (
		message.sender.id != store.state.selectedUser?.id &&
		message.recipient.id == store.state.user.id
	) {
		store.commit("addSendingUsers", message.sender.id);
	}
});

socket.on("userDisconnected", () => {
	store.commit("setAuthenticated", false);
});

export default store;
