import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import EmployeeService from '../../../services/EmployeeService';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const AddEmployeeForm = ({ show, onHide }) => {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const mutation = useMutation({
    mutationFn: (newEmployee) => EmployeeService.createEmployee(newEmployee),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      reset();
      onHide();
      toast.success('Сотрудник успешно добавлен! ✅');
    },
    onError: (error) => {
      setServerError(error.response?.data?.message || 'Ошибка при создании сотрудника');
      toast.error('❌ Ошибка при создании сотрудника');
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('birth_date', data.birthDate);
    formData.append('department', data.department);
    formData.append('position', data.position);
    formData.append('hire_date', data.hireDate);
    formData.append('contract_end', data.contractEnd);
    formData.append('status', data.status);
    formData.append('salary', data.salary);
    formData.append('vacation_start', data.vacationStart);
    formData.append('vacation_end', data.vacationEnd);
    formData.append('education', data.education);
    formData.append('passport_info', data.passportInfo);
    formData.append('registration_address', data.registrationAddress);
    if (data.photo[0]) formData.append('photo', data.photo[0]);

    mutation.mutate(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить сотрудника</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>ФИО *</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.name}
              {...register('name', { required: 'Обязательное поле' })}
            />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Дата рождения *</Form.Label>
            <Form.Control
              type="date"
              isInvalid={!!errors.birthDate}
              {...register('birthDate', { required: 'Обязательное поле' })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.birthDate?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Отдел *</Form.Label>
            <Form.Select
              {...register('department', { required: 'Выберите отдел' })}
              isInvalid={!!errors.department}>
              <option value="">Выберите отдел</option>
              <option value="HR">Отдел кадров</option>
              <option value="IT">IT-отдел</option>
              <option value="FIN">Финансовый отдел</option>
              <option value="MKT">Маркетинг</option>
              <option value="ADM">Администрация</option>
              <option value="SALE">Продажи</option>
              <option value="LOG">Логистика</option>
              <option value="LEG">Юридический отдел</option>
              <option value="DEV">Разработка</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.department?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Должность *</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.position}
              {...register('position', { required: 'Обязательное поле' })}
            />
            <Form.Control.Feedback type="invalid">{errors.position?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Образование</Form.Label>
            <Form.Control type="text" {...register('education')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Паспортные данные</Form.Label>
            <Form.Control type="text" {...register('passportInfo')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Адрес прописки</Form.Label>
            <Form.Control type="text" {...register('registrationAddress')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Дата приема *</Form.Label>
            <Form.Control
              type="date"
              isInvalid={!!errors.hireDate}
              {...register('hireDate', { required: 'Обязательное поле' })}
            />
            <Form.Control.Feedback type="invalid">{errors.hireDate?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Окончание контракта</Form.Label>
            <Form.Control type="date" {...register('contractEnd')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Статус сотрудника</Form.Label>
            <Form.Select
              {...register('status', { required: 'Выберите статус' })}
              isInvalid={!!errors.status}>
              <option value="работает">Работает</option>
              <option value="в отпуске">В отпуске</option>
              <option value="в декрете">В декрете</option>
              <option value="командировка">Командировка</option>
              <option value="уволен">Уволен</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.status?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Зарплата *</Form.Label>
            <Form.Control
              type="number"
              isInvalid={!!errors.salary}
              {...register('salary', {
                required: 'Обязательное поле',
                min: { value: 0, message: 'Не может быть отрицательной' },
              })}
            />
            <Form.Control.Feedback type="invalid">{errors.salary?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Отпуск: с</Form.Label>
            <Form.Control type="date" {...register('vacationStart')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>по</Form.Label>
            <Form.Control type="date" {...register('vacationEnd')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Фото</Form.Label>
            <Form.Control type="file" accept="image/*" {...register('photo')} />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Отмена
            </Button>
            <Button variant="primary" type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Сохранение...
                </>
              ) : (
                'Добавить'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEmployeeForm;
