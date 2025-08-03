import authHeader from "./data-service"
import api from "./api";
import TokenService from "./token-service";

export const httpHelpers = () => {

	const customFetch = async (url, options = {}) => {
		const user = TokenService.getUser("user");
		if (user) {
			const defaultMethod = "GET"
			const defaultHeaders = {
				"Content-Type": "application/json",
				"accept": "*/*",
				"Access-Control-Allow-Origin": "*",
				"Authorization": 'Bearer ' + user.accessToken
			}
			const controller = new AbortController()
			options.signal = controller.signal

			options.method = options.method || defaultMethod
			options.headers = options.headers
				? { ...defaultHeaders, ...options.headers }
				: defaultHeaders

			options.body = JSON.stringify(options.body) || false
			if (!options.body) delete options.body

			setTimeout(() => {
				controller.abort()
			}, 3000)

			try {
				const response = await fetch(url, options);
				console.log("cricket customFetch", response);
				return response;
			} catch (err) {
				console.log("cricket customFetch err", err);
				return null;
			}
		} else {
			return 401;
		}
	}

	const get = (url, role) => {
		console.log("url", url, role);
		return api.get(url, { role })
	}

	const post = (url, options) => {
		options.method = "POST"
		return api.post(url, options)
	}

	const put = (url, options) => {
		options.method = "PUT"
		return api.put(url, options)
	}

	const del = (url, options) => {
		options.method = "DELETE"
		return api.del(url, options)
	}

	return {
		get,
		post,
		put,
		del,
		customFetch
	}
}
