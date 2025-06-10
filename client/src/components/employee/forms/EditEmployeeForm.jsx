// components/EditEmployeeForm.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button, Form, Modal, Spinner, Alert, Image } from 'react-bootstrap';
import EmployeeService from '../../../services/EmployeeService';
import { ToastContainer, toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const EditEmployeeForm = ({ employeeId, show, onHide }) => {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);
  const [serverError, setServerError] = useState('');

  const getEmployee = async () => {
    try {
      const { data } = await EmployeeService.fetchEmployee(employeeId);

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => getEmployee(employeeId),
    enabled: !!employeeId && show,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const photo = watch('photo');

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        position: employee.position,
        hire_date: employee.hire_date.split('T')[0],
        contract_end: employee.contract_end?.split('T')[0] || '',
        status: employee.status || 'работает',
        salary: employee.salary,
        birth_date: employee.birth_date.split('T')[0],
        vacation_start: employee.vacation_start.split('T')[0],
        vacation_end: employee.vacation_end.split('T')[0],
        education: employee.education,
        passport_info: employee.passport_info,
        registration_address: employee.registration_address,
        department: employee.department,
      });
      setPreview(employee.photo_url ? `${baseURL}${employee.photo_url}` : null);
    }
  }, [employee, reset]);

  useEffect(() => {
    if (photo && photo[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(photo[0]);
    }
  }, [photo]);

  const mutation = useMutation({
    mutationFn: (newEmployee) => EmployeeService.updateEmployee(newEmployee),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      queryClient.invalidateQueries(['employee', employeeId]);
      onHide();
      toast.success('Изменения успешно сохранены! ✏️');
    },
    onError: (error) => {
      setServerError(error.response?.data?.error || 'Ошибка при обновлении');
      toast.error('❌ Ошибка при обновлении сотрудника');
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('birth_date', data.birth_date);
    formData.append('department', data.department);
    formData.append('position', data.position);
    formData.append('salary', data.salary);
    formData.append('status', data.status);
    formData.append('hire_date', data.hire_date);
    formData.append('contract_end', data.contract_end);
    formData.append('vacation_start', data.vacation_start);
    formData.append('vacation_end', data.vacation_end);
    formData.append('education', data.education);
    formData.append('passport_info', data.passport_info);
    formData.append('registration_address', data.registration_address);
    if (data.photo && data.photo.length > 0) {
      formData.append('photo', data.photo[0]);
    }

    mutation.mutate({ id: employeeId, formData });
  };

  const handleRemovePhoto = () => {
    setValue('photo', []);
    setPreview(null);
  };

  if (isLoading) return <Spinner animation="border" />;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Редактировать сотрудника</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>ФИО</Form.Label>
            <Form.Control type="text" {...register('name', { required: 'Обязательное поле' })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Дата рождения *</Form.Label>
            <Form.Control
              type="date"
              isInvalid={!!errors.birth_date}
              {...register('birth_date', { required: 'Обязательное поле' })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.birth_date?.message}
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
            <Form.Label>Должность</Form.Label>
            <Form.Control
              type="text"
              {...register('position', { required: 'Обязательное поле' })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Образование</Form.Label>
            <Form.Control type="text" {...register('education')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Паспортные данные</Form.Label>
            <Form.Control type="text" {...register('passport_info')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Адрес прописки</Form.Label>
            <Form.Control type="text" {...register('registration_address')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Дата приема</Form.Label>
            <Form.Control
              type="date"
              {...register('hire_date', { required: 'Обязательное поле' })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Окончание контракта</Form.Label>
            <Form.Control type="date" {...register('contract_end')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Статус сотрудника</Form.Label>
            <Form.Select {...register('status', { required: 'Обязательное поле' })}>
              <option value="работает">Работает</option>
              <option value="в отпуске">В отпуске</option>
              <option value="в декрете">В декрете</option>
              <option value="командировка">Командировка</option>
              <option value="уволен">Уволен</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Зарплата</Form.Label>
            <Form.Control
              type="number"
              {...register('salary', {
                required: 'Обязательное поле',
                min: { value: 0, message: 'Не может быть отрицательной' },
              })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Отпуск: с</Form.Label>
            <Form.Control type="date" {...register('vacation_start')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>по</Form.Label>
            <Form.Control type="date" {...register('vacation_end')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Фото</Form.Label>
            {preview && (
              <div className="mb-3">
                <Image src={preview} thumbnail style={{ maxHeight: '200px' }} />
                <Button variant="danger" size="sm" onClick={handleRemovePhoto} className="ms-2">
                  Удалить фото
                </Button>
              </div>
            )}
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
                'Сохранить'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default EditEmployeeForm;
