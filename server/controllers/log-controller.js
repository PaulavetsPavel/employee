import logService from '../service/log-service.js';

class LogController {
  async getAllLogs(req, res) {
    const { page = 2, limit = 10, search, sortBy } = req.query;
    const offset = (page - 1) * limit;

    try {
      const logsData = await logService.getAllLogsFromDB(offset, limit);

      return res.status(200).json(logsData);
    } catch (error) {
      return res.status(500).json(error.messagee);
    }
  }
}
export default new LogController();
