import React, { useContext,useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../src/context/auth';

function Register(props) {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
    const [state, setState] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      const [errorMsg, setErrorMsg] = useState("");
      const [submitting, setSubmitting] = useState(false);

      const handleChange = (event) => {
        const { name, value } = event.target;
        setState({
          ...state,
          [name]: value
        });
      };

      const [addUser] = useMutation(REGISTER_USER, {
        update(_, {data: {register: userData}}) {
          context.login(userData);
          console.log(userData);
          navigate('/')
        },
        variables: state
      })

      const handleSubmit = (event) => {
        event.preventDefault();
        console.log('state', state);
        const { username, email, password,confirmPassword } = state;
        if (
          username.trim() !== '' &&
          email.trim() !== '' &&
          password.trim() !== '' &&
          confirmPassword.trim() !== ''
        ) {
          setErrorMsg('');
          try {
            // throw new Error();
            addUser();            
          }  catch (error) {
            setSubmitting(false);
            console.log(error.response);
            if (error.response) {
              setErrorMsg(error.response.data);
            } else {
              setErrorMsg('Something went wrong. Try again later.');
            }
          }
        } else {
          setErrorMsg('All the fields are required.');
        }
      };
         
  return (
  <div className='register'>
     <h2 className='heading'>Register Page</h2>
    <Form onSubmit={handleSubmit}>
    {errorMsg && <p className='error-msg'>{errorMsg}</p>}
     <Form.Group className='mb-3' controlId='username'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your name'
            name='username'
            value={state.username}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter your email'
            name='email'
            value={state.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter your password'
            name='password'
            value={state.password}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm Password..'
            name='confirmPassword'
            value={state.confirmPassword}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant='primary' type='submit' disabled={submitting}>
          {submitting ? 'Submitting...' : 'Register'}
        </Button>
     <div className='mt-2'>
          Already have an account? <Link to='/login'>login here</Link>
        </div>
      </Form>
    </div>
  )
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Register