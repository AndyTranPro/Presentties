import React from 'react';
import styled from 'styled-components';
import {
  useNavigate,
} from 'react-router-dom';
import { apiCall } from '../utils/Helper';
import * as Form from '@radix-ui/react-form';
import { PersonIcon, EnvelopeClosedIcon, LockClosedIcon, EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'

// Styled components
const RegisterWrapper = styled.div`
  background: linear-gradient(to right, #74ebd5, #acb6e5);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RegisterContainer = styled(Form.Root)`
  min-width: 350px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled(Form.Message)`
  color: red;
  margin-bottom: 10px;
  font-style: italic;
`;

const FormControl = styled(Form.Control)`
  width: 100%;
  padding: 5px 10px;
  border: 2px solid transparent;
  border-radius: 15px;
  background: #F0F0F0;
  color: #333;
  transition: all 0.3s ease-in-out;
  outline: none;

  &:focus {
    border-color: #007BFF;
    background: white;
    box-shadow: 0 0 0 3px rgba(0,123,255,.25);
  }
`;

const Label = styled(Form.Label)`
  color: #8a2be2;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;

  svg {
    margin-right: 5px;
  }
`;

const ShowPasswordIcon = styled(EyeClosedIcon)`
  cursor: pointer;
  margin-left: 15px;
`;

const HidePasswordIcon = styled(EyeOpenIcon)`
  cursor: pointer;
  margin-left: 15px;
`;

const Button = styled.button`
  cursor: pointer;
  background: linear-gradient(to bottom left, #8a2be2, #da70d6);
  color: white;
  border: none;
  border-radius: 20px;
  width: 100%;
  margin-top: 15px;
  padding: 5px 20px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Link = styled.a`
  display: block;
  text-align: center;
  color: #007bff;
  margin-top: 15px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// Register a user
const Register = () => {
  const navigate = useNavigate();
  // set the password validation
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  // keep track of the form data
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Can show the password
  const passwordVisibility = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowPassword(!showPassword);
  };

  // Can show the confirm password
  const confirmPasswordVisibility = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle form input changes
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Submit the form
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const { email, name, password, confirmPassword } = formData;
    // Validate user inputs
    if (password !== confirmPassword) {
      setIsPasswordValid(false);
      return;
    } else {
      setIsPasswordValid(true);
    }
    // Get register API
    const data = await apiCall('/admin/auth/register', 'POST', { email, password, name }, null);
    if (data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      navigate('/dashboard');
    } else {
      console.log('failed');
    }
  }

  return (
    <RegisterWrapper>
      <RegisterContainer onSubmit={handleSubmit}>
        <h2 className="mb-4 text-center">Register</h2>
        {/* Name */}
        <Form.Field className='grid mb-3' name='name'>
          <InputField>
            <Label><PersonIcon /> Name</Label>
            <ErrorMessage match='valueMissing'>Name is required !!!</ErrorMessage>
          </InputField>
          <FormControl data-testid="name" value={formData.name} onChange={handleChange} type='text' required placeholder='Enter your name here' />
        </Form.Field>
        {/* Email */}
        <Form.Field className='grid mb-3' name='email'>
          <InputField>
            <Label><EnvelopeClosedIcon /> Email</Label>
            <ErrorMessage match='typeMismatch'>Invalid Email !!! Please enter again</ErrorMessage>
            <ErrorMessage match='valueMissing'>Email is required !!!</ErrorMessage>
          </InputField>
          <FormControl data-testid="email" value={formData.email} onChange={handleChange} type='email' required placeholder='Enter your email here' />
        </Form.Field>
        {/* Password */}
        <Form.Field className='grid mb-3' name='password'>
          <InputField>
            <Label>
              <LockClosedIcon /> Password
              {showPassword
                ? <ShowPasswordIcon onClick={(event) => passwordVisibility(event)} />
                : <HidePasswordIcon onClick={(event) => passwordVisibility(event)} />}
            </Label>
            <ErrorMessage match='valueMissing'>Password is required !!!</ErrorMessage>
            {!isPasswordValid && <ErrorMessage>Passwords do not match</ErrorMessage>}
          </InputField>
          <FormControl data-testid="password" value={formData.password} onChange={handleChange} type={showPassword ? 'text' : 'password' } required placeholder='Enter your password here' />
        </Form.Field>
        {/* Confirm Password */}
        <Form.Field className='grid mb-3' name='confirmPassword'>
          <InputField>
          <Label>
              <LockClosedIcon /> Confirm Password
              {showConfirmPassword
                ? <ShowPasswordIcon onClick={(event) => confirmPasswordVisibility(event)} />
                : <HidePasswordIcon onClick={(event) => confirmPasswordVisibility(event)} />}
            </Label>
            <ErrorMessage match='valueMissing'>Confirm Password is required !!!</ErrorMessage>
            {!isPasswordValid && <ErrorMessage>Passwords do not match</ErrorMessage>}
          </InputField>
          <FormControl data-testid="comfirmpass" value={formData.confirmPassword} onChange={handleChange} type={showConfirmPassword ? 'text' : 'password' } required placeholder='Re-enter your password' />
        </Form.Field>
        <Button data-testid="submitRegister" type="submit">Submit</Button>
        <Link href="/login">Already have an account? Login</Link>
      </RegisterContainer>
    </RegisterWrapper>
  );
};

export default Register;
