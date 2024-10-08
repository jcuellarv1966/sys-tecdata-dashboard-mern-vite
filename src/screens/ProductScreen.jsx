import axios from 'axios';
import { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from "../../utils/error"
import { Store } from "../../utils/Store"
import { generatePublicUrlProducts } from '../../utils/urlConfig';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function ProductScreen() {
    const navigate = useNavigate();
    const params = useParams();
    const { slug } = params;
    const [tab, setTab] = useState(0);

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: '',
    });

    const isActive = (index) => {
        if (tab === index) return " active";
        return ""
    }

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`http://localhost:5000/api/products/slug/${slug}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, [slug]);

    const { state, dispatching: ctxDispatch } = useContext(Store);
    const { cart } = state;

    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`http://localhost:5000/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity },
        });
        navigate('/cart');
    };

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Row>
                <Col md={6}>
                    <div className="flex flex-col justify-center items-center">
                        {product.images.length > 0 ? (
                            <>
                                <div className="relative" key={product.images[tab].file}>
                                    <div className="flex items-center justify-center w-full h-120 mx-2 overflow-hidden rounded-2xl">
                                        <img src={generatePublicUrlProducts(product.images[tab].file)} alt={product.images[tab].file}
                                            className="d-block img-thumbnail rounded mt-4 w-100"
                                            style={{ height: '350px' }} />
                                    </div>
                                </div>

                                <div className="row mx-0" style={{ cursor: 'pointer' }} >
                                    {product.images.map((image, index) => (
                                        <img key={index} src={generatePublicUrlProducts(image.file)} alt={image.file}
                                            className={`img-thumbnail rounded ${isActive(index)}`}
                                            style={{ height: '60px', width: '100px' }}
                                            onClick={() => {
                                                setTab(index);
                                            }} />
                                    ))}
                                </div>
                            </>
                        ) : ""}
                    </div>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{product.title}</title>
                            </Helmet>
                            <h1>{product.title}</h1>
                            <h2>Category : <span className='text-blue-700'>{product.category.name}</span></h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating
                                rating={product.rating}
                                numReviews={product.numReviews}
                            ></Rating>
                        </ListGroup.Item>
                        <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
                        <ListGroup.Item>
                            Description:
                            <p>{product.description}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>${product.price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ? (
                                                <Badge bg="success">In Stock</Badge>
                                            ) : (
                                                <Badge bg="danger">Unavailable</Badge>
                                            )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <div className="d-grid">
                                            <Button onClick={addToCartHandler} variant="primary">
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
export default ProductScreen;