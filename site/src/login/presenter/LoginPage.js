import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { ipAPI } from '../../utils/ips';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const schema = yup
    .object()
    .shape({
        email: yup
            .string()
            .required('Insira um email')
            .email('Insira um email válido')
            .max(50, 'O limite máximo é de 100 caractres'),
        password: yup
            .string()
            .required('Insira uma senha')
            .min(4, 'A senha precisa ter pelo menos 4 caracteres')
            .max(50, 'O limite máximo é de 50 caractres')
    })
    .required();

export default function LoginPage() {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {

        fetch(`${ipAPI}/login/signin/${data.email}/${data.password}`, {
            method: 'GET'
        }).then((response) => {
            if (response.status === 204) {
                setError('Usuário ou senha inválidos');
                throw new Error();
            } else if (!response.ok) {
                setError('Estamos com problemas');
                throw new Error();
            }

            return response.json();
        }).then((json) => {
            setError('');
            console.log(json);
            navigate('/Inicio');
        }).catch(() => {});
    }

    return (
        <Container fluid>
            <Row className='vh-100'>
                <Col className='d-flex justify-content-center align-items-center'>
                    <Container 
                        fluid
                        className='p-4'
                        style={{
                            maxWidth: 475,
                            borderRadius: 16,
                            backgroundColor: 'white',
                            boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <Container className='d-flex justify-content-center mb-2'>
                            <h2>Eventos</h2>
                        </Container>

                        <Form 
                            noValidate 
                            validated={true} 
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Form.Group>
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    placeholder="example@example.com" 
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email')}
                                />

                                <Form.Control.Feedback type='invalid'>
                                    {errors.email?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Senha:</Form.Label>
                                <Form.Control
                                    placeholder="******" 
                                    type={'password'}
                                    autoComplete="true"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    {...register('password')}
                                />

                                <Form.Control.Feedback type='invalid'>
                                    {errors.password?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Row className='mb-2 mt-2'>
                                { error && <span className='text-danger'>{error}</span> }
                            </Row>

                            <div className='d-flex justify-content-between'>
                                <Button 
                                    type="submit"
                                >
                                    Entrar
                                </Button>

                                <Button 
                                    type="button" 
                                    onClick={() => navigate('/Registrar')}
                                >
                                    Cadastre-se
                                </Button>
                            </div>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}