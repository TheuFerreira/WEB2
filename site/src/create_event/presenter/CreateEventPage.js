import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Menu from '../../components/menu/Menu';
import { useContext, useEffect, useState } from 'react';
import Context from '../../Context/Context';
import { create } from '../repositories/CreateEventRepository';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import LoadingButton from '../../components/loading_button/LoadingButton';
import { ToastContainer, toast } from 'react-toastify';
import { getAll } from '../repositories/PlaceRepository';
import { Plus } from 'react-bootstrap-icons';
import AddPlaceModal from './modals/AddPlaceModal';

const schema = yup
    .object()
    .shape({
        title: yup.string().required('Insira o título'),
        description: yup.string().required('Insira uma descrição'),
        date: yup.string().required('Insira uma data'),
        hour: yup.string().required('Insira a hora'),
        local: yup
            .number()
            .required()
            .typeError('Escolha um Local ou crie um'),
    })
    .required();

export default function CreateEventPage(props) {

    const [usuario] = useContext(Context);
    const [places, setPlaces] = useState([]);
    const [isLoadingButton, setLoadingButton] = useState(false);
    const [showAddPlace, setShowAddPlace] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        document.title = 'Eventos - Novo Evento';

        loadAllPlaces();
    }, []);

    const loadAllPlaces = async () => {
        const response = await getAll();
        if (response.message !== undefined) {
            toast.error(response.message);
            return;
        }
    
        setPlaces(response.data);
    }

    const onSubmit = async (data) => {
        const date = `${data.date}T${data.hour}`;
        
        setLoadingButton(true);
        const response = await create(parseInt(usuario.id_user), data.title, data.description, date, data.local);
        setLoadingButton(false);
        
        if (response.message) {
            toast.error(response.message);
            return;
        }

        toast.success('Evento Criado');
        reset();
    }

    const onAddedLocal = () => {
        setShowAddPlace(false);
        loadAllPlaces();
    };

    return (
        <div>
            <ToastContainer/>
            <AddPlaceModal show={showAddPlace} onAdded={onAddedLocal} onClose={() => setShowAddPlace(false)}/>

            <Menu/>

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
                                <h2>Criar Evento</h2>
                            </Container>

                            <Form 
                                noValidate 
                                validated={isValid} 
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <Form.Group>
                                    <Form.Label>Título:</Form.Label>
                                    <Form.Control
                                        placeholder="example" 
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        {...register('title')}
                                    />

                                    <Form.Control.Feedback type='invalid'>
                                        {errors.title?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Descrição:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        {...register('description')}
                                    />

                                    <Form.Control.Feedback type='invalid'>
                                        {errors.description?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Local:</Form.Label>

                                    <div className='d-flex flex-row'>
                                        <div className='d-flex flex-column w-100 me-2'>
                                            <Form.Select
                                                className={`form-control ${errors.local ? 'is-invalid' : ''}`}
                                                {...register('local')}
                                            >
                                                { 
                                                    places.map((x) => 
                                                        <option 
                                                            key={x.id_place} 
                                                            value={x.id_place}
                                                        >{x.description}</option> 
                                                    ) 
                                                }
                                            </Form.Select>

                                            <Form.Control.Feedback type='invalid'>
                                                {errors.local?.message}
                                            </Form.Control.Feedback>
                                        </div>

                                        <div className='d-flex align-items-start'>
                                            <Button 
                                                onClick={() => setShowAddPlace(true)}
                                                style={{
                                                    backgroundColor: '#0b549e',
                                                    borderColor: '#0b549e'
                                                }}
                                            >
                                                <Plus size={20}/>
                                            </Button>
                                        </div>

                                    </div>

                                </Form.Group>

                                <div className='d-flex flex-row'>
                                    <Form.Group>
                                        <Form.Label>Data:</Form.Label>
                                        <Form.Control
                                            type='date'
                                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                            {...register('date')}
                                        />

                                        <Form.Control.Feedback type='invalid'>
                                            {errors.date?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group 
                                        style={{
                                            paddingLeft: 16
                                        }}
                                    >
                                        <Form.Label>Hora:</Form.Label>
                                        <Form.Control
                                            type='time'
                                            className={`form-control ${errors.hour ? 'is-invalid' : ''}`}
                                            {...register('hour')}
                                        />

                                        <Form.Control.Feedback type='invalid'>
                                            {errors.hour?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className='d-flex justify-content-center mt-4'>
                                    <LoadingButton 
                                        type="submit"
                                        loading={isLoadingButton}
                                    >
                                        Criar Evento
                                    </LoadingButton>
                                </div>
                            </Form>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}