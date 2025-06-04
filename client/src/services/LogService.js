import $api from '../http'

export default class LogService {
	static fetchLogs(page,limit) {
		
		
		return $api.get(`/logs?page=${page}&limit=${limit}`)
	}
}
