import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import EmployeeService from '../../../services/EmployeeService';
import { useForm } from 'react-hook-form';

export const AddEmployeeForm = ({ show, onHide }) => {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const mutation = useMutation({
        mutationFn: (newEmployee) => EmployeeService.createEmployee(newEmployee),
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            reset();
            onHide();
        },
        onError: (error) => {
            setServerError(error.response?.data?.message || 'Ошибка при создании сотрудника');
        }
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('position', data.position);
        formData.append('salary', data.salary);
        formData.append('hire_date', data.hireDate);
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
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Должность *</Form.Label>
                        <Form.Control
                            type="text"
                            isInvalid={!!errors.position}
                            {...register('position', { required: 'Обязательное поле' })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.position?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Зарплата *</Form.Label>
                        <Form.Control
                            type="number"
                            isInvalid={!!errors.salary}
                            {...register('salary', {
                                required: 'Обязательное поле',
                                min: { value: 0, message: 'Не может быть отрицательной' }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.salary?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Дата приема *</Form.Label>
                        <Form.Control
                            type="date"
                            isInvalid={!!errors.hireDate}
                            {...register('hireDate', { required: 'Обязательное поле' })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.hireDate?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Фото</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            {...register('photo')}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button
                            variant="secondary"
                            onClick={onHide}
                            className="me-2"
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Сохранение...
                                </>
                            ) : 'Добавить'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddEmployeeForm