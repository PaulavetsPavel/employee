import logService from "../service/log-service.js";

class LogController {
  async getAllLogs(req, res) {
    const { page = 2, limit = 10, search, sortBy } = req.query;
			const offset = (page - 1) * limit;
         
    try {
      const logsData = await logService.getAllLogsFromDB(offset,limit);

      return res.json(logsData);
    } catch (e) {
      return res.status(500).json(e.messagee)
    }
  }
}
export default new LogController();
