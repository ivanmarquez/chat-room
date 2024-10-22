import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import LoginView from "@/views/LoginView.vue";
import ChatRoomView from "@/views/ChatRoomView.vue";

const routes = [
	{
		path: "/",
		name: "Login",
		component: LoginView,
        meta: { title: "Chat Room - Login" }
	},
	{
		path: "/chat",
		name: "ChatRoom",
		component: ChatRoomView,
		meta: { requiresAuth: true, title: "Chat Room"  },
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Default Title';

	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!store.state.isAuthenticated) {
			next({ name: "Login" });
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
