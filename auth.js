import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'

const firebaseConfig = {
  apiKey: 'AIzaSyCltthxML3XVxkwYyB-ZZC9GyEkmQG84EQ',
  authDomain: 'rg2-tv-pl.firebaseapp.com',
  projectId: 'rg2-tv-pl',
  storageBucket: 'rg2-tv-pl.firebasestorage.app',
  messagingSenderId: '1043024560336',
  appId: '1:1043024560336:web:e34f5f9d04d02f61185ed5',
  measurementId: 'G-8X75M0H60X'
}

const POST_LOGIN_URL = 'https://rg-2-cal-2026.vercel.app/'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const emailEl = document.getElementById('email')
const passwordEl = document.getElementById('password')
const signinBtn = document.getElementById('signin')
const signupBtn = document.getElementById('signup')
const googleBtn = document.getElementById('google')
const signoutBtn = document.getElementById('signout')
const userBox = document.getElementById('user')
const uidEl = document.getElementById('uid')
const uemailEl = document.getElementById('uemail')
const errorBox = document.getElementById('error')
const successBox = document.getElementById('success')

function showError(message) {
  errorBox.textContent = message
  errorBox.style.display = 'block'
  successBox.style.display = 'none'
}

function showSuccess(message) {
  successBox.textContent = message
  successBox.style.display = 'block'
  errorBox.style.display = 'none'
}

async function handleSignIn() {
  const email = emailEl.value.trim()
  const password = passwordEl.value
  if (!email || !password) {
    showError('Informe e-mail e senha')
    return
  }
  try {
    await signInWithEmailAndPassword(auth, email, password)
    showSuccess('Login realizado')
  } catch (e) {
    showError('Falha no login: ' + e.message)
  }
}

async function handleSignUp() {
  const email = emailEl.value.trim()
  const password = passwordEl.value
  if (!email || !password) {
    showError('Informe e-mail e senha')
    return
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password)
    showSuccess('Cadastro realizado')
  } catch (e) {
    showError('Falha no cadastro: ' + e.message)
  }
}

async function handleGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    showSuccess('Login com Google realizado')
  } catch (e) {
    showError('Falha no Google: ' + e.message)
  }
}

async function handleSignOut() {
  try {
    await signOut(auth)
    showSuccess('Sessão encerrada')
  } catch (e) {
    showError('Falha ao sair: ' + e.message)
  }
}

if (signinBtn) signinBtn.addEventListener('click', handleSignIn)
if (signupBtn) signupBtn.addEventListener('click', handleSignUp)
if (googleBtn) googleBtn.addEventListener('click', handleGoogle)
if (signoutBtn) signoutBtn.addEventListener('click', handleSignOut)

onAuthStateChanged(auth, user => {
  if (user) {
    const target = POST_LOGIN_URL
    const alreadyOnTarget = target && (location.href.replace(/\/$/, '') === target.replace(/\/$/, ''))
    if (!alreadyOnTarget && target) {
      location.assign(target)
      return
    }
    if (userBox) userBox.classList.remove('hidden')
    if (uidEl) uidEl.value = user.uid
    if (uemailEl) uemailEl.value = user.email || ''
  } else {
    if (userBox) userBox.classList.add('hidden')
    if (uidEl) uidEl.value = ''
    if (uemailEl) uemailEl.value = ''
  }
})
