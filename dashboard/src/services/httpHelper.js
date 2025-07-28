import authHeader from "./data-service"
import TokenService from "./token-service";

export const httpHelper = () => {
	const customFetch = async (url, options = {}) => {
		let role = "agent";
		if (url.includes === "alpha") {
			role = "admin";
		}
		const user = TokenService.getUser();

  		//console.log('helper', user.accessToken)
		const defaultMethod = "GET"
		const defaultHeaders = {
			"Content-Type": "application/json",
			"accept": "*/*",
			"Access-Control-Allow-Origin":"*",
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
			const response = await fetch(url, options)
			//console.log("getAgents", response)
			return await response.json()
		} catch (err) {
			return err
		}
	}

	const get = (url, options = {}) => customFetch(url, options)

	const post = (url, options) => {
		options.method = "POST"
		return customFetch(url, options)
	}

	const put = (url, options) => {
		options.method = "PUT"
		return customFetch(url, options)
	}

	const del = (url, options) => {
		options.method = "DELETE"
		return customFetch(url, options)
	}

	return {
		get,
		post,
		put,
		del,
	}
}
