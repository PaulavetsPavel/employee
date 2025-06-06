// components/EditEmployeeForm.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Form, Modal, Spinner, Alert, Image } from 'react-bootstrap';
import EmployeeService from '../../../services/EmployeeService';

export const EditEmployeeForm = ({ employeeId, show, onHide }) => {
    const queryClient = useQueryClient();
    const [preview, setPreview] = useState(null);
    const [serverError, setServerError] = useState('');

    const getEmployee = async () => {
        try {
            const { data } = await EmployeeService.fetchEmployee(employeeId);


            return data[0];
        } catch (error) {
            console.log(error);
        }
    };

    const { data: employee, isLoading } = useQuery({
        queryKey: ['employee', employeeId],
        queryFn: () => getEmployee(employeeId),
        enabled: !!employeeId && show
    });

    const { register, handleSubmit, reset, watch, setValue } = useForm();
    const photo = watch('photo');

    useEffect(() => {
        if (employee) {
            // console.log(employee);

            reset({
                name: employee.name,
                position: employee.position,
                salary: employee.salary,
                hire_date: employee.hire_date.split('T')[0]
            });
            setPreview(employee.photo_url);
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
        },
        onError: (error) => {
            setServerError(error.response?.data?.error || 'Ошибка при обновлении');
        }
    });

    const onSubmit = (data) => {
        const formData = new FormData();


        formData.append('name', data.name);
        formData.append('position', data.position);
        formData.append('salary', data.salary);
        formData.append('hire_date', data.hire_date);

        if (data.photo[0]) {
            formData.append('photo', data.photo[0]);
        }

        mutation.mutate({ id: employeeId, formData });
    };

    const handleRemovePhoto = () => {
        setValue('photo', null);
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
                        <Form.Control
                            type="text"
                            {...register('name', { required: 'Обязательное поле' })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Должность</Form.Label>
                        <Form.Control
                            type="text"
                            {...register('position', { required: 'Обязательное поле' })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Зарплата</Form.Label>
                        <Form.Control
                            type="number"
                            {...register('salary', {
                                required: 'Обязательное поле',
                                min: { value: 0, message: 'Не может быть отрицательной' }
                            })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Дата приема</Form.Label>
                        <Form.Control
                            type="date"
                            {...register('hire_date', { required: 'Обязательное поле' })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Фото</Form.Label>
                        {preview && (
                            <div className="mb-3">
                                <Image
                                    src={preview}
                                    thumbnail
                                    style={{ maxHeight: '200px' }}
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={handleRemovePhoto}
                                    className="ms-2"
                                >
                                    Удалить фото
                                </Button>
                            </div>
                        )}
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
                            ) : 'Сохранить'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
export default EditEmployeeForm