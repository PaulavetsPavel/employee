import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import 'moment/locale/ru';

import EmployeeService from '../services/EmployeeService';

import { Button, Row, Col, Container } from 'react-bootstrap';

moment.locale('ru');

const VacationCalendar = () => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('all');

  const getEmployees = async () => {
    try {
      const response = await EmployeeService.fetchEmployees();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => getEmployees(),
  });

  const departments = useMemo(() => {
    const deptSet = new Set(employees.map((e) => e.department || 'Без отдела'));
    return ['all', ...deptSet];
  }, [employees]);

  const filteredEmployees = employees.filter((emp) =>
    selectedDept === 'all' ? true : emp.department === selectedDept
  );

  const vacationEvents = filteredEmployees
    .filter((emp) => emp.vacation_start && emp.vacation_end)
    .map((emp) => ({
      title: `${emp.name.replace(/^00\s*/, '')} (${emp.department || 'Без отдела'})`,
      start: emp.vacation_start,
      end: moment(emp.vacation_end).add(1, 'day').format('YYYY-MM-DD'),
      backgroundColor: '#66c2a5',
      borderColor: '#66c2a5',
    }));

  const months = Array.from({ length: 12 }, (_, i) => moment().startOf('year').add(i, 'months'));

  return (
    <Container fluid className="px-lg-5" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <div className="container mt-4">
        <div
          className="d-flex justify-content-between align-items-center sticky-top bg-white py-3 px-3 shadow-sm"
          style={{ zIndex: 1000 }}>
          <h3 className="m-0">🏖 График отпусков на {moment().year()} год</h3>
          <div>
            <label className="me-2">Фильтр по отделу:</label>
            <select
              className="form-select d-inline-block w-auto"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}>
              {departments.map((dept, i) => (
                <option key={i} value={dept}>
                  {dept === 'all' ? 'Все отделы' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          <Row>
            {months.map((month, index) => {
              const startOfMonth = month.clone().startOf('month');
              const endOfMonth = month.clone().endOf('month');

              const monthEvents = vacationEvents.filter((event) => {
                const eventStart = moment(event.start);
                const eventEnd = moment(event.end);
                return (
                  eventStart.isBetween(startOfMonth, endOfMonth, 'day', '[]') ||
                  eventEnd.isBetween(startOfMonth, endOfMonth, 'day', '[]') ||
                  (eventStart.isBefore(startOfMonth) && eventEnd.isAfter(endOfMonth))
                );
              });

              return (
                <Col md={4} className="mb-4" key={index}>
                  <h5 className="text-center text-capitalize mb-2">{month.format('MMMM YYYY')}</h5>
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate={month.format('YYYY-MM-DD')}
                    locale="ru"
                    headerToolbar={false}
                    height="auto"
                    events={monthEvents}
                    editable={false}
                    selectable={false}
                    displayEventTime={false}
                    displayEventEnd={true}
                  />
                </Col>
              );
            })}
          </Row>
        )}
      </div>

      <div className="container mt-4">
        <Button variant="secondary" onClick={() => navigate('/employee')}>
          Закрыть
        </Button>
      </div>
    </Container>
  );
};

export default VacationCalendar;
