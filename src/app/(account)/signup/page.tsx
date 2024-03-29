'use client'

import { useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase/config'
import { ButtonSubmit } from '@/app/_components/buttons'
import ErrorMessage from '@/app/_components/errorMessage';
import { doc, setDoc } from 'firebase/firestore';
import moment from 'moment';


const COLORS = ['#8AB4F8', '#F28B82', '#FDD663', '#81C995', '#FF8BCB', '#C58AF9', '#FCAD70', '#78D9EC',]


const SignUp = () => {
    const [errorStatus, setErrorStatus] = useState(false)
    const [errorText, setErrorText] = useState('')
    const router = useRouter()


    async function signUp(formData: FormData) {
        let username = (formData.get('username') as string).trim()
        let email = (formData.get('email') as string).trim()
        let password = (formData.get('password') as string).trim()
        await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then(async (userDoc) => {
                await updateProfile(userDoc.user, { displayName: username })
                await setDoc(
                    doc(FIREBASE_DB, `users/${userDoc.user.uid}`), {
                    username: username,
                    email: email,
                    createdAt: moment().unix(),
                    color: COLORS[Math.floor(Math.random() * 8)],
                })
                router.push('/')
            })
            .catch(error => {
                setErrorText('Your username, email or password was incorrect')
                setErrorStatus(true)
            });
    }

    return (
        <form className='form' action={signUp}>
            <h1 className='form-title'>Create new account</h1>
            <div className='form-inputs'>
                <input placeholder='Username' type='text' name='username' autoComplete='off' required />
                <input placeholder='Email' type='email' name='email' autoComplete='on' required />
                <input placeholder='Password' type='password' name='password' autoComplete='on' required />
                {!errorStatus ? null :
                    <ErrorMessage onClick={() => setErrorStatus(false)} text={errorText} />
                }
            </div>
            <div className='form-buttons'>
                <ButtonSubmit text={'Sign up'} />
                <div className='divider-horizontal' />
                <Link href='/signin'>Login in exist account</Link>
            </div>
        </form>
    );
}

export default SignUp;